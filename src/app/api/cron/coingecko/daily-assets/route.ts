import { NextResponse } from "next/server"
import {
  fetchDocumentsWithCoingeckoId,
  fetchDailyPricesSplitted,
} from "@/app/api/coingecko/fetch-daily"
import { DailyAsset } from "@/types/mongoDb"
import { DailyAssetsClient } from "@/utils/MongoDbClient"
import { AssetCategory } from "@/types/indexTypes"
import { uploadToDailyAssets } from "@/utils/convertToMongo/parse"

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

    const { collection } = await DailyAssetsClient()

    //TODO filter if the data is given and otherwise don't upload it
    const mongoDbData: DailyAsset[] = dailyPrices.map((item) => ({
      ticker: item.symbol.toUpperCase(),
      name: item.name.toLowerCase(),
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

    const filteredMongoDbData = mongoDbData.filter(
      (item) => item.name && item.ticker
    )

    await uploadToDailyAssets(filteredMongoDbData, collection)

    return NextResponse.json({
      message: "Data uploaded successfully",
      // data: filteredMongoDbData.slice(0, 20),
      status: 200,
    })
  } catch (error) {
    return NextResponse.json({
      status: "error",
      error: error,
    })
  }
}
