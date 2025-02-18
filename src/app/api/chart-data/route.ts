import { aggregateType } from "@/types/mongoDb"
import DailyAssetsClient from "@/utils/MongoDbClient"
import { MongoClient } from "mongodb"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  let client: MongoClient | null = null
  try {
    const body = await request.json()

    if (!body || !body.ticker) {
      return NextResponse.json(
        { message: "Ticker is required" },
        { status: 400 }
      )
    }

    const { ticker, limit, sort, ...additionalFilters } = body

    const { client: localClient, collection } = await DailyAssetsClient(
      "DailyAssets"
    )
    client = localClient

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

    await client.close()

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
  } finally {
    if (client) {
      await client.close()
    }
  }
}
