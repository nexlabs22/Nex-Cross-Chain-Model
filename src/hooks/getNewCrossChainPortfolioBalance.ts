import { crossChainFactoryStorageAbi, indexFactoryV2Abi } from '@/constants/abi'
import { chainSelectorAddresses, tokenAddresses } from '@/constants/contractAddresses';
import { useGlobal } from '@/providers/GlobalProvider';
import { Address } from '@/types/indexTypes';
import { getClient } from '@/utils/getRPCClient'
import { useCallback, useEffect, useState } from 'react';
import { PublicClient } from 'viem'

export function GetNewCrossChainPortfolioBalance(totalPortfolioValue: number, wethAmount: number) {

	const { activeChainSetting: { chain, network } } = useGlobal()
	const [portfolioValue, setPortfolioValue] = useState(0)

	const getPortfolioValue = useCallback(async () => {
		const sepoliaPublicClient = getClient('Ethereum', 'Sepolia')
		const arbitrumSepoliaPublicClient = getClient('Arbitrum', 'Sepolia')

		let totalPortfolioBalance: number = totalPortfolioValue;

		const totalCurrentList = await (sepoliaPublicClient as PublicClient).readContract({
			address: tokenAddresses.CRYPTO5?.[chain]?.[network]?.storage?.address as Address,
			abi: crossChainFactoryStorageAbi,
			functionName: 'totalCurrentList',
		})

		for (let i = 0; i < Number(totalCurrentList); i++) {
			const tokenAddress = await (sepoliaPublicClient as PublicClient).readContract({
				address: tokenAddresses.CRYPTO5?.[chain]?.[network]?.storage?.address as Address,
				abi: crossChainFactoryStorageAbi,
				functionName: 'currentList',
				args: [i]
			})
			const tokenChainSelector = await (sepoliaPublicClient as PublicClient).readContract({
				address: tokenAddresses.CRYPTO5?.[chain]?.[network]?.storage?.address as Address,
				abi: crossChainFactoryStorageAbi,
				functionName: 'tokenChainSelector',
				args: [tokenAddress]
			})
			const tokenMarketShare = await (sepoliaPublicClient as PublicClient).readContract({
				address: tokenAddresses.CRYPTO5?.[chain]?.[network]?.storage?.address as Address,
				abi: crossChainFactoryStorageAbi,
				functionName: 'tokenCurrentMarketShare',
				args: [tokenAddress]
			})

			if (tokenChainSelector == chainSelectorAddresses.Arbitrum?.Sepolia) {
				const crossChainValue = await (sepoliaPublicClient as PublicClient).readContract({
					address: tokenAddresses.CRYPTO5?.[chain]?.[network]?.factory?.address as Address,
					abi: indexFactoryV2Abi,
					functionName: 'getAmountOut',
					args: [tokenAddresses.WETH?.[chain]?.[network]?.token?.address, tokenAddresses.CRYPTO5?.[chain]?.[network]?.ccip?.address as Address, (wethAmount * Number(tokenMarketShare) / 100e18).toFixed(0), 3]
				})
				const tokenValue = await (arbitrumSepoliaPublicClient as PublicClient).readContract({
					address: tokenAddresses.CRYPTO5?.Arbitrum?.Sepolia?.factory?.address as Address,
					abi: indexFactoryV2Abi,
					functionName: 'getAmountOut',
					args: [tokenAddresses.CRYPTO5?.Arbitrum?.Sepolia?.ccip?.address, tokenAddresses.WETH?.Arbitrum?.Sepolia?.token?.address, crossChainValue, 3]
				})
				totalPortfolioBalance += Number(tokenValue)

			} else {
				totalPortfolioBalance += wethAmount * Number(tokenMarketShare) / 100e18
			}
		}
		setPortfolioValue(totalPortfolioBalance)
	},[chain, network, totalPortfolioValue, wethAmount])

	  useEffect(() => {
		getPortfolioValue()
	  }, [getPortfolioValue])
	
	  return {
		portfolioValue
	  }

}
