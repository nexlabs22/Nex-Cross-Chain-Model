import { AssetCategory } from "@/types/indexTypes"
import { aggregateType, DailyAsset } from "@/types/mongoDb"
import DailyAssetsClient from "@/utils/MongoDbClient"
import { Collection } from "mongodb"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body || !body.ticker) {
      return NextResponse.json(
        { message: "Ticker is required" },
        { status: 400 }
      )
    }

    const { ticker, limit, sort, ...additionalFilters } = body

    const { collection }: { collection: Collection<DailyAsset> } =
      await DailyAssetsClient("DailyAssets")

    const filter = {
      type: "index" as AssetCategory,
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
