import { IndexCryptoAsset } from "@/types/indexTypes"
import { DailyAsset } from "@/types/mongoDb"

export async function calculateTwentyFourHourChange(index: IndexCryptoAsset) {
  const lastPrice =
    index?.historicalPrice?.[index?.historicalPrice?.length - 1]?.price
  const firstPrice = index?.historicalPrice?.[0]?.price
  if (!lastPrice || !firstPrice) return null
  const TwentyFourHourChange = ((lastPrice - firstPrice) / firstPrice) * 100
  return TwentyFourHourChange
}

export function calculateHistoricalTwentyFourHourChange(
  historicalPrices: DailyAsset[]
) {
  const lastPrice = historicalPrices?.[historicalPrices?.length - 1]?.price
  const firstPrice = historicalPrices?.[0]?.price
  if (!lastPrice || !firstPrice) return null
  const TwentyFourHourChange = ((lastPrice - firstPrice) / firstPrice) * 100
  return TwentyFourHourChange
}
