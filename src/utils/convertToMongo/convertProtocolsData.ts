import { DailyAsset } from "@/types/mongoDb"
import { DailyAssetsClient } from "@/utils/MongoDbClient"
import connectToSpotDb from "@/utils/connectToSpotDB"
import { AssetCategory } from "@/types/indexTypes"
import {
  parseOHLC,
  convertUnixToDate,
  filterValues,
  uploadToDailyAssets,
} from "./parse"

const protocolsDataMap = {
  aave: {
    ticker: "AAVE",
    name: "Aave",
  },
  pendle: {
    ticker: "PENDLE",
    name: "Pendle",
  },
  uniswap: {
    ticker: "UNI",
    name: "Uniswap",
  },
  curve_dex: {
    ticker: "CRV",
    name: "Curve",
  },
  convex_finance: {
    ticker: "CVX",
    name: "Convex Finance",
  },
  compound: {
    ticker: "COMP",
    name: "Compound",
  },
  pancakeswap_amm: {
    ticker: "CAKE",
    name: "PancakeSwap",
  },
  connext: {
    ticker: "CONX",
    name: "Connext",
  },
  balancer: {
    ticker: "BAL",
    name: "Balancer",
  },
  solvbtc: {
    ticker: "SOLVBT",
    name: "SolvBTC",
  },
  tornado_cash: {
    ticker: "TORN",
    name: "Tornado Cash",
  },
  uncx_network: {
    ticker: "UNCX",
    name: "Uncx Network",
  },
  gmx: {
    ticker: "GMX",
    name: "GMX",
  },
  gearbox: {
    ticker: "GEAR",
    name: "Gearbox",
  },
  stargate: {
    ticker: "STG",
    name: "Stargate",
  },
  sushiswap: {
    ticker: "SUSHI",
    name: "SushiSwap",
  },
  yearn_finance: {
    ticker: "YFI",
    name: "Yearn Finance",
  },
  beefy: {
    ticker: "BFC",
    name: "Beefy Finance",
  },
  penpie: {
    ticker: "PENPIE",
    name: "Penpie",
  },
  team_finance: {
    ticker: "TEAM",
    name: "Team Finance",
  },
  synapse: {
    ticker: "SYN",
    name: "Synapse",
  },
  multichain: {
    ticker: "MULTI",
    name: "Multichain",
  },
  axelar: {
    ticker: "AXL",
    name: "Axelar",
  },
  curve_llamalend: {
    ticker: "LLAM",
    name: "Curve Llama Lend",
  },
  equilibria: {
    ticker: "EQUI",
    name: "Equilibria",
  },
  silo_finance: {
    ticker: "SILO",
    name: "Silo",
  },
  radiant: {
    ticker: "RADIANT",
    name: "Radiant",
  },
  abracadabra_spell: {
    ticker: "SPELL",
    name: "Abracadabra Spell",
  },
  vertex: {
    ticker: "VRTX",
    name: "Vertex",
  },
  apex_protocol: {
    ticker: "APEX",
    name: "Apex Protocol",
  },
  gamma: {
    ticker: "GAMMA",
    name: "Gamma",
  },
  dhedge: {
    ticker: "DHE",
    name: "Dhedge",
  },
  railgun: {
    ticker: "RAIL",
    name: "Railgun",
  },
  sommelier: {
    ticker: "SOMM",
    name: "Sommelier",
  },
  atlas_aggregator: {
    ticker: "ATLAS",
    name: "Atlas Aggregator",
  },
  empyreal: {
    ticker: "EMP",
    name: "Empyreal",
  },
  beluga_dex: {
    ticker: "BELUGA",
    name: "Beluga Dex",
  },
  florence_finance: {
    ticker: "FLORENCE",
    name: "Florence Finance",
  },
  handlefi_hsp: {
    ticker: "HSP",
    name: "HandleFi HSP",
  },
  strips_finance: {
    ticker: "STRP",
    name: "Strips Finance",
  },
  betswirl: {
    ticker: "BET",
    name: "BetSwirl",
  },
  opulous: {
    ticker: "OPUL",
    name: "Opulous",
  },
  merkl: {
    ticker: "MERKL",
    name: "Merkl",
  },
  arbitrum: {
    ticker: "ARB",
    name: "Arbitrum",
  },
}

const convertProtocolsData = async () => {
  const { collection } = await DailyAssetsClient()
  const spotClient = await connectToSpotDb()

  const data = await spotClient.query(
    "SELECT * FROM protocols_data ORDER BY date DESC"
  )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const parsedData: (DailyAsset | null)[] = data.rows.flatMap((row: any) => {
    const timestamp = Number(row.stampsec) / 1000
    const date = convertUnixToDate(timestamp)
    // map over each column in the row that is not the stampsec or date column
    return Object.keys(row)
      .filter((key) => key !== "stampsec" && key !== "date")
      .map((key) => {
        const ticker =
          protocolsDataMap[key as keyof typeof protocolsDataMap]?.ticker
        const name =
          protocolsDataMap[key as keyof typeof protocolsDataMap]?.name
        const ohlcData = parseOHLC(row[key])

        const entry: DailyAsset = {
          ticker,
          name: name?.toLowerCase(),
          date,
          timestamp,
          price: ohlcData?.price,
          open: ohlcData?.open,
          high: ohlcData?.high,
          low: ohlcData?.low,
          close: ohlcData?.close,
          type: AssetCategory.Cryptocurrency,
        }

        const filteredEntry = filterValues(entry)

        if (
          filteredEntry.ticker &&
          filteredEntry.date &&
          filteredEntry.type &&
          filteredEntry.name &&
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

export default convertProtocolsData
