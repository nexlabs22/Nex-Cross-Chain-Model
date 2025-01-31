//import { Collection } from "mongodb"

import { MongoDb } from "@/types/mongoDb"
import connectToMongoDb from "@/utils/connectToMongoDb"
import connectToSpotDb from "@/utils/connectToSpotDB"
import { AssetCategory } from "@/types/indexTypes"
import {
  convertUnixToDate,
  parseOHLC,
  uploadToMongo,
  filterValues,
} from "./parse"

/*type HistCompData = {
  stampsec: number //example: 1064462400, which is in unix time in seconds
  nyse: string
  nasdaq: string
  swiss: string
  dow: string
  sandp: string
  nex: string
  bitcoin: string
  ethereum: string
  usdc: string
  usdt: string
  binancecoin: string
  steth: string
  solana: string
  stellar: string
  litecoin: string
  monero: string
  okb: string
  polkadot: string
  eos: string
  chainlink: string
  dogecoin: string
  bitcoincashsv: string
  bitcoincash: string
  ethereumclassic: string
  gold: string
  xaut: string
  ripple: string
  oil: string
  asml: string
  microsoft: string
  paypal: string
  copper: string
  lithium: string
  apple: string
  aplhabet: string
  silver: string
  amazon: string
  tencent: string
  visa: string
  tsmc: string
  exxon_mob: string
  unitedhealth_group: string
  nvidia: string
  johnson_n_johnson: string
  lvmh: string
  tesla: string
  jpmorgan: string
  walmart: string
  meta: string
  spdr: string
  mastercard: string
  chevron_corp: string
  bekshire_hathaway: string
  sci: string
  arbitrum: string
}*/

// map the column names to name and ticker
const columnToNameAndtickerMap: {
  [key: string]: {
    name: string
    ticker: string
    type: AssetCategory
    source: string
  }
} = {
  nyse: {
    name: "New York Stock Exchange",
    ticker: "NYSE",
    type: AssetCategory.Stock,
    source: "investing.com",
  },
  nasdaq: {
    name: "NASDAQ",
    ticker: "NASDAQ",
    type: AssetCategory.Stock,
    source: "investing.com",
  },
  swiss: {
    name: "Swiss Exchange",
    ticker: "SWX",
    type: AssetCategory.Stock,
    source: "investing.com",
  },
  dow: {
    name: "Dow Jones Industrial Average",
    ticker: "DJI",
    type: AssetCategory.Stock,
    source: "investing.com",
  },
  sandp: {
    name: "S&P 500",
    ticker: "SPDR",
    type: AssetCategory.Stock,
    source: "investing.com",
  },
  //   nex: {
  //    Is this our nex token?
  //   },
  bitcoin: {
    name: "Bitcoin",
    ticker: "BTC",
    type: AssetCategory.Cryptocurrency,
    source: "investing.com",
  },
  ethereum: {
    name: "Ethereum",
    ticker: "ETH",
    type: AssetCategory.Cryptocurrency,
    source: "investing.com",
  },
  usdc: {
    name: "USDC",
    ticker: "USDC",
    type: AssetCategory.Cryptocurrency,
    source: "investing.com",
  },
  usdt: {
    name: "Tether USDT",
    ticker: "USDT",
    type: AssetCategory.Cryptocurrency,
    source: "investing.com",
  },
  binancecoin: {
    name: "Binance Coin",
    ticker: "BNB",
    type: AssetCategory.Cryptocurrency,
    source: "investing.com",
  },
  steth: {
    name: "Staked ETH",
    ticker: "STETH",
    type: AssetCategory.Cryptocurrency,
    source: "investing.com",
  },
  solana: {
    name: "Solana",
    ticker: "SOL",
    type: AssetCategory.Cryptocurrency,
    source: "investing.com",
  },
  stellar: {
    name: "Stellar",
    ticker: "XLM",
    type: AssetCategory.Cryptocurrency,
    source: "investing.com",
  },
  litecoin: {
    name: "Litecoin",
    ticker: "LTC",
    type: AssetCategory.Cryptocurrency,
    source: "investing.com",
  },
  monero: {
    name: "Monero",
    ticker: "XMR",
    type: AssetCategory.Cryptocurrency,
    source: "investing.com",
  },
  okb: {
    name: "OKB",
    ticker: "OKB",
    type: AssetCategory.Cryptocurrency,
    source: "investing.com",
  },
  polkadot: {
    name: "Polkadot",
    ticker: "DOT",
    type: AssetCategory.Cryptocurrency,
    source: "investing.com",
  },
  eos: {
    name: "EOS",
    ticker: "EOS",
    type: AssetCategory.Cryptocurrency,
    source: "investing.com",
  },
  chainlink: {
    name: "Chainlink",
    ticker: "LINK",
    type: AssetCategory.Cryptocurrency,
    source: "investing.com",
  },
  arbitrum: {
    name: "ARBITRUM",
    ticker: "ARBITRUM",
    type: AssetCategory.Cryptocurrency,
    source: "investing.com",
  },
  mastercard: {
    name: "Mastercard",
    ticker: "MA",
    type: AssetCategory.Stock,
    source: "investing.com",
  },
  dogecoin: {
    name: "Dogecoin",
    ticker: "DOGE",
    type: AssetCategory.Cryptocurrency,
    source: "investing.com",
  },
  bitcoincashsv: {
    name: "Bitcoin Cash SV",
    ticker: "BCHSV",
    type: AssetCategory.Cryptocurrency,
    source: "investing.com",
  },
  bitcoincash: {
    name: "Bitcoin Cash",
    ticker: "BCH",
    type: AssetCategory.Cryptocurrency,
    source: "investing.com",
  },
  ethereumclassic: {
    name: "Ethereum Classic",
    ticker: "ETC",
    type: AssetCategory.Cryptocurrency,
    source: "investing.com",
  },
  gold: {
    name: "Gold spot",
    ticker: "XAU",
    type: AssetCategory.Commodity,
    source: "investing.com",
  },
  xaut: {
    name: "Tether Gold",
    ticker: "XAUT",
    type: AssetCategory.Cryptocurrency,
    source: "investing.com",
  },
  ripple: {
    name: "Ripple",
    ticker: "XRP",
    type: AssetCategory.Cryptocurrency,
    source: "investing.com",
  },
  oil: {
    name: "Crude Oil WTI Futures",
    ticker: "CL",
    type: AssetCategory.Commodity,
    source: "investing.com",
  },
  asml: {
    name: "ASML Holding NV",
    ticker: "ASML",
    type: AssetCategory.Stock,
    source: "investing.com",
  },
  microsoft: {
    name: "Microsoft Corporation",
    ticker: "MSFT",
    type: AssetCategory.Stock,
    source: "investing.com",
  },
  paypal: {
    name: "PayPal Holdings",
    ticker: "PYPL",
    type: AssetCategory.Stock,
    source: "investing.com",
  },
  copper: {
    name: "Copper Futures",
    ticker: "HG",
    type: AssetCategory.Commodity,
    source: "investing.com",
  },
  lithium: {
    name: "Lithium",
    ticker: "LITHIUM",
    type: AssetCategory.Commodity,
    source: "investing.com",
  },
  apple: {
    name: "Apple Inc.",
    ticker: "AAPL",
    type: AssetCategory.Stock,
    source: "investing.com",
  },
  aplhabet: {
    name: "Alphabet Inc.",
    ticker: "GOOGL",
    type: AssetCategory.Stock,
    source: "investing.com",
  },
  silver: {
    name: "Silver Futures",
    ticker: "SI",
    type: AssetCategory.Commodity,
    source: "investing.com",
  },
  amazon: {
    name: "Amazon.com Inc.",
    ticker: "AMZN",
    type: AssetCategory.Stock,
    source: "investing.com",
  },
  tencent: {
    name: "Tencent Holdings",
    ticker: "0700",
    type: AssetCategory.Stock,
    source: "investing.com",
  },
  visa: {
    name: "Visa Inc.",
    ticker: "V",
    type: AssetCategory.Stock,
    source: "investing.com",
  },
  tsmc: {
    name: "Taiwan Semiconductor Manufacturing Company",
    ticker: "TSM",
    type: AssetCategory.Stock,
    source: "investing.com",
  },
  exxon_mob: {
    name: "Exxon Mobil Corporation",
    ticker: "XOM",
    type: AssetCategory.Stock,
    source: "investing.com",
  },
  unitedhealth_group: {
    name: "UnitedHealth Group",
    ticker: "UNH",
    type: AssetCategory.Stock,
    source: "investing.com",
  },
  nvidia: {
    name: "NVIDIA Corporation",
    ticker: "NVDA",
    type: AssetCategory.Stock,
    source: "investing.com",
  },
  johnson_n_johnson: {
    name: "Johnson & Johnson",
    ticker: "JNJ",
    type: AssetCategory.Stock,
    source: "investing.com",
  },
  lvmh: {
    name: "LVMH Moët Hennessy Louis Vuitton",
    ticker: "MC",
    type: AssetCategory.Stock,
    source: "investing.com",
  },
  tesla: {
    name: "Tesla Inc.",
    ticker: "TSLA",
    type: AssetCategory.Stock,
    source: "investing.com",
  },
  jpmorgan: {
    name: "JPMorgan Chase & Co.",
    ticker: "JPM",
    type: AssetCategory.Stock,
    source: "investing.com",
  },
  walmart: {
    name: "Walmart Inc.",
    ticker: "WMT",
    type: AssetCategory.Stock,
    source: "investing.com",
  },
  meta: {
    name: "Meta Platforms Inc.",
    ticker: "META",
    type: AssetCategory.Stock,
    source: "investing.com",
  },
  spdr: {
    name: "SPDR S&P 500 ETF Trust",
    ticker: "SPY",
    type: AssetCategory.Stock,
    source: "investing.com",
  },
  chevron_corp: {
    name: "Chevron Corporation",
    ticker: "CVX",
    type: AssetCategory.Stock,
    source: "investing.com",
  },
  bekshire_hathaway: {
    name: "Berkshire Hathaway Inc.",
    ticker: "BRK.A",
    type: AssetCategory.Stock,
    source: "investing.com",
  },
  sci: {
    name: "Smart Contract Index",
    ticker: "SCI",
    type: AssetCategory.Cryptocurrency,
    source: "investing.com",
  },
}

const convertHistCompDataTable = async () => {
  const { collection } = await connectToMongoDb("DailyAssets")
  const spotClient = await connectToSpotDb()

  const data = await spotClient.query(
    "SELECT * FROM histcomp ORDER BY date DESC"
  )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const parsedData: (MongoDb | null)[] = data.rows.flatMap((row: any) => {
    const timestamp = Number(row.stampsec)
    const date = convertUnixToDate(timestamp)

    return Object.keys(columnToNameAndtickerMap).map((column) => {
      if (column === "stampsec" || column === "date") return null
      const ohlcData = parseOHLC(row[column])
      const ticker = columnToNameAndtickerMap[column].ticker
      const name = columnToNameAndtickerMap[column].name
      const type = columnToNameAndtickerMap[column].type

      const entry: MongoDb = {
        ticker,
        name,
        type,
        date,
        timestamp,
        open: ohlcData?.open,
        high: ohlcData?.high,
        low: ohlcData?.low,
        close: ohlcData?.close,
        price: ohlcData?.price,
        volume: ohlcData?.volume,
      }

      const filteredEntry = filterValues(entry)

      if (filteredEntry.ticker && filteredEntry.date && filteredEntry.type) {
        return filteredEntry as MongoDb
      }
      return null
    })
  })

  await uploadToMongo(parsedData, collection)

  return parsedData
}

export default convertHistCompDataTable
