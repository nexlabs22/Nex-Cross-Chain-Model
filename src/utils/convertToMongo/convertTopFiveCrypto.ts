//Todo: convert ten protocols data new
import { Collection } from "mongodb"
import {
  extractUniqueKeys,
  parseCommaSeparated,
  convertUnixToDate,
  filterValues,
  uploadToDailyAssets,
} from "./parse"
import connectToSpotDb from "@/utils/connectToSpotDB"
import { DailyAssetsClient } from "@/utils/MongoDbClient"
import { DailyAsset } from "@/types/mongoDb"
import { AssetCategory } from "@/types/indexTypes"

/*const uniqueProtocols = [
  "bitcoin",
  "litecoin",
  "ripple",
  "dogecoin",
  "monero",
  "stellar",
  "ethereum",
  "ethereum-classic",
  "bitcoin-cash",
  "cardano",
  "eos",
  "bitcoin-cash-sv",
  "chainlink",
  "polkadot",
  "binancecoin",
  "solana",
  "okb",
]*/

const mapNameToTicker: Record<string, { ticker: string; name: string }> = {
  bitcoin: { ticker: "BTC", name: "Bitcoin" },
  litecoin: { ticker: "LTC", name: "Litecoin" },
  ripple: { ticker: "XRP", name: "Ripple" },
  dogecoin: { ticker: "DOGE", name: "Dogecoin" },
  monero: { ticker: "XMR", name: "Monero" },
  stellar: { ticker: "XLM", name: "Stellar" },
  ethereum: { ticker: "ETH", name: "Ethereum" },
  "ethereum-classic": { ticker: "ETC", name: "Ethereum Classic" },
  "bitcoin-cash": { ticker: "BCH", name: "Bitcoin Cash" },
  cardano: { ticker: "ADA", name: "Cardano" },
  eos: { ticker: "EOS", name: "EOS" },
  "bitcoin-cash-sv": { ticker: "BSV", name: "Bitcoin Cash SV" },
  chainlink: { ticker: "LINK", name: "Chainlink" },
  polkadot: { ticker: "DOT", name: "Polkadot" },
  binancecoin: { ticker: "BNB", name: "Binance Coin" },
  solana: { ticker: "SOL", name: "Solana" },
  okb: { ticker: "OKB", name: "OKB" },
}

type TopFiveCrypto = {
  // id: number
  date: string //YYYY-MM-DD
  timestamp: number //timestamp in seconds
  top5: Record<string, number>
}

export const getUniqueProtocols = async () => {
  const spotClient = await connectToSpotDb()
  const data = (await spotClient.query("SELECT * FROM top5crypto")).rows
  const columns = ["id", "date", "timestamp", "top5"]
  const targetColumns = ["top5"]
  const uniqueKeys = extractUniqueKeys(data, columns, targetColumns)
  console.log(uniqueKeys, "unique keys")
}

export const convertTopFiveCrypto = async () => {
  const { collection }: { collection: Collection<DailyAsset> } =
    await DailyAssetsClient()
  const spotClient = await connectToSpotDb()

  const data = await spotClient.query("SELECT * FROM top5crypto")
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const parsedData: TopFiveCrypto[] = data.rows.map((row: any) => ({
    date: convertUnixToDate(Number(row.timestamp)),
    timestamp: Math.floor(
      Number(
        row.timestamp.toString().length === 13
          ? row.timestamp / 1000
          : row.timestamp
      )
    ),
    top5: parseCommaSeparated(row.top5),
  }))

  const mongoDbData: DailyAsset[] = []

  // Iterate over each row in the parsed data
  for (const row of parsedData) {
    // Assuming 'top5' is a comma-separated string in each row
    const top5Entries = Object.entries(row.top5)

    // Create a MongoDB document for each entry in 'top5'
    for (const entry of top5Entries) {
      const date = row.date
      const timestamp = row.timestamp
      const ticker =
        mapNameToTicker[entry[0] as keyof typeof mapNameToTicker].ticker
      const name =
        mapNameToTicker[entry[0] as keyof typeof mapNameToTicker].name
      const marketCap = entry[1]
      const type = AssetCategory.Cryptocurrency

      const mongoDbDocument: DailyAsset = {
        date,
        timestamp,
        ticker,
        name: name?.toLowerCase(),
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
        mongoDbData.push(filteredEntry as DailyAsset)
      }
    }
  }
  await uploadToDailyAssets(mongoDbData, collection)
}
