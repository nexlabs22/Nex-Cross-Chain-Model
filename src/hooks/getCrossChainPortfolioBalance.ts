import { num } from './math'
import { useEffect, useState, useCallback } from 'react'
// import { useAccountAddressStore } from '@store/zustandStore'
import { createPublicClient, http, parseAbiItem } from 'viem'
import { goerli, polygonMumbai, sepolia } from 'viem/chains'
// import { getTickerFromAddress } from '../utils/general'
import { mumbaiChainSelector, mumbaiCrypto5V2IndexFactory, mumbaiCrypto5V2Vault, mumbaiWmaticAddress, sepoliaCrypto5V2Factory, zeroAddress } from '@constants/contractAddresses'
import { useAddress } from '@thirdweb-dev/react'
import { crossChainIndexFactoryV2Abi, indexFactoryV2Abi, tokenAbi } from '@/constants/abi'



export function GetCrossChainPortfolioBalance() {
	
	const [portfolioValue, setPortfolioValue] = useState<number>()

    
	const getPortfolioValue = useCallback(async () => {
		
		const sepoliaPublicClient = createPublicClient({
			chain: sepolia,
			// transport: http(`https://eth-goerli.g.alchemy.com/v2/NucIfnwc-5eXFYtxgjat7itrQPkNQsty`),
			transport: http(`https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_SEPOLIA_KEY}`),
		})

		const mumbaiPublicClient = createPublicClient({
			chain: polygonMumbai,
			// transport: http(`https://eth-goerli.g.alchemy.com/v2/NucIfnwc-5eXFYtxgjat7itrQPkNQsty`),
			transport: http(`https://rpc.ankr.com/polygon_mumbai/bf22a1af586c8f23c56205136ecbee0965c7d06d57c29d414bcd8ad877a0afc4`),
		})

		let totalPortfolioBalance: number = 0;

		const sepoliaPortfolioBalance = await sepoliaPublicClient.readContract({
			address: sepoliaCrypto5V2Factory,
			abi: crossChainIndexFactoryV2Abi,
			functionName: 'getPortfolioBalance',
		  })
		totalPortfolioBalance += Number(sepoliaPortfolioBalance)
		const totalCurrentList = await sepoliaPublicClient.readContract({
			address: sepoliaCrypto5V2Factory,
			abi: crossChainIndexFactoryV2Abi,
			functionName: 'totalCurrentList',
		  })
		
		for (let i = 0; i < Number(totalCurrentList); i++) { 
			const tokenAddress = await sepoliaPublicClient.readContract({
				address: sepoliaCrypto5V2Factory,
				abi: crossChainIndexFactoryV2Abi,
				functionName: 'currentList',
				args:[i]
			  })
			const tokenChainSelector = await sepoliaPublicClient.readContract({
				address: sepoliaCrypto5V2Factory,
				abi: crossChainIndexFactoryV2Abi,
				functionName: 'tokenChainSelector',
				args:[tokenAddress]
			})
			
			if(tokenChainSelector == mumbaiChainSelector){
				const tokenBalance = await mumbaiPublicClient.readContract({
					address: tokenAddress as `0x${string}`,
					abi: tokenAbi,
					functionName: 'balanceOf',
					args:[mumbaiCrypto5V2Vault]
				  })
				const tokenValue = await mumbaiPublicClient.readContract({
					address: mumbaiCrypto5V2IndexFactory,
					abi: indexFactoryV2Abi,
					functionName: 'getAmountOut',
					args:[tokenAddress, mumbaiWmaticAddress, tokenBalance, 3]
				})
				totalPortfolioBalance += Number(tokenValue)
				
			}
		}
		// console.log("totalPortfolioBalance", totalPortfolioBalance)
		setPortfolioValue(totalPortfolioBalance);
	}, [])

	useEffect(() => {
		getPortfolioValue()
	}, [getPortfolioValue])

	return {
		data: portfolioValue,
		reload: getPortfolioValue,
	}
}
