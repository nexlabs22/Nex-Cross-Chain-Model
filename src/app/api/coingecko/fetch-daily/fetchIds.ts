import { connectToMongoDbDocument } from "@/utils/connectToMongoDb"

export async function fetchDocumentsWithCoingeckoId() {
  try {
    const { collection, client } = await connectToMongoDbDocument(
      "AssetOverview"
    )

    const query = { "coingecko.id": { $exists: true, $ne: null } }
    //coingecko rate limit is 5-15 calls per minute, with 250 requests per call
    const documents = await collection.find(query).limit(250).toArray()

    client.close()
    return documents
  } catch (error) {
    console.error("Error fetching documents:", error)
  }
}
