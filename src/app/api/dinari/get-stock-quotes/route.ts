import { NextRequest, NextResponse } from "next/server"
import { Stock } from "../get-stocks/route"
import { AssetOverviewClient, DailyAssetsClient } from "@/utils/MongoDbClient"
import { uploadStocksToDailyAssets } from "@/utils/convertToMongo/parse"
import { DailyAsset } from "@/types/mongoDb"
import { AssetCategory } from "@/types/indexTypes"

type QuoteResponse = {
  change: number
  change_percent: number
  close: number
  high: number
  low: number
  open: number
  previous_close: number
  price: number
  stock_id: string
  volume: number
}

export async function GET(request: NextRequest) {
  const { collection } = await AssetOverviewClient()
  const { collection: dailyAssetsCollection } = await DailyAssetsClient()

  const dinariAssets = await collection
    .find({ dinari: { $exists: true } })
    .toArray()

  const mainnet = request.nextUrl.searchParams.get("mainnet") || true
  const pageSize = request.nextUrl.searchParams.get("page_size") || 100
  const page = request.nextUrl.searchParams.get("page") || 1
  const apiKey = mainnet
    ? process.env.DINARI_MAINNET_API_KEY
    : process.env.DINARI_TESTNET_API_KEY

  const url = `https://api-enterprise.${
    mainnet ? "sbt" : "sandbox"
  }.dinari.com/api/v1/stocks?page_size=${pageSize}&page=${page}`

  const response = await fetch(url, {
    headers: {
      accept: "application/json",
      authorization: `Bearer ${apiKey}`,
    },
  })

  if (!response.ok) {
    return NextResponse.json(
      { error: "Failed to fetch stocks" },
      { status: 500 }
    )
  }

  const data = await response.json()
  const idList = data.map((stock: Stock) => stock.id)
  const quoteResponse = await getStockQuotes(idList)

  //match the idList with the stocks in the database to find the symbol
  const matchedStocks: (DailyAsset | null)[] = dinariAssets.map((asset) => {
    const quote = quoteResponse.find(
      (quote) => quote.stock_id === asset.dinari?.stock?.id
    )

    if (!quote || !asset.dinari?.stock.symbol) {
      return null
    }

    return {
      name: asset.dinari?.stock.name.toLowerCase(),
      ticker: asset.dinari?.stock.symbol,
      type: AssetCategory.Stock,
      date: new Date().toISOString().split("T")[0],
      timestamp: Math.floor(new Date().getTime() / 1000),
      price: quote.price,
      open: quote.open,
      high: quote.high,
      low: quote.low,
      close: quote.close,
      tokenAddress: asset.dinari?.token.address,
    }
  })

  await uploadStocksToDailyAssets(matchedStocks, dailyAssetsCollection)

  return NextResponse.json({
    status: 200,
    message: "success",
    // matchedStocks: matchedStocks,
  })
}

async function getStockQuotes(idList: string[]): Promise<QuoteResponse[]> {
  const apiKey = process.env.DINARI_MAINNET_API_KEY
  const idString = idList.map((id) => `stock_ids=${id}`).join("&")
  const quoteUrl = `https://api-enterprise.sbt.dinari.com/api/v1/stocks/quote?${idString}`

  let data
  try {
    const response = await fetch(quoteUrl, {
      headers: {
        accept: "application/json",
        authorization: `Bearer ${apiKey}`,
      },
    })

    data = await response.json()
  } catch (error) {
    console.error("Error fetching stock quotes:", error)
    throw error
  }

  return data
}
