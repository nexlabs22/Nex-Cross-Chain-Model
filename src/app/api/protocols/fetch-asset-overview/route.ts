import { NextRequest, NextResponse } from "next/server"
import { AssetOverviewClient } from "@/utils/MongoDbClient"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const ticker = searchParams.get("ticker") || "AAPL"

  //   const address =
  //     searchParams.get("address") || "0x68E670D2f9B792f034a1826cF4A8F180C9952Cb6"

  const { client, collection } = await AssetOverviewClient("AssetOverview")

  if (!ticker) {
    return NextResponse.json({ error: "Ticker is required" }, { status: 400 })
  }

  const assetOverview = await collection.find({ ticker }).toArray()

  if (!assetOverview) {
    return NextResponse.json(
      { error: "Asset overview not found" },
      { status: 404 }
    )
  }

  await client.close()

  return NextResponse.json({ assetOverview, status: 200 })
}
