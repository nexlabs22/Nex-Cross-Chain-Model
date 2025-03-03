//TODO: remove this endpoint, use protocols/fetch-daily-asset instead then convert to chart data.
import { aggregateType } from "@/types/mongoDb"
import { DailyAssetsClient } from "@/utils/MongoDbClient"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    
    const { searchParams } = new URL(request.url) 
    const ticker = searchParams.get("ticker") || "ANFI"

    const { collection } = await DailyAssetsClient()

    const filter = {
      ticker: ticker === "ARBEI" ? "rARBEI" : ticker,    
    }

    const pipeline: aggregateType[] = [{ $match: filter }]

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
