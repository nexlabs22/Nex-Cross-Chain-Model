import { NextRequest, NextResponse } from "next/server"
import DailyAssetsClient from "@/utils/MongoDbClient"

interface Query {
  date: string
  [key: string]: string | { $exists: boolean }
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const chain = url.searchParams.get("chain")
  const limit = parseInt(url.searchParams.get("limit") || "0", 10)

  const { collection } = await DailyAssetsClient("DailyAssets")

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0]

  // Build the query
  const query: Query = { date: today }
  if (chain) {
    query["chainTvls." + chain] = { $exists: true }
  }

  // Fetch data from MongoDB
  const protocols = await collection
    .find(query)
    .sort({ tvl: -1 })
    .limit(limit > 0 ? limit : 0)
    .toArray()

  const protocolsWithTvl = protocols.filter(
    (protocol) => protocol.tvl !== undefined && protocol.tvl !== null
  )

  // Calculate total TVL for weight calculation
  const totalTvl = protocolsWithTvl.reduce(
    (sum, protocol) => sum + (protocol.tvl || 0),
    0
  )

  // Map the results to include ticker, tvl, and weight
  const result = protocolsWithTvl.map((protocol) => ({
    name: protocol.name,
    ticker: protocol.ticker,
    tvl: protocol.tvl,
    weight: protocol.tvl ? protocol.tvl / totalTvl : 0,
  }))

  return NextResponse.json({
    message: "Protocols fetched successfully",
    data: result,
  })
}
