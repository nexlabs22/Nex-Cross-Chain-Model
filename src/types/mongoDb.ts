import { ObjectId, Sort } from "mongodb"

import { AssetCategory } from "./indexTypes"

export type MongoDb = {
  _id?: ObjectId
  ticker: string
  name: string
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
}

export type aggregateType = {
  $match?: {[key:string]: number|string},
  $sort?: {[key:string]: Sort},
  $limit?: number
}