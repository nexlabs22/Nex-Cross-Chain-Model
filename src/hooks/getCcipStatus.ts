import { num } from './math'
import { useEffect, useState, useCallback } from 'react'
// import { useAccountAddressStore } from '@store/zustandStore'
import { createPublicClient, http, parseAbiItem } from 'viem'
import { goerli } from 'viem/chains'
// import { getTickerFromAddress } from '../utils/general'
// import { zeroAddress } from '@constants/contractAddresses'
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
	

    

	// useEffect(() => {
	const getHistory = useCallback(async () => {
		

		const client = createPublicClient({
			chain: goerli,
			// transport: http(`https://eth-goerli.g.alchemy.com/v2/NucIfnwc-5eXFYtxgjat7itrQPkNQsty`),
			transport: http(`https://eth-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`),
		})

		const positions0: Positions[] = []
		
		const mintRequestlogs = await client.getLogs({
			address: exchangeAddress,
			event: parseAbiItem(
				'event MintRequestAdd( uint256 indexed nonce, address indexed requester, uint256 amount, address depositAddress, uint256 timestamp, bytes32 requestHash )'
			),
			args: {
				// requester: accountAddress as `0x${string}` ,
			},
			fromBlock: BigInt(0),
		})
		// const userMintRequestLogs = mintRequestlogs.filter((log) => log.args.requester == accountAddress)

		
		},[])

		

    

		// setPositions(positions0)
		

	// }, [])

	// useEffect(() => {
	// 	getHistory()
	// }, [getHistory, exchangeAddress])

	// return {
	// 	data: positions,
	// 	reload: getHistory,
	// }
}
