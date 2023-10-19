export interface chartDataType {
	time: number
	open: number
	high: number
	low: number
	close: number
}
export interface lineChartDataType {
	time: number | string | Date
	value: number
}

export interface dataFromDatabasetype {
	time: number
	eth: number
	bnb: number
	xaut: number
	btc: number
	usdt: number
	usdc: number
}
