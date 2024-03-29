import { num } from './math'
import { useEffect, useState, useCallback } from 'react'
// import { useAccountAddressStore } from '@store/zustandStore'
import { createPublicClient, http, parseAbiItem } from 'viem'
import { arbitrumSepolia, goerli, sepolia } from 'viem/chains'
// import { getTickerFromAddress } from '../utils/general'
import { factoryAddresses, goerliAnfiV2Factory, goerliCrypto5Factory, zeroAddress } from '@constants/contractAddresses'
import { useAddress } from '@thirdweb-dev/react'
import { Positions } from '@/types/tradeTableTypes'
import { getCCIPStatusById } from './getCcipStatusModelById'
import { crossChainIndexFactoryV2Abi, indexFactoryV2Abi } from '@/constants/abi'

export interface Positions1 {
	side: string;
	user: `0x${string}` | string;
	tokenAddress: `0x${string}` | string;
	timestamp: number;
	inputAmount: number;
	outputAmount: number;
	indexName: string;
	txHash: string;
	messageId?: string;
	nonce?: number;
	sendStatus?: string;
	receiveStatus?: string;
}

const sepoliaCrypto5V2Factory = "0xCd16eDa751CcC77f780E06B7Af9aeD0E90a51586"

// export function GetPositionsHistory2(exchangeAddress: `0x${string}`, activeTicker: string) {
export function GetRequestHistory() {
	// const accountAddress = useAccountAddressStore((state) => state.accountAddress)
	// if(!exchangeAddress) return;

	const [accountAddress, setAccountAddress] = useState<`0x${string}` | string>()
	const address = useAddress()

	const [positions, setPositions] = useState<Positions[]>([])

    const factoryAddresses0 =  {'CRYPTO5': sepoliaCrypto5V2Factory }

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
		const client2 = createPublicClient({
			chain: arbitrumSepolia,
			// transport: http(`https://eth-goerli.g.alchemy.com/v2/NucIfnwc-5eXFYtxgjat7itrQPkNQsty`),
			transport: http(`https://arb-sepolia.g.alchemy.com/v2/Go-5TbveGF0JbuWNP4URPr5cm5xgIKCy`),
		})

		const positions0: Positions[] = []
		// return;
		if (!accountAddress) return
		//store open long history
		// console.log(exchangeAddress)
		for (const [key, value] of Object.entries(factoryAddresses0)) {
			// if (!accountAddress || exchangeAddress === zeroAddress || !exchangeAddress) return
			
			const mintRequestlogs = await client.getLogs({
				address: value as `0x${string}`,
				event: parseAbiItem(
					// 'event MintRequestAdd( uint256 indexed nonce, address indexed requester, uint256 amount, address depositAddress, uint256 timestamp, bytes32 requestHash )'
					// 'event Issuanced(address indexed user, address indexed inputToken, uint inputAmount, uint outputAmount, uint time)'
					'event RequestIssuance(bytes32 indexed messageId, uint indexed nonce, address indexed user, address inputToken, uint inputAmount, uint outputAmount, uint time)'
				),
				args: {
					user: accountAddress as `0x${string}`,
				},
				fromBlock: BigInt(0),
			})
			const userMintRequestLogs: any = mintRequestlogs.filter((log) => log.args.user == accountAddress)
			userMintRequestLogs.forEach(async (log: any) => {
				// console.log(log)
                
                const sendStatus = await getCCIPStatusById(log.args.messageId, "ethereumSepolia", "arbitrumSepolia")
                let receiveStatus = ""
                if(sendStatus == "SUCCESS"){
                    const messageId = await client2.readContract({
                        address: "0xeB08A8CA65Bc5f5dD4D54841a55bb6949fab3548",
                        // abi: indexFactoryV2Abi,
                        abi: crossChainIndexFactoryV2Abi,
                        functionName: 'issuanceMessageIdByNonce',
                        args:[log.args.nonce]
                      })
                      receiveStatus = await getCCIPStatusById(messageId as string, "arbitrumSepolia", "ethereumSepolia") as string
                }
				const obj: Positions1 = {
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
                    receiveStatus
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
					'event RequestRedemption(bytes32 indexed messageId, uint indexed nonce, address indexed user, address outputToken, uint inputAmount, uint outputAmount, uint time)'
				),
				args: {
					user: accountAddress as `0x${string}`,
				},
				fromBlock: BigInt(0),
			})
			const userBurnRequestLogsLogs = burnRequestLogs.filter((log) => log.args.user == accountAddress)

			userBurnRequestLogsLogs.forEach(async (log) => {
                const sendStatus = await getCCIPStatusById(log.args.messageId as `0x${string}`, "ethereumSepolia", "arbitrumSepolia")
                let receiveStatus = ""
                if(sendStatus == "SUCCESS"){
                    const messageId = await client2.readContract({
                        address: "0xeB08A8CA65Bc5f5dD4D54841a55bb6949fab3548",
                        abi: indexFactoryV2Abi,
                        functionName: 'redemptionMessageIdByNonce',
                        args:[log.args.nonce]
                      })
                      receiveStatus = await getCCIPStatusById(messageId as string, "arbitrumSepolia", "ethereumSepolia") as string
                }
				const obj: Positions1 = {
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
                    sendStatus,
                    receiveStatus
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
        // console.log("CR5 requests:", sortedPositionsData)
		setPositions(sortedPositionsData)
	}, [accountAddress])

	useEffect(() => {

		getHistory()
	}, [getHistory])

    // useEffect(() => {
    //     console.log("CR5 requests:", positions)
    // },[positions])
	return {
		data: positions,
		reload: getHistory,
	}
}
