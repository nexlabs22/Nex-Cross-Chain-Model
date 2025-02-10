import { AssetOverviewDocument } from "@/types/indexTypes"
import { connectToMongoDbDocument } from "@/utils/connectToMongoDb"

export const updateAssetOverview = async (asset: AssetOverviewDocument) => {
  const { client, collection } = await connectToMongoDbDocument("AssetOverview")
  try {
    const existingAsset = await collection.findOne({ ticker: asset.ticker })

    if (!existingAsset) {
      await collection.insertOne(asset)
    }

    if (existingAsset && asset.provider) {
      let newProvider = []
      if (existingAsset?.provider?.includes(asset.provider[0])) {
        newProvider = [...existingAsset.provider]
      } else {
        newProvider = [...(existingAsset?.provider || []), ...asset.provider]
      }

      await collection.updateOne(
        { ticker: asset.ticker },
        { $set: { ...existingAsset, ...asset, provider: newProvider } }
      )
    }
  } catch (error) {
    console.error("Error updating or inserting asset:", error)
  } finally {
    await client.close()
  }
}
