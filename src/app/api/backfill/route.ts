import {
  convertArbitrumDataTable,
  convertHistCompDataTable,
  convertMagSeven,
  convertNexlabsIndex,
  convertProtocolsData,
  convertStocksData,
  convertTopFiveCrypto,
  convertTopStocksByMarketCap,
} from "@/utils/convertToMongo"
import { DailyAssetsClient } from "@/utils/MongoDbClient"
import { NextResponse } from "next/server"

export async function POST() {
  const { collection } = await DailyAssetsClient()
  const rowCount = await collection.countDocuments()

  await convertArbitrumDataTable()
  await convertHistCompDataTable()
  await convertMagSeven()
  await convertNexlabsIndex()
  await convertProtocolsData()
  await convertStocksData()
  await convertTopFiveCrypto()
  await convertTopStocksByMarketCap()
  //rows added to mongoDb
  const newRowCount = await collection.countDocuments()
  return NextResponse.json({
    message: `Backfill completed, new ${
      newRowCount - rowCount
    } rows added to mongoDb. New row count: ${newRowCount}`,
    status: 200,
  })
}
