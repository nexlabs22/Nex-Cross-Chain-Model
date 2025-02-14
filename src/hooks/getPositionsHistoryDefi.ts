import { useEffect, useState, useCallback } from 'react'
import { num } from '@/utils/conversionFunctions'
import { useDashboard } from '@/providers/DashboardProvider'
import { Transaction, RequestType, AllowedTickers, Address } from '@/types/indexTypes'

export function GetPositionsHistoryDefi(dataFromGraph: { [key: string]: RequestType[] }) {
	const { nexTokens } = useDashboard()
	const [positions, setPositions] = useState<Transaction[]>([])
	const [loading, setLoading] = useState<boolean>(false)

	const getHistory = useCallback(() => {
		setLoading(true)

		const defiTokensSet = new Set(
			nexTokens
				.filter(token => token.smartContractType === 'defi')
				.map(token => token.symbol.toLowerCase())
		)

		const positions0: Transaction[] = Object.entries(dataFromGraph)
			.filter(([key]) => Array.from(defiTokensSet).some(token => key.includes(token)))
			.flatMap(([key, logs]) => 
				logs.map(log => {
					const isMint = key.includes('issuanceds')
					const tokenName = key.split(isMint ? 'issuanceds' : 'redemptions')[0].toUpperCase() as AllowedTickers

					return {
						side: isMint ? 'Mint Request' : 'Burn Request',
						userAddress: log.user as Address,
						inputAmount: num(log.inputAmount),
						outputAmount: num(log.outputAmount),
						tokenAddress: (isMint ? log.inputToken : log.outputToken) as Address,
						timestamp: Number(log.time),
						txHash: log.transactionHash,
						tokenName,
					}
				})
			)

		setPositions(positions0.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0)))
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
