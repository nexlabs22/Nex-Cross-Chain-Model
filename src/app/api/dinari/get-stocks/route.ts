import { type NextRequest, NextResponse } from "next/server"

// const url = `https://api-enterprise.sbt.dinari.com/api/v1/stocks/?page=1&page_size=100`
// testnet chainId = "11155111" // for mainnet use 1, nothing on polygon, 42161 for arbitrum
// const url = `https://api-enterprise.sbt.dinari.com/api/v1/tokens/${chainId}`

//Dinari supported chains, with same offering on each chain
// Ethereum Mainnet → 1
// Arbitrum One → 42161
// Base → 8453
// Blast → 81457
// Kinto → 3889

async function fetchAllPages(request: NextRequest) {
  const chainId = request.nextUrl.searchParams.get("chain-id") || "1"
  const mainnet = request.nextUrl.searchParams.get("mainnet") || true
  const pageSize = request.nextUrl.searchParams.get("page_size") || 100

  const apiKey = mainnet
    ? process.env.DINARI_MAINNET_API_KEY
    : process.env.DINARI_TESTNET_API_KEY

  let allData: unknown[] = []

  for (let page = 1; page <= 5; page++) {
    const url = `https://api-enterprise.${
      mainnet ? "sbt" : "sandbox"
    }.dinari.com/api/v1/tokens/${chainId}?page=${page}&page_size=${pageSize}`

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          accept: "application/json",
          authorization: `Bearer ${apiKey}`,
        },
      })
      const data = await response.json()
      allData = allData.concat(data)
    } catch (error) {
      console.error(`Error fetching page ${page}:`, error)
    }
  }

  return allData
}

export async function GET(request: NextRequest) {
  try {
    const allData = await fetchAllPages(request)
    return NextResponse.json(allData, { status: 200 })
  } catch (error) {
    console.error("Error in getStocks:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
