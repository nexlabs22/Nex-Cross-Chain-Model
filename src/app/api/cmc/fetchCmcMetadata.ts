const COINMARKETCAP_KEY = process.env.COINMARKETCAP_KEY

if (!COINMARKETCAP_KEY) {
  throw new Error("COINMARKETCAP_KEY is not defined")
}

export type CmcV2Metadata = {
  data: {
    [key: string]: {
      urls: {
        website: string[]
        twitter: string[]
        message_board: string[]
        chat: string[]
        facebook: string[]
        explorer: string[]
        reddit: string[]
        technical_doc: string[]
        source_code: string[]
        announcement: string[]
      }
      logo: string
      id: number
      name: string
      symbol: string
      slug: string
      description: string
      notice: string
      subreddit: string
      date_added: string
      twitter_username: string
      date_launched: string
      tags: string[]
      "tag-names": string[]
      "tag-groups": string[]
      platform?: {
        id: string
        name: string
        slug: string
        symbol: string
        token_address: string
      }
      category: string
      contract_address: {
        contract_address: string
        platform: {
          name: string
          coin: {
            id: string
            name: string
            symbol: string
            slug: string
          }
        }
      }[]
      self_reported_circulating_supply: string | null
      self_reported_market_cap: string | null
      self_reported_tags: string | null
      infinite_supply: boolean
    }
  }
  status: {
    timestamp: string
    error_code: number
    error_message: string
    elapsed: number
    credit_count: number
    notice?: string
  }
}

export const fetchCmcMetadata = async ({ idList }: { idList: string[] }) => {
  try {
    const metaDataResponse = await fetch(
      `https://pro-api.coinmarketcap.com/v2/cryptocurrency/info?id=${idList.join(
        ","
      )}`,
      {
        cache: "no-cache",
        headers: {
          "X-CMC_PRO_API_KEY": COINMARKETCAP_KEY,
        },
      }
    )

    const resp2 = (await metaDataResponse.json()) as CmcV2Metadata
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
