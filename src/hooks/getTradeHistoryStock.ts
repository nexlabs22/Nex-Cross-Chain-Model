import { num, weiToNum } from './math'
import { useEffect, useState, useCallback } from 'react'
import { createPublicClient, http, parseAbiItem } from 'viem'
import { goerli, sepolia } from 'viem/chains'
import { factoryAddresses, goerliAnfiV2Factory, goerliCrypto5Factory, sepoliaMag7Factory, zeroAddress } from '@constants/contractAddresses'
import { useAddress } from '@thirdweb-dev/react'
import { PositionType } from '@/types/tradeTableTypes'
import { sepoliaTokens } from '@/constants/testnetTokens'
import { getClient } from '@/app/api/client'
import { indexesClient } from '@/utils/graphQL-client'
import { GET_MAG7_ISSUANCED_EVENT_LOGS, GET_MAG7_REDEMPTION_EVENT_LOGS } from '@/uniswap/graphQuery'



export function GetTradeHistoryStock() {

	const [accountAddress, setAccountAddress] = useState<`0x${string}` | string>()
	const [loading, setLoading] = useState<boolean>(false)
	const address = useAddress()

	const [positions, setPositions] = useState<PositionType[]>([])

	useEffect(() => {
		if (address) {
			setAccountAddress(address)
		}
	}, [address])

	const getHistory = useCallback(async () => {

		setLoading(true)
		setPositions([])

		// const client = createPublicClient({
		// 	chain: sepolia,
		// 	// transport: http(`https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_SEPOLIA_KEY}`),
		// 	transport: http(`https://eth-sepolia.g.alchemy.com/v2/Go-5TbveGF0JbuWNP4URPr5cm5xgIKCy`),
		// })

		const client = getClient('sepolia')

		const positions0: PositionType[] = []

		if (!accountAddress) return

		const factoryAddresses0 = {MAG7 : sepoliaMag7Factory}

		for (const [key, value] of Object.entries(factoryAddresses0)) {
			
			// const mintRequestlogs = await client.getLogs({
			// 	address: value as `0x${string}`,
			// 	event: parseAbiItem(
			// 		'event Issuanced(uint indexed nonce,address indexed user,address inputToken,uint inputAmount,uint outputAmount, uint time)'
			// 	),
			// 	args: {
			// 		user: accountAddress as `0x${string}`,
			// 	},
			// 	fromBlock: BigInt(0),
			// })

			const { data: mintRequestlogs } = await indexesClient
			.query(GET_MAG7_ISSUANCED_EVENT_LOGS, { accountAddress: accountAddress as `0x${string}` })
			.toPromise()
			

			const userMintRequestLogs: any = mintRequestlogs.mag7Issuanceds.filter((log:any) => log.user.toLowerCase() == accountAddress.toLowerCase())

			userMintRequestLogs.forEach((log: any) => {
				
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
                    sendStatus: "SUCCESS",
                    receiveStatus: "SUCCESS"
				}
				positions0.push(obj)
			})

			//store open short history
			// const burnRequestLogs = await client.getLogs({
			// 	address: value as `0x${string}`,
			// 	event: parseAbiItem(
			// 		'event Redemption(uint indexed nonce,address indexed user,address outputToken,uint inputAmount,uint outputAmount,uint time)'
			// 	),
			// 	args: {
			// 		user: accountAddress as `0x${string}`,
			// 	},
			// 	fromBlock: BigInt(0),
			// })
			
			const { data: burnRequestLogs } = await indexesClient
			.query(GET_MAG7_REDEMPTION_EVENT_LOGS, { accountAddress: accountAddress as `0x${string}` })
			.toPromise()

			const userBurnRequestLogsLogs = burnRequestLogs.mag7Redemptions.filter((log:any) => log.user.toLowerCase() == accountAddress.toLowerCase())

			userBurnRequestLogsLogs.forEach(async (log:any) => {
				const tokenDecimals = sepoliaTokens.filter((d)=>{ return d.address.toLowerCase() === log.outputToken})[0].decimals
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
                    sendStatus: "SUCCESS",
                    receiveStatus: "SUCCESS"
				}
				positions0.push(obj)
			})

		}

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
