import { useEffect, useState, useCallback } from "react"
import { getClient } from "@/utils/getRPCClient"
import { useDashboard } from "@/providers/DashboardProvider"
import { AllowedTickers, CryptoAsset } from "@/types/indexTypes"
import { readContract } from "thirdweb"
import GetContract from "./getContract"

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

  const storageContract = GetContract(activeTicker as AllowedTickers, 'storage')

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

    let totalPortfolioBalance: number = 0

    const sepoliaPortfolioBalance = await readContract({
      contract: storageContract,
      method: "function getPortfolioBalance() returns (uint256)",
      params: []
    })

    totalPortfolioBalance += Number(sepoliaPortfolioBalance)

    setPortfolioValue(totalPortfolioBalance)
  }, [storageContract])

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
