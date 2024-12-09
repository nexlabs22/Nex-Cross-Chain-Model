// export interface DefiPositionType {
// 	side: string;
// 	user: `0x${string}` | string;
// 	tokenAddress: `0x${string}` | string;
// 	timestamp: number;
// 	inputAmount: number;
// 	outputAmount: number;
// 	indexName: string;
// 	txHash: string;
// }

import { StaticImageData } from "next/image"
import { ReactElement } from "react"

export interface PositionType {
	side: string
	user: `0x${string}` | string
	tokenAddress: `0x${string}` | string
	timestamp: number
	inputAmount: number
	outputAmount: number
	indexName: string
	txHash: string
	messageId?: string
	nonce?: number
	sendStatus?: string
	receiveStatus?: string
	recieveSideMessageId?: string
}

export type underlyingAsset = {
	name: string
	percentage: number
	symbol: string
	logo: ReactElement
}

export interface indexObjectType {
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
	predictedIncome: number,
	underlyingAssets: underlyingAsset[]
}