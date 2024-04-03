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