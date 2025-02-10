"use client"

import React, { createContext, useState, useEffect, useContext } from 'react'
import axios from 'axios'

import convertToUSDUni from '@/utils/convertToUSDUni'
import { sepolia } from 'thirdweb/chains'
import { client } from '@/utils/thirdWebClient'
import { getContract, readContract } from 'thirdweb'
import { Address, IndexCryptoAsset } from '@/types/indexTypes'
import { useGlobal } from './GlobalProvider'

import { get24hChange, getDecimals } from '@/utils/general'
import { nexTokensArray } from '@/constants/indices'
import { MongoDb } from '@/types/mongoDb'

interface DashboardContextProps {
	ethPriceUsd: number
	nexTokens: IndexCryptoAsset[]
}

const DashboardContext = createContext<DashboardContextProps>(({
	ethPriceUsd: 0,
	nexTokens: nexTokensArray
}))

const useDashboard = () => {
	return useContext(DashboardContext)
}

const DashboardProvider = ({ children }: { children: React.ReactNode }) => {
  const [ethPriceUsd, setEthPriceUsd] = useState<number>(0)
  const { activeChainSetting:{chain, network} } = useGlobal()

	useEffect(() => {
		async function getEthPrice() {
			const wethPriceinUsd = await axios
				.get('/api/getLatestPrice?ticker=ethereum&tableName=histcomp')
				.then((res) => res.data.price)
				.catch((err) => console.log(err))

			setEthPriceUsd(wethPriceinUsd)
		}

		getEthPrice()

	}, [])



	const [nexTokens, setNexTokens] = useState<IndexCryptoAsset[]>(nexTokensArray);


  useEffect(() => {
    async function fetchIndexesData() {
      const nexTokens = await Promise.all(
        nexTokensArray.map(async (token) => {
          try {
            const { index, decimals } = {
              index: token.tokenAddresses?.[chain]?.[network]?.token?.address,
              decimals: getDecimals(
                token.tokenAddresses?.Ethereum?.Sepolia?.token
              ),
            }

						// Fetch market price in USD
						const marketPriceUSD = await convertToUSDUni(
							index as Address,
							decimals,
							ethPriceUsd,
							network
						);

						// Fetch contract instance
						const contract = getContract({
							address: index as string,
							chain: sepolia, // Assuming `sepolia` is defined
							client,
						});

						// Fetch fee rate
						const feeRateRaw = await readContract({
							contract,
							method: "function feeRatePerDayScaled() returns (uint256)",
							params: [],
						});
						const managementFee = feeRateRaw ? Number(feeRateRaw) / 1e18 : 0;

						// Fetch total supply
						const totalSupplyRaw = await readContract({
							contract,
							method: "function totalSupply() returns (uint256)",
							params: [],
						});
						const totalSupply = totalSupplyRaw ? Number(totalSupplyRaw) / 1e18 : 0;
						const price = marketPriceUSD !== Infinity ? Number(marketPriceUSD) : 0

						const filter = {
							ticker: token.symbol
						  }
			
						const historicalPrice: MongoDb[] = await axios.post(`/api/chart-data`,filter).then((res)=> res.data.data).catch(err=> console.log(err));
						const { change24h, change24hPer} = get24hChange(historicalPrice)

						// Construct the enhanced token object
						return {
							...token,
							marketInfo: {
								...token.marketInfo,																							
								change24h,
								change24hPer,
								marketCap: totalSupply * price
							},
							smartContractInfo:{
								...token.smartContractInfo,
								poolPrice: price,
								managementFee,
								totalSupply
							},
							historicalPrice
						};
					} catch (error) {
						console.error(`Error fetching data for token: ${token.symbol}`, error);
						return token;
					}
				})
			);

			setNexTokens(nexTokens)

		}

    fetchIndexesData()
  }, [ethPriceUsd,chain, network])

	const contextValue = {
		ethPriceUsd,
		nexTokens,
	}
	return <DashboardContext.Provider value={contextValue}>{children}</DashboardContext.Provider>
}

export { DashboardContext, DashboardProvider, useDashboard }
