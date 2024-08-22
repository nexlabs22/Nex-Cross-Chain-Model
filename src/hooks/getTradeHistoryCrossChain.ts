import { num } from './math'
import { useEffect, useState, useCallback } from 'react'
// import { useAccountAddressStore } from '@store/zustandStore'
import { createPublicClient, http, parseAbiItem } from 'viem'
import { goerli, sepolia } from 'viem/chains'
// import { getTickerFromAddress } from '../utils/general'
import { factoryAddresses, goerliAnfiV2Factory, goerliCrypto5Factory, zeroAddress } from '@constants/contractAddresses'
import { useAddress } from '@thirdweb-dev/react'
import { PositionType } from '@/types/tradeTableTypes'
import { getClient } from '@/app/api/client'
import { indexesClient } from '@/utils/graphQL-client'
import { GET_ISSUANCED_CR5_EVENT_LOGS, GET_REDEMPTION_CR5_EVENT_LOGS } from '@/uniswap/graphQuery'
// import { Positions } from '@/types/tradeTableTypes'
// import { Positions1 } from './getRequestHistory'



// export function GetPositionsHistory2(exchangeAddress: `0x${string}`, activeTicker: string) {
export function GetTradeHistoryCrossChain() {
	// const accountAddress = useAccountAddressStore((state) => state.accountAddress)
	// if(!exchangeAddress) return;

	const [accountAddress, setAccountAddress] = useState<`0x${string}` | string>()
	const [loading, setLoading] = useState<boolean>(false)
	const address = useAddress()

	const [positions, setPositions] = useState<PositionType[]>([])

	useEffect(() => {
		if (address) {
			setAccountAddress(address)
		}
	}, [address])

	// useEffect(() => {


	const getHistory = useCallback(async () => {

		setLoading(true)
		setPositions([])

		const client = getClient('sepolia')

		const positions0: PositionType[] = []
		// return;
		if (!accountAddress) return
		//store open long history
		for (const [key, value] of Object.entries(factoryAddresses)) {
			// if (!accountAddress || exchangeAddress === zeroAddress || !exchangeAddress) return
			
			const { error, data: mintRequestlogs } = await indexesClient
			.query(GET_ISSUANCED_CR5_EVENT_LOGS, { accountAddress: accountAddress as `0x${string}` })
			.toPromise()

			const userMintRequestLogs: any = mintRequestlogs.cr5Issuanceds.filter((log:any) => log.user == accountAddress.toLowerCase())
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
					messageId: log.messageId,
                    nonce: Number(log.nonce),
                    sendStatus: "SUCCESS",
                    receiveStatus: "SUCCESS"
				}
				positions0.push(obj)
				// setPositions(preObj => [...preObj, obj])
			})

			//store open short history
			const { data: burnRequestLogs } = await indexesClient
			.query(GET_REDEMPTION_CR5_EVENT_LOGS, { accountAddress: accountAddress as `0x${string}` })
			.toPromise()
			
			const userBurnRequestLogsLogs = burnRequestLogs.cr5Redemptions.filter((log:any) => log.user == accountAddress.toLowerCase())

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
					messageId: log.messageId,
                    nonce: Number(log.nonce),
                    sendStatus: "SUCCESS",
                    receiveStatus: "SUCCESS"
				}
				positions0.push(obj)
				// setPositions(preObj => [...preObj, obj])
			})

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
