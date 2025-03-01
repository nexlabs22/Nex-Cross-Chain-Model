import { NextResponse } from "next/server"
import { processCoinMarketCapData } from "./index"

export async function GET() {
  try {
    const mongoData = await processCoinMarketCapData()

    return NextResponse.json({
      message: "CMC Assets fetched successfully",
      data: mongoData,
    })
  } catch (error) {
    console.error("Error in asset fetch process:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
