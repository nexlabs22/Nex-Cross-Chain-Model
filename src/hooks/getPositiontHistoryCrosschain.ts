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
			const client = createPublicClient({
				chain: sepolia,
				// transport: http(`https://eth-goerli.g.alchemy.com/v2/NucIfnwc-5eXFYtxgjat7itrQPkNQsty`),
				transport: http(`https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_SEPOLIA_KEY}`),
			})

			const client2 = createPublicClient({
				chain: arbitrumSepolia,
				// transport: http(`https://eth-goerli.g.alchemy.com/v2/NucIfnwc-5eXFYtxgjat7itrQPkNQsty`),
				transport: http(`https://arb-sepolia.g.alchemy.com/v2/Go-5TbveGF0JbuWNP4URPr5cm5xgIKCy`),
			})

			if (!accountAddress) return

			const mintLogsPromise = Object.entries(factoryAddresses0).map(async ([key, value]) => {
				const mintRequestlogs = await client.getLogs({
					address: value as `0x${string}`,
					event: parseAbiItem('event RequestIssuance(bytes32 indexed messageId, uint indexed nonce, address indexed user, address inputToken, uint inputAmount, uint outputAmount, uint time)'),
					args: {
						user: accountAddress as `0x${string}`,
					},
					fromBlock: BigInt(0),
				})

				const userMintRequestLogs = mintRequestlogs.filter((log) => log.args.user == accountAddress)

				const mintData = userMintRequestLogs.map(async (log) => {
					const isExist = crossChainpositionHistory.data.find((data) => {
						return data.nonce === log.args.nonce && data.side === 'Mint Request'
					})

					let sendStatus = ''
					let receiveStatus = ''
					let recieveSideMessageId = ''

					if (!isExist) {
						sendStatus = await getCCIPStatusById(log.args.messageId as string, 'ethereumSepolia', 'arbitrumSepolia')
						if (sendStatus == 'SUCCESS') {
							const messageId = await client2.readContract({
								address: arbtirumSepoliaCR5CrossChainFactory,
								abi: crossChainIndexFactoryV2Abi,
								functionName: 'issuanceMessageIdByNonce',
								args: [log.args.nonce],
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
						user: log.args.user as `0x${string}`,
						inputAmount: num(log.args.inputAmount),
						outputAmount: num(log.args.outputAmount),
						tokenAddress: log.args.inputToken as `0x${string}`,
						timestamp: Number(log.args.time),
						txHash: log.transactionHash,
						indexName: key,
						messageId: log.args.messageId,
						nonce: Number(log.args.nonce),
						sendStatus,
						receiveStatus,
						recieveSideMessageId,
					}

					return obj
				})

				return Promise.all(mintData)
			})

			const burnLogsPromise = Object.entries(factoryAddresses0).map(async ([key, value]) => {
				const burnRequestLogs = await client.getLogs({
					address: value as `0x${string}`,
					event: parseAbiItem('event RequestRedemption(bytes32 indexed messageId, uint indexed nonce, address indexed user, address outputToken, uint inputAmount, uint outputAmount, uint time)'),
					args: {
						user: accountAddress as `0x${string}`,
					},
					fromBlock: BigInt(0),
				})

				const userBurnRequestLogsLogs = burnRequestLogs.filter((log) => log.args.user == accountAddress)

				const burnData = userBurnRequestLogsLogs.map(async (log) => {
					const isExist = crossChainpositionHistory.data.find((data) => {
						return data.nonce === log.args.nonce && data.side === 'Burn Request'
					})

					let sendStatus = ''
					let receiveStatus = ''
					let recieveSideMessageId = ''

					if (!isExist) {
						sendStatus = await getCCIPStatusById(log.args.messageId as `0x${string}`, 'ethereumSepolia', 'arbitrumSepolia')
						if (sendStatus == 'SUCCESS') {
							const messageId = await client2.readContract({
								address: arbtirumSepoliaCR5CrossChainFactory,
								abi: crossChainIndexFactoryV2Abi,
								functionName: 'redemptionMessageIdByNonce',
								args: [log.args.nonce],
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
						user: log.args.user as `0x${string}`,
						inputAmount: num(log.args.inputAmount),
						outputAmount: num(log.args.outputAmount),
						tokenAddress: log.args.outputToken as `0x${string}`,
						timestamp: Number(log.args.time),
						txHash: log.transactionHash,
						indexName: key,
						messageId: log.args.messageId,
						recieveSideMessageId,
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
		getHistory()
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
