
import { useEffect, useState, useCallback } from 'react'

import { GetTradeHistoryStock } from './getTradeHistoryStock'
import { PositionType, RequestType } from '@/types/indexTypes'
import { getDecimals } from '@/utils/general'
import { tokenAddresses } from '@/constants/contractAddresses'
import { num, weiToNum } from '@/utils/conversionFunctions'

export function GetPositionsHistoryStock(dataFromGraph: { [key: string]: RequestType[] }) {

	const stockTradeHistory = GetTradeHistoryStock(dataFromGraph)

	const [positions, setPositions] = useState<PositionType[]>([])


	const getHistory = useCallback(async () => {
		try {

			const userAllMintRequestLogs = [...(dataFromGraph['mag7RequestIssuances']?.length > 0 ? dataFromGraph['mag7RequestIssuances'] : []), ...(dataFromGraph['mag7RequestCancelIssuances']?.length > 0 ? dataFromGraph['mag7RequestCancelIssuances'] : [])]
			const userAllBurnRequestLogs = [...(dataFromGraph['mag7RequestRedemptions']?.length > 0 ? dataFromGraph['mag7RequestRedemptions'] : []), ...(dataFromGraph['mag7RequestCancelRedemptions']?.length > 0 ? dataFromGraph['mag7RequestCancelRedemptions'] : [])]

			const mintData = userAllMintRequestLogs.map((log) => {

				let status = ''

				const isCancelledExist = stockTradeHistory.data.find((data: PositionType) => {
					return data.nonce === Number(log.nonce) && data.side === 'Cancelled Mint'
				})

				const isMintedExist = stockTradeHistory.data.find((data: PositionType) => {
					return data.nonce === Number(log.nonce) && data.side === 'Mint Request'
				})


				if (log.__typename === 'MAG7RequestCancelIssuance') {
					if (isCancelledExist) {
						status = 'CANCELLED'
					} else {
						status = 'CANCEL PENDING'
					}
				} else {
					if (isMintedExist) {
						status = 'SUCCESS'
					} else {
						status = 'MINT PENDING'
					}

				}


				const tokenDecimals = getDecimals(Object.values(tokenAddresses)
					.flatMap(chains => Object.values(chains)
						.flatMap(networks => Object.values(networks)
							.flatMap(contractTypes => Object.values(contractTypes))))
					.find(obj => obj.address.toLowerCase() === log.inputToken?.toLowerCase()));


				const obj: PositionType = {
					side: 'Mint Request',
					user: log.user as `0x${string}`,
					inputAmount: weiToNum(log.inputAmount, tokenDecimals),
					outputAmount: num(log.outputAmount),
					tokenAddress: log.inputToken as `0x${string}`,
					timestamp: Number(log.time),
					txHash: log.transactionHash,
					indexName: 'MAG7',
					nonce: Number(log.nonce),
					sendStatus: status,
					receiveStatus: status,
				}

				return obj
			})

			const burnData = userAllBurnRequestLogs.map((log) => {

				let status = ''

				const isCancelledExist = stockTradeHistory.data.find((data: PositionType) => {
					return data.nonce === Number(log.nonce) && data.side === 'Cancelled Burn'
				})

				const isBurnedExist = stockTradeHistory.data.find((data: PositionType) => {
					return data.nonce === Number(log.nonce) && data.side === 'Burn Request'
				})


				if (log.__typename === 'MAG7RequestCancelRedemption') {
					if (isCancelledExist) {
						status = 'CANCELLED'
					} else {
						status = 'CANCEL PENDING'
					}
				} else {
					if (isBurnedExist) {
						status = 'SUCCESS'
					} else {
						status = 'BURN PENDING'
					}

				}


				const tokenDecimals = getDecimals(Object.values(tokenAddresses)
					.flatMap(chains => Object.values(chains)
						.flatMap(networks => Object.values(networks)
							.flatMap(contractTypes => Object.values(contractTypes))))
					.find(obj => obj.address.toLowerCase() === log.outputToken?.toLowerCase()));

				const obj: PositionType = {
					side: 'Burn Request',
					user: log.user as `0x${string}`,
					inputAmount: num(log.inputAmount),
					outputAmount: weiToNum(log.outputAmount, tokenDecimals),
					tokenAddress: log.outputToken as `0x${string}`,
					timestamp: Number(log.time),
					txHash: log.transactionHash,
					indexName: 'MAG7',
					nonce: Number(log.nonce),
					sendStatus: status,
					receiveStatus: status,
				}

				return obj
			})

			const combinedData = [...mintData, ...burnData]
			const nonceMap = new Map();

			combinedData.forEach(obj => {
				const { nonce, sendStatus } = obj;

				// If nonce is not in the map or sendStatus contains 'cancel', store/replace the object
				if (!nonceMap.has(nonce) || sendStatus?.includes('CANCEL')) {
					nonceMap.set(nonce, obj);
				}
			});

			// Convert the map values to an array for sorting
			const filteredData = Array.from(nonceMap.values());

			const sortedPositionsData = filteredData.sort(function (a, b) {
				if (!a.timestamp || !b.timestamp) return 0
				return Number(b.timestamp) - Number(a.timestamp)
			})

			setPositions(sortedPositionsData)

		} catch (err) {
			console.log(err)
		}
	}, [stockTradeHistory.data, dataFromGraph])

	useEffect(() => {
		getHistory()
	}, [getHistory])

	function handleReload() {
		stockTradeHistory.reload()
		getHistory()
	}

	return {
		history: stockTradeHistory.data,
		requests: positions,
		reload: handleReload,
	}
}
