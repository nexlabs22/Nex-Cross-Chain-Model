import { NextResponse } from "next/server"
import {
  fetchDocumentsWithCoingeckoId,
  fetchDailyPricesSplitted,
} from "./index"
import { DailyAsset } from "@/types/mongoDb"
import { DailyAssetsClient } from "@/utils/MongoDbClient"
import { AssetCategory } from "@/types/indexTypes"
import { uploadToDailyAssets } from "@/utils/convertToMongo/parse"

interface DailyPrice {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  fully_diluted_valuation: number
  total_volume: number
  high_24h: number
  low_24h: number
  price_change_24h: number
  price_change_percentage_24h: number
  market_cap_change_24h: number
  market_cap_change_percentage_24h: number
  circulating_supply: number
  total_supply: number
  max_supply: number
  ath: number
  ath_change_percentage: number
  ath_date: string // ISO date string
  atl: number
  atl_change_percentage: number
  atl_date: string // ISO date string
  roi: null | {
    times: number
    currency: string
    percentage: number
  }
  last_updated: string // ISO date string
}

export async function GET() {
  try {
    const documents = await fetchDocumentsWithCoingeckoId()
    if (!documents) {
      return NextResponse.json({
        message: "No documents found",
      })
    }

    const idList = documents.map((document) => document?.coingecko?.id)
    if (!idList) {
      return NextResponse.json({
        message: "No ids found",
      })
    }

    const dailyPrices = await fetchDailyPricesSplitted(idList)
    if (!dailyPrices) {
      return NextResponse.json({
        message: "No daily prices found",
      })
    }

    await mapAndUploadDailyPrices(dailyPrices)

    return NextResponse.json({
      status: "success",
      dailyPrices,
    })
  } catch (error) {
    return NextResponse.json({
      status: "error",
      error: error,
    })
  }
}

async function mapAndUploadDailyPrices(dailyPrices: DailyPrice[]) {
  const { collection } = await DailyAssetsClient()

  try {
    const mongoDbData: DailyAsset[] = dailyPrices.map((item) => ({
      ticker: item.symbol.toUpperCase(),
      name: item.name,
      type: AssetCategory.Cryptocurrency, // Assuming type is Cryptocurrency, adjust as needed
      date: new Date(item.last_updated).toISOString().split("T")[0], // Convert to YYYY-MM-DD
      timestamp: Math.floor(new Date(item.last_updated).getTime() / 1000), // Convert to seconds
      price: item.current_price,
      high: item.high_24h,
      low: item.low_24h,
      volume: item.total_volume,
      marketCap: item.market_cap,
      circulatingSupply: item.circulating_supply,
      totalSupply: item.total_supply,
      fullyDilutedValuation: item.fully_diluted_valuation,
    }))

    await uploadToDailyAssets(mongoDbData, collection)
    console.log("Data uploaded successfully")
  } catch (error) {
    console.error("Error uploading data:", error)
  }
}
