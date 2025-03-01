"use client"
import React, { createContext, useEffect, useState } from "react"
import { useContext } from "react"
import { useTrade } from "./TradeProvider"
import { NexIndices, Transaction, RequestType } from "@/types/indexTypes"
import { apolloIndexClient } from "@/utils/graphqlClient"
import { generateGraphQLQuery } from "@/app/api/graphql/queries/uniswap"
import { useGlobal } from "./GlobalProvider"
import { usePathname, useSearchParams } from "next/navigation"
import { UsePositionsHistory } from "@/hooks/usePositionHistory"
import { nexTokensArray } from "@/constants/indices"


interface HistoryContextProps {
	positionHistoryData: Transaction[],
	reloadData: () => void
}

const HistoryContext = createContext<HistoryContextProps>({
	positionHistoryData: [],
	reloadData: () => { }
})

const useHistory = () => {
	return useContext(HistoryContext)
}

const HistoryProvider = ({ children }: { children: React.ReactNode }) => {

	const { swapFromToken, swapToToken } = useTrade()
	const { userAddress, activeChainSetting: { network } } = useGlobal()
	const pathname = usePathname()
	const queryParams = useSearchParams()
	const index = queryParams?.get('index') || 'ANFI'

	const tokenDetails = nexTokensArray.filter((token) => { return token.symbol === index })[0]
	const activeSmartContractType = tokenDetails.smartContractType || 'defi'

	const [positionHistoryData, setPositionHistoryData] = useState<Transaction[]>([])
	const [activeTicker, setActiveTicker] = useState<NexIndices>(index as NexIndices)
	const [dataFromGraph, setDataFromGraph] = useState({})

	useEffect(() => {
		async function fetchData() {
			const { data: graphData }: { data: { [key: string]: RequestType[] } } = await apolloIndexClient(network).query({
				query: generateGraphQLQuery(tokenDetails.symbol.toLowerCase(), activeSmartContractType),
				fetchPolicy: 'network-only',
			});
			setDataFromGraph(graphData)
		}

		fetchData()
	}, [tokenDetails, activeSmartContractType, network])

	const processedData = UsePositionsHistory(dataFromGraph, index)
	const activeIndexType = swapFromToken.smartContractType || swapToToken.smartContractType

	useEffect(() => {
		const activeTicker = swapFromToken.hasOwnProperty('smartContractType') ? swapFromToken.symbol : swapToToken.symbol
		setActiveTicker(activeTicker as NexIndices)
	}, [swapFromToken, swapToToken])


	useEffect(() => {
		if (pathname === '/trade') {
			const dataToShow = processedData.data.finalData.filter((data: Transaction) => {
				return data.tokenName === activeTicker && data.userAddress.toLowerCase() === userAddress?.toLowerCase()
			})
			if (JSON.stringify(dataToShow) !== JSON.stringify(positionHistoryData)) {
				setPositionHistoryData(dataToShow)
			}
		} else if (pathname === '/catalogue/index-details') {

			const dataToShow = processedData.data.finalData.filter((data: Transaction) => {
				return data.tokenName === index
			})
			if (JSON.stringify(dataToShow) !== JSON.stringify(positionHistoryData)) {
				setPositionHistoryData(dataToShow)
			}
		}

	}, [
		pathname,
		positionHistoryData,
		activeIndexType,
		activeTicker,
		swapFromToken,
		swapToToken,
		userAddress,
		queryParams,
		processedData,
		index
	])


	const contextValue = {
		positionHistoryData,
		reloadData: processedData.reload
	}

	return <HistoryContext.Provider value={contextValue}>{children}</HistoryContext.Provider>
}

export { HistoryProvider, HistoryContext, useHistory }