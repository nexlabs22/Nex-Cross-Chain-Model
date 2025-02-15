const COINMARKETCAP_KEY = process.env.COINMARKETCAP_KEY

if (!COINMARKETCAP_KEY) {
  throw new Error("COINMARKETCAP_KEY is not defined")
}

export const fetchCmcMetadata = async ({ idList }: { idList: string[] }) => {
  try {
    const metaDataResponse = await fetch(
      `https://pro-api.coinmarketcap.com/v1/cryptocurrency/info?id=${idList.join(
        ","
      )}`,
      {
        cache: "no-cache",
        headers: {
          "X-CMC_PRO_API_KEY": COINMARKETCAP_KEY,
        },
      }
    )

    const resp2 = await metaDataResponse.json()
    const metaData = resp2.data
    return metaData
  } catch (error) {
    console.error("Error fetching CoinMarketCap metadata:", error)
    return {}
  }
}

export const fetchSplittedCmcMetadata = async ({
  idList,
}: {
  idList: string[]
}) => {
  const chunks = idList.reduce((acc, curr, index) => {
    const chunkIndex = Math.floor(index / 1000) //we get an fetching error above 1K items
    if (!acc[chunkIndex]) {
      acc[chunkIndex] = []
    }
    acc[chunkIndex].push(curr)
    return acc
  }, [] as string[][])

  const metaData = await Promise.all(
    chunks.map((chunk) => fetchCmcMetadata({ idList: chunk }))
  )

  const mergedMetaData = metaData.flatMap((chunk) => Object.values(chunk))
  return mergedMetaData
}
