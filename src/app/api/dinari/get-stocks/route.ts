import { type NextRequest, NextResponse } from "next/server"
import { fetchAllPages } from "./index"
import { AssetOverviewClient } from "@/utils/MongoDbClient"
import { AssetOverviewDocument } from "@/types/mongoDb"
import { uploadStocksToAssetOverview } from "@/utils/convertToMongo/parse"

// const url = `https://api-enterprise.sbt.dinari.com/api/v1/stocks/?page=1&page_size=100`
// testnet chainId = "11155111" // for mainnet use 1, nothing on polygon, 42161 for arbitrum

// const url = `https://api-enterprise.sbt.dinari.com/api/v1/tokens/${chainId}`

//Dinari supported chains, with same offering on each chain
// Ethereum Mainnet → 1
// Arbitrum One → 42161
// Base → 8453
// Blast → 81457
// Kinto → 3889

export interface Stock {
  cik: string
  composite_figi: string
  cusip: string
  description: string
  display_name: string
  id: string
  is_fractionable: boolean
  logo_url: string
  name: string
  symbol: string
}

interface Token {
  address: string
  chain_id: number
  decimals: number
  image_url: string
  is_active: boolean
  is_primary: boolean
  symbol: string
  version: string
}

interface DinariObject {
  stock: Stock
  token: Token
}

export async function GET(request: NextRequest) {
  try {
    const allData = await fetchAllPages(request)

    const { collection } = await AssetOverviewClient()

    const mongoData: (AssetOverviewDocument | null)[] = []
    for (const data of allData) {
      const dinariData = data as DinariObject
      mongoData.push({
        dinari: dinariData,
        lastUpdate: new Date(),
        name: dinariData.stock.name.toLowerCase(),
        ticker: dinariData.stock.symbol,
        tokenAddress: dinariData.token.address,
      })
    }

    await uploadStocksToAssetOverview(mongoData, collection)

    return NextResponse.json(
      { message: "Stocks updated successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error in getStocks:", error)
    return NextResponse.json(
      { error: "Internal server error" },

      { status: 500 }
    )
  }
}
