import React, { createContext, useState, useEffect, useContext } from 'react'
import { ThirdwebSDK, useAddress } from '@thirdweb-dev/react'
import useTradePageStore from '@/store/tradeStore'
import { sepoliaIndexTokenAddresses, sepoliaIndexPoolAddresses } from '@/constants/contractAddresses'
import { indexTokenAbi } from '@/constants/abi'
import { FormatToViewNumber, num } from '@/hooks/math'
import { getTimestampDaysAgo } from '@/utils/conversionFunctions'
import { nexTokens } from '@/constants/nexIndexTokens'
import { nexTokenDataType } from '@/types/nexTokenData'
import convertToUSD from '@/utils/convertToUsd'

// Firebase :
import { ref, onValue } from 'firebase/database'
import { database } from '@/utils/firebase'
import { PositionType } from '@/types/tradeTableTypes'
import { GetPositionsHistoryDefi } from '@/hooks/getPositionsHistoryDefi'
import { GetTradeHistoryCrossChain } from '@/hooks/getTradeHistoryCrossChain'
import { useChartDataStore, useLandingPageStore } from '@/store/store'
import usePortfolioPageStore from '@/store/portfolioStore'
import { GenericToast } from '@/components/GenericToast'
import client from '@/utils/graphQL-client'
import { GET_HISTORICAL_PRICES_QL } from '@/uniswap/graphQuery'

interface User {
	email: string
	inst_name: string
	main_wallet: string
	name: string
	vatin: string
	address: string
	ppLink: string
	p1: boolean
	p2: boolean
	p3: boolean
	p4: boolean
	p5: boolean
	ppType: string
	creationDate: string
}

interface PortfolioContextProps {
	user: User | null
	showPortfolioData: boolean | null
	chartArr: { time: number; value: number }[]
	indexPercent: { [key: string]: number }
	indexTokenBalance: { [key: string]: number }
	todayPortfolioPrice: number
	yesterdayPortfolioPrice: number
	portfolio24hChange: number
	portfolio24hChangePer: number
	pieData: (string | number)[][]
	nexTokenAssetData: nexTokenDataType[]
	totalPortfolioBalance: any
	positionHistoryDefi: { data: PositionType[]; reload: () => Promise<void> }
	positionHistoryCrosschain: { data: PositionType[]; reload: () => Promise<void> }
	// combinedData: PositionType[]
	// latestObjectsMap: Map<string, PositionType>
	indexDetails: { index: string; smartContract: string; lastTnx: string; ownedAmount: string }[]
	indexDetailsMap: Map<string, any>
	uploadedPPLink: string
	chosenPPType: string
	handleCopyFunction: () => void
	handleCopyIndexDetailsFunction: () => void
}

const PortfolioContext = createContext<PortfolioContextProps>({
	user: null,
	showPortfolioData: null,
	chartArr: [],
	indexPercent: {},
	indexTokenBalance: {},
	todayPortfolioPrice: 0,
	yesterdayPortfolioPrice: 0,
	portfolio24hChange: 0,
	portfolio24hChangePer: 0,
	pieData: [],
	nexTokenAssetData: [],
	totalPortfolioBalance: 0,
	positionHistoryDefi: { data: [], reload: () => Promise.resolve() },
	positionHistoryCrosschain: { data: [], reload: () => Promise.resolve() },
	// combinedData: [],
	// latestObjectsMap: new Map(),
	indexDetails: [],
	indexDetailsMap: new Map(),
	uploadedPPLink: 'none',
	chosenPPType: 'none',
	handleCopyFunction: () => {},
	handleCopyIndexDetailsFunction: () => {},
})

const usePortfolio = () => {
	return useContext(PortfolioContext)
}

const PortfolioProvider = ({ children }: { children: React.ReactNode }) => {
	const address = useAddress()
	const { ethPriceInUsd } = useTradePageStore()
	const { setDayChange } = usePortfolioPageStore()
	const [indexData, setIndexData] = useState<{ [key: string]: { error: any; data: any } }>({})
	const [indexTokenBalance, setIndexTokenBalance] = useState<{ [key: string]: number }>({})
	const [indexPercentage, setIndexPercentages] = useState<{ [key: string]: number }>({})
	let [chartArr, setChartArr] = useState<{ time: number; value: number }[]>([])
	const [indexDetails, setIndexDetails] = useState<{ index: string; smartContract: string; lastTnx: string; ownedAmount: string }[]>([])

	useEffect(() => {
		if (address) {
			Object.entries(sepoliaIndexTokenAddresses).forEach(async ([indexName, tokenAddress]) => {
				const sdk = new ThirdwebSDK('sepolia')
				const tokenContract = await sdk.getContract(tokenAddress as string, indexTokenAbi)

				const tokenBalance = await tokenContract.call('balanceOf', [address])

				setIndexTokenBalance((prevState) => ({
					...prevState,
					[indexName]: num(tokenBalance),
				}))
			})
		}
	}, [address])

	useEffect(() => {
		const totalBalance = Object.values(indexTokenBalance).reduce((sum, value) => sum + value, 0)
		const percentages = Object.fromEntries(Object.entries(indexTokenBalance).map(([key, value]) => [key, (value / totalBalance) * 100]))

		setIndexPercentages(percentages)
	}, [indexTokenBalance])

	useEffect(() => {
		async function getHistoricalPrice() {
			Object.entries(sepoliaIndexPoolAddresses).forEach(async ([indexName, poolAddress]) => {
				const { error, data } = await client
					.query(GET_HISTORICAL_PRICES_QL, { poolAddress: poolAddress.toLowerCase(), startingDate: getTimestampDaysAgo(1000), limit: 10, direction: 'asc' })
					.toPromise()

				setIndexData((prevState) => ({
					...prevState,
					[indexName]: { error, data },
				}))
			})
		}

		getHistoricalPrice()
	}, [])

	const calculateMetrics = () => {
		const chartData: { time: number; value: number }[] = []
		let allDataAvailable = true

		// Check if data is available for all indexes
		for (const indexName of Object.keys(sepoliaIndexTokenAddresses)) {
			if (indexData[indexName]?.error || !indexData[indexName]?.data) {
				allDataAvailable = false
				break
			}
		}

		if (allDataAvailable && chartArr.length === 0) {
			const indexNames = Object.keys(sepoliaIndexTokenAddresses)
			const firstIndexData = indexData[indexNames[0]].data.poolDayDatas

			for (let i = 0; i < firstIndexData.length; i++) {
				const chartObj: { time: number; value: number } = { time: 0, value: 0 }
				chartObj.time = firstIndexData[i].date

				let totalValue = 0
				for (const indexName of indexNames) {
					const indexPoolDayData = indexData[indexName].data.poolDayDatas
					totalValue += indexTokenBalance[indexName] * Number(indexPoolDayData[i]?.token0Price || 0)
				}
				chartObj.value = totalValue
				chartData.push(chartObj)
			}

			setChartArr(chartData)

			const indexPrices: { [key: string]: number } = {}
			const dayChange: { [key: string]: number } = {}

			for (const indexName of indexNames) {
				const indexPoolDayData = indexData[indexName].data.poolDayDatas
				const todayPrice = indexPoolDayData[indexPoolDayData.length - 1].token0Price * indexTokenBalance[indexName]
				const yesterdayPrice = indexPoolDayData[indexPoolDayData.length - 2]?.token0Price || 0
				indexPrices[indexName] = todayPrice
				dayChange[indexName] = ((todayPrice - yesterdayPrice) / yesterdayPrice) * 100
			}

			// setIndexPrices(indexPrices);
			setDayChange(dayChange)
		}
	}

	useEffect(() => {
		if (address && Object.keys(indexTokenBalance).length > 0) {
			calculateMetrics()
		}
	}, [indexData, address, indexTokenBalance])

	const todayPortfolioPrice = chartArr[chartArr.length - 1]?.value || 0
	const yesterdayPortfolioPrice = chartArr[chartArr.length - 2]?.value || 0
	const portfolio24hChange = todayPortfolioPrice - yesterdayPortfolioPrice
	const portfolio24hChangePer = ((todayPortfolioPrice - yesterdayPortfolioPrice) / yesterdayPortfolioPrice) * 100


	const pieDataToReturn: [string, number | string][] = [['Asset', 'Percentage']]

	Object.entries(indexPercentage).forEach(([key, value]) => {
		pieDataToReturn.push([key, Number(value.toFixed(2))])
	})

	const hasBalance = Object.values(indexTokenBalance).reduce((acc, value) => acc || typeof value === 'number', false)

	const showPortfolioData = address && hasBalance ? true : false

	const [assetData, setAssetData] = useState<nexTokenDataType[]>([])

	useEffect(() => {
		async function getTokenDetails() {
			const data = await Promise.all(
				nexTokens.map(async (item: nexTokenDataType) => {
					const calculatedUsdValue = (await convertToUSD({ tokenAddress: item.address, tokenDecimals: item.decimals }, ethPriceInUsd, false)) || 0
					const totalToken = indexTokenBalance[item.symbol.toUpperCase()] || 0
					const totalTokenUsd = calculatedUsdValue * totalToken || 0
					const percentage = indexPercentage[item.symbol.toUpperCase()] || 0

					return {
						...item,
						totalToken,
						totalTokenUsd,
						percentage,
					}
				})
			)

			setAssetData(data)
		}

		getTokenDetails()
	}, [ethPriceInUsd, indexPercentage])

	const totalPortfolioBalance = assetData.reduce((total, data) => total + Number(data.totalTokenUsd), 0)
	const positionHistoryDefi = GetPositionsHistoryDefi()
	const positionHistoryCrosschain = GetTradeHistoryCrossChain()

	useEffect(() => {
		const latestObjectsMap: Map<string, PositionType> = new Map()

		const combinedData = !positionHistoryDefi.loading && !positionHistoryCrosschain.loading ? positionHistoryDefi.data.concat(positionHistoryCrosschain.data) : null

		if (combinedData) {
			for (const item of combinedData) {
				if (!latestObjectsMap.has(item.indexName)) {
					latestObjectsMap.set(item.indexName, item)
				}
			}
		}

		async function getTokenDetails() {
			const data = nexTokens.map((item: nexTokenDataType) => {
				const index = item.symbol
				return {
					index,
					smartContract: item.address,
					lastTnx: latestObjectsMap.get(index)?.txHash || 'N/A',
					ownedAmount: FormatToViewNumber({ value: indexTokenBalance[index], returnType: 'string' }) + index,
				}
			})
			setIndexDetails(data)
		}

		getTokenDetails()
	}, [indexTokenBalance, positionHistoryDefi.loading, positionHistoryCrosschain.loading])

	const indexDetailsMap: Map<string, any> = new Map()

	indexDetails.forEach((detail) => {
		indexDetailsMap.set(detail.index, detail)
	})

	chartArr = chartArr.filter((obj) => obj.time !== 1702512000)

	const { changeSelectedIndex } = useLandingPageStore()

	const { fetchIndexData, ANFIData, CR5Data } = useChartDataStore()
	useEffect(() => {
		fetchIndexData({ tableName: 'histcomp', index: 'OurIndex' })
	}, [fetchIndexData])

	const dataForChart: { [key: string]: { time: string | number | Date; value: number }[] } = {
		ANFI: ANFIData.reverse().slice(30),
		CR5: CR5Data.reverse().slice(30),
	}

	const [uploadedPPLink, setUploadedPPLink] = useState('none')
	const [chosenPPType, setChosenPPType] = useState('none')

	const [connectedUser, setConnectedUser] = useState<User | null>(null)
	const [connectedUserId, setConnectedUserId] = useState('')

	useEffect(() => {
		function getUser() {
			const usersRef = ref(database, 'users/')
			onValue(usersRef, (snapshot) => {
				const users = snapshot.val()
				for (const key in users) {
					// console.log(users[key])
					const potentialUser: User = users[key]
					if (address && potentialUser.main_wallet == address) {
						setConnectedUser(potentialUser)
						setConnectedUserId(key)
					}
				}
			})
		}
		getUser()
	}, [address])

	const handleCopy = () => {
		if (address) {
			GenericToast({
				type: 'success',
				message: 'Copied !',
			})
		} else {
			GenericToast({
				type: 'error',
				message: 'Please connect your wallet !',
			})
		}
	}

	const handleCopyIndexDetails = () => {
		GenericToast({
			type: 'success',
			message: 'Copied !',
		})
	}

	const contextValue = {
		user: connectedUser,
		showPortfolioData: showPortfolioData,
		chartArr: chartArr,
		indexPercent: indexPercentage,
		indexTokenBalance: indexTokenBalance,
		todayPortfolioPrice: todayPortfolioPrice,
		yesterdayPortfolioPrice: yesterdayPortfolioPrice,
		portfolio24hChange: portfolio24hChange,
		portfolio24hChangePer: portfolio24hChangePer,
		// anfiTokenContract: anfiTokenContract,
		// crypto5TokenContract: crypto5TokenContract,
		// anfiPercent: anfiPercent,
		// crypto5Percent: crypto5Percent,
		// anfiTokenBalance: anfiTokenBalance,
		// crypto5TokenBalance: crypto5TokenBalance,
		pieData: pieDataToReturn,
		nexTokenAssetData: assetData,
		totalPortfolioBalance: totalPortfolioBalance,
		positionHistoryDefi: positionHistoryDefi,
		positionHistoryCrosschain: positionHistoryCrosschain,
		// combinedData: combinedData,
		// latestObjectsMap: latestObjectsMap,
		indexDetails: indexDetails,
		indexDetailsMap: indexDetailsMap,
		uploadedPPLink: uploadedPPLink,
		chosenPPType: chosenPPType,
		handleCopyFunction: handleCopy,
		handleCopyIndexDetailsFunction: handleCopyIndexDetails,
	}

	return <PortfolioContext.Provider value={contextValue}>{children}</PortfolioContext.Provider>
}

export { PortfolioProvider, PortfolioContext, usePortfolio }
