import { NextResponse } from "next/server"
import { nexTokensArray } from "@/constants/indices"
import { DailyAssetsClient } from "@/utils/MongoDbClient"

export async function GET() {
  console.log("fetching data assets")
  try {
    const tickers = nexTokensArray.map((index) => index.symbol === 'ARBEI' ? 'rARBEI' : index.symbol)
    const { collection } = await DailyAssetsClient()

    const filter = {
      ticker: { $in: tickers },
      timestamp: {
        $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).getTime() / 1000,
      },
    }

    const data = (await collection.find(filter).toArray()).map((token)=> token.ticker === 'rARBEI' ? {...token, ticker: 'ARBEI'}: token)

    return NextResponse.json({ data })
  } catch (error) {
    console.error("Error fetching data:", error)
    return NextResponse.json({
      error: "Failed to fetch data",
      status: 500,
    })
  }
}
