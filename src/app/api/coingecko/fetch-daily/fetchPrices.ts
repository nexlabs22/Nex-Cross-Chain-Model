import { DailyPrice } from "./route"

export async function fetchDailyPrices(
  idList: (string | undefined)[]
): Promise<DailyPrice[] | null> {
  const idListShortString = idList
    .map((id: string | undefined) => id?.replace(/"/g, ""))
    .join(",")

  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${idListShortString}&per_page=250`

  try {
    const response = await fetch(url, {
      cache: "no-cache",
      headers: {
        Accept: "application/json",
        "x-cg-demo-api-key": process.env.COINGECKO_API_KEY || "",
      },
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error parsing JSON response:", error)
    return null
  }
}

export async function fetchDailyPricesSplitted(
  idList: (string | undefined)[]
): Promise<DailyPrice[] | null> {
  // go from 0-100, 100-200, 200-300 etc.
  const idListSplitted = []
  for (let i = 0; i < idList.length; i += 250) {
    idListSplitted.push(idList.slice(i, i + 250))
  }

  const data = await Promise.all(
    idListSplitted.map((idList) => {
      return fetchDailyPrices(idList)
    })
  )

  return data.flat().filter((item): item is DailyPrice => item !== null)
}
