import { AssetOverviewClient, DailyAssetsClient } from "@/utils/MongoDbClient"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const collectionType = url.searchParams.get("collection")
  if (collectionType !== "AssetOverview" && collectionType !== "DailyAssets") {
    return NextResponse.json({
      message: "Invalid collection type",
    })
  }

  let collection
  if (collectionType === "DailyAssets") {
    const { collection: dailyAssetsCollection } = await DailyAssetsClient()
    collection = dailyAssetsCollection
  } else {
    const { collection: assetOverviewCollection } = await AssetOverviewClient()
    collection = assetOverviewCollection
  }

  const indexInfo = await collection.indexInformation()

  return NextResponse.json({
    message: "Index read successfully",
    indexInfo,
  })
}

export async function POST(request: Request) {
  const url = new URL(request.url)
  const collectionType = url.searchParams.get("collection")
  const dropIndexValue = url.searchParams.get("dropIndex")

  if (collectionType !== "AssetOverview" && collectionType !== "DailyAssets") {
    return NextResponse.json({
      message: "Invalid collection type",
    })
  }

  let collection
  if (collectionType === "DailyAssets") {
    const { collection: dailyAssetsCollection } = await DailyAssetsClient()
    collection = dailyAssetsCollection
  } else {
    const { collection: assetOverviewCollection } = await AssetOverviewClient()
    collection = assetOverviewCollection
  }

  if (!collection) {
    return NextResponse.json({
      message: "Collection not found",
    })
  }
  if (dropIndexValue) {
    const dropIndex = await collection.indexExists(dropIndexValue)
    if (dropIndex) {
      await collection.dropIndex(dropIndexValue)
    }
  }

  if (collectionType === "AssetOverview") {
    await collection.createIndex({ ticker: 1, name: 1 }, { unique: true })
  }

  if (collectionType === "DailyAssets") {
    await collection.createIndex(
      { ticker: 1, name: 1, date: 1 },
      { unique: true }
    )
  }

  const newIndexInfo = await collection.indexInformation()

  return NextResponse.json({
    message: "Index updated successfully",
    indexInfo: newIndexInfo,
    // dropIndex,
  })
}
