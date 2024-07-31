import { num, weiToNum } from './math'
import { useEffect, useState, useCallback } from 'react'
import {  parseAbiItem } from 'viem'

import { sepoliaMag7Factory } from '@constants/contractAddresses'
import { useAddress } from '@thirdweb-dev/react'
import useTradePageStore from '@/store/tradeStore'
import { PositionType } from '@/types/tradeTableTypes'
import { GetTradeHistoryStock } from './getTradeHistoryStock'
import { sepoliaTokens } from '@/constants/testnetTokens'
import { getClient } from '@/app/api/client'

export function GetPositionsHistoryStock() {
	const { setStockTableTableReload } = useTradePageStore()

	const [accountAddress, setAccountAddress] = useState<`0x${string}` | string>()
	const address = useAddress()
	const stockTradeHistory = GetTradeHistoryStock()

	const [positions, setPositions] = useState<PositionType[]>([])

	useEffect(() => {
		if (address) {
			setAccountAddress(address)
		}
	}, [address])

	const getHistory = useCallback(async () => {
		try {
			setStockTableTableReload(true)

			const factoryAddresses0 = { MAG7: sepoliaMag7Factory }

			const client = getClient('sepolia')

			if (!accountAddress) return

			const mintLogsPromise = Object.entries(factoryAddresses0).map(async ([key, value]) => {
				const mintRequestlogs = await client.getLogs({
					address: value as `0x${string}`,
					event: parseAbiItem('event RequestIssuance(uint indexed nonce, address indexed user, address inputToken, uint inputAmount, uint outputAmount, uint time)'),
					args: {
						user: accountAddress as `0x${string}`,
					},
					fromBlock: BigInt(0),
				})

				const userMintRequestLogs = mintRequestlogs.filter((log) => log.args.user == accountAddress)

				const mintData = userMintRequestLogs.map(async (log) => {
					const isExist = stockTradeHistory.data.find((data) => {
						return data.nonce === log.args.nonce && data.side === 'Mint Request'
					})

					let sendStatus = ''
					let receiveStatus = ''

					if (!isExist) {
						// sendStatus = await getCCIPStatusById(log.args.messageId as string, 'ethereumSepolia', 'arbitrumSepolia')
						// sendStatus = await getCCIPStatusById(log.args.messageId as string, 'ethereumSepolia', 'arbitrumSepolia')
						// if (sendStatus == 'SUCCESS') {
						// 	const messageId = await client2.readContract({
						// 		address: arbtirumSepoliaCR5CrossChainFactory,
						// 		abi: crossChainIndexFactoryV2Abi,
						// 		functionName: 'issuanceMessageIdByNonce',
						// 		args: [log.args.nonce],
						// 	})
						// 	receiveStatus = (await getCCIPStatusById(messageId as string, 'arbitrumSepolia', 'ethereumSepolia')) as string
						// 	recieveSideMessageId = messageId as string
						// }
						sendStatus = 'PENDING'
						receiveStatus = 'PENDING'
					} else {
						sendStatus = 'SUCCESS'
						receiveStatus = 'SUCCESS'
					}


					const tokenDecimals = sepoliaTokens.filter((d)=>{ return d.address === log.args.inputToken})[0].decimals

					const obj: PositionType = {
						side: 'Mint Request',
						user: log.args.user as `0x${string}`,
						inputAmount: weiToNum(log.args.inputAmount, tokenDecimals),
						outputAmount: num(log.args.outputAmount),
						tokenAddress: log.args.inputToken as `0x${string}`,
						timestamp: Number(log.args.time),
						txHash: log.transactionHash,
						indexName: key,
						nonce: Number(log.args.nonce),
						sendStatus,
						receiveStatus,
					}

					return obj
				})

				return Promise.all(mintData)
			})

			const burnLogsPromise = Object.entries(factoryAddresses0).map(async ([key, value]) => {
				const burnRequestLogs = await client.getLogs({
					address: value as `0x${string}`,
					event: parseAbiItem('event RequestRedemption( uint indexed nonce, address indexed user, address outputToken, uint inputAmount, uint outputAmount, uint time)'),
					args: {
						user: accountAddress as `0x${string}`,
					},
					fromBlock: BigInt(0),
				})

				const userBurnRequestLogsLogs = burnRequestLogs.filter((log) => log.args.user == accountAddress)

				const burnData = userBurnRequestLogsLogs.map(async (log) => {
					const isExist = stockTradeHistory.data.find((data) => {
						return data.nonce === log.args.nonce && data.side === 'Burn Request'
					})

					let sendStatus = ''
					let receiveStatus = ''

					if (!isExist) {
						// sendStatus = await getCCIPStatusById(log.args.messageId as `0x${string}`, 'ethereumSepolia', 'arbitrumSepolia')
						// if (sendStatus == 'SUCCESS') {
						// 	const messageId = await client2.readContract({
						// 		address: arbtirumSepoliaCR5CrossChainFactory,
						// 		abi: crossChainIndexFactoryV2Abi,
						// 		functionName: 'redemptionMessageIdByNonce',
						// 		args: [log.args.nonce],
						// 	})
						// 	receiveStatus = (await getCCIPStatusById(messageId as string, 'arbitrumSepolia', 'ethereumSepolia')) as string
						// 	recieveSideMessageId = messageId as string
						// }
						sendStatus = 'PENDING'
						receiveStatus = 'PENDING'
					} else {
						sendStatus = 'SUCCESS'
						receiveStatus = 'SUCCESS'
					}

					const tokenDecimals = sepoliaTokens.filter((d)=>{return d.address === log.args.outputToken})[0].decimals

					const obj: PositionType = {
						side: 'Burn Request',
						user: log.args.user as `0x${string}`,
						inputAmount: num(log.args.inputAmount),
						outputAmount: weiToNum(log.args.outputAmount, tokenDecimals),
						tokenAddress: log.args.outputToken as `0x${string}`,
						timestamp: Number(log.args.time),
						txHash: log.transactionHash,
						indexName: key,						
						nonce: Number(log.args.nonce),
						sendStatus,
						receiveStatus,
					}

					return obj
				})

				return Promise.all(burnData)
			})

			Promise.all([...mintLogsPromise, ...burnLogsPromise])
				.then((results) => {
					const combinedData = results.flat()

					const sortedPositionsData = combinedData.sort(function (a, b) {
						if (!a.timestamp || !b.timestamp) return 0
						return Number(b.timestamp) - Number(a.timestamp)
					})

					setPositions(sortedPositionsData)
					setStockTableTableReload(false)
				})
				.catch((err) => {
					console.log(err)
					setStockTableTableReload(false)
				})
		} catch (err) {
			console.log(err)
		}
	}, [accountAddress, stockTradeHistory.data])

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
