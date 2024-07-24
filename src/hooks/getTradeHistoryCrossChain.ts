import { num } from './math'
import { useEffect, useState, useCallback } from 'react'
// import { useAccountAddressStore } from '@store/zustandStore'
import { createPublicClient, http, parseAbiItem } from 'viem'
import { goerli, sepolia } from 'viem/chains'
// import { getTickerFromAddress } from '../utils/general'
import { factoryAddresses, goerliAnfiV2Factory, goerliCrypto5Factory, zeroAddress } from '@constants/contractAddresses'
import { useAddress } from '@thirdweb-dev/react'
import { PositionType } from '@/types/tradeTableTypes'
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

		const client = createPublicClient({
			chain: sepolia,
			// transport: http(`https://eth-goerli.g.alchemy.com/v2/NucIfnwc-5eXFYtxgjat7itrQPkNQsty`),
			transport: http(`https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_SEPOLIA_KEY}`),
		})

		const positions0: PositionType[] = []
		// return;
		if (!accountAddress) return
		//store open long history
		// console.log(exchangeAddress)
		for (const [key, value] of Object.entries(factoryAddresses)) {
			// if (!accountAddress || exchangeAddress === zeroAddress || !exchangeAddress) return
			
			const mintRequestlogs = await client.getLogs({
				address: value as `0x${string}`,
				event: parseAbiItem(
					// 'event MintRequestAdd( uint256 indexed nonce, address indexed requester, uint256 amount, address depositAddress, uint256 timestamp, bytes32 requestHash )'
					// 'event Issuanced(address indexed user, address indexed inputToken, uint inputAmount, uint outputAmount, uint time)'
					'event Issuanced(bytes32 indexed messageId,uint indexed nonce,address indexed user,address inputToken,uint inputAmount,uint outputAmount, uint time)'
				),
				args: {
					user: accountAddress as `0x${string}`,
				},
				fromBlock: BigInt(0),
			})
			const userMintRequestLogs: any = mintRequestlogs.filter((log) => log.args.user == accountAddress)
			userMintRequestLogs.forEach((log: any) => {
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
                    sendStatus: "SUCCESS",
                    receiveStatus: "SUCCESS"
				}
				positions0.push(obj)
				// setPositions(preObj => [...preObj, obj])
			})

			//store open short history
			const burnRequestLogs = await client.getLogs({
				address: value as `0x${string}`,
				event: parseAbiItem(
					// 'event Burned( uint256 indexed nonce, address indexed requester, uint256 amount, address depositAddress, uint256 timestamp, bytes32 requestHash )'
					// 'event Redemption(address indexed user, address indexed outputToken, uint inputAmount, uint outputAmount, uint time)'
					'event Redemption(bytes32 indexed messageId,uint indexed nonce,address indexed user,address outputToken,uint inputAmount,uint outputAmount,uint time)'
				),
				args: {
					user: accountAddress as `0x${string}`,
				},
				fromBlock: BigInt(0),
			})
			const userBurnRequestLogsLogs = burnRequestLogs.filter((log) => log.args.user == accountAddress)

			userBurnRequestLogsLogs.forEach(async (log) => {
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
                    nonce: Number(log.args.nonce),
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
