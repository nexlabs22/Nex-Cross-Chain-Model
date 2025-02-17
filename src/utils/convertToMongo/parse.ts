import { Collection } from "mongodb"
import { DailyAsset } from "@/types/mongoDb"
import { AssetOverviewDocument } from "@/types/mongoDb"

export const parseCommaSeparated = (str: string) => {
  return str?.split(",").reduce((acc, item) => {
    const [key, value] = item.split(":")
    acc[key] = parseFloat(value)
    return acc
  }, {} as Record<string, number>)
}

export const removeQuotes = (str: string): string => {
  return str.replace("'", "")
}

export const updateOrInsertDocument = async (
  collection: Collection<DailyAsset>,
  ticker: string,
  date: string,
  updateData: Partial<DailyAsset>
) => {
  if (!ticker || !date || Object.keys(updateData).length === 0) {
    console.warn(
      `Skipping update: Invalid data - ticker: ${ticker}, date: ${date}, updateData: ${JSON.stringify(
        updateData
      )}`
    )
    return
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _id, ...sanitizedData } = updateData

  // Log the query parameters
  console.log(`Querying for document with ticker: ${ticker}, date: ${date}`)

  try {
    await collection.updateOne(
      { ticker, date },
      { $set: sanitizedData },
      { upsert: true }
    )
  } catch (error) {
    console.error(
      `Duplicate key error for ticker: ${ticker}, date: ${date}. Error: ${error}`
    )
  }
}

export const convertUnixToDate = (timestamp: number): string => {
  let milisecondTimestamp = timestamp
  if (timestamp.toString().length === 10) {
    milisecondTimestamp = timestamp * 1000
  } else if (timestamp.toString().length === 16) {
    milisecondTimestamp = timestamp / 1000
  }

  const date = new Date(milisecondTimestamp)
  return date.toISOString().split("T")[0] // YYYY-MM-DD
}

export const parseOHLC = (data: string) => {
  // does this work if there is no volume?
  if (!data) return null
  if (data?.split(",")?.length < 2) return { price: Number(data) }
  const [open, high, low, close, volume] = data?.split(",")?.map(Number)
  return { open, high, low, close, volume }
}

export const uploadToAssetOverview = async (
  data: (AssetOverviewDocument | null)[],
  collection: Collection<AssetOverviewDocument>
) => {
  const bulkOperations = []

  console.log("Initiating upload to MongoDB Document")

  for (const row of data) {
    if (!row) continue
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { ticker, ...rest } = row as any // Assuming date and ticker are common fields
    const bulkOperation = {
      updateOne: {
        filter: { ticker },
        update: { $set: rest },
        upsert: true,
      },
    }
    bulkOperations.push(bulkOperation)
  }

  if (bulkOperations.length > 0) {
    await collection.bulkWrite(bulkOperations)
  }

  // Return a row count
  const rowCount = await collection.countDocuments()
  console.log(`Successfully uploaded bulk, new row count: ${rowCount}`)
  return
}

export const uploadStocksToAssetOverview = async (
  data: (AssetOverviewDocument | null)[],
  collection: Collection<AssetOverviewDocument>
) => {
  const bulkOperations = []

  console.log("Initiating upload to MongoDB Document")

  for (const row of data) {
    if (!row) continue

    const address = row.address
    const ticker = row.ticker

    const bulkOperation = {
      updateOne: {
        filter: { ticker, address },
        update: { $set: row },
        upsert: true,
      },
    }
    bulkOperations.push(bulkOperation)
  }

  if (bulkOperations.length > 0) {
    await collection.bulkWrite(bulkOperations)
  }

  // Return a row count
  const rowCount = await collection.countDocuments()
  console.log(`Successfully uploaded bulk, new row count: ${rowCount}`)
  return
}

export const uploadToDailyAssets = async (
  data: (DailyAsset | null)[],
  collection: Collection<DailyAsset>
) => {
  const bulkOperations = []

  console.log("initiate upload to mongo")

  for (const row of data) {
    if (!row) continue
    const { date, ticker, ...rest } = row
    // concatentate the data
    const bulkOperation = {
      updateOne: {
        filter: { date, ticker },
        update: { $set: rest },
        upsert: true,
      },
    }
    bulkOperations.push(bulkOperation)
  }

  if (bulkOperations.length > 0) {
    await collection.bulkWrite(bulkOperations)
  }

  //return a row count
  const rowCount = await collection.countDocuments()
  console.log(`Successfully uploaded bulk, new row count: ${rowCount}`)
  return
}

export const uploadStocksToDailyAssets = async (
  data: (DailyAsset | null)[],
  collection: Collection<DailyAsset>
) => {
  const bulkOperations = []

  console.log("initiate upload stock to daily assets mongo")

  for (const row of data) {
    if (!row) continue
    const { date, ticker, address, ...rest } = row
    // concatentate the data
    const bulkOperation = {
      updateOne: {
        filter: { date, ticker, address },
        update: { $set: rest },
        upsert: true,
      },
    }
    bulkOperations.push(bulkOperation)
  }

  if (bulkOperations.length > 0) {
    await collection.bulkWrite(bulkOperations)
  }

  //return a row count
  const rowCount = await collection.countDocuments()
  console.log(`Successfully uploaded stock to bulk, new row count: ${rowCount}`)
  return
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const filterValues = (obj: Record<string, any>) => {
  return Object.fromEntries(
    Object.entries(obj).filter(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ([_, value]) => value !== undefined && value !== 0 && value !== null
    )
  )
}

export const extractUniqueKeys = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[],
  columns: string[],
  targetColumns: string[]
): Set<string> => {
  const uniqueKeys = new Set<string>()

  data.forEach((row) => {
    columns.forEach((column) => {
      if (targetColumns.includes(column)) {
        const columnData = row[column]
        if (typeof columnData === "string") {
          const keyValuePairs = columnData.split(",")
          keyValuePairs.forEach((pair) => {
            const [key] = pair.split(":")
            uniqueKeys.add(key)
          })
        }
      }
    })
  })

  return uniqueKeys
}

export const mongoDataToOHLC = (data: DailyAsset[]) => {
  return data.map((item) => {
    return {
      time: item.timestamp,
      open: item.open || item.price,
      high: item.high || item.price,
      low: item.low || item.price,
      close: item.close || item.price,
    }
  })
}

export const mongoDataToChartData = (
  data: DailyAsset[]
): { xValue: number[]; yValue: number[] } => {
  if (data.length > 1) {
    const xValue = data
      .sort((a, b) => a.timestamp - b.timestamp)
      .map((obj) => {
        return Number(obj.price)
      })
    const yValue = data.map((obj) => {
      return obj.timestamp
    })

    return { xValue, yValue }
  } else {
    return { xValue: [], yValue: [] }
  }
}
