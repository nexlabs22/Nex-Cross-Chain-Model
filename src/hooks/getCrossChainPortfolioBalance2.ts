import { useEffect, useState, useCallback } from "react"
import {
  chainSelectorAddresses,
  tokenAddresses,
} from "@/constants/contractAddresses"
import { Address, AllowedTickers, CryptoAsset } from "@/types/indexTypes"
import { useGlobal } from "@/providers/GlobalProvider"
import { getContractByNetwork } from "./getContract"
import { getContract, readContract } from "thirdweb"
import { arbitrumSepolia } from "thirdweb/chains"
import { client } from "@/utils/thirdWebClient"
import { nexTokensArray } from "@/constants/indices"


export function GetCrossChainPortfolioBalance2(
    swapFromToken: CryptoAsset,
  swapToToken: CryptoAsset
) {
  console.log('Inside GetCrossChainPortfolioBalance----->')
  const {activeChainSetting: {chainName, network}} = useGlobal()
  const [portfolioValue, setPortfolioValue] = useState<number>()
  const [portfolioValue2, setPortfolioValue2] = useState<number>()
  const allowedSymbols = nexTokensArray
  .filter((token) => token.smartContractType === "crosschain")
  .map((token) => token.symbol)

const activeTicker = [swapFromToken.symbol, swapToToken.symbol].filter(
  (symbol) => allowedSymbols.includes(symbol)
)[0]

  const getPortfolioValue = useCallback(async () => {
    console.log("inside callback function")


  console.log(activeTicker)
    
    const functionsOracleContract = activeTicker ? getContractByNetwork(activeTicker as AllowedTickers, 'functions_oracle', chainName, network) : null
    const storageContract = activeTicker ? getContractByNetwork(activeTicker as AllowedTickers, 'storage', chainName, network): null
    const arbitrumSepoliaStorageContract = activeTicker ? getContractByNetwork(activeTicker as AllowedTickers, 'storage', 'Arbitrum', 'Sepolia'): null
    console.log({functionsOracleContract})
    console.log({storageContract})
    console.log({arbitrumSepoliaStorageContract})

    if (!functionsOracleContract || !storageContract || !arbitrumSepoliaStorageContract) {
      console.log('contracts not found, returning!')
      return
    }

    let totalPortfolioBalance: number = 0
    let mainChainPortfolioBalance: number = 0
    let crossChainPortfolioBalance: number = 0

    const sepoliaPortfolioBalance = await readContract({
      contract: storageContract,      
      method: "function getPortfolioBalance() returns(uint256)",
      params: []
    })
    console.log({sepoliaPortfolioBalance})
    
    totalPortfolioBalance += Number(sepoliaPortfolioBalance)
    mainChainPortfolioBalance += Number(sepoliaPortfolioBalance)

    console.log({totalPortfolioBalance})

		const totalCurrentList = await readContract({
			contract: functionsOracleContract,
			method: 'function totalCurrentList() returns(uint256)',
			params: []
		})
		console.log({totalCurrentList})
    
    for (let i = 0; i < Number(totalCurrentList); i++) {
      const tokenAddress = await readContract({
        contract: functionsOracleContract,
				method: 'function currentList(uint256) returns(address)',
				params: [BigInt(i)]
			})
      console.log({tokenAddress})
      
			const tokenChainSelector = await readContract({
        contract: functionsOracleContract,
				method: 'function tokenChainSelector(address) returns(uint64)',
				params: [tokenAddress as Address]
			})
      console.log({tokenChainSelector})
      
      if (Number(tokenChainSelector) == Number(chainSelectorAddresses.Arbitrum?.Sepolia)) {
        const arbitrumSepoliaTokenContract = getContract({
          address: tokenAddress as Address,
          client,
          chain: arbitrumSepolia,
        })
        const tokenBalance = await readContract({
          contract: arbitrumSepoliaTokenContract,
          method: "function balanceOf(address) returns(uint256)",
          params: [tokenAddresses?.[activeTicker as AllowedTickers]?.Arbitrum?.Sepolia?.vault?.address as Address],
        })
        console.log({tokenBalance})
        
        const tokenValue = await readContract({
          contract: arbitrumSepoliaStorageContract,
          method:
          "function getAmountOut(address[], uint24[], uint256) returns (uint256)",
          params: [
            [tokenAddress as Address, tokenAddresses.WETH?.Arbitrum?.Sepolia?.token?.address as Address],
            [3000],
            tokenBalance
          ],
        })
        console.log({tokenValue})

        totalPortfolioBalance += Number(tokenValue)
        crossChainPortfolioBalance += Number(tokenValue)
      }
    }

    const ccipTokenValue = await readContract({
        contract: arbitrumSepoliaStorageContract,
        method: "function getAmountOut(address[], uint24[], uint256) returns (uint256)",
        params: [
            [
            tokenAddresses.WETH?.Arbitrum?.Sepolia?.token?.address as Address,
            tokenAddresses?.[activeTicker as AllowedTickers]?.Arbitrum?.Sepolia?.ccip?.address as Address 
            ],
            [3000],
            BigInt((crossChainPortfolioBalance).toFixed(0))
        ],
    })					  
    console.log("ccipTokenValue: ",{ccipTokenValue})
    
    const crossChainRealPortfolioBalance = await readContract({
        contract: storageContract,
        method:
              "function getAmountOut(address[], uint24[], uint256) returns (uint256)",
              params: [
                  [
                    tokenAddresses?.ANFI?.Ethereum?.Sepolia?.ccip?.address as Address,
                    tokenAddresses.WETH?.Ethereum?.Sepolia?.token?.address as Address
                ],
                  [3000],
                  ccipTokenValue
                ],
            })						
        console.log("crossChainRealPortfolioBalance: ",crossChainRealPortfolioBalance)
    // totalPortfolioBalance += Number(tokenValue)


    // console.log({totalPortfolioBalance})
    // setPortfolioValue(totalPortfolioBalance)
    // console.log({totalPortfolioBalance})
    setPortfolioValue(totalPortfolioBalance)
    setPortfolioValue2(Number(mainChainPortfolioBalance) + Number(crossChainRealPortfolioBalance))
  }, [chainName, network, activeTicker])

  useEffect(() => {
    getPortfolioValue()
  }, [getPortfolioValue])

  return {
    data: portfolioValue,
    data2: portfolioValue2,
    reload: getPortfolioValue,
  }
}