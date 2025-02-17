import { NextResponse } from "next/server"
import { AssetOverviewClient } from "@/utils/MongoDbClient"

export async function GET() {
  try {
    const { collection, client } = await AssetOverviewClient("AssetOverview")

    await collection.updateMany(
      //   { dinari: { $exists: true } },
      {},
      { $unset: { dinari: "", address: "", name: "" } }
    )

    console.log("Successfully removed dinari object from documents")

    await client.close()
    return NextResponse.json({ status: 200, message: "Dinari objects removed" })
  } catch (error) {
    console.error("Error in removeStocks:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
