
import { tokenAddresses } from '@/constants/contractAddresses'
import { useDashboard } from '@/providers/DashboardProvider'
import { Address, PositionType, RequestType } from '@/types/indexTypes'
import { num, weiToNum } from '@/utils/conversionFunctions'
import { getDecimals } from '@/utils/general'
import { useEffect, useState, useCallback } from 'react'


export function GetTradeHistoryStock(dataFromGraph: { [key: string]: RequestType[] }) {

	const [loading, setLoading] = useState<boolean>(false)
	const [positions, setPositions] = useState<PositionType[]>([])

	const { nexTokens } = useDashboard();

	const getHistory = useCallback(async () => {

		setLoading(true)
		setPositions([])


		const positions0: PositionType[] = []

		const stockTokens = nexTokens.filter((token) => {
			return token.smartContractType === 'stocks'
		}).map((token) => {
			return token.symbol.toLowerCase()
		})


		Object.entries(dataFromGraph).forEach(([key, logs]) => {
			if (stockTokens.some(token => key.includes(token))) {		
				if (key.includes('Issuanceds')) {
					logs.forEach((log: RequestType) => {


						const tokenDecimals = getDecimals(Object.values(tokenAddresses)
							.flatMap(chains => Object.values(chains)
								.flatMap(networks => Object.values(networks)
									.flatMap(contractTypes => Object.values(contractTypes))))
							.find(obj => obj.address.toLowerCase() === log.inputToken?.toLowerCase()));

						const obj: PositionType = {
							side: 'Minted',
							user: log.user as Address,
							inputAmount: weiToNum(log.inputAmount, tokenDecimals),
							outputAmount: num(log.outputAmount),
							tokenAddress: log.inputToken as Address,
							timestamp: Number(log.time),
							txHash: log.transactionHash,
							indexName: key.split('Issuanceds')[0].toUpperCase(),
							nonce: Number(log.nonce),
							sendStatus: "SUCCESS",
							receiveStatus: "SUCCESS"
						}
						positions0.push(obj)


					})
				} else if (key.includes('IssuanceCancelleds')) {					
					logs.forEach((log: RequestType) => {

						const tokenDecimals = getDecimals(Object.values(tokenAddresses)
							.flatMap(chains => Object.values(chains)
								.flatMap(networks => Object.values(networks)
									.flatMap(contractTypes => Object.values(contractTypes))))
							.find(obj => obj.address.toLowerCase() === log.inputToken?.toLowerCase()));

						const obj: PositionType = {
							side: 'Cancelled Mint',
							user: log.user as Address,
							inputAmount: weiToNum(log.inputAmount, tokenDecimals),
							outputAmount: num(log.outputAmount),
							tokenAddress: log.inputToken as Address,
							timestamp: Number(log.time),
							txHash: log.transactionHash,
							indexName: key.split('IssuanceCancelleds')[0].toUpperCase(),
							nonce: Number(log.nonce),
							sendStatus: "CANCELLED",
							receiveStatus: "CANCELLED"
						}
						positions0.push(obj)
					})

				}
				else if (key.includes('Redemptions')) {					
					logs.forEach(async (log: RequestType) => {

						const tokenDecimals = getDecimals(Object.values(tokenAddresses)
							.flatMap(chains => Object.values(chains)
								.flatMap(networks => Object.values(networks)
									.flatMap(contractTypes => Object.values(contractTypes))))
							.find(obj => obj.address.toLowerCase() === log.outputToken?.toLowerCase()));

						const obj: PositionType = {
							side: 'Burned',
							user: log.user as Address,
							inputAmount: num(log.inputAmount),
							outputAmount: weiToNum(log.outputAmount, tokenDecimals),
							tokenAddress: log.outputToken as Address,
							timestamp: Number(log.time),
							txHash: log.transactionHash,
							indexName: key.split('Redemptions')[0].toUpperCase(),
							nonce: Number(log.nonce),
							sendStatus: "SUCCESS",
							receiveStatus: "SUCCESS"
						}
						positions0.push(obj)
					})
				} else if (key.includes('RedemptionCancelleds')) {					
					logs.forEach((log: RequestType) => {

						const tokenDecimals = getDecimals(Object.values(tokenAddresses)
							.flatMap(chains => Object.values(chains)
								.flatMap(networks => Object.values(networks)
									.flatMap(contractTypes => Object.values(contractTypes))))
							.find(obj => obj.address.toLowerCase() === log.outputToken?.toLowerCase()));

						const obj: PositionType = {
							side: 'Cancelled Burn',
							user: log.user as Address,
							inputAmount: num(log.inputAmount),
							outputAmount: weiToNum(log.outputAmount, tokenDecimals),
							tokenAddress: log.outputToken as Address,
							timestamp: Number(log.time),
							txHash: log.transactionHash,
							indexName: key.split('RedemptionCancelleds')[0].toUpperCase(),
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

	function handleReload() {
		getHistory()
	}

	return {
		data: positions,
		reload: handleReload,
		loading
	}
}
