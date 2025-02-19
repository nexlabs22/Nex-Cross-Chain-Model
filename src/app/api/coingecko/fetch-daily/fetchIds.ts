import { AssetOverviewClient } from "@/utils/MongoDbClient"

export async function fetchDocumentsWithCoingeckoId() {
  try {
    const { collection} = await AssetOverviewClient()

    const query = { "coingecko.id": { $exists: true, $ne: null } }
    const documents = await collection.find(query).limit(250).toArray()

    return documents
  } catch (error) {
    console.error("Error fetching documents:", error)
  }
}
