import { NextResponse } from "next/server"
import {
  filterValues,
  uploadToMongoDocument,
} from "@/utils/convertToMongo/parse"
import { AssetOverviewDocument } from "@/types/indexTypes"
import { connectToMongoDbDocument } from "@/utils/connectToMongoDb"
import { MongoClient } from "mongodb"
import { fetchCmcListings, fetchCmcMetadata } from "./index"

const fetchCoinMarketCapData = async () => {
  const idList = await fetchCmcListings()
  const metaData = await fetchCmcMetadata({ idList })
  const coinMarketCapData = Object.entries(metaData).map(([key, value]) => ({
    id: key,
    ...(value as object),
  }))
  return coinMarketCapData
}

export async function GET() {
  let client: MongoClient | null = null
  try {
    const { collection, client: localClient } = await connectToMongoDbDocument(
      "AssetOverview"
    )
    client = localClient

    const coinMarketCapData = await fetchCoinMarketCapData()
    const mongoData: (AssetOverviewDocument | null)[] = []

    for (const asset of coinMarketCapData) {
      const filteredAsset = filterValues(asset)
      const storeObject: AssetOverviewDocument = {
        coinmarketcap: {
          ...filteredAsset,
        },
        lastUpdate: new Date(),
        provider: ["coinmarketcap"],
        name: filteredAsset.name,
        ticker: filteredAsset.symbol,
      }
      mongoData.push(storeObject)
    }
    await uploadToMongoDocument(mongoData, collection)

    return NextResponse.json({
      message: "Assets updated successfully",
      // data: coinMarketCapData.slice(0, 5),
    })
  } catch (error) {
    console.error("Error in asset update process:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  } finally {
    if (client) {
      await client.close()
    }
  }
}
