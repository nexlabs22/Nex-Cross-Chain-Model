export const getCoingeckList = async () => {
  const response = await fetch(
    "https://api.coingecko.com/api/v3/coins/list",
    {}
  )
  const data = await response.json()
  return data
}
