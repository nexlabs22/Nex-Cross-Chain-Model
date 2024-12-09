import { StaticImageData } from "next/image"
import { ReactElement } from "react"

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

export interface underlyingAsset {
	name: string
	percentage: number
	symbol: string
	logo: ReactElement
}

export interface indexDetailsType {
    name: string
    logo: StaticImageData | null
    symbol: string
    shortSymbol: string
    shortDescription: string
    description: string
    mktCap: number
    mktPrice: number
    chg24h: string
    tokenAddress: string
    managementFee: string
    totalSupply: string
    predictedIncome: number
    underlyingAssets: underlyingAsset[]
}

export interface indexWithDetailsType {
    name: string
    logo: StaticImageData
    symbol: string
    shortSymbol: string
    shortDescription: string
    description: string
    mktCap: number
    mktPrice: number
    chg24h: string
    tokenAddress: string
    managementFee: string
    totalSupply: string
    underlyingAssets: underlyingAsset[]
}

export interface Product {
	name: string
	symbol: string
	logo: string // Assuming logo is a file path or URL (string)
	address: string
	totalSupply: number | string // Corrected typo in property name
	category: string[]
	subcategory: string
}

