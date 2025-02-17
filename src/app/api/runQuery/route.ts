import { AssetCategory } from "@/types/indexTypes"
import { DailyAsset } from "@/types/mongoDb"
import DailyAssetsClient from "@/utils/MongoDbClient"
import { Collection } from "mongodb"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const ticker = searchParams.get("index") || "ANFI"

  const { collection }: { collection: Collection<DailyAsset> } =
    await DailyAssetsClient("DailyAssets")

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
