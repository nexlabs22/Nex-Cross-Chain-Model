import { useEffect, useState, useCallback } from "react"
import { indexFactoryV2Abi } from "@/constants/abi"
import { getClient } from "@/utils/getRPCClient"
import { useDashboard } from "@/providers/DashboardProvider"
import { Address, CryptoAsset } from "@/types/indexTypes"
import { PublicClient } from 'viem'
import { useGlobal } from "@/providers/GlobalProvider"

export function GetDefiPortfolioBalance(
  swapFromToken: CryptoAsset,
  swapToToken: CryptoAsset
) {
  const [portfolioValue, setPortfolioValue] = useState<number>()
  const { nexTokens } = useDashboard()
  const {activeChainSetting:{chainName, network}} = useGlobal()

  const allowedSymbols = nexTokens
    .filter((token) => token.smartContractType === "defi")
    .map((token) => token.symbol)
  const activeTicker = [swapFromToken.symbol, swapToToken.symbol].filter(
    (symbol) => allowedSymbols.includes(symbol)
  )[0]

  const getPortfolioValue = useCallback(async () => {
    let sepoliaPublicClient = null
    try {
      sepoliaPublicClient = getClient('Ethereum', 'Sepolia')
    } catch (error) {
      console.error("Error getting sepolia client", error)
    }

    if (!sepoliaPublicClient) {
      return
    }

    const activeFactoryAddress = nexTokens.filter(
      (token) => token.symbol === activeTicker
    )[0].tokenAddresses?.[chainName]?.[network]?.factory?.address

    let totalPortfolioBalance: number = 0

    const sepoliaPortfolioBalance = await (sepoliaPublicClient as PublicClient).readContract({
      address: activeFactoryAddress as Address,
      abi: indexFactoryV2Abi,
      functionName: "getPortfolioBalance",
    })

    totalPortfolioBalance += Number(sepoliaPortfolioBalance)

    setPortfolioValue(totalPortfolioBalance)
  }, [nexTokens, activeTicker,chainName, network])

  useEffect(() => {
    if (activeTicker) {
      getPortfolioValue()
    }
  }, [getPortfolioValue, activeTicker])

  return {
    data: portfolioValue,
    reload: getPortfolioValue,
  }
}
