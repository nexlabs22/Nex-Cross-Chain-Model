export type Candle = {
  timestamp: number
  open: number
  high: number
  low: number
  close: number
  volume?: number
}

export type ChartPoint = {
  time: number
  value: number
}
