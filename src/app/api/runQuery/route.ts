import { AssetCategory } from "@/types/indexTypes"
import { DailyAssetsClient } from "@/utils/MongoDbClient"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const ticker = searchParams.get("index") || "ANFI"

  const { collection } = await DailyAssetsClient()

  const filter = {
    type: "index" as AssetCategory,
    ticker: ticker === "ARBEI" ? "rARBEI" : ticker,
  }

  const data = await collection
    .find(filter)
    .sort({ timestamp: "asc" })
    .toArray()

  return NextResponse.json({
    data,
    meta: {
      message: "Data fetched successfully",
    },
  })
}
