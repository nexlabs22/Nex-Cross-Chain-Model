import { useDashboard } from '@/providers/DashboardProvider';
import { PositionType, RequestType } from '@/types/indexTypes'
import { num } from '@/utils/conversionFunctions';
import { useEffect, useState, useCallback } from 'react'

export function GetTradeHistoryCrossChain(dataFromGraph: {[key:string]: RequestType[]}) {
	
	const [loading, setLoading] = useState<boolean>(false)
	const [positions, setPositions] = useState<PositionType[]>([])
	const { nexTokens } = useDashboard();

	const getHistory = useCallback(async () => {

		setLoading(true)
		setPositions([])

		const positions0: PositionType[] = []		

		
		const crosschainTokens = nexTokens.filter((token) => {
			return token.smartContractType === 'crosschain'
		  }).map((token) => {
			return token.symbol.toLowerCase()
		  })		
		
		  Object.entries(dataFromGraph).forEach(([key, logs]) => {
			if (crosschainTokens.some(token => key.includes(token))) {				
			  if (key.includes('Issuanceds')) {           	

				logs.forEach((log: RequestType) => {
				  const obj: PositionType = {
					side: 'Minted',
					user: log.user as `0x${string}`,
					inputAmount: num(log.inputAmount),
					outputAmount: num(log.outputAmount),
					tokenAddress: log.inputToken as `0x${string}`,
					timestamp: Number(log.time),
					txHash: log.transactionHash,
					indexName: key.split('Issuanceds')[0].toUpperCase(),
					messageId: log.messageId,
					nonce: Number(log.nonce),
                    sendStatus: "SUCCESS",
                    receiveStatus: "SUCCESS"					
				  }
	
				  positions0.push(obj)
				})
			  } else if (key.includes('Redemptions')) {  				
				logs.forEach(async (log: RequestType) => {
				  const obj: PositionType = {
					side: 'Burned',
					user: log.user as `0x${string}`,
					inputAmount: num(log.inputAmount),
					outputAmount: num(log.outputAmount),
					tokenAddress: log.outputToken as `0x${string}`,
					timestamp: Number(log.time),
					txHash: log.transactionHash,
					indexName: key.split('Redemptions')[0].toUpperCase(),
					messageId: log.messageId,				
					nonce: Number(log.nonce),
                    sendStatus: "SUCCESS",
                    receiveStatus: "SUCCESS"
				  }
	
				  positions0.push(obj)						
				})
			  }
			}
		  })

		
		const sortedPositionsData = positions0.sort(function (a, b) {
			if (!a.timestamp || !b.timestamp) return 0
			return Number(b.timestamp) - Number(a.timestamp)
		})
		setPositions(sortedPositionsData)
		setLoading(false)
	}, [nexTokens, dataFromGraph])

	useEffect(() => {

		getHistory()
	}, [getHistory])

	return {
		data: positions,
		reload: getHistory,
		loading
	}
}
