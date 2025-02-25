import { ObjectId, Sort } from "mongodb"
import { AssetCategory } from "./indexTypes"
import { CmcV2Metadata } from "@/app/api/cmc/fetchCmcMetadata"

export type DailyAsset = {
  _id?: ObjectId
  ticker: string //uppercase === symbol
  name: string //lowercase
  tokenAddress?: string
  type: AssetCategory
  date: string // YYYY-MM-DD
  timestamp: number // timestamp in seconds
  price?: number
  open?: number
  high?: number
  low?: number
  close?: number
  volume?: number
  marketCap?: number
  activeAddressCount?: number
  fullyDilutedValuation?: number
  chainTvls?: Record<string, number>
  tvl?: number
  cmdId?: string
  geckoId?: string
  onChain?: onChainDataType[]
  chain?: string
  network?: string
}

export type onChainDataType = {
  timestamp: number,
  price: number,
  totalSupply: number
}

export type aggregateType = {
  $match?: { [key: string]: number | string }
  $sort?: { [key: string]: Sort }
  $limit?: number
}

export type AssetOverviewDocument = {
  _id?: ObjectId
  lastUpdate?: Date
  tokenAddress?: string
  tradeStatus?: "active" | "upcoming" | "inactive"
  description?: string
  name: string //lowercase
  cik?: string
  isin?: string
  cusip?: string
  logo_url?: string
  ticker: string //uppercase
  coinmarketcap?: CmcV2Metadata["data"][string]
  coingecko?: {
    id: string
  }
  dinari?: DinariAsset
}

export type DinariAsset = {
  stock: {
    id: string
    cik: string
    composite_figi: string
    cusip: string
    description: string
    display_name: string
    is_fractionable: boolean
    logo_url: string
    name: string
    symbol: string //the actual symbol of the stock on the tradfi exchange
  }
  token: {
    address: string
    chain_id: number
    decimals: number
    image_url: string
    is_active: boolean
    is_primary: boolean
    symbol: string //the dinari symobl, ending with XXX.d
    version: string
  }
}
