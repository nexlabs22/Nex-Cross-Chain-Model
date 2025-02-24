"use client"

import React, { createContext, useState, useEffect, useContext } from "react"
import axios from "axios"

import convertToUSDUni from "@/utils/convertToUSDUni"
import { client } from "@/utils/thirdWebClient"
import { getContract, readContract } from "thirdweb"
import { Address, IndexCryptoAsset } from "@/types/indexTypes"
import { useGlobal } from "./GlobalProvider"

import { getDecimals } from "@/utils/general"
import { nexTokensArray } from "@/constants/indices"
import { DailyAsset } from "@/types/mongoDb"

interface DashboardContextProps {
  ethPriceUsd: number
  nexTokens: IndexCryptoAsset[]
  historicalPrices: DailyAsset[]
  loadingHistoricalPrices: boolean
}

const DashboardContext = createContext<DashboardContextProps>({
  ethPriceUsd: 0,
  nexTokens: nexTokensArray,
  historicalPrices: [],
  loadingHistoricalPrices: true,
})

const useDashboard = () => {
  return useContext(DashboardContext)  
}

const DashboardProvider = ({ children }: { children: React.ReactNode }) => {
  const [ethPriceUsd, setEthPriceUsd] = useState<number>(0)
  const [nexTokens, setNexTokens] = useState<IndexCryptoAsset[]>(nexTokensArray)
  const [historicalPrices, setHistoricalPrices] = useState<DailyAsset[]>([])
  const [loadingHistoricalPrices, setLoadingHistoricalPrices] =
    useState<boolean>(true)

  const { activeChainSetting, activeThirdWebChain } = useGlobal()
  const { chainName, network } = activeChainSetting

  useEffect(() => {
    async function getEthPrice() {
      try {
        const response = await axios.get(
          "/api/getLatestPrice?ticker=ethereum&tableName=histcomp"
        )
        const wethPriceinUsd = response.data.price
        setEthPriceUsd(wethPriceinUsd)
        console.log(wethPriceinUsd, "wethPriceinUsd")
      } catch (error) {
        console.error("Error fetching ETH price:", error)
      }
    }

    getEthPrice()
  }, [])

  useEffect(() => {
    async function fetchHistoricalPrices() {
      try {
        const data = await fetch("/api/chart-data/assets", {
          headers: {
            Accept: "application/json",
          },
        })
        const response = await data.json()
        // console.log(response, "response")
        setHistoricalPrices(response.data)
      } catch (error) {
        console.error("Error fetching historical prices:", error)
      } finally {
        setLoadingHistoricalPrices(false)
      }
    }

    fetchHistoricalPrices()
  }, [])

  useEffect(() => {
    console.log("fetching indexes data")
    async function fetchIndexesData() {
      try {
        const nexTokens = await Promise.all(
          nexTokensArray.map(async (token) => {
            try {
              const { index, decimals } = {
                index: token.tokenAddresses?.[chainName]?.[network]?.token?.address,
                decimals: getDecimals(
                  token.tokenAddresses?.Ethereum?.Sepolia?.token
                ),
              }

              const marketPriceUSD = await convertToUSDUni(
                index as Address,
                decimals,
                ethPriceUsd || 0,
                activeChainSetting
              )

              const contract = getContract({
                address: index as string,
                chain: activeThirdWebChain,
                client,
              })

              const [feeRateRaw, totalSupplyRaw] = await Promise.all([
                readContract({
                  contract,
                  method: "function feeRatePerDayScaled() returns (uint256)",
                  params: [],
                }),
                readContract({
                  contract,
                  method: "function totalSupply() returns (uint256)",
                  params: [],
                }),
              ])

              const managementFee = feeRateRaw ? Number(feeRateRaw) / 1e18 : 0
              const totalSupply = totalSupplyRaw
                ? Number(totalSupplyRaw) / 1e18
                : 0
              const price =
                marketPriceUSD !== Infinity ? Number(marketPriceUSD) : 0

              // Get historical data for this token
              // const tokenHistoricalPrice = historicalPrices.filter(
              //   (price) => price.ticker === token.symbol
              // )

              // const { change24h, change24hFmt } =
              //   get24hChange(tokenHistoricalPrice)

              return {
                ...token,
                marketInfo: {
                  ...token.marketInfo,
                  // change24h,
                  // change24hFmt,
                  marketCap: totalSupply * price,
                },
                smartContractInfo: {
                  ...token.smartContractInfo,
                  poolPrice: price,
                  managementFee,
                  totalSupply,
                },
                // historicalPrice: tokenHistoricalPrice,
              }
            } catch (error) {
              console.error(
                `Error fetching data for token: ${token.symbol}`,
                error
              )
              return token
            }
          })
        )
        setNexTokens(nexTokens)
      } catch (error) {
        console.error("Error in fetchIndexesData:", error)
      }
    }

    fetchIndexesData()
  }, [ethPriceUsd,chainName, network, activeChainSetting,activeThirdWebChain, historicalPrices]) // Added historicalPrices as dependency

  const contextValue = {
    ethPriceUsd,
    nexTokens,
    historicalPrices,
    loadingHistoricalPrices,
  }

  return (
    <DashboardContext.Provider value={contextValue}>
      {children}
    </DashboardContext.Provider>
  )
}

export { DashboardContext, DashboardProvider, useDashboard }
