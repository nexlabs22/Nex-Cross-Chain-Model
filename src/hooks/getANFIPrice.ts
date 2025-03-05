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


export function GetANFIPrice(
) {

  const {activeChainSetting: {chainName, network}} = useGlobal()
  const [price, setPrice] = useState<number>()
  const [portfolioValue, setPortfolioValue] = useState<number>()
  const [portfolioValue2, setPortfolioValue2] = useState<number>()
  
  let totalPortfolioBalance: number = 0
  let mainChainPortfolioBalance: number = 0
  let crossChainPortfolioBalance: number = 0
  
  const usdtAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7"; // Ethereum Xaut
  const sideChain = sideChainMap['Arbitrum']?.['Mainnet']?.['ANFI']
  const indexTokenContract = getContractByNetwork('ANFI', 'token', 'Arbitrum', 'Mainnet');
  const storageContract = getContractByNetwork('ANFI', 'storage', 'Arbitrum', 'Mainnet');
  const functionsOracleContract = getContractByNetwork('ANFI', 'functions_oracle', 'Arbitrum', 'Mainnet');
  
  const sideChainStorageContract = getContractByNetwork("ANFI", 'storage', 'Ethereum', 'Mainnet');

    const getPortfolioValue = useCallback(async () => {
        if (!storageContract || !sideChainStorageContract || !functionsOracleContract || !sideChain || !indexTokenContract) {
        console.log('contracts not found, returning!')
        return
        }
    
        const totalSupply = await readContract({
        contract: indexTokenContract,
        method: "function totalSupply() returns(uint256)",
        params: []
        })

        console.log("TOTAL SUPPLY", totalSupply)

        const portfolioBalance = await readContract({
        contract: storageContract,      
        method: "function getPortfolioBalance() returns(uint256)",
        params: []
        })
        
        console.log("PORTFOLIO BALANCE", portfolioBalance)

        const ethPrice = await readContract({
        contract: storageContract,
        method: "function priceInWei() returns(uint256)",
        params: []
        })

        console.log("ETH PRICE", ethPrice)


        totalPortfolioBalance += Number(portfolioBalance)*Number(ethPrice)/1e18;
        mainChainPortfolioBalance += Number(portfolioBalance)*Number(ethPrice)/1e18;

        const totalCurrentList = await readContract({
			contract: functionsOracleContract,
			method: 'function totalCurrentList() returns(uint256)',
			params: []
		})

        console.log("TOTAL CURRENT LIST", totalCurrentList)
    
    for (let i = 0; i < Number(totalCurrentList); i++) {
      const tokenAddress = await readContract({
        contract: functionsOracleContract,
				method: 'function currentList(uint256) returns(address)',
				params: [BigInt(i)]
			})
            
            console.log("TOKEN ADDRESS", tokenAddress)
			const tokenChainSelector = await readContract({
        contract: functionsOracleContract,
				method: 'function tokenChainSelector(address) returns(uint64)',
				params: [tokenAddress as Address]
			})      
            
            console.log("TOKEN CHAIN SELECTOR", tokenChainSelector)
      
      if (Number(tokenChainSelector) == Number(chainSelectorAddresses?.['Ethereum']?.['Mainnet'])) {
        const sideChainTokenContract = getContract({
          address: tokenAddress as Address,
          client,
          chain: sideChain.chain,
        })
        const tokenBalance = await readContract({
          contract: sideChainTokenContract,
          method: "function balanceOf(address) returns(uint256)",
          params: [tokenAddresses?.['ANFI']?.[sideChain.chainName]?.[sideChain.network]?.vault?.address as Address],
        })        

        console.log("TOKEN BALANCE", tokenBalance)
        
        let tokenValue;
        if(tokenAddress == tokenAddresses.WETH?.[sideChain.chainName]?.[sideChain.network]?.token?.address){
          tokenValue = tokenBalance
        } else {
        tokenValue = await readContract({
          contract: sideChainStorageContract,
          method:
          "function getAmountOut(address[], uint24[], uint256) returns (uint256)",
          params: [
            [tokenAddress as Address, usdtAddress, tokenAddresses.WETH?.[sideChain.chainName]?.[sideChain.network]?.token?.address as Address],
            [3000, 500],
            tokenBalance
          ],
        })
        }      
        
        console.log("TOKEN VALUE", tokenValue)

        totalPortfolioBalance += Number(tokenValue)*Number(ethPrice)/1e18;
        crossChainPortfolioBalance += Number(tokenValue)*Number(ethPrice)/1e18;

        console.log("TOTAL PORTFOLIO BALANCE", totalPortfolioBalance)
        console.log("MAIN CHAIN PORTFOLIO BALANCE", mainChainPortfolioBalance)
        console.log("CROSS CHAIN PORTFOLIO BALANCE", crossChainPortfolioBalance)
      }
    }
    
    setPrice((totalPortfolioBalance*1e18)/Number(totalSupply))
    setPortfolioValue(totalPortfolioBalance)
    setPortfolioValue2(Number(mainChainPortfolioBalance) + Number(crossChainPortfolioBalance))

    console.log("PRICE", price)
    console.log("PORTFOLIO VALUE", portfolioValue)
    console.log("PORTFOLIO VALUE 2", portfolioValue2)

    }, [storageContract, sideChainStorageContract])

    useEffect(() => {
        getPortfolioValue()
    }, [getPortfolioValue])

  return {
    data: portfolioValue,
    data2: portfolioValue2,
    price,
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


