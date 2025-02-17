import { NextResponse } from "next/server"
import DailyAssetsClient from "@/utils/MongoDbClient"
import { MongoClient } from "mongodb"
// async function getAssetOverviewClient() {
//   const { client } = await AssetOverviewClient("AssetOverview")
//   return client
// }

async function getDailyAssetsClient() {
  const { client, collection } = await DailyAssetsClient("DailyAssets")
  return { client, collection }
}

export async function GET() {
  let client: MongoClient | null = null
  try {
    const { client: localClient } = await getDailyAssetsClient()
    client = localClient

    return NextResponse.json(
      { message: "MongoDB client connected" },
      { status: 200 }
    )
  } catch (error) {
    console.error("MongoDB client connection error", error)
    return NextResponse.json(
      { message: "MongoDB client connection error" },
      { status: 500 }
    )
  } finally {
    if (client) {
      await client.close()
    }
  }
}
