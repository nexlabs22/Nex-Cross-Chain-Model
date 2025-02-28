import { NextResponse } from "next/server"
import { processCoingeckoData } from "@/app/api/coingecko"
import { uploadToAssetOverview } from "@/utils/convertToMongo/parse"

export async function GET() {
  try {
    const { mongoData, collection } = await processCoingeckoData()

    await uploadToAssetOverview(mongoData, collection)

    return NextResponse.json({
      message: "Assets updated successfully",
      status: 200,
    })
  } catch (error) {
    console.error("Error in asset update process:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
