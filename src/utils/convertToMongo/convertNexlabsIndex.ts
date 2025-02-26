import { DailyAsset } from "@/types/mongoDb"
import { DailyAssetsClient } from "@/utils/MongoDbClient"
import connectToSpotDb from "@/utils/connectToSpotDB"
import { AssetCategory } from "@/types/indexTypes"
import { uploadToDailyAssets, filterValues, convertUnixToDate } from "./parse"

const nexlabsIndexMap = {
  anfi: {
    ticker: "ANFI",
    name: "Anti Inflation Index",
  },
  crypto5: {
    name: "Crypto 5 Index",
    ticker: "CRYPTO5",
  },
  stock5: {
    name: "Stock 5 Index",
    ticker: "STOCK5",
  },
  mag7: {
    name: "Magnificent 7 Index",
    ticker: "MAG7",
  },
  sci: {
    name: "Smart Contract Index",
    ticker: "SCI",
  },
  arbei: {
    name: "Arbitrum Ecosystem Index",
    ticker: "ARBEI",
  },
  arb15: {
    name: "Arbitrum 15 Index",
    ticker: "ARB15",
  },
  arbreg: {
    name: "Regression Arbitrum Ecosystem Index",
    ticker: "rARBEI",
  },
  arbei_reg_v2: {
    name: "Regression Arbitrum Ecosystem Index",
    ticker: "rARBEI",
  },
  arbei_reg: {
    name: "Regression Arbitrum Ecosystem Index V1",
    ticker: "rARBEI_V1",
  },
}

const convertNexlabsIndex = async () => {
  const { collection } = await DailyAssetsClient()
  const spotClient = await connectToSpotDb()

  const data = await spotClient.query(
    "SELECT * FROM nexlabindex ORDER BY stampsec DESC"
  )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const parsedData: (DailyAsset | null)[] = data.rows.flatMap((row: any) => {
    // return a new document for each column in the row
    return Object.entries(row).map(([key, value]) => {
      if (key === "stampsec" || !value || key === "date") return null

      const timestamp = Number(row.stampsec)
      const date = convertUnixToDate(timestamp)
      const name = nexlabsIndexMap[key as keyof typeof nexlabsIndexMap].name
      const ticker = nexlabsIndexMap[key as keyof typeof nexlabsIndexMap].ticker

      const entry: DailyAsset = {
        ticker,
        name: name?.toLowerCase(),
        date,
        timestamp,
        price: Number(value),
        type: AssetCategory.Index,
      }

      const filteredEntry = filterValues(entry)

      if (
        filteredEntry.ticker &&
        filteredEntry.name &&
        filteredEntry.date &&
        filteredEntry.type &&
        filteredEntry.price
      ) {
        return filteredEntry as DailyAsset
      }
      return null
    })
  })

  await uploadToDailyAssets(parsedData, collection)
}

export default convertNexlabsIndex
