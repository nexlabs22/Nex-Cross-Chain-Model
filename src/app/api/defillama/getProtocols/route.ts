import { NextResponse } from "next/server"
import { DailyAsset } from "@/types/mongoDb"
import { AssetCategory } from "@/types/indexTypes"
const url = "https://api.llama.fi/protocols"

export interface Protocol {
  cmcId?: string
  name: string
  gecko_id?: string
  symbol: string
  tvl?: number
  mcap?: number
  chainTvls?: Record<string, number>
  parentProtocol?: string
  url?: string
  slug?: string
  address?: string
}

export async function GET() {
  const response = await fetch(url, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
  })
  const data = await response.json()

  const protocolsByGroup: Record<string, Protocol[]> = data.reduce(
    (acc: Record<string, Protocol[]>, protocol: Protocol) => {
      if (
        protocol.tvl === undefined ||
        protocol.symbol === undefined ||
        protocol.symbol === "-"
      ) {
        return acc
      }

      const groupKey = protocol.parentProtocol
        ? `${protocol.parentProtocol}#${protocol.symbol}#${protocol.url}`
        : `${protocol.symbol}#${protocol.url}`
      if (!acc[groupKey]) {
        acc[groupKey] = []
      }
      acc[groupKey].push(protocol)

      return acc
    },
    {}
  )

  const processedProtocols: DailyAsset[] = Object.values(protocolsByGroup)
    .filter(
      (protocols) =>
        protocols[0].cmcId &&
        protocols[0].cmcId !== "undefined" &&
        protocols[0].cmcId !== null
    )
    .map((protocols) => {
      const currentDate = new Date().toISOString().split("T")[0] // YYYY-MM-DD format

      const totalTvl = protocols.reduce(
        (sum, protocol) => sum + (protocol.tvl || 0),
        0
      )
      const totalChainTvls = protocols.reduce((chainSum, protocol) => {
        if (protocol.chainTvls) {
          for (const [chain, tvl] of Object.entries(protocol.chainTvls)) {
            chainSum[chain] = (chainSum[chain] || 0) + (tvl || 0)
          }
        }
        return chainSum
      }, {} as Record<string, number>)

      const marketCap = protocols[0]?.mcap

      return {
        name: protocols[0].name.toLowerCase(),
        cmcId: protocols[0].cmcId,
        gecko_id: protocols[0].gecko_id,
        ticker: protocols[0].symbol.toUpperCase(),
        type: AssetCategory.Cryptocurrency,
        date: currentDate,
        ...(totalTvl !== undefined &&
          totalTvl !== null &&
          totalTvl !== 0 && {
            tvl: totalTvl,
          }),
        timestamp: Math.floor(new Date().getTime() / 1000),
        ...(Object.keys(totalChainTvls).length > 0 && {
          chainTvls: totalChainTvls,
        }),
        ...(marketCap !== undefined &&
          marketCap !== null &&
          marketCap !== 0 && {
            marketCap: marketCap,
          }),
      }
    })

  return NextResponse.json({
    message: "Protocols processed successfully",
    processedProtocols: processedProtocols.slice(0, 20),
  })
}
