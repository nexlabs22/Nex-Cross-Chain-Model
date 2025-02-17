import { tokenAddresses } from "@/constants/contractAddresses"
import { Address } from "@/types/indexTypes"
import { DailyAsset } from "@/types/mongoDb"
import { sub, isWeekend } from "date-fns"

function getPreviousWeekday(date: Date | string) {
  let previousDay = sub(date, { days: 10 })

  while (isWeekend(previousDay)) {
    previousDay = sub(previousDay, { days: 1 })
  }

  return previousDay
}

function SwapNumbers(a: number, b: number): [number, number] {
  ;[a, b] = [b, a]
  return [a, b]
}

function reduceAddress(address: string | undefined) {
  if (!address) return
  return (
    address?.toString().slice(0, 5) +
    "..." +
    address?.toString().substring(address?.toString().length - 5)
  )
}

function convertTime(timestamp: number) {
  const date = new Date(timestamp * 1000)
  const localDate = date.toLocaleDateString("en-US")
  const localTime = date.toLocaleTimeString("en-US")
  return localDate + " " + localTime
}

const calculateChange = (prices: { value: number }[]) => {
  if (prices.length > 1) {
    const last = prices[prices.length - 1].value
    const secondLast = prices[prices.length - 2].value
    return (((last - secondLast) / secondLast) * 100).toFixed(2)
  } else {
    return "0.00"
  }
}

const getDecimals = (type?: { address: string; decimals?: number }): number => {
  return type?.decimals ?? 18 // Default to 18 if not specified
}

const isWETH = (address: Address): boolean => {
  return address === tokenAddresses.WETH?.Ethereum?.Sepolia?.token?.address
}

const parseQueryFromPath = (path: string): Record<string, string | undefined> => {
  const queryObject: Record<string, string | undefined> = {}
  // Extract the query string (part after '?')
  const queryString = path.split('?')[1]
  if (!queryString) return queryObject // Return empty object if no query params
  // Split query parameters and store them in an object
  queryString.split('&').forEach(param => {
      const [key, value] = param.split('=')
      queryObject[key] = value ? decodeURIComponent(value) : undefined
  })
  return queryObject
}

const get24hChange = (data: DailyAsset[]) => {
  if (data.length > 1) {
    const descSorted = data.sort((a, b) => b.timestamp - a.timestamp)
    const today = descSorted[0].open || (descSorted[0].price as number)
    const yesterday = descSorted[1].open || (descSorted[1].price as number)

    const change24h = today - yesterday
    const change24hFmt = (((today - yesterday) / yesterday) * 100).toFixed(2)

    return { change24h, change24hFmt }
  } else {
    return { change24h: 0, change24hFmt: Number(0).toFixed(2) }
  }
}


function getTokenInfoByAddress(
  address: string,
  infoType: "symbol" | "decimal"
): string | number | undefined {
  const lowerCaseAddress = address.toLowerCase();

  for (const [symbol, chains] of Object.entries(tokenAddresses)) {
    if (!chains) continue;

    for (const networks of Object.values(chains)) {
      if (!networks) continue;

      for (const contracts of Object.values(networks)) {
        if (!contracts) continue;

        for (const contract of Object.values(contracts)) {
          if (contract.address.toLowerCase() === lowerCaseAddress) {
            if (infoType === "symbol") {
              return symbol;
            }
            if (infoType === "decimal") {
              return contract.decimals !== undefined ? contract.decimals : 18;
            }
          }
        }
      }
    }
  }

  return undefined; // Return undefined if no match is found
}



export {
  getPreviousWeekday,
  SwapNumbers,
  reduceAddress,
  convertTime,
  calculateChange,
  getDecimals,
  isWETH,
  getTokenInfoByAddress,
  get24hChange,
  parseQueryFromPath,
}
