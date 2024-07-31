import { num } from './math'
import { useEffect, useState, useCallback } from 'react'
// import { useAccountAddressStore } from '@store/zustandStore'
import { createPublicClient, http, parseAbiItem } from 'viem'
import { arbitrumSepolia, goerli, polygonMumbai, sepolia } from 'viem/chains'
// import { getTickerFromAddress } from '../utils/general'
import { arbitrumSepoliaChainSelector, arbitrumSepoliaCrossChainTokenAddress, arbitrumSepoliaWethAddress, arbtirumSepoliaCR5CrossChainFactory, mumbaiChainSelector, mumbaiCrossChainTokenAddress, mumbaiCrypto5V2IndexFactory, mumbaiCrypto5V2Vault, mumbaiWmaticAddress, sepoliaCR5FactoryStorage, sepoliaCrossChainTokenAddress, sepoliaCrypto5V2Factory, sepoliaWethAddress, zeroAddress } from '@constants/contractAddresses'
import { useAddress } from '@thirdweb-dev/react'
import { crossChainFactoryStorageAbi, crossChainIndexFactoryV2Abi, indexFactoryV2Abi, tokenAbi } from '@/constants/abi'
import { getClient } from '@/app/api/client'



export async function getNewCrossChainPortfolioBalance(totalPortfolioValue:number, wethAmount: number) {
	
		
		const sepoliaPublicClient = getClient('sepolia')
		const arbitrumSepoliaPublicClient = getClient('arbitrumSepolia')
		
		// const mumbaiPublicClient = createPublicClient({
		// 	chain: polygonMumbai,
		// 	// transport: http(`https://eth-goerli.g.alchemy.com/v2/NucIfnwc-5eXFYtxgjat7itrQPkNQsty`),
		// 	transport: http(`https://rpc.ankr.com/polygon_mumbai/bf22a1af586c8f23c56205136ecbee0965c7d06d57c29d414bcd8ad877a0afc4`),
		// })

		let totalPortfolioBalance: number = totalPortfolioValue;

		// const sepoliaPortfolioBalance = await sepoliaPublicClient.readContract({
		// 	address: sepoliaCrypto5V2Factory,
		// 	abi: crossChainIndexFactoryV2Abi,
		// 	functionName: 'getPortfolioBalance',
		//   })
		// totalPortfolioBalance += Number(sepoliaPortfolioBalance)
		const totalCurrentList = await sepoliaPublicClient.readContract({
			address: sepoliaCR5FactoryStorage,
			abi: crossChainFactoryStorageAbi,
			functionName: 'totalCurrentList',
		  })
		
		for (let i = 0; i < Number(totalCurrentList); i++) { 
			const tokenAddress = await sepoliaPublicClient.readContract({
				address: sepoliaCR5FactoryStorage,
				abi: crossChainFactoryStorageAbi,
				functionName: 'currentList',
				args:[i]
			  })
			const tokenChainSelector = await sepoliaPublicClient.readContract({
				address: sepoliaCR5FactoryStorage,
				abi: crossChainFactoryStorageAbi,
				functionName: 'tokenChainSelector',
				args:[tokenAddress]
			})
			const tokenMarketShare = await sepoliaPublicClient.readContract({
				address: sepoliaCR5FactoryStorage,
				abi: crossChainFactoryStorageAbi,
				functionName: 'tokenCurrentMarketShare',
				args:[tokenAddress]
			})
			
			if(tokenChainSelector == arbitrumSepoliaChainSelector){
				// const tokenBalance = await mumbaiPublicClient.readContract({
				// 	address: tokenAddress as `0x${string}`,
				// 	abi: tokenAbi,
				// 	functionName: 'balanceOf',
				// 	args:[mumbaiCrypto5V2Vault]
				//   })
				const crossChainValue = await sepoliaPublicClient.readContract({
					address: sepoliaCrypto5V2Factory,
					abi: indexFactoryV2Abi,
					functionName: 'getAmountOut',
					args:[sepoliaWethAddress, sepoliaCrossChainTokenAddress, (wethAmount*Number(tokenMarketShare)/100e18).toFixed(0), 3]
				})
				const tokenValue = await arbitrumSepoliaPublicClient.readContract({
					address: arbtirumSepoliaCR5CrossChainFactory,
					abi: indexFactoryV2Abi,
					functionName: 'getAmountOut',
					args:[arbitrumSepoliaCrossChainTokenAddress, arbitrumSepoliaWethAddress, crossChainValue, 3]
				})
				totalPortfolioBalance += Number(tokenValue)
				
			}else{
                totalPortfolioBalance += wethAmount*Number(tokenMarketShare)/100e18
            }
		}
		// console.log("totalPortfolioBalance", totalPortfolioBalance)
		return totalPortfolioBalance;
}
