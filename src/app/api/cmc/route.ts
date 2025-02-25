import { NextResponse } from "next/server"
import { uploadToAssetOverview } from "@/utils/convertToMongo/parse"
import { AssetOverviewDocument } from "@/types/mongoDb"
import { AssetOverviewClient } from "@/utils/MongoDbClient"
import { fetchCmcListings, fetchSplittedCmcMetadata } from "./index"

const fetchCoinMarketCapData = async () => {
  const idList = await fetchCmcListings()
  const metaData = await fetchSplittedCmcMetadata({ idList })
  return metaData
}

export async function GET() {
  try {
    const { collection } = await AssetOverviewClient()

    const coinMarketCapData = await fetchCoinMarketCapData()
    const mongoData: (AssetOverviewDocument | null)[] = []

    for (const asset of coinMarketCapData) {
      const storeObject: AssetOverviewDocument = {
        name: asset.name.toLowerCase(),
        ticker: asset.symbol,
        lastUpdate: new Date(),
        tokenAddress: asset.platform?.token_address,
        coinmarketcap: asset,
      }
      mongoData.push(storeObject)
    }

    await uploadToAssetOverview(mongoData, collection)

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
