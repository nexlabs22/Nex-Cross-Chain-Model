import { DailyAsset } from "@/types/mongoDb"
import { DailyAssetsClient } from "@/utils/MongoDbClient"
import connectToSpotDb from "@/utils/connectToSpotDB"
import { AssetCategory } from "@/types/indexTypes"
import {
  parseOHLC,
  uploadToDailyAssets,
  filterValues,
  convertUnixToDate,
} from "./parse"

const stocks = {
  msft: { ticker: "MSFT", name: "Microsoft" },
  aapl: { ticker: "AAPL", name: "Apple" },
  goog: { ticker: "GOOG", name: "Google" },
  amzn: { ticker: "AMZN", name: "Amazon" },
  csco: { ticker: "CSCO", name: "Cisco Systems" },
  intc: { ticker: "INTC", name: "Intel" },
  cmcsa: { ticker: "CMCSA", name: "Comcast" },
  pep: { ticker: "PEP", name: "PepsiCo" },
  nflx: { ticker: "NFLX", name: "Netflix" },
  adbe: { ticker: "ADBE", name: "Adobe" },
  pypl: { ticker: "PYPL", name: "PayPal" },
  hon: { ticker: "HON", name: "Honeywell" },
  cost: { ticker: "COST", name: "Costco" },
  amgn: { ticker: "AMGN", name: "Amgen" },
  avgo: { ticker: "AVGO", name: "Broadcom" },
  lin: { ticker: "LIN", name: "Linde" },
  txn: { ticker: "TXN", name: "Texas Instruments" },
  azn: { ticker: "AZN", name: "AstraZeneca" },
  sbux: { ticker: "SBUX", name: "Starbucks" },
  asml: { ticker: "ASML", name: "ASML Holding" },
  tsla: { ticker: "TSLA", name: "Tesla" },
  gild: { ticker: "GILD", name: "Gilead Sciences" },
  tmus: { ticker: "TMUS", name: "T-Mobile" },
  chtr: { ticker: "CHTR", name: "Charter Communications" },
  zm: { ticker: "ZM", name: "Zoom" },
  qcom: { ticker: "QCOM", name: "Qualcomm" },
  jd: { ticker: "JD", name: "JD.com" },
  pdd: { ticker: "PDD", name: "Pinduoduo" },
  mrna: { ticker: "MRNA", name: "Moderna" },
  intu: { ticker: "INTU", name: "Intuit" },
  amd: { ticker: "AMD", name: "Advanced Micro Devices" },
  vod: { ticker: "VOD", name: "Vodafone" },
  bidu: { ticker: "BIDU", name: "Baidu" },
  vfs: { ticker: "VFS", name: "VinFast" },
  imcr: { ticker: "IMCR", name: "Immunocore" },
  meta: { ticker: "META", name: "Meta Platforms" },
  amat: { ticker: "AMAT", name: "Applied Materials" },
  mu: { ticker: "MU", name: "Micron Technology" },
  nvda: { ticker: "NVDA", name: "NVIDIA" },
  isrg: { ticker: "ISRG", name: "Intuitive Surgical" },
  qqq: { ticker: "QQQ", name: "Invesco QQQ Trust" },
  pltr: { ticker: "PLTR", name: "Palantir Technologies" },
}

export const convertStocksData = async () => {
  const { collection } = await DailyAssetsClient()
  const spotClient = await connectToSpotDb()

  const data = await spotClient.query("SELECT * FROM stocks_data")

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const parsedData: (DailyAsset | null)[] = data.rows.flatMap((row: any) => {
    const timestamp = Number(row.stampsec)
    const date = convertUnixToDate(timestamp)

    return Object.keys(row)
      .filter((key) => key !== "stampsec" && key !== "date")
      .map((key) => {
        const ticker = stocks[key as keyof typeof stocks]?.ticker
        const name = stocks[key as keyof typeof stocks]?.name
        const ohlcData = parseOHLC(row[key])

        const entry: DailyAsset = {
          ticker,
          name,
          date,
          timestamp,
          price: ohlcData?.price,
          open: ohlcData?.open,
          high: ohlcData?.high,
          low: ohlcData?.low,
          close: ohlcData?.close,
          type: AssetCategory.Stock,
        }

        const filteredEntry = filterValues(entry)

        if (
          filteredEntry.ticker &&
          filteredEntry.date &&
          filteredEntry.type &&
          (filteredEntry.price || filteredEntry.close)
        ) {
          return filteredEntry as DailyAsset
        }
        return null
      })
  })

  await uploadToDailyAssets(parsedData, collection)

  return parsedData
}
