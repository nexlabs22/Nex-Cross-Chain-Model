import { AssetOverviewClient } from "@/utils/MongoDbClient"
import { filterValues } from "@/utils/convertToMongo/parse"

export const fetchCoingeckoList = async () => {
  const response = await fetch("https://api.coingecko.com/api/v3/coins/list", {
    headers: {
      Accept: "application/json",
      "x-cg-demo-api-key": process.env.COINGECKO_API_KEY || "",
    },
  })
  const data = await response.json()
  return data
}

export async function processCoingeckoData() {
  const { collection } = await AssetOverviewClient()
  const existingAssets = await collection.find({}).toArray()
  const coingeckoList = await fetchCoingeckoList()

  const mongoData = []

  for (const asset of coingeckoList) {
    const { id, symbol, name } = asset
    const coingeckoObject = {
      id,
    }

    const storeObject = {
      coingecko: coingeckoObject,
      lastUpdate: new Date(),
      name: name.toLowerCase(),
      ticker: symbol.toUpperCase(),
    }

    const existingAsset = existingAssets.find(
      (asset) =>
        asset.ticker === symbol.toUpperCase() &&
        asset.name === name.toLowerCase()
    )

    const filterAsset = filterValues(storeObject)

    if (
      existingAsset &&
      filterAsset.name &&
      filterAsset.ticker &&
      filterAsset.coingecko
    ) {
      mongoData.push(storeObject)
    }
  }

  return { mongoData, collection, existingAssets, coingeckoList }
}
