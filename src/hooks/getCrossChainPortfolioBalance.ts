import { useEffect, useState, useCallback } from "react"
import {
  crossChainFactoryStorageAbi,
  crossChainIndexFactoryV2Abi,
  indexFactoryV2Abi,
  tokenAbi,
} from "@/constants/abi"
import { getClient } from "@/utils/getRPCClient"
import {
  chainSelectorAddresses,
  tokenAddresses,
} from "@/constants/contractAddresses"
import { Address } from "@/types/indexTypes"

export function GetCrossChainPortfolioBalance() {
  const [portfolioValue, setPortfolioValue] = useState<number>()

  const getPortfolioValue = useCallback(async () => {
    let sepoliaPublicClient
    try {
      sepoliaPublicClient = getClient("sepolia")
    } catch (error) {
      console.error("Error getting sepolia client", error)
    }

    let arbitrumSepoliaPublicClient
    try {
      arbitrumSepoliaPublicClient = getClient("arbitrumSepolia")
    } catch (error) {
      console.error("Error getting arbitrumSepolia client", error)
    }

    if (!sepoliaPublicClient || !arbitrumSepoliaPublicClient) {
      return
    }

    let totalPortfolioBalance: number = 0

    const sepoliaPortfolioBalance = await sepoliaPublicClient.readContract({
      address: tokenAddresses.CRYPTO5?.Ethereum?.Sepolia?.factory
        ?.address as Address,
      abi: crossChainIndexFactoryV2Abi,
      functionName: "getPortfolioBalance",
    })
    totalPortfolioBalance += Number(sepoliaPortfolioBalance)
    const totalCurrentList = await sepoliaPublicClient.readContract({
      address: tokenAddresses.CRYPTO5?.Ethereum?.Sepolia?.storage
        ?.address as Address,
      abi: crossChainFactoryStorageAbi,
      functionName: "totalCurrentList",
    })

    for (let i = 0; i < Number(totalCurrentList); i++) {
      const tokenAddress = await sepoliaPublicClient.readContract({
        address: tokenAddresses.CRYPTO5?.Ethereum?.Sepolia?.storage
          ?.address as Address,
        abi: crossChainFactoryStorageAbi,
        functionName: "currentList",
        args: [i],
      })

      const tokenChainSelector = await sepoliaPublicClient.readContract({
        address: tokenAddresses.CRYPTO5?.Ethereum?.Sepolia?.storage
          ?.address as Address,
        abi: crossChainFactoryStorageAbi,
        functionName: "tokenChainSelector",
        args: [tokenAddress],
      })

      if (tokenChainSelector == chainSelectorAddresses.Arbitrum?.Sepolia) {
        const tokenBalance = await arbitrumSepoliaPublicClient.readContract({
          address: tokenAddress as Address,
          abi: tokenAbi,
          functionName: "balanceOf",
          args: [tokenAddresses.CRYPTO5?.Arbitrum?.Sepolia?.vault?.address],
        })
        const tokenValue = await arbitrumSepoliaPublicClient.readContract({
          address: tokenAddresses.CRYPTO5?.Arbitrum?.Sepolia?.factory
            ?.address as Address,
          abi: indexFactoryV2Abi,
          functionName: "getAmountOut",
          args: [
            tokenAddress,
            tokenAddresses.WETH?.Arbitrum?.Sepolia?.index?.address,
            tokenBalance,
            3,
          ],
        })
        totalPortfolioBalance += Number(tokenValue)
      }
    }
    setPortfolioValue(totalPortfolioBalance)
  }, [])

  useEffect(() => {
    getPortfolioValue()
  }, [getPortfolioValue])

  return {
    data: portfolioValue,
    reload: getPortfolioValue,
  }
}
