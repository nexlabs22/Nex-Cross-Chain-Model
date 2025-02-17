import { NextRequest } from "next/server"

export async function fetchAllPages(request: NextRequest) {
  console.log("fetchAllPages")
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
      if (data.length === 0) {
        break
      }
      allData = allData.concat(data)
    } catch (error) {
      console.error(`Error fetching page ${page}:`, error)
    }
  }
  return allData
}
