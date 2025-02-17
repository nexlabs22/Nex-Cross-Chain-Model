import { NextResponse } from "next/server"
import { AssetOverviewClient } from "@/utils/MongoDbClient"
import { uploadToAssetOverview } from "@/utils/convertToMongo/parse"
import { MongoClient } from "mongodb"

const fetchCoingeckoList = async () => {
  const response = await fetch("https://api.coingecko.com/api/v3/coins/list", {
    headers: {
      Accept: "application/json",
      "x-cg-demo-api-key": process.env.COINGECKO_API_KEY || "",
    },
  })
  const data = await response.json()
  return data
}

export async function GET() {
  let client: MongoClient | null = null
  try {
    const { collection, client: localClient } = await AssetOverviewClient(
      "AssetOverview"
    )

    const existingAssets = await collection
      .find({}, { projection: { ticker: 1, name: 1 } })
      .toArray()

    client = localClient

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
        name,
        ticker: symbol.toUpperCase(),
      }

      const existingAsset = existingAssets.find(
        (asset) => asset.ticker === symbol.toUpperCase() && asset.name === name
      )

      if (existingAsset) {
        mongoData.push(storeObject)
      }
    }

    await uploadToAssetOverview(mongoData, collection)

    return NextResponse.json({
      message: "Assets updated successfully",
    })
  } catch (error) {
    console.error("Error in asset update process:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  } finally {
    if (client) {
      await client.close()
    }
  }
}
