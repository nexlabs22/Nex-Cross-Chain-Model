import { NextRequest, NextResponse } from "next/server";
import { AssetOverviewClient } from "@/utils/MongoDbClient";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ticker = searchParams.get("ticker");
    const tickers = searchParams.get("tickers");

    const { collection } = await AssetOverviewClient();

    if (!ticker && !tickers) {
      return NextResponse.json({ error: "At least one ticker is required" }, { status: 400 });
    }

    let query = {};
    if (tickers) {
      const tickersArray = tickers.split(",").map(t => t.trim().toUpperCase());
      query = { ticker: { $in: tickersArray } };
    } else if (ticker) {
      query = { ticker: ticker.toUpperCase() };
    }

    const assetOverview = await collection.find(query).toArray();

    if (!assetOverview || assetOverview.length === 0) {
      return NextResponse.json({ error: "Asset overview not found" }, { status: 404 });
    }

    return NextResponse.json({ assetOverview, status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error", details: error }, { status: 500 });
  }
}
