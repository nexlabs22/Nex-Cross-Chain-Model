import { AssetOverviewDocument } from "@/types/mongoDb"
import { filterValues } from "@/utils/convertToMongo/parse"
import { fetchCmcListings, fetchSplittedCmcMetadata } from "./index"

export const fetchCoinMarketCapData = async () => {
  const idList = await fetchCmcListings()
  const metaData = await fetchSplittedCmcMetadata({ idList })
  return metaData
}

export async function processCoinMarketCapData() {
  const coinMarketCapData = await fetchCoinMarketCapData()
  const mongoData: (AssetOverviewDocument | null)[] = []

  for (const asset of coinMarketCapData) {
    const storeObject: AssetOverviewDocument = {
      name: asset.name.toLowerCase(),
      ticker: asset.symbol.toUpperCase(),
      lastUpdate: new Date(),
      tokenAddress: asset.platform?.token_address,
      coinmarketcap: asset,
    }

    const filteredObject = filterValues(storeObject)
    if (
      filteredObject.name &&
      filteredObject.ticker &&
      filteredObject.coinmarketcap
    ) {
      mongoData.push(filteredObject as AssetOverviewDocument)
    }
  }
  return mongoData
}
