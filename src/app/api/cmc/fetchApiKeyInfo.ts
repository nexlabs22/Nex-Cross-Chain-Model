export const fetchApiKeyInfo = async () => {
  const COINMARKETCAP_KEY = process.env.COINMARKETCAP_KEY
  if (!COINMARKETCAP_KEY) {
    throw new Error("COINMARKETCAP_KEY is not defined")
  }

  const response = await fetch(
    "https://pro-api.coinmarketcap.com/v1/key/info",
    {
      headers: {
        "X-CMC_PRO_API_KEY": COINMARKETCAP_KEY,
      },
    }
  )
  if (!response.ok) {
    throw new Error(`Error fetching API key info: ${response.statusText}`)
  }

  const data = await response.json()
  return data
}
