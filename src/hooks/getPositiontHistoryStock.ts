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
import { GET_MAG7_REQ_ISSUANCED_EVENT_LOGS, GET_MAG7_REQ_REDEMPTION_EVENT_LOGS } from '@/uniswap/graphQuery'
import apolloIndexClient from '@/utils/apollo-client'


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

				const { data: mintRequestlogs } = await apolloIndexClient.query({
					query: GET_MAG7_REQ_ISSUANCED_EVENT_LOGS,
					variables: { accountAddress: accountAddress as `0x${string}` },
					fetchPolicy: 'network-only'
				  });
				

				const userMintRequestLogs = mintRequestlogs.mag7RequestIssuances.filter((log:any) => log.user == accountAddress.toLowerCase())

				const mintData = userMintRequestLogs.map(async (log:any) => {
					const isExist = stockTradeHistory.data.find((data) => {						
						return data.nonce === Number(log.nonce) && data.side === 'Mint Request'
					})

					let sendStatus = ''
					let receiveStatus = ''

					if (isExist === undefined) {
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
						if(isMintedExist){
							status = 'SUCCESS'
						}else{
							status = 'MINT PENDING'
						}
					}


					const tokenDecimals = sepoliaTokens.filter((d)=>{ return d.address.toLowerCase() === log.inputToken})[0].decimals

					const obj: PositionType = {
						side: 'Mint Request',
						user: log.user as `0x${string}`,
						inputAmount: weiToNum(log.inputAmount, tokenDecimals),
						outputAmount: num(log.outputAmount),
						tokenAddress: log.inputToken as `0x${string}`,
						timestamp: Number(log.time),
						txHash: log.transactionHash,
						indexName: key,
						nonce: Number(log.nonce),
						sendStatus,
						receiveStatus,
					}

					return obj
				})

				return Promise.all(mintData)
			})

			const burnLogsPromise = Object.entries(factoryAddresses0).map(async ([key, value]) => {

				const { data: burnRequestLogs } = await apolloIndexClient.query({
					query: GET_MAG7_REQ_REDEMPTION_EVENT_LOGS,
					variables: { accountAddress: accountAddress as `0x${string}` },
					fetchPolicy: 'network-only'
				  });

				const userBurnRequestLogsLogs = burnRequestLogs.mag7RequestRedemptions.filter((log:any) => log.user == accountAddress.toLowerCase())

				const burnData = userBurnRequestLogsLogs.map(async (log:any) => {
					const isExist = stockTradeHistory.data.find((data) => {
						return data.nonce === Number(log.nonce) && data.side === 'Burn Request'
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

					const tokenDecimals = sepoliaTokens.filter((d)=>{return d.address.toLowerCase() === log.outputToken})[0].decimals

					const obj: PositionType = {
						side: 'Burn Request',
						user: log.user as `0x${string}`,
						inputAmount: num(log.inputAmount),
						outputAmount: weiToNum(log.outputAmount, tokenDecimals),
						tokenAddress: log.outputToken as `0x${string}`,
						timestamp: Number(log.time),
						txHash: log.transactionHash,
						indexName: key,						
						nonce: Number(log.nonce),
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
