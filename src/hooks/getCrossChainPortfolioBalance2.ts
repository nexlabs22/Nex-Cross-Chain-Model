import { useEffect, useState, useCallback } from "react"
import {
  chainSelectorAddresses,
  tokenAddresses,
} from "@/constants/contractAddresses"
import { Address, AllowedTickers, CryptoAsset, NexIndices } from "@/types/indexTypes"
import { useGlobal } from "@/providers/GlobalProvider"
import { getContractByNetwork } from "./getContract"
import { getContract, readContract } from "thirdweb"
import { client } from "@/utils/thirdWebClient"
import { nexTokensArray } from "@/constants/indices"
import { sideChainMap } from "@/utils/mappings"


export function GetCrossChainPortfolioBalance2(
    swapFromToken: CryptoAsset,
  swapToToken: CryptoAsset
) {
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
    
    const sideChain = activeTicker ? sideChainMap[chainName]?.[network]?.[activeTicker as NexIndices]: null
    const functionsOracleContract = activeTicker ? getContractByNetwork(activeTicker as AllowedTickers, 'functions_oracle', chainName, network) : null
    const storageContract = activeTicker ? getContractByNetwork(activeTicker as AllowedTickers, 'storage', chainName, network): null
    const sideChainStorageContract = activeTicker && sideChain ? getContractByNetwork(activeTicker as AllowedTickers, 'storage', sideChain?.chainName, sideChain?.network): null


    if (!functionsOracleContract || !storageContract || !sideChainStorageContract) {
      console.log('contracts not found, returning!')
      return
    }

    if( !sideChain){
      console.log('No side chain found, retunring')
      return 
    }

    let totalPortfolioBalance: number = 0
    let mainChainPortfolioBalance: number = 0
    let crossChainPortfolioBalance: number = 0

    const portfolioBalance = await readContract({
      contract: storageContract,      
      method: "function getPortfolioBalance() returns(uint256)",
      params: []
    })
    
    totalPortfolioBalance += Number(portfolioBalance)
    mainChainPortfolioBalance += Number(portfolioBalance)

		const totalCurrentList = await readContract({
			contract: functionsOracleContract,
			method: 'function totalCurrentList() returns(uint256)',
			params: []
		})
    
    for (let i = 0; i < Number(totalCurrentList); i++) {
      const tokenAddress = await readContract({
        contract: functionsOracleContract,
				method: 'function currentList(uint256) returns(address)',
				params: [BigInt(i)]
			})
      
			const tokenChainSelector = await readContract({
        contract: functionsOracleContract,
				method: 'function tokenChainSelector(address) returns(uint64)',
				params: [tokenAddress as Address]
			})      
      
      if (Number(tokenChainSelector) == Number(chainSelectorAddresses?.[sideChain.chainName]?.[sideChain.network])) {
        const sideChainTokenContract = getContract({
          address: tokenAddress as Address,
          client,
          chain: sideChain.chain,
        })
        const tokenBalance = await readContract({
          contract: sideChainTokenContract,
          method: "function balanceOf(address) returns(uint256)",
          params: [tokenAddresses?.[activeTicker as AllowedTickers]?.[sideChain.chainName]?.[sideChain.network]?.vault?.address as Address],
        })        
        
        const tokenValue = await readContract({
          contract: sideChainStorageContract,
          method:
          "function getAmountOut(address[], uint24[], uint256) returns (uint256)",
          params: [
            [tokenAddress as Address, tokenAddresses.WETH?.[sideChain.chainName]?.[sideChain.network]?.token?.address as Address],
            [3000],
            tokenBalance
          ],
        })        

        totalPortfolioBalance += Number(tokenValue)
        crossChainPortfolioBalance += Number(tokenValue)
      }
    }

    const ccipTokenValue = await readContract({
        contract: sideChainStorageContract,
        method: "function getAmountOut(address[], uint24[], uint256) returns (uint256)",
        params: [
            [
            tokenAddresses.WETH?.[sideChain.chainName]?.[sideChain.network]?.token?.address as Address,
            tokenAddresses?.[activeTicker as AllowedTickers]?.[sideChain.chainName]?.[sideChain.network]?.ccip?.address as Address 
            ],
            [3000],
            BigInt((crossChainPortfolioBalance).toFixed(0))
        ],
    })				  
    
    const crossChainRealPortfolioBalance = await readContract({
        contract: storageContract,
        method:
              "function getAmountOut(address[], uint24[], uint256) returns (uint256)",
              params: [
                  [
                    tokenAddresses?.[activeTicker as AllowedTickers]?.[chainName]?.[network]?.ccip?.address as Address,
                    tokenAddresses.WETH?.[chainName]?.[network]?.token?.address as Address
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

//Testnet
//Mainchain - Ethereum Sepolia - ANFI, CR5
//Second chain - Arbitrum Sepolia - ANFI , CR5

//Mainnet
// Mainchain - Arbitrum - ANFI, CR5
// Sidechain - Ethereum Mainnet - ANFI
// Sidechain - Binance Mainnet - CR5


