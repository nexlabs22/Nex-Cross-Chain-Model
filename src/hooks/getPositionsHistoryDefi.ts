
import { useEffect, useState, useCallback } from 'react'
import { num } from '@/utils/conversionFunctions'
import { useDashboard } from '@/providers/DashboardProvider'
import { PositionType, RequestType } from '@/types/indexTypes'



export function GetPositionsHistoryDefi(dataFromGraph: { [key: string]: RequestType[] }) {
	const { nexTokens } = useDashboard()

	const [positions, setPositions] = useState<PositionType[]>([])
	const [loading, setLoading] = useState<boolean>(false)


	const getHistory = useCallback(async () => {

		setLoading(true)
		setPositions([])

		const positions0: PositionType[] = []		

		const defiTokens = nexTokens.filter((token) => {
			return token.smartContractType === 'defi'
		}).map((token) => {
			return token.symbol.toLowerCase()
		})		

		Object.entries(dataFromGraph).forEach(([key, logs]) => {
			if (defiTokens.some(token => key.includes(token))) {
				if (key.includes('issuanceds')) {									
					logs.forEach((log: RequestType) => {
						const obj: PositionType = {
							side: 'Mint Request',
							user: log.user as `0x${string}`,
							inputAmount: num(log.inputAmount),
							outputAmount: num(log.outputAmount),
							tokenAddress: log.inputToken as `0x${string}`,
							timestamp: Number(log.time),
							txHash: log.transactionHash,
							indexName: key.split('issuanceds')[0].toUpperCase(),
						}
						positions0.push(obj)
					})
				} else {					
					logs.forEach(async (log: RequestType) => {
						const obj: PositionType = {
							side: 'Burn Request',
							user: log.user as `0x${string}`,
							inputAmount: num(log.inputAmount),
							outputAmount: num(log.outputAmount),
							tokenAddress: log.outputToken as `0x${string}`,
							timestamp: Number(log.time),
							txHash: log.transactionHash,
							indexName: key.split('redemptions')[0].toUpperCase(),
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
		loading,
	}
}
