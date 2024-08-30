import { num } from './math'
import { useEffect, useState, useCallback } from 'react'
import { useAddress } from '@thirdweb-dev/react'
import { nexTokens } from '@/constants/nexIndexTokens'
import { PositionType } from '@/types/tradeTableTypes'
import { getClient } from '@/app/api/client'
import { indexesClient } from '@/utils/graphQL-client'
import { GET_ISSUANCED_ANFI_EVENT_LOGS, GET_ISSUANCED_ARBEI_EVENT_LOGS, GET_REDEMPTION_ANFI_EVENT_LOGS, GET_REDEMPTION_ARBEI_EVENT_LOGS } from '@/uniswap/graphQuery'
import apolloIndexClient from '@/utils/apollo-client'
import useTradePageStore from '@/store/tradeStore'

interface MintRequest {
	__typename: string;
	time: string;
	user: string;
	transactionHash: string;
	inputToken: string;
	inputAmount: string;
	outputAmount: string;
}
interface BurnRequest {
	__typename: string;
	time: string;
	user: string;
	transactionHash: string;
	outToken: string;
	inputAmount: string;
	outputAmount: string;
}

export function GetPositionsHistoryDefi() {
	const [accountAddress, setAccountAddress] = useState<`0x${string}` | string>()
	const address = useAddress()
	const { setDefiTableTableReload} = useTradePageStore()

	const [positions, setPositions] = useState<PositionType[]>([])
	const [loading, setLoading] = useState<boolean>(false)

	const defiQueryMapRedemption = {
		ANFI: {
			'issuanced':GET_ISSUANCED_ANFI_EVENT_LOGS,
			'redemption': GET_REDEMPTION_ANFI_EVENT_LOGS
		},
		ARBEI: {
			'issuanced':GET_ISSUANCED_ARBEI_EVENT_LOGS,
			'redemption': GET_REDEMPTION_ARBEI_EVENT_LOGS
		}
	}



	useEffect(() => {
		if (address) {
			setAccountAddress(address)
		}
	}, [address])

	const getHistory = useCallback(async () => {
		setLoading(true)
		setDefiTableTableReload(true)
		setPositions([])

		const positions0: PositionType[] = []
		if (!accountAddress) return

		for (const [key, query] of Object.entries(defiQueryMapRedemption)) {
			const tokenData = nexTokens.find((token) => {
				return token.symbol === key
			})
			if (tokenData?.indexType === 'defi') {
				const { data: mintRequestlogs }: { data: { [key: string]: MintRequest[] } } = await apolloIndexClient.query({
					query: query.issuanced,
					variables: { accountAddress: accountAddress as `0x${string}` },
					fetchPolicy: 'network-only',
				});

				const userMintRequestLogs: any = Object.values(mintRequestlogs)[0].filter((log: any) => log.user == accountAddress.toLowerCase())
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

				
				const { data: burnRequestLogs }: { data: { [key: string]: BurnRequest[] } } = await apolloIndexClient.query({
					query: query.redemption,
					variables: { accountAddress: accountAddress as `0x${string}` },
					fetchPolicy: 'network-only',
				})

				console.log(Object.values(burnRequestLogs))
				const userBurnRequestLogsLogs = Object.values(burnRequestLogs)[0].filter((log: any) => log.user == accountAddress.toLowerCase())

				userBurnRequestLogsLogs.forEach(async (log: any) => {
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
		setDefiTableTableReload(false)		
	}, [accountAddress])

	useEffect(() => {
		getHistory()
	}, [getHistory])

	return {
		data: positions,
		reload: getHistory,
		loading,
	}
}
