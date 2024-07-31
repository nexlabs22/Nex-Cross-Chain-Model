import { num } from './math'
import { useEffect, useState, useCallback } from 'react'
// import { useAccountAddressStore } from '@store/zustandStore'
import { createPublicClient, http, parseAbiItem } from 'viem'
import { goerli, polygonMumbai, arbitrumSepolia, sepolia } from 'viem/chains'
// import { getTickerFromAddress } from '../utils/general'
import {
	arbitrumSepoliaChainSelector,
	arbitrumSepoliaCrypto5V2Vault,
	arbitrumSepoliaWethAddress,
	arbtirumSepoliaCR5CrossChainFactory,
	mumbaiChainSelector,
	mumbaiCrypto5V2IndexFactory,
	mumbaiCrypto5V2Vault,
	mumbaiWmaticAddress,
	sepoliaCR5FactoryStorage,
	sepoliaCrypto5V2Factory,
	zeroAddress,
} from '@constants/contractAddresses'
import { useAddress } from '@thirdweb-dev/react'
import { crossChainFactoryStorageAbi, crossChainIndexFactoryV2Abi, indexFactoryV2Abi, tokenAbi } from '@/constants/abi'
import { getClient } from '@/app/api/client'

export function GetCrossChainPortfolioBalance() {
	const [portfolioValue, setPortfolioValue] = useState<number>()

	const getPortfolioValue = useCallback(async () => {

		const sepoliaPublicClient = getClient('sepolia')
		const arbitrumSepoliaPublicClient = getClient('arbitrumSepolia')

		// const mumbaiPublicClient = createPublicClient({
		// 	chain: polygonMumbai,
		// 	// transport: http(`https://eth-goerli.g.alchemy.com/v2/NucIfnwc-5eXFYtxgjat7itrQPkNQsty`),
		// 	transport: http(`https://rpc.ankr.com/polygon_mumbai/bf22a1af586c8f23c56205136ecbee0965c7d06d57c29d414bcd8ad877a0afc4`),
		// })

		let totalPortfolioBalance: number = 0

		const sepoliaPortfolioBalance = await sepoliaPublicClient.readContract({
			address: sepoliaCrypto5V2Factory,
			abi: crossChainIndexFactoryV2Abi,
			functionName: 'getPortfolioBalance',
		})
		totalPortfolioBalance += Number(sepoliaPortfolioBalance)
		const totalCurrentList = await sepoliaPublicClient.readContract({
			address: sepoliaCR5FactoryStorage,
			abi: crossChainFactoryStorageAbi,
			// address: sepoliaCrypto5V2Factory,
			// abi: crossChainIndexFactoryV2Abi,
			functionName: 'totalCurrentList',
		})

		for (let i = 0; i < Number(totalCurrentList); i++) {
			const tokenAddress = await sepoliaPublicClient.readContract({
				// abi: crossChainIndexFactoryV2Abi,
				// address: sepoliaCrypto5V2Factory,
				address: sepoliaCR5FactoryStorage,
				abi: crossChainFactoryStorageAbi,
				functionName: 'currentList',
				args: [i],
			})
			const tokenChainSelector = await sepoliaPublicClient.readContract({
				// address: sepoliaCrypto5V2Factory,
				// abi: crossChainIndexFactoryV2Abi,
				address: sepoliaCR5FactoryStorage,
				abi: crossChainFactoryStorageAbi,
				functionName: 'tokenChainSelector',
				args: [tokenAddress],
			})

			if (tokenChainSelector == arbitrumSepoliaChainSelector) {
				const tokenBalance = await arbitrumSepoliaPublicClient.readContract({
					address: tokenAddress as `0x${string}`,
					abi: tokenAbi,
					functionName: 'balanceOf',
					args: [arbitrumSepoliaCrypto5V2Vault],
				})
				const tokenValue = await arbitrumSepoliaPublicClient.readContract({
					// address: mumbaiCrypto5V2IndexFactory,
					// abi: indexFactoryV2Abi,
					address: arbtirumSepoliaCR5CrossChainFactory,
					abi: indexFactoryV2Abi,
					functionName: 'getAmountOut',
					args: [tokenAddress, arbitrumSepoliaWethAddress, tokenBalance, 3],
				})
				totalPortfolioBalance += Number(tokenValue)
			}
		}
		// console.log("totalPortfolioBalance", totalPortfolioBalance)
		setPortfolioValue(totalPortfolioBalance)
	}, [])

	useEffect(() => {
		getPortfolioValue()
	}, [getPortfolioValue])

	return {
		data: portfolioValue,
		reload: getPortfolioValue,
	}
}
