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
	ethereum: number
	binancecoin: number
	xaut: number
	gold: string
	bitcoin: number
	ripple: number
	litecoin: number
	dogecoin: number
	monero: number
	stellar: number
	ethereumclassic: number
	bitcoincash: number
	cardano: number
	eos: number
	bitcoincashsv: number
	chainlink: number
	polkadot: number
	solana: number
	okb: number
	[key: string]: number|string

}
