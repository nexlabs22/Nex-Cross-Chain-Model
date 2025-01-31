import { useState, useEffect } from "react"
import { AssetOverviewDocument } from "@/types/indexTypes"

export function useFetchAndMapStocks() {
  const [data, setData] = useState<AssetOverviewDocument[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/dinari/get-stocks")
        const result = await response.json()

        // TODO: Map the data to the AssetOverviewDocument type
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mappedData: AssetOverviewDocument[] = result.map((item: any) => ({
          stockId: item.stock.id,
          stockName: item.stock.name,
          stockSymbol: item.stock.symbol,
          tokenAddress: item.token.address,
          tokenChainId: item.token.chain_id,
          tokenSymbol: item.token.symbol,
          // Map other fields as necessary
        }))

        setData(mappedData)
      } catch (err) {
        setError("Failed to fetch data")
        console.error("Error fetching and mapping stocks:", err)
      }
    }

    fetchData()
  }, [])

  return { data, error }
}
