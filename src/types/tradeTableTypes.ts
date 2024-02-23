export interface Positions {
	side: string;
	user: `0x${string}` | string;
	tokenAddress: `0x${string}` | string;
	timestamp: number;
	inputAmount: number;
	outputAmount: number;
	indexName: string;
	txHash: string;
}