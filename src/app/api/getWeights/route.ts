import { NextResponse } from "next/server"
import axios from "axios"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const indexSymbol = searchParams.get("index")

  if (!indexSymbol) {
    return NextResponse.json(
      { error: "Missing 'index' query parameter" },
      { status: 400 }
    )
  }

  try {
    const response = await axios.get(
      `https://vercel-cron-xi.vercel.app/api/getWeights?index=${indexSymbol.toLowerCase()}`
    )
    return NextResponse.json(response.data)
  } catch (error) {
    console.error("Error fetching weights:", error)
    return NextResponse.json(
      { error: "Failed to fetch weights" },
      { status: 500 }
    )
  }
}
