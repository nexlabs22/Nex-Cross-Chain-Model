import { num } from './math'
import { useEffect, useState, useCallback } from 'react'
// import { useAccountAddressStore } from '@store/zustandStore'
import { createPublicClient, http, parseAbiItem } from 'viem'
import { goerli, sepolia } from 'viem/chains'
// import { getTickerFromAddress } from '../utils/general'
import { factoryAddresses, goerliAnfiV2Factory, goerliCrypto5Factory, zeroAddress } from '@constants/contractAddresses'
import { useAddress } from '@thirdweb-dev/react'
// import { Positions } from '@/types/tradeTableTypes'
import { nexTokens } from '@/constants/nexIndexTokens'
import { PositionType } from '@/types/tradeTableTypes'
import { getClient } from '@/app/api/client'
import { indexesClient } from '@/utils/graphQL-client'
import { GET_ISSUANCED_ANFI_EVENT_LOGS, GET_REDEMPTION_ANFI_EVENT_LOGS } from '@/uniswap/graphQuery'

export function GetPositionsHistoryDefi() {

	const [accountAddress, setAccountAddress] = useState<`0x${string}` | string>()
	const address = useAddress()

	const [positions, setPositions] = useState<PositionType[]>([])
	const [loading, setLoading] = useState<boolean>(false)

	useEffect(() => {
		if (address) {
			setAccountAddress(address)
		}
	}, [address])

	const getHistory = useCallback(async () => {
		setLoading(true)
		setPositions([])

		const client = getClient('sepolia')

		const positions0: PositionType[] = []
		// return;
		if (!accountAddress) return

		

		for (const [key, value] of Object.entries(factoryAddresses)) {
			// if (!accountAddress || exchangeAddress === zeroAddress || !exchangeAddress) return
			const tokenData = nexTokens.find((token) => {
				return token.symbol === key
			})
			if (tokenData?.indexType === 'defi') {
				// const mintRequestlogs = await client.getLogs({
				// 	address: value as `0x${string}`,
				// 	event: parseAbiItem(
				// 		// 'event MintRequestAdd( uint256 indexed nonce, address indexed requester, uint256 amount, address depositAddress, uint256 timestamp, bytes32 requestHash )'
				// 		'event Issuanced(address indexed user, address indexed inputToken, uint inputAmount, uint outputAmount, uint time)'
				// 	),
				// 	args: {
				// 		user: accountAddress as `0x${string}`,
				// 	},
				// 	fromBlock: BigInt(0),
				// })

				const { data: mintRequestlogs } = await indexesClient
				.query(GET_ISSUANCED_ANFI_EVENT_LOGS, { accountAddress: accountAddress as `0x${string}` })
				.toPromise()
				
				const userMintRequestLogs: any = mintRequestlogs.anfiissuanceds.filter((log:any) => log.user == accountAddress.toLowerCase())
				userMintRequestLogs.forEach((log: any) => {
					const obj: PositionType = {
						side: 'Mint Request',
						user: log.user as `0x${string}`,
						inputAmount: num(log.inputAmount),
						outputAmount: num(log.outputAmount),
						tokenAddress: log.inputToken as `0x${string}`,
						timestamp: Number(log.time),
						txHash: log.transactionHash,
						indexName: key,
					}

					positions0.push(obj)
					// setPositions(preObj => [...preObj, obj])
				})


				//store open short history
				// const burnRequestLogs = await client.getLogs({
				// 	address: value as `0x${string}`,
				// 	event: parseAbiItem(
				// 		// 'event Burned( uint256 indexed nonce, address indexed requester, uint256 amount, address depositAddress, uint256 timestamp, bytes32 requestHash )'
				// 		'event Redemption(address indexed user, address indexed outputToken, uint inputAmount, uint outputAmount, uint time)'
				// 	),
				// 	args: {
				// 		user: accountAddress as `0x${string}`,
				// 	},
				// 	fromBlock: BigInt(0),
				// })
				const { data: burnRequestLogs } = await indexesClient
				.query(GET_REDEMPTION_ANFI_EVENT_LOGS, { accountAddress: accountAddress as `0x${string}` })
				.toPromise()
				const userBurnRequestLogsLogs = burnRequestLogs.anfiredemptions.filter((log:any) => log.user.toLowerCase() == accountAddress.toLowerCase())

				userBurnRequestLogsLogs.forEach(async (log:any) => {
					const obj: PositionType = {
						side: 'Burn Request',
						user: log.user as `0x${string}`,
						inputAmount: num(log.inputAmount),
						outputAmount: num(log.outputAmount),
						tokenAddress: log.outputToken as `0x${string}`,
						timestamp: Number(log.time),
						txHash: log.transactionHash,
						indexName: key,
					}
					positions0.push(obj)
					// setPositions(preObj => [...preObj, obj])
				})
			}
		}

		// setPositions(positions0)
		const sortedPositionsData = positions0.sort(function (a, b) {
			if (!a.timestamp || !b.timestamp) return 0
			return Number(b.timestamp) - Number(a.timestamp)
		})
		setPositions(sortedPositionsData)
		setLoading(false)
	}, [accountAddress])

	useEffect(() => {
		getHistory()
	}, [getHistory])

	return {
		data: positions,
		reload: getHistory,
		loading
	}
}
