import { useEffect, useState, useCallback } from "react"
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

  const storageContract = activeTicker ? GetContract(activeTicker as AllowedTickers, 'storage'): null

  const getPortfolioValue = useCallback(async () => {

    let totalPortfolioBalance: number = 0

    const sepoliaPortfolioBalance = await readContract({
      contract: storageContract!,
      method: "function getPortfolioBalance() returns (uint256)",
      params: []
    })

    totalPortfolioBalance += Number(sepoliaPortfolioBalance)

    setPortfolioValue(totalPortfolioBalance)
  }, [storageContract])

  useEffect(() => {
    if (activeTicker && storageContract) {
      getPortfolioValue()
    }
  }, [getPortfolioValue, activeTicker, storageContract])

  return {
    data: portfolioValue,
    reload: getPortfolioValue,
  }
}
