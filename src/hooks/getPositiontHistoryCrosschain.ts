import { num } from './math'
import { useEffect, useState, useCallback } from 'react'
// import { useAccountAddressStore } from '@store/zustandStore'
import { createPublicClient, http, parseAbiItem } from 'viem'
import { arbitrumSepolia, goerli, sepolia } from 'viem/chains'
// import { getTickerFromAddress } from '../utils/general'
import { arbtirumSepoliaCR5CrossChainFactory, factoryAddresses, goerliAnfiV2Factory, goerliCrypto5Factory, sepoliaCrypto5V2Factory, zeroAddress } from '@constants/contractAddresses'
import { useAddress } from '@thirdweb-dev/react'
import { getCCIPStatusById } from './getCcipStatusModelById'
import useTradePageStore from '@/store/tradeStore'
import { crossChainIndexFactoryV2Abi, indexFactoryV2Abi } from '@/constants/abi'
import { GetTradeHistoryCrossChain } from './getTradeHistoryCrossChain'
import { PositionType } from '@/types/tradeTableTypes'
import { getClient } from '@/app/api/client'
import { GET_ISSUANCED_CR5_EVENT_LOGS, GET_REDEMPTION_CR5_EVENT_LOGS, GET_REQ_ISSUANCED_CR5_EVENT_LOGS, GET_REQ_REDEMPTION_CR5_EVENT_LOGS } from '@/uniswap/graphQuery'
import { indexesClient } from '@/utils/graphQL-client'

export function GetPositionsHistoryCrossChain() {
	const { setCrosschainTableTableReload } = useTradePageStore()

	const [accountAddress, setAccountAddress] = useState<`0x${string}` | string>()
	const address = useAddress()
	const crossChainpositionHistory = GetTradeHistoryCrossChain()

	const [positions, setPositions] = useState<PositionType[]>([])

	useEffect(() => {
		if (address) {
			setAccountAddress(address)
		}
	}, [address])

	const getHistory = useCallback(async () => {
		try {
			setCrosschainTableTableReload(true)

			const factoryAddresses0 = { CRYPTO5: sepoliaCrypto5V2Factory }
			
			const client = getClient('sepolia')
			const client2 = getClient('arbitrumSepolia')


			if (!accountAddress) return

			const mintLogsPromise = Object.entries(factoryAddresses0).map(async ([key, value]) => {
				const { data: mintRequestlogs } = await indexesClient
				.query(GET_REQ_ISSUANCED_CR5_EVENT_LOGS, { accountAddress: accountAddress as `0x${string}` })
				.toPromise()
				

				const userMintRequestLogs: any = mintRequestlogs.cr5RequestIssuances.filter((log:any) => log.user == accountAddress.toLowerCase())

				const mintData = userMintRequestLogs.map(async (log:any) => {
					const isExist = crossChainpositionHistory.data.find((data) => {
						return data.nonce === Number(log.nonce) && data.side === 'Mint Request'
					})

					let sendStatus = ''
					let receiveStatus = ''
					let recieveSideMessageId = ''

					if (!isExist) {
						sendStatus = await getCCIPStatusById(log.messageId as string, 'ethereumSepolia', 'arbitrumSepolia')
						if (sendStatus == 'SUCCESS') {
							const messageId = await client2.readContract({
								address: arbtirumSepoliaCR5CrossChainFactory,
								abi: crossChainIndexFactoryV2Abi,
								functionName: 'issuanceMessageIdByNonce',
								args: [log.nonce],
							})
							receiveStatus = (await getCCIPStatusById(messageId as string, 'arbitrumSepolia', 'ethereumSepolia')) as string
							recieveSideMessageId = messageId as string
						}
					} else {
						sendStatus = 'SUCCESS'
						receiveStatus = 'SUCCESS'
					}

					const obj: PositionType = {
						side: 'Mint Request',
						user: log.user as `0x${string}`,
						inputAmount: num(log.inputAmount),
						outputAmount: num(log.outputAmount),
						tokenAddress: log.inputToken as `0x${string}`,
						timestamp: Number(log.time),
						txHash: log.transactionHash,
						indexName: key,
						messageId: log.messageId,
						nonce: Number(log.nonce),
						sendStatus,
						receiveStatus,
						recieveSideMessageId,
					}

					return obj
				})

				return Promise.all(mintData)
			})

			const burnLogsPromise = Object.entries(factoryAddresses0).map(async ([key, value]) => {
				const { data: burnRequestLogs } = await indexesClient
				.query(GET_REQ_REDEMPTION_CR5_EVENT_LOGS, { accountAddress: accountAddress as `0x${string}` })
				.toPromise()
				

				const userBurnRequestLogsLogs = burnRequestLogs.cr5RequestRedemptions.filter((log:any) => log.user == accountAddress.toLowerCase())

				const burnData = userBurnRequestLogsLogs.map(async (log:any) => {
					const isExist = crossChainpositionHistory.data.find((data) => {
						return data.nonce === Number(log.nonce) && data.side === 'Burn Request'
					})

					let sendStatus = ''
					let receiveStatus = ''
					let recieveSideMessageId = ''

					if (!isExist) {
						sendStatus = await getCCIPStatusById(log.messageId as `0x${string}`, 'ethereumSepolia', 'arbitrumSepolia')
						if (sendStatus == 'SUCCESS') {
							const messageId = await client2.readContract({
								address: arbtirumSepoliaCR5CrossChainFactory,
								abi: crossChainIndexFactoryV2Abi,
								functionName: 'redemptionMessageIdByNonce',
								args: [log.nonce],
							})
							receiveStatus = (await getCCIPStatusById(messageId as string, 'arbitrumSepolia', 'ethereumSepolia')) as string
							recieveSideMessageId = messageId as string
						}
					} else {
						sendStatus = 'SUCCESS'
						receiveStatus = 'SUCCESS'
					}

					const obj: PositionType = {
						side: 'Burn Request',
						user: log.user as `0x${string}`,
						inputAmount: num(log.inputAmount),
						outputAmount: num(log.outputAmount),
						tokenAddress: log.outputToken as `0x${string}`,
						timestamp: Number(log.time),
						txHash: log.transactionHash,
						indexName: key,
						messageId: log.messageId,
						recieveSideMessageId,
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
					setCrosschainTableTableReload(false)
				})
				.catch((err) => {
					console.log(err)
					setCrosschainTableTableReload(false)
				})
		} catch (err) {
			console.log(err)
		}
	}, [accountAddress, crossChainpositionHistory.data])

	useEffect(() => {
		// getHistory()
	}, [getHistory])

	function handleReload() {
		crossChainpositionHistory.reload()
		getHistory()
	}

	return {
		history: crossChainpositionHistory.data,
		requests: positions,
		reload: handleReload,
	}
}
