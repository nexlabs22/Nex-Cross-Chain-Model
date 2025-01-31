//Todo: convert ten protocols data new
import { Collection } from "mongodb"
import {
  extractUniqueKeys,
  parseCommaSeparated,
  convertUnixToDate,
  filterValues,
  uploadToMongo,
} from "./parse"
import connectToSpotDb from "@/utils/connectToSpotDB"
import connectToMongoDb from "@/utils/connectToMongoDb"
import { MongoDb } from "@/types/mongoDb"
import { AssetCategory } from "@/types/indexTypes"

/*const uniqueProtocols = [
  "MSFT",
  "AMZN",
  "AAPL",
  "GOOG",
  "META",
  "CSCO",
  "INTC",
  "CMCSA",
  "PEP",
  "NFLX",
  "ADBE",
  "PYPL",
  "HON",
  "COST",
  "AMGN",
  "AVGO",
  "LIN",
  "TXN",
  "AZN",
  "SBUX",
  "NVDA",
  "ASML",
  "TSLA",
  "GILD",
  "TMUS",
  "CHTR",
  "ZM",
  "QCOM",
  "JD",
  "PDD",
  "MRNA",
  "INTU",
  "AMD",
  "VOD",
  "BIDU",
  "VFS",
  "IMCR",
  "GOOGL",
  "AMAT",
  "MU",
  "ISRG",
  "FOUN",
  "QQQ",
  "BKNG",
  "PLTR",
]*/

const mapNameToTicker: Record<string, { ticker: string; name: string }> = {
  MSFT: { ticker: "MSFT", name: "Microsoft" },
  AMZN: { ticker: "AMZN", name: "Amazon" },
  AAPL: { ticker: "AAPL", name: "Apple" },
  GOOG: { ticker: "GOOG", name: "Google" },
  META: { ticker: "META", name: "Meta" },
  CSCO: { ticker: "CSCO", name: "Cisco" },
  INTC: { ticker: "INTC", name: "Intel" },
  CMCSA: { ticker: "CMCSA", name: "Comcast" },
  PEP: { ticker: "PEP", name: "PepsiCo" },
  NFLX: { ticker: "NFLX", name: "Netflix" },
  ADBE: { ticker: "ADBE", name: "Adobe" },
  PYPL: { ticker: "PYPL", name: "PayPal" },
  HON: { ticker: "HON", name: "Honeywell" },
  COST: { ticker: "COST", name: "Costco" },
  AMGN: { ticker: "AMGN", name: "Amgen" },
  AVGO: { ticker: "AVGO", name: "Broadcom" },
  LIN: { ticker: "LIN", name: "Linde" },
  TXN: { ticker: "TXN", name: "Texas Instruments" },
  AZN: { ticker: "AZN", name: "AstraZeneca" },
  SBUX: { ticker: "SBUX", name: "Starbucks" },
  NVDA: { ticker: "NVDA", name: "NVIDIA" },
  ASML: { ticker: "ASML", name: "ASML" },
  TSLA: { ticker: "TSLA", name: "Tesla" },
  GILD: { ticker: "GILD", name: "Gilead Sciences" },
  TMUS: { ticker: "TMUS", name: "T-Mobile" },
  CHTR: { ticker: "CHTR", name: "Charter Communications" },
  ZM: { ticker: "ZM", name: "Zoom" },
  QCOM: { ticker: "QCOM", name: "Qualcomm" },
  JD: { ticker: "JD", name: "JD.com" },
  PDD: { ticker: "PDD", name: "Pinduoduo" },
  MRNA: { ticker: "MRNA", name: "Moderna" },
  INTU: { ticker: "INTU", name: "Intuit" },
  AMD: { ticker: "AMD", name: "AMD" },
  VOD: { ticker: "VOD", name: "Vodafone" },
  BIDU: { ticker: "BIDU", name: "Baidu" },
  VFS: { ticker: "VFS", name: "VFS" },
  IMCR: { ticker: "IMCR", name: "Immunocore" },
  GOOGL: { ticker: "GOOGL", name: "Google" },
  AMAT: { ticker: "AMAT", name: "Applied Materials" },
  MU: { ticker: "MU", name: "Micron Technology" },
  ISRG: { ticker: "ISRG", name: "Intuitive Surgical" },
  FOUN: { ticker: "FOUN", name: "Foun" },
  QQQ: { ticker: "QQQ", name: "Nasdaq-100 Index" },
  BKNG: { ticker: "BKNG", name: "Booking Holdings" },
  PLTR: { ticker: "PLTR", name: "Palantir" },
}

type TopStocksByMarketCap = {
  // id: number
  date: string //YYYY-MM-DD
  timestamp: number //timestamp in seconds
  topstocks: Record<string, number>
}

export const getUniqueProtocols = async () => {
  const spotClient = await connectToSpotDb()
  const data = (await spotClient.query("SELECT * FROM topstocksbymarketcap"))
    .rows
  const columns = ["id", "date", "stampsec", "topstocks"]
  const targetColumns = ["topstocks"]
  const uniqueKeys = extractUniqueKeys(data, columns, targetColumns)
  console.log(uniqueKeys, "unique keys")
}

export const convertTopStocksByMarketCap = async () => {
  const { collection }: { collection: Collection<MongoDb> } =
    await connectToMongoDb("DailyAssets")
  const spotClient = await connectToSpotDb()

  const data = await spotClient.query("SELECT * FROM topstocksbymarketcap")
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const parsedData: TopStocksByMarketCap[] = data.rows.map((row: any) => ({
    date: convertUnixToDate(Number(row.stampsec)),
    timestamp: Math.floor(
      Number(
        row.stampsec.toString().length === 13
          ? row.stampsec / 1000
          : row.stampsec
      )
    ),
    topstocks: parseCommaSeparated(row.topstocks),
  }))

  const mongoDbData: MongoDb[] = []

  // Iterate over each row in the parsed data
  for (const row of parsedData) {
    // Assuming 'top5' is a comma-separated string in each row
    const topstocksEntries = Object.entries(row.topstocks)

    // Create a MongoDB document for each entry in 'top5'
    for (const entry of topstocksEntries) {
      const date = row.date
      const timestamp = row.timestamp
      const ticker =
        mapNameToTicker[entry[0] as keyof typeof mapNameToTicker].ticker
      const name =
        mapNameToTicker[entry[0] as keyof typeof mapNameToTicker].name
      const marketCap = entry[1]
      const type = AssetCategory.Stock

      const mongoDbDocument: MongoDb = {
        date,
        timestamp,
        ticker,
        name,
        marketCap,
        type,
      }

      const filteredEntry = filterValues(mongoDbDocument)

      if (
        filteredEntry.ticker &&
        filteredEntry.name &&
        filteredEntry.date &&
        filteredEntry.type &&
        filteredEntry.marketCap
      ) {
        mongoDbData.push(filteredEntry as MongoDb)
      }
    }
  }
  await uploadToMongo(mongoDbData, collection)
}
