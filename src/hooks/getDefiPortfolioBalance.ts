import { useEffect, useState, useCallback } from "react"
import { indexFactoryV2Abi } from "@/constants/abi"
import { getClient } from "@/utils/getRPCClient"
import { useDashboard } from "@/providers/DashboardProvider"
import { CryptoAsset } from "@/types/indexTypes"

export function GetDefiPortfolioBalance(
  swapFromToken: CryptoAsset,
  swapToToken: CryptoAsset
) {
  const [portfolioValue, setPortfolioValue] = useState<number>()
  const { nexTokens } = useDashboard()

  const allowedSymbols = nexTokens
    .filter((token) => token.smartContractType === "defi")
    .map((token) => token.symbol)
  const activeTicker = [swapFromToken.symbol, swapToToken.symbol].filter(
    (symbol) => allowedSymbols.includes(symbol)
  )[0]

  const getPortfolioValue = useCallback(async () => {
    const sepoliaPublicClient = getClient("sepolia")
    const activeFactoryAddress = nexTokens.filter(
      (token) => token.symbol === activeTicker
    )[0].tokenAddresses?.Ethereum?.Sepolia?.factory?.address

    let totalPortfolioBalance: number = 0

    const sepoliaPortfolioBalance = await sepoliaPublicClient.readContract({
      address: activeFactoryAddress as `0x${string}`,
      abi: indexFactoryV2Abi,
      functionName: "getPortfolioBalance",
    })

    totalPortfolioBalance += Number(sepoliaPortfolioBalance)

    setPortfolioValue(totalPortfolioBalance)
  }, [nexTokens, activeTicker])

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
