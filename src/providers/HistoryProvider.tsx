"use client"

import { GetPositionsHistoryDefi } from "@/hooks/getPositionsHistoryDefi"
import { GetPositionsHistoryCrossChain } from "@/hooks/getPositiontHistoryCrosschain"
import { GetPositionsHistoryStock } from "@/hooks/getPositiontHistoryStock"
import React, { createContext, useEffect, useState } from "react"
import { useContext } from "react"
import { useTrade } from "./TradeProvider"
import { NexIndices, PositionType, RequestType } from "@/types/indexTypes"
import apolloIndexClient from "@/utils/graphqlClient"
import { GET_ISSUANCED_ANFI_EVENT_LOGS } from "@/app/api/graphql/queries/uniswap"
import { useGlobal } from "./GlobalProvider"
import { usePathname } from "next/navigation"
import { nexTokensArray } from "@/constants/indices"
import { parseQueryFromPath } from "@/utils/general"


interface HistoryContextProps {
	positionHistoryData: PositionType[]
}

const HistoryContext = createContext<HistoryContextProps>({
	positionHistoryData: []
})

const useHistory = () => {
	return useContext(HistoryContext)
}

const HistoryProvider = ({ children }: { children: React.ReactNode }) => {

	const { swapFromToken, swapToToken } = useTrade()
	const { userAddress } = useGlobal()
	const pathname = usePathname()

	const searchQuery = typeof window !== 'undefined' ? window.location.search : '/'
	const queryParams = parseQueryFromPath(searchQuery)

	const [positionHistoryData, setPositionHistoryData] = useState<PositionType[]>([])
	const [activeTicker, setActiveTicker] = useState<NexIndices>('ANFI')
	const [combinedPositionTableCrosschainData, setCombinedPositionTableCrosschainData] = useState<PositionType[]>([])
	const [combinedPositionTableStockData, setCombinedPositionTableStockData] = useState<PositionType[]>([])
	const [dataFromGraph, setDataFromGraph] = useState({})

	useEffect(() => {
		async function fetchData() {
			const { data: testData }: { data: { [key: string]: RequestType[] } } = await apolloIndexClient.query({
				query: GET_ISSUANCED_ANFI_EVENT_LOGS,
				fetchPolicy: 'network-only',
			});
			setDataFromGraph(testData)
		}

		fetchData()
	}, [userAddress])


	const positionHistoryDefi = GetPositionsHistoryDefi(dataFromGraph)
	const positionHistoryCrosschain = GetPositionsHistoryCrossChain(dataFromGraph)
	const positionHistoryStock = GetPositionsHistoryStock(dataFromGraph)

	const activeIndexType = swapFromToken.smartContractType || swapToToken.smartContractType

	useEffect(() => {
		const crossChainRequests = positionHistoryCrosschain.requests
		const crossChainHistory = positionHistoryCrosschain.history

		const activeRequests = crossChainRequests.filter((data) => {
			const isExist = crossChainHistory.find((hist) => {
				return hist.nonce === data.nonce && hist.side === data.side
			})
			return !isExist
		})

		const combinedData = [...crossChainHistory, ...activeRequests].sort((a, b) => b.timestamp - a.timestamp)

		if (JSON.stringify(combinedData) !== JSON.stringify(combinedPositionTableCrosschainData)) {
			setCombinedPositionTableCrosschainData(combinedData)
		}
	}, [positionHistoryCrosschain, combinedPositionTableCrosschainData])

	useEffect(() => {
		const stockRequests = positionHistoryStock.requests
		const stockHistory = positionHistoryStock.history

		const activeRequests = stockRequests.filter((data) => {
			const isExist = stockHistory.find((hist) => {
				return hist.nonce === data.nonce && hist.side === data.side
			})
			return !isExist
		})

		const combinedData = [...stockHistory, ...activeRequests].sort((a, b) => b.timestamp - a.timestamp)

		if (JSON.stringify(combinedData) !== JSON.stringify(combinedPositionTableStockData)) {
			setCombinedPositionTableStockData(combinedData)
		}
	}, [positionHistoryStock, combinedPositionTableStockData])


	useEffect(() => {
		const activeTicker = swapFromToken.hasOwnProperty('smartContractType') ? swapFromToken.symbol : swapToToken.symbol
		setActiveTicker(activeTicker as NexIndices)
	}, [swapFromToken, swapToToken])
	const totalPortfolioData = [...positionHistoryDefi.data, ...positionHistoryCrosschain.history, ...positionHistoryStock.history].sort((a, b) => b.timestamp - a.timestamp)


	useEffect(() => {
		if (pathname === '/trade') {
			const data = activeIndexType === 'defi' ? positionHistoryDefi.data : activeIndexType === 'crosschain' ? combinedPositionTableCrosschainData : combinedPositionTableStockData

			const dataToShow = data.filter((data: PositionType) => {
				return data.indexName === activeTicker && data.user.toLowerCase() === userAddress?.toLowerCase()
			})
			if (JSON.stringify(dataToShow) !== JSON.stringify(positionHistoryData)) {
				setPositionHistoryData(dataToShow)
			}
		} else if (pathname === '/index-details') {
			const indextype = nexTokensArray.find((token) => token.symbol === queryParams.index)?.smartContractType
			const data = indextype === 'defi' ? positionHistoryDefi.data : indextype === 'crosschain' ? positionHistoryCrosschain.history: positionHistoryStock.history

			const dataToShow = data.filter((data: PositionType) => {
				return data.indexName === queryParams.index
			})
			if (JSON.stringify(dataToShow) !== JSON.stringify(positionHistoryData)) {
				setPositionHistoryData(dataToShow)
			}
		}

	}, [
		pathname,
		positionHistoryDefi.data,
		positionHistoryData,
		activeIndexType,
		activeTicker,
		combinedPositionTableCrosschainData,
		swapFromToken,
		swapToToken,
		combinedPositionTableStockData,
		positionHistoryCrosschain,
		positionHistoryStock,
		totalPortfolioData,
		userAddress,
		queryParams	
	])


	const contextValue = {
		positionHistoryData
	}

	return <HistoryContext.Provider value={contextValue}>{children}</HistoryContext.Provider>
}

export { HistoryProvider, HistoryContext, useHistory }