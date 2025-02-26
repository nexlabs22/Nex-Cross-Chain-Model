import { AssetOverviewClient } from "@/utils/MongoDbClient"
import { processCoinMarketCapData } from "@/app/api/cmc"
import { uploadToAssetOverview } from "@/utils/convertToMongo/parse"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const { collection } = await AssetOverviewClient()
    const mongoData = await processCoinMarketCapData()

    await uploadToAssetOverview(mongoData, collection)

    return NextResponse.json({
      status: 200,
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
