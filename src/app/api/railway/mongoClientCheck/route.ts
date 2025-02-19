import { NextResponse } from "next/server"
import { DailyAssetsClient } from "@/utils/MongoDbClient"
import { MongoClient } from "mongodb"

async function getConnectionStats(client: MongoClient) {
  const item = await client.db().command({
    serverStatus: 1,
  })
  console.log(item)
  return item.connections.current
}

async function getDailyAssetsClient() {
  const { client, collection } = await DailyAssetsClient()
  return { client, collection }
}

export async function GET() {
  try {
    const { client } = await getDailyAssetsClient()
    const stats = await getConnectionStats(client)

    return NextResponse.json(
      { message: "MongoDB client connected", stats },
      { status: 200 }
    )
  } catch (error) {
    console.error("MongoDB client connection error", error)
    return NextResponse.json(
      { message: "MongoDB client connection error" },
      { status: 500 }
    )
  }
}
