//import { Collection } from "mongodb"

import { MongoDb } from "@/types/mongoDb"
import connectToMongoDb from "@/utils/connectToMongoDb"
import connectToSpotDb from "@/utils/connectToSpotDB"
import { AssetCategory } from "@/types/indexTypes"
import { uploadToMongo, filterValues, convertUnixToDate } from "./parse"

/*type MagSeven = {
  stampsec: string
  date: string
  topstocks: string //example AAPL:3668604660000,NVDA:3431293900000,MSFT:3156552652800,GOOG:2380084545998,AMZN:2335696950000,META:1541457756972,TSLA:1267781096400
}*/

const columnToNameAndtickerMap: {
  [key: string]: {
    name: string
    ticker: string
    type: AssetCategory
    source: string
  }
} = {
  AAPL: {
    name: "Apple",
    ticker: "AAPL",
    type: AssetCategory.Stock,
    source: "investing.com",
  },
  NVDA: {
    name: "Nvidia",
    ticker: "NVDA",
    type: AssetCategory.Stock,
    source: "investing.com",
  },
  MSFT: {
    name: "Microsoft",
    ticker: "MSFT",
    type: AssetCategory.Stock,
    source: "investing.com",
  },
  GOOG: {
    name: "Alphabet",
    ticker: "GOOG",
    type: AssetCategory.Stock,
    source: "investing.com",
  },
  AMZN: {
    name: "Amazon",
    ticker: "AMZN",
    type: AssetCategory.Stock,
    source: "investing.com",
  },
  META: {
    name: "Meta",
    ticker: "META",
    type: AssetCategory.Stock,
    source: "investing.com",
  },
  TSLA: {
    name: "Tesla",
    ticker: "TSLA",
    type: AssetCategory.Stock,
    source: "investing.com",
  },
  BRKA: {
    name: "Berkshire Hathaway",
    ticker: "BRKA",
    type: AssetCategory.Stock,
    source: "investing.com",
  },
  V: {
    name: "Visa",
    ticker: "V",
    type: AssetCategory.Stock,
    source: "investing.com",
  },
  WMT: {
    name: "Walmart",
    ticker: "WMT",
    type: AssetCategory.Stock,
    source: "investing.com",
  },
  JNJ: {
    name: "Johnson & Johnson",
    ticker: "JNJ",
    type: AssetCategory.Stock,
    source: "investing.com",
  },
  SSNLF: {
    name: "Samsung",
    ticker: "SSNLF",
    type: AssetCategory.Stock,
    source: "investing.com",
  },
  BABA: {
    name: "Alibaba",
    ticker: "BABA",
    type: AssetCategory.Stock,
    source: "investing.com",
  },
  TCEHY: {
    name: "Tencent",
    ticker: "TCEHY",
    type: AssetCategory.Stock,
    source: "investing.com",
  },
}

const parseTopStocks = (
  topstocks: string
): { ticker: string; marketcap: string }[] => {
  return topstocks.split(",").map((item) => {
    const [ticker, marketcap] = item.split(":")
    return { ticker, marketcap }
  })
}

const convertMagSeven = async () => {
  const { collection } = await connectToMongoDb("DailyAssets")
  const spotClient = await connectToSpotDb()

  const data = await spotClient.query(
    "SELECT * FROM mag7stocksmarketcap ORDER BY date DESC"
  )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const parsedData: (MongoDb | null)[] = data.rows.flatMap((row: any) => {
    const topstocks = parseTopStocks(row.topstocks)

    return topstocks.map((stock) => {
      const timestamp = Number(row.stampsec)
      const date = convertUnixToDate(timestamp)
      const name =
        columnToNameAndtickerMap[
          stock.ticker as keyof typeof columnToNameAndtickerMap
        ]?.name
      const ticker =
        columnToNameAndtickerMap[
          stock.ticker as keyof typeof columnToNameAndtickerMap
        ]?.ticker
      const type =
        columnToNameAndtickerMap[
          stock.ticker as keyof typeof columnToNameAndtickerMap
        ]?.type

      const entry: MongoDb = {
        name,
        ticker,
        date,
        timestamp,
        marketCap: Number(stock.marketcap),
        type,
      }

      const filteredEntry = filterValues(entry)

      if (
        filteredEntry.ticker &&
        filteredEntry.date &&
        filteredEntry.type &&
        filteredEntry.marketCap
      ) {
        return filteredEntry as MongoDb
      }

      return null
    })
  })

  await uploadToMongo(parsedData, collection)

  return parsedData
}

export default convertMagSeven
