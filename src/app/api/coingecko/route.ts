import { NextResponse } from "next/server"
import { processCoingeckoData } from "./index"

export async function GET() {
  try {
    const { mongoData, existingAssets, coingeckoList } =
      await processCoingeckoData()

    return NextResponse.json({
      message: "Assets fetched successfully",
      data: mongoData.slice(0, 30),
      existingAssets: existingAssets.slice(0, 30),
      coingeckoList: coingeckoList.slice(0, 30),
    })
  } catch (error) {
    console.error("Error in asset fetch process:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
