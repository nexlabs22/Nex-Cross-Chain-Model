import { NextRequest, NextResponse } from "next/server"
import { DailyAssetsClient } from "@/utils/MongoDbClient"
import { DailyAsset } from "@/types/mongoDb"

interface DailyIndex {
  indexPrice: number
  date: string
  totalChainTvl?: number
  isRebalanceDay?: boolean
  protocols?: DailyAsset[]
  indexConstituents?: IndexConstituentWithPreviousData[]
}

interface IndexConstituent {
  ticker: string
  weight?: number
  price: number
  previousPrice?: number
  previousWeight?: number
  tokenAmount?: number
}

type IndexConstituentWithPreviousData = IndexConstituent & {
  previousPrice?: number
  previousWeight?: number
  priceChange?: number
  tokenValue?: number
  weight: number
  amount: number
}

interface DailyAssetFiltered extends DailyAsset {
  chainTvls: { [key: string]: number }
  price: number
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const chain = searchParams.get("chain") || "Ethereum"
  const days = parseInt(searchParams.get("days") || "365")
  const topN = parseInt(searchParams.get("topN") || "10")
  const rebalancePeriod = Number(searchParams.get("rebalancePeriod")) || 14

  const { collection } = await DailyAssetsClient()

  const protocols = (await collection
    .find({
      [`chainTvls.${chain}`]: { $exists: true },
      price: { $exists: true },
      timestamp: {
        $gte:
          new Date(Date.now() - days * 24 * 60 * 60 * 1000).getTime() / 1000,
      },
    })
    .toArray()) as DailyAssetFiltered[]

  const uniqueDates = [...new Set(protocols.map((p) => p.date))].sort()
  let previousConstituents: IndexConstituentWithPreviousData[] = []
  let previousIndexPrice = 100

  const dailyIndexData: DailyIndex[] = uniqueDates.map((date, index) => {
    const protocolsForDay = protocols
      .filter((p) => p.date === date)
      .sort((a, b) => (b.chainTvls?.[chain] || 0) - (a.chainTvls?.[chain] || 0))
      .slice(0, topN)

    const totalChainTvl = protocolsForDay.reduce(
      (sum, p) => sum + (p.chainTvls?.[chain] || 0),
      0
    )
    const isRebalanceDay = index === 0 || index % rebalancePeriod === 0

    const indexConstituents: IndexConstituentWithPreviousData[] =
      protocolsForDay.map((protocol) => {
        const targetWeight =
          totalChainTvl > 0
            ? (protocol.chainTvls?.[chain] || 0) / totalChainTvl
            : 0
        return {
          ticker: protocol.ticker,
          weight: targetWeight,
          price: protocol.price,
          amount: 0,
        }
      })

    let currentIndexPrice = 100
    indexConstituents.forEach((constituent) => {
      if (index === 0) {
        constituent.amount =
          (constituent.weight * currentIndexPrice) / constituent.price
      } else if (isRebalanceDay) {
        constituent.amount =
          (previousIndexPrice * constituent.weight) / constituent.price
      } else {
        const prevConst = previousConstituents.find(
          (p) => p.ticker === constituent.ticker
        )
        constituent.amount = prevConst?.amount || 0
      }
    })

    if (index > 0) {
      currentIndexPrice = indexConstituents.reduce(
        (sum, constituent) => sum + constituent.amount * constituent.price,
        0
      )
    }

    previousConstituents = [...indexConstituents]
    previousIndexPrice = currentIndexPrice

    return {
      date,
      //   protocols: protocolsForDay,
      //   totalChainTvl,
      protocols,
      indexPrice: currentIndexPrice,
      //   indexConstituents,
      //   isRebalanceDay,
    }
  })

  return NextResponse.json({ dailyIndexData, status: 200 })
}
