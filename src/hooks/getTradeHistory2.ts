import { num } from './math'
import { useEffect, useState, useCallback } from 'react'
// import { useAccountAddressStore } from '@store/zustandStore'
import { createPublicClient, http, parseAbiItem } from 'viem'
import { goerli } from 'viem/chains'
// import { getTickerFromAddress } from '../utils/general'
import { zeroAddress } from '@constants/contractAddresses'
import { useAddress } from '@thirdweb-dev/react'

interface Positions {
    side: string,
    user: `0x${string}` | string,
    tokenAddress: `0x${string}` | string,
    timestamp: number,
    inputAmount: number,
    outputAmount: number,
    indexName: string
}

export function GetPositionsHistory2(exchangeAddress: `0x${string}`, activeTicker: string) {
	// const accountAddress = useAccountAddressStore((state) => state.accountAddress)
	// if(!exchangeAddress) return;
	const [accountAddress, setAccountAddress] = useState<`0x${string}` | string>()
    const address = useAddress()

	const [positions, setPositions] = useState<Positions[]>([])

    useEffect(() => {
        if(address){
            setAccountAddress(address)
        }
    },[address])

	// useEffect(() => {
	const getHistory = useCallback(async () => {
		console.log("getHistory2")
		setPositions([])

		const client = createPublicClient({
			chain: goerli,
			// transport: http(`https://eth-goerli.g.alchemy.com/v2/NucIfnwc-5eXFYtxgjat7itrQPkNQsty`),
			transport: http(`https://eth-goerli.g.alchemy.com/v2/LOxUiFd7inEC7y9S-rxGH-_FmJjLlYC1`),
		})

		const positions0: Positions[] = []
		// return;
		if (!accountAddress || exchangeAddress === zeroAddress || !exchangeAddress) return
		//store open long history
		// console.log(exchangeAddress)
		const mintRequestlogs = await client.getLogs({
			address: exchangeAddress,
			event: parseAbiItem(
				// 'event MintRequestAdd( uint256 indexed nonce, address indexed requester, uint256 amount, address depositAddress, uint256 timestamp, bytes32 requestHash )'
				'event Issuanced(address indexed user, address indexed inputToken, uint inputAmount, uint outputAmount, uint time)'
			),
			args: {
				user: accountAddress as `0x${string}` ,
			},
			fromBlock: BigInt(0),
		})
		const userMintRequestLogs = mintRequestlogs.filter((log) => log.args.user == accountAddress)

		userMintRequestLogs.forEach((log) => {
			const obj:Positions = {
				side: 'Mint Request',
				user: log.args.user as `0x${string}`,
				inputAmount: num(log.args.inputAmount),
				outputAmount: num(log.args.outputAmount),
				tokenAddress: log.args.inputToken as `0x${string}`,
				timestamp: Number(log.args.time),
				indexName: activeTicker,
			}
			positions0.push(obj)
			// setPositions(preObj => [...preObj, obj])
		})

		//store open short history
		const burnRequestLogs = await client.getLogs({
			address: exchangeAddress,
			event: parseAbiItem(
				// 'event Burned( uint256 indexed nonce, address indexed requester, uint256 amount, address depositAddress, uint256 timestamp, bytes32 requestHash )'
				'event Redemption(address indexed user, address indexed outputToken, uint inputAmount, uint outputAmount, uint time)'
			),
			args: {
				user: accountAddress as `0x${string}` ,
			},
			fromBlock: BigInt(0),
		})
		const userBurnRequestLogsLogs = burnRequestLogs.filter((log) => log.args.user == accountAddress)

		userBurnRequestLogsLogs.forEach((log) => {
			const obj:Positions = {
				side: 'Burn Request',
				user: log.args.user as `0x${string}`,
				inputAmount: num(log.args.inputAmount),
				outputAmount: num(log.args.outputAmount),
				tokenAddress: log.args.outputToken as `0x${string}`,
				timestamp: Number(log.args.time),
				indexName: activeTicker,
			}
			positions0.push(obj)
			// setPositions(preObj => [...preObj, obj])
		})

		

		setPositions(positions0)
		setPositions((positions) =>
			positions.sort(function (a, b) {
				if (!a.timestamp || !b.timestamp) return 0
				return Number(b.timestamp) - Number(a.timestamp)
			})
		)
	}, [accountAddress, exchangeAddress, activeTicker])

	useEffect(() => {
		getHistory()
	}, [getHistory, exchangeAddress])

	return {
		data: positions,
		reload: getHistory,
	}
}
