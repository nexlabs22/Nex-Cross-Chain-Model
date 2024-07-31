export interface nexTokenDataType {
    symbol: string,
    shortName: string,
    decimals: number,
    address: string
    logo: string,
    totalToken?: number,
    totalTokenUsd?: number,
    percentage?:  number,
    indexDayChange?: number
}

export interface Coin {
	logo: string
	name: string
	Symbol: string
	address: string
    isNexlabToken?:boolean
    indexType?: string
	factoryAddress: string
	decimals: number
    
}