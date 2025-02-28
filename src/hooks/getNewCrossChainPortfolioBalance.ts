// import { crossChainFactoryStorageAbi, indexFactoryV2Abi } from '@/constants/abi'
import { chainSelectorAddresses, tokenAddresses } from '@/constants/contractAddresses';
// import { useGlobal } from '@/providers/GlobalProvider';
import { Address, AllowedTickers, Chains, Networks } from '@/types/indexTypes';
// import { getClient } from '@/utils/getRPCClient'
// import { useCallback, useEffect, useState } from 'react';
import { readContract } from 'thirdweb';
// import { PublicClient } from 'viem'
import {getContractByNetwork} from './getContract';

export async function getNewCrossChainPortfolioBalance(totalPortfolioValue: number, wethAmount: number, chainName: Chains, network: Networks, activeTicker: string) {
	
	console.log({activeTicker})
	const functionsOracleContract = getContractByNetwork(activeTicker as AllowedTickers, 'functions_oracle', chainName, network)
	const storageContract = getContractByNetwork(activeTicker  as AllowedTickers, 'storage', chainName, network)
	const arbitrumSepoliaStorageContract = getContractByNetwork(activeTicker  as AllowedTickers, 'storage', 'Arbitrum', 'Sepolia')

	if(!functionsOracleContract || !storageContract) return 0	

		let totalPortfolioBalance: number = totalPortfolioValue;

		const totalCurrentList = await readContract({
			contract: functionsOracleContract,
			method: 'function totalCurrentList() returns(uint256)',
			params: []
		})		
		console.log("new: ",{totalCurrentList})

		for (let i = 0; i < Number(totalCurrentList); i++) {
			const tokenAddress = await readContract({
				contract: functionsOracleContract,
				method: 'function currentList(uint256) returns(address)',
				params: [BigInt(i)]
			})			
			console.log("new: ",{tokenAddress})
			const tokenChainSelector = await readContract({
				contract: functionsOracleContract,
				method: 'function tokenChainSelector(address) returns(uint64)',
				params: [tokenAddress as Address]
			})			
			console.log("new: ",{tokenChainSelector})
			const tokenMarketShare = await readContract({
				contract: functionsOracleContract,
				method: 'function tokenCurrentMarketShare(address) returns(uint256)',
				params: [tokenAddress as Address]
			})			
			console.log("new: ",{tokenMarketShare})
			
			if (Number(tokenChainSelector) == Number(chainSelectorAddresses.Arbitrum?.Sepolia) && arbitrumSepoliaStorageContract) {
				
				const crossChainValue = await readContract({
					contract: storageContract,
					method:
					"function getAmountOut(address[], uint24[], uint256) returns (uint256)",
					params: [
						[
						tokenAddresses.WETH?.[chainName]?.[network]?.token?.address as Address,
						tokenAddresses?.[activeTicker as AllowedTickers]?.[chainName]?.[network]?.ccip?.address as Address ],
						[3000],
						BigInt((wethAmount * Number(tokenMarketShare) / 100e18).toFixed(0))
					],
				})					  
				console.log("new: ",{crossChainValue})
				
				const tokenValue = await readContract({
					contract: arbitrumSepoliaStorageContract,
					method:
						  "function getAmountOut(address[], uint24[], uint256) returns (uint256)",
						  params: [
							  [
								tokenAddresses?.[activeTicker as AllowedTickers]?.Arbitrum?.Sepolia?.ccip?.address as Address,
							   tokenAddresses.WETH?.Arbitrum?.Sepolia?.token?.address as Address
							],
							  [3000],
							  crossChainValue
							],
						})						
						console.log("new: ",{tokenValue})
				totalPortfolioBalance += Number(tokenValue)

			} else {
				totalPortfolioBalance += wethAmount * Number(tokenMarketShare) / 100e18
			}
		}
console.log({totalPortfolioBalance})
		return totalPortfolioBalance

}
