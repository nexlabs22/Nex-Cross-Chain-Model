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
	id: number
	logo: string
	name: string
	Symbol: string
	address: string
    isNexlabToken?:boolean
	factoryAddress: string
	decimals: number
    
}