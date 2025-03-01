//TODO: Remove this file, it's required, one can use the api call directly.
export async function fetchCoinMarketCapTokens() {
  try {
    const response = await fetch("/api/cmc/fetch-tokens")

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`)
    }

    const data = await response.json()
    console.log(data)
    return data
  } catch (error) {
    console.error("Error in fetchCoinMarketCapTokens:", error)
    throw error
  }
}
