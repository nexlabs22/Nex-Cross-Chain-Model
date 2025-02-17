import { NextResponse } from "next/server"
import { Protocol } from "../getProtocols/route"
import { DailyAsset } from "@/types/mongoDb"
import { uploadToDailyAssets } from "@/utils/convertToMongo/parse"
import DailyAssetsClient from "@/utils/MongoDbClient"

// interface Protocol {
//   id: string
//   name: string
//   url: string
//   description: string
//   logo: string
//   chains: string[]
//   gecko_id: string
//   cmcId: string
//   treasury: string
//   twitter: string
//   governanceID: string[]
//   wrongLiquidity: boolean
//   github: string[]
//   currentChainTvls: Record<string, number>
//   chainTvls: Record<string, any>
//   tokens: any[]
//   tokensInUsd: any[]
//   tvl: any[]
//   isParentProtocol: boolean
//   raises: any[]
//   metrics: Record<string, any>
//   symbol: string
//   mcap: number
//   otherProtocols: string[]
//   hallmarks: any[]
// }

interface TVL {
  date: number
  tvl: number
  totalLiquidityUSD: number
}

export async function GET() {
  const { collection, client } = await DailyAssetsClient("DailyAssets")
  const protocols = await fetch(`https://api.llama.fi/protocols`, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
  })
  const protocolsData = await protocols.json()
  //return only the protocols that have a cmcId and slug
  const filteredProtocols = protocolsData
    .filter(
      (protocol: Protocol) =>
        protocol.cmcId &&
        protocol.slug &&
        protocol.symbol &&
        protocol.symbol !== "-" &&
        protocol.address !== undefined
    )
    .slice(0, 250)

  const baseUrl = `https://api.llama.fi/protocol/`
  const data = []

  for (const protocol of filteredProtocols) {
    const url = baseUrl + protocol.slug
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const response = await fetch(url, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    })
    const jsonResponse = await response.json()
    data.push(jsonResponse)
  }

  const oneYearAgo = Date.now() - 31536000000
  const oneYearAgoDate = new Date(oneYearAgo)

  const convertedData: DailyAsset[] = data.flatMap((protocol) =>
    protocol.tvl
      .filter((tvl: TVL) => new Date(tvl.date * 1000) >= oneYearAgoDate)
      .map((tvl: TVL) => ({
        timestamp: tvl.date,
        date: new Date(tvl.date * 1000).toISOString().split("T")[0],
        tvl: Number(tvl.totalLiquidityUSD.toFixed(0)),
        ticker: protocol.symbol,
        cmdId: protocol.cmcId,
        geckoId: protocol.gecko_id,
      }))
  )

  //upload to mongo db
  await uploadToDailyAssets(convertedData, collection)

  client.close()

  return NextResponse.json({
    message: "Historical Protocols fetched successfully",
  })
}
