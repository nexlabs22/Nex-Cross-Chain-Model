//TODO: remove this endpoint, use protocols/fetch-daily-asset instead then convert to chart data.
import { aggregateType } from "@/types/mongoDb"
import { DailyAssetsClient } from "@/utils/MongoDbClient"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    //TODO: update using request const { searchParams } = new URL(request.url) const ticker = searchParams.get("ticker") || "AAPL"
    const body = await request.json()

    if (!body || !body.ticker) {
      return NextResponse.json(
        { message: "Ticker is required" },
        { status: 400 }
      )
    }

    const { ticker, limit, sort, ...additionalFilters } = body

    const { collection } = await DailyAssetsClient()

    const filter = {
      ticker: ticker === "ARBEI" ? "rARBEI" : ticker,
      ...additionalFilters,
    }

    const pipeline: aggregateType[] = [{ $match: filter }]

    if (sort) {
      pipeline.push({ $sort: sort })
    }

    if (limit) {
      pipeline.push({ $limit: limit })
    }

    const data = await collection.aggregate(pipeline).toArray()

    return NextResponse.json({
      data,
      meta: {
        message: `Data fetched successfully`,
      },
    })
  } catch (error) {
    console.error("Error fetching data:", error)
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    )
  }
}
