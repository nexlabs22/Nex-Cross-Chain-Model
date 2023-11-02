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
    nonce: number,
    amount: number,
    depositAddress: `0x${string}` | string,
    timestamp: number,
    requestHash: string,
    indexName: string
}

export function GetPositionsHistory(exchangeAddress: `0x${string}`, activeTicker: string) {
	// const accountAddress = useAccountAddressStore((state) => state.accountAddress)
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
		setPositions([])

		const client = createPublicClient({
			chain: goerli,
			transport: http(`https://eth-goerli.g.alchemy.com/v2/NucIfnwc-5eXFYtxgjat7itrQPkNQsty`),
		})

		const positions0: Positions[] = []

		if (!accountAddress || exchangeAddress === zeroAddress) return
		//store open long history
		// console.log(exchangeAddress)
		const mintRequestlogs = await client.getLogs({
			address: exchangeAddress,
			event: parseAbiItem(
				'event MintRequestAdd( uint256 indexed nonce, address indexed requester, uint256 amount, address depositAddress, uint256 timestamp, bytes32 requestHash )'
			),
			args: {
				requester: accountAddress as `0x${string}` ,
			},
			fromBlock: BigInt(0),
		})
		const userMintRequestLogs = mintRequestlogs.filter((log) => log.args.requester == accountAddress)

		userMintRequestLogs.forEach((log) => {
			const obj:Positions = {
				side: 'Mint Request',
				user: log.args.requester as `0x${string}`,
				nonce: Number(log.args.nonce),
				amount: num(log.args.amount),
				depositAddress: log.args.depositAddress as `0x${string}`,
				timestamp: Number(log.args.timestamp),
				requestHash: log.args.requestHash as `0x${string}`,
				indexName: activeTicker,
			}
			positions0.push(obj)
			// setPositions(preObj => [...preObj, obj])
		})

		//store open short history
		const burnRequestLogs = await client.getLogs({
			address: exchangeAddress,
			event: parseAbiItem(
				'event Burned( uint256 indexed nonce, address indexed requester, uint256 amount, address depositAddress, uint256 timestamp, bytes32 requestHash )'
			),
			args: {
				requester: accountAddress as `0x${string}` ,
			},
			fromBlock: BigInt(0),
		})
		const userBurnRequestLogsLogs = burnRequestLogs.filter((log) => log.args.requester == accountAddress)

		userBurnRequestLogsLogs.forEach((log) => {
			const obj:Positions = {
				side: 'Burn Request',
				user: log.args.requester as `0x${string}`,
				nonce: Number(log.args.nonce),
				amount: num(log.args.amount),
				depositAddress: log.args.depositAddress as `0x${string}`,
				timestamp: Number(log.args.timestamp),
				requestHash: log.args.requestHash as `0x${string}`,
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
	}, [getHistory])

	return {
		data: positions,
		reload: getHistory,
	}
}
