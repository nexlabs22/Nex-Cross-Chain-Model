const COINMARKETCAP_KEY = process.env.COINMARKETCAP_KEY

if (!COINMARKETCAP_KEY) {
  throw new Error("COINMARKETCAP_KEY is not defined")
}

export const fetchCmcMetadata = async ({ idList }: { idList: string[] }) => {
  const metaDataResponse = await fetch(
    `https://pro-api.coinmarketcap.com/v1/cryptocurrency/info?id=${idList.join(
      ","
    )}`,
    {
      headers: {
        "X-CMC_PRO_API_KEY": COINMARKETCAP_KEY,
      },
    }
  )

  const resp2 = await metaDataResponse.json()
  const metaData = resp2.data
  return metaData
}
