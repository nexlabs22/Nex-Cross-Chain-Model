const COINMARKETCAP_API_URL =
  "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest"

const COINMARKETCAP_KEY = process.env.COINMARKETCAP_KEY

if (!COINMARKETCAP_KEY) {
  throw new Error("COINMARKETCAP_KEY is not defined")
}

export const fetchCmcListings = async () => {
  try {
    const response = await fetch(`${COINMARKETCAP_API_URL}?limit=1000`, {
      headers: {
        "X-CMC_PRO_API_KEY": COINMARKETCAP_KEY,
      },
    })

    if (!response.ok) {
      throw new Error(`CoinMarketCap API error: ${response.statusText}`)
    }

    const data = await response.json()

    const idList = data.data.map((crypto: { id: string }) => crypto.id)

    return idList
  } catch (error) {
    console.error("Failed to fetch CoinMarketCap data:", error)
    throw error
  }
}
