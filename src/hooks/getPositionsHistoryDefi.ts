
import { useEffect, useState, useCallback } from 'react'
import { weiToNum } from '@/utils/conversionFunctions'
import { useDashboard } from '@/providers/DashboardProvider'
import { Transaction, RequestType, AllowedTickers, Address } from '@/types/indexTypes'
import { getDecimals, getTokenInfoByAddress } from '@/utils/general'
import { tokenAddresses } from '@/constants/contractAddresses'
import { useGlobal } from '@/providers/GlobalProvider'

export function GetPositionsHistoryDefi(dataFromGraph: { [key: string]: RequestType[] }) {
	const { nexTokens } = useDashboard()
	const { activeChainSetting : {chainName, network} } = useGlobal()
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
					const tokenAddress = isMint ? log.inputToken : log.outputToken
					const decimalsForInput = isMint ? Number(getTokenInfoByAddress(tokenAddress as Address, 'decimal')) : Number(getDecimals(tokenAddresses?.[tokenName]?.[chainName]?.[network]?.token))
					const decimalsForOutput = isMint ? Number(getDecimals(tokenAddresses?.[tokenName]?.[chainName]?.[network]?.token)) : Number(getTokenInfoByAddress(tokenAddress as Address, 'decimal')) 

					return {
						side: isMint ? 'Mint Request' : 'Burn Request',
						userAddress: log.user as Address,
						inputAmount: weiToNum(log.inputAmount, decimalsForInput),
						outputAmount: weiToNum(log.outputAmount, decimalsForOutput),
						tokenAddress: tokenAddress as Address,
						timestamp: Number(log.time),
						txHash: log.transactionHash,
						tokenName,
					}
				})
			)

		setPositions(positions0.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0)))
		setLoading(false)
	}, [nexTokens, dataFromGraph, chainName, network])

	useEffect(() => {
		getHistory()
	}, [getHistory])

	return {
		data: positions,
		reload: getHistory,
		loading,
	}
}
