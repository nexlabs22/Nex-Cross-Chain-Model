import { tokenAddresses } from "@/constants/contractAddresses"
import { Address } from "@/types/indexTypes"
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
  return address === tokenAddresses.WETH?.Ethereum?.Sepolia?.index?.address
}

export {
  getPreviousWeekday,
  SwapNumbers,
  reduceAddress,
  convertTime,
  calculateChange,
  getDecimals,
  isWETH,
}
