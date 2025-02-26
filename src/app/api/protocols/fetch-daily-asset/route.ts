import { NextRequest, NextResponse } from "next/server"
import { DailyAssetsClient } from "@/utils/MongoDbClient"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const days = parseInt(searchParams.get("days") || "365")
  const ticker = searchParams.get("ticker") || "AAPL"
  const name = searchParams.get("name") || "apple"

  const { collection } = await DailyAssetsClient()

  if (!ticker) {
    return NextResponse.json({ error: "Ticker is required" }, { status: 400 })
  }

  const assetOverview = await collection
    .find({
      ticker,
      name,
      timestamp: {
        $gte:
          new Date(Date.now() - days * 24 * 60 * 60 * 1000).getTime() / 1000,
      },
    })
    .toArray()

  if (!assetOverview) {
    return NextResponse.json(
      { error: "Asset overview not found" },
      { status: 404 }
    )
  }

  return NextResponse.json({ assetOverview, status: 200 })
}
