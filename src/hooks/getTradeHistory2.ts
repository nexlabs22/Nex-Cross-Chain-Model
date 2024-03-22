import { num } from './math'
import { useEffect, useState, useCallback } from 'react'
// import { useAccountAddressStore } from '@store/zustandStore'
import { createPublicClient, http, parseAbiItem } from 'viem'
import { goerli, sepolia } from 'viem/chains'
// import { getTickerFromAddress } from '../utils/general'
import { factoryAddresses, goerliAnfiV2Factory, goerliCrypto5Factory, zeroAddress } from '@constants/contractAddresses'
import { useAddress } from '@thirdweb-dev/react'
import { Positions } from '@/types/tradeTableTypes'



// export function GetPositionsHistory2(exchangeAddress: `0x${string}`, activeTicker: string) {
export function GetPositionsHistory2() {
	// const accountAddress = useAccountAddressStore((state) => state.accountAddress)
	// if(!exchangeAddress) return;

	const [accountAddress, setAccountAddress] = useState<`0x${string}` | string>()
	const address = useAddress()

	const [positions, setPositions] = useState<Positions[]>([])

	useEffect(() => {
		if (address) {
			setAccountAddress(address)
		}
	}, [address])

	// useEffect(() => {


	const getHistory = useCallback(async () => {

		setPositions([])

		const client = createPublicClient({
			chain: sepolia,
			// transport: http(`https://eth-goerli.g.alchemy.com/v2/NucIfnwc-5eXFYtxgjat7itrQPkNQsty`),
			transport: http(`https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_SEPOLIA_KEY}`),
		})

		const positions0: Positions[] = []
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
					'event Issuanced(address indexed user, address indexed inputToken, uint inputAmount, uint outputAmount, uint time)'
				),
				args: {
					user: accountAddress as `0x${string}`,
				},
				fromBlock: BigInt(0),
			})
			const userMintRequestLogs: any = mintRequestlogs.filter((log) => log.args.user == accountAddress)
			userMintRequestLogs.forEach((log: any) => {
				const obj: Positions = {
					side: 'Mint Request',
					user: log.args.user as `0x${string}`,
					inputAmount: num(log.args.inputAmount),
					outputAmount: num(log.args.outputAmount),
					tokenAddress: log.args.inputToken as `0x${string}`,
					timestamp: Number(log.args.time),
					txHash: log.transactionHash,
					indexName: key,
				}
				positions0.push(obj)
				// setPositions(preObj => [...preObj, obj])
			})

			//store open short history
			const burnRequestLogs = await client.getLogs({
				address: value as `0x${string}`,
				event: parseAbiItem(
					// 'event Burned( uint256 indexed nonce, address indexed requester, uint256 amount, address depositAddress, uint256 timestamp, bytes32 requestHash )'
					'event Redemption(address indexed user, address indexed outputToken, uint inputAmount, uint outputAmount, uint time)'
				),
				args: {
					user: accountAddress as `0x${string}`,
				},
				fromBlock: BigInt(0),
			})
			const userBurnRequestLogsLogs = burnRequestLogs.filter((log) => log.args.user == accountAddress)

			userBurnRequestLogsLogs.forEach(async (log) => {
				const obj: Positions = {
					side: 'Burn Request',
					user: log.args.user as `0x${string}`,
					inputAmount: num(log.args.inputAmount),
					outputAmount: num(log.args.outputAmount),
					tokenAddress: log.args.outputToken as `0x${string}`,
					timestamp: Number(log.args.time),
					txHash: log.transactionHash,
					indexName: key,
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
	}, [accountAddress])

	useEffect(() => {

		getHistory()
	}, [getHistory])

	return {
		data: positions,
		reload: getHistory,
	}
}
