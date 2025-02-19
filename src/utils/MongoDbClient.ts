import { MongoClient } from "mongodb"
import { DailyAsset } from "@/types/mongoDb"
import { AssetOverviewDocument } from "@/types/mongoDb"
import client from "./mongoDb"

export const DailyAssetsClient = async () => {
  const db = client.db("History")
  const collection = db.collection<DailyAsset>("DailyAssets")
  return { client, collection }
}

export const AssetOverviewClient = async () => {
  const db = client.db("History")
  const collection = db.collection<AssetOverviewDocument>("AssetOverview")
  return { client, collection }
}

export const clearCollection = async (collectionName: string) => {
  const url = process.env.MONGO_PUBLIC_URL || ""
  const client = new MongoClient(url)

  try {
    await client.connect()
    const db = client.db("History")
    await db.collection(collectionName).deleteMany({})
    console.log(`Collection ${collectionName} cleared successfully`)
  } catch (error) {
    console.error("Cannot clear collection", error)
  } finally {
    await client.close()
  }
}
