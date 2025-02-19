import { NextResponse } from "next/server"
import { AssetOverviewClient } from "@/utils/MongoDbClient"

export async function GET() {
  try {
    const { collection } = await AssetOverviewClient()

    await collection.updateMany(
      //   { dinari: { $exists: true } },
      {},
      { $unset: { dinari: "", address: "", name: "" } }
    )

    console.log("Successfully removed dinari object from documents")

    return NextResponse.json({ status: 200, message: "Dinari objects removed" })
  } catch (error) {
    console.error("Error in removeStocks:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
