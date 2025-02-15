import { MongoClient, Collection } from "mongodb"
import { MongoDb } from "@/types/mongoDb"
import { AssetOverviewDocument } from "@/types/indexTypes"

const connectToMongoDb = async (
  collectionName: string
): Promise<{ client: MongoClient; collection: Collection<MongoDb> }> => {
  const url = process.env.MONGO_PUBLIC_URL || ""
  const client = new MongoClient(url, {
    serverSelectionTimeoutMS: 30000,
  })

  try {
    await client.connect()
    console.log("Connected successfully to MongoDB client check")
    const db = client.db("History")
    const collection = db.collection<MongoDb>(collectionName)
    return { client, collection }
  } catch (error) {
    console.error("Cannot connect to MongoDB", error)
    throw new Error("Cannot connect to MongoDB")
  }
}

export const connectToMongoDbDocument = async (
  collectionName: string
): Promise<{
  client: MongoClient
  collection: Collection<AssetOverviewDocument>
}> => {
  const url = process.env.MONGO_PUBLIC_URL || ""
  if (!url || url === "") {
    throw new Error("MONGO_PUBLIC_URL is not set")
  }
  const client = new MongoClient(url, {
    serverSelectionTimeoutMS: 30000,
  })

  try {
    await client.connect()
    console.log("Connected successfully to MongoDB document")
    const db = client.db("History")
    const collection = db.collection<AssetOverviewDocument>(collectionName)
    return { client, collection }
  } catch (error) {
    console.error("Cannot connect to MongoDB", error)
    throw new Error("Cannot connect to MongoDB")
  }
}

export default connectToMongoDb

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
