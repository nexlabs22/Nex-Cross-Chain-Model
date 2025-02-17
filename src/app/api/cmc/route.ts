import { NextResponse } from "next/server"
import {
  filterValues,
  uploadToAssetOverview,
} from "@/utils/convertToMongo/parse"
import { AssetOverviewDocument } from "@/types/mongoDb"
import { AssetOverviewClient } from "@/utils/MongoDbClient"
import { fetchCmcListings, fetchSplittedCmcMetadata } from "./index"

const fetchCoinMarketCapData = async () => {
  const idList = await fetchCmcListings()
  const metaData = await fetchSplittedCmcMetadata({ idList })
  const coinMarketCapData = Object.entries(metaData).map(([key, value]) => ({
    id: key,
    ...(value as object),
  }))
  return coinMarketCapData
}

export async function GET() {
  try {
    const { collection, client } = await AssetOverviewClient("AssetOverview")

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
    await uploadToAssetOverview(mongoData, collection)
    await client.close()

    return NextResponse.json({
      message: "CMC Assets updated successfully",
    })
  } catch (error) {
    console.error("Error in asset update process:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
