import React, { createContext, useState, useEffect, useContext, ReactElement } from 'react';
import { Stack, Container, Typography, Button } from '@mui/material'
import { Menu, MenuButton, MenuItem } from '@szhsin/react-menu'
import '@szhsin/react-menu/dist/index.css'
import '@szhsin/react-menu/dist/transitions/slide.css'
import Image from 'next/image'
import Link from 'next/link'
import { lightTheme } from '@/theme/theme'
import anfiLogo from '@assets/images/anfi.png'
import cr5Logo from '@assets/images/cr5.png'
import Divider from '@mui/material/Divider'
import { goerliAnfiFactory, goerliAnfiV2Factory, goerliCrypto5Factory, sepoliaTokenAddresses } from '@/constants/contractAddresses'
import { sepoliaTokens } from '@/constants/testnetTokens'
import { FormatToViewNumber, formatNumber } from '@/hooks/math'
import usePortfolioPageStore from '@/store/portfolioStore'
import useTradePageStore from '@/store/tradeStore'
import { PositionType } from '@/types/tradeTableTypes'
import convertToUSD from '@/utils/convertToUsd'
import etherscan from '@assets/images/etherscan2.png'
import ccip from '@assets/images/ccip.png'
import chainlink from '@assets/images/chainlink.png'
import { useLandingPageStore } from '@/store/store'
import { BsArrowCounterclockwise } from 'react-icons/bs'
import { convertTime, reduceAddress } from '@/utils/general'
import exportPDF from '@/utils/exportTable'

import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'
import { GetPositionsHistoryDefi } from '@/hooks/getPositionsHistoryDefi'
import { GetPositionsHistoryCrossChain } from '@/hooks/getPositiontHistoryCrosschain'
import { useAddress } from '@thirdweb-dev/react'
import { IoMdLink } from 'react-icons/io'
import { PWAGradientStack } from '@/theme/overrides'
import { RiDownloadLine } from 'react-icons/ri'
import { toast } from 'react-toastify'
import { GenericToast } from "@components/GenericToast"
import { CSVLink } from 'react-csv'

interface HistoryContextProps {
	test: String,
	positionHistoryDefi: {
		data: PositionType[] | null;
		reload: () => Promise<void>;
	},
	positionHistoryCrosschain: {
		history: PositionType[] | null;
		requests: PositionType[] | null;
		reload: () => void;
	},
	positionHistoryData: PositionType[],
	combinedPositionTableData: PositionType[],
	usdPrices: {
		[key: string]: number;
	},
	activeIndexType: string | "defi" | "crosschain",
	path: string,
	searchQuery: string,
	assetName: string,
	allowedSymbols: any,
	activeTicker: string[],
	dataToShow: PositionType[],
	handleExportPDF: () => void,
	timestampstring: string,
	fileName: string,
	csvData: any[][],
	handleExportCSV: () => void
}

const HistoryContext = createContext<HistoryContextProps>({
	test: "",
	positionHistoryDefi: {
		data: null,
		reload: () => Promise.resolve()
	},
	positionHistoryCrosschain: {
		history: null,
		requests: null,
		reload: () => Promise.resolve()
	},
	positionHistoryData: [],
	combinedPositionTableData: [],
	usdPrices: {},
	activeIndexType: "defi",
	path: "",
	searchQuery: "",
	assetName: "",
	allowedSymbols: null,
	activeTicker: [],
	dataToShow: [],
	handleExportPDF: () => { },
	timestampstring: "",
	fileName: "",
	csvData: [],
	handleExportCSV: () => { }
})

const useHistory = () => {
	return (useContext(HistoryContext))
}

const HistoryProvider = ({ children }: { children: React.ReactNode }) => {

	const address = useAddress()
	const { mode, selectedIndex } = useLandingPageStore()
	const { swapFromCur, swapToCur, setTradeTableReload, tradeTableReload, crosschainTableReload, setEthPriceInUsd, ethPriceInUsd, isMainnet } = useTradePageStore()
	const { ownedAssetInActivity, setPortfolioData } = usePortfolioPageStore()

	const positionHistoryDefi = GetPositionsHistoryDefi()
	const positionHistoryCrosschain = GetPositionsHistoryCrossChain()

	const [positionHistoryData, setPositionHistoryData] = useState<PositionType[]>([])
	const [combinedPositionTableData, setCombinedPositionTableData] = useState<PositionType[]>([])
	const [usdPrices, setUsdPrices] = useState<{ [key: string]: number }>({})

	const activeIndexType = swapFromCur?.indexType === 'defi' || swapToCur?.indexType === 'defi' ? 'defi' : 'crosschain'

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

		if (JSON.stringify(combinedData) !== JSON.stringify(combinedPositionTableData)) {
			setCombinedPositionTableData(combinedData)
		}
	}, [positionHistoryCrosschain])

	const path = typeof window !== 'undefined' ? window.location.pathname : '/'
	const searchQuery = typeof window !== 'undefined' ? window.location.search : '/'
	const assetName = searchQuery.split('=')[1]

	const allowedSymbols = sepoliaTokens.filter((token) => token.isNexlabToken).map((token) => token.Symbol)
	const activeTicker = [swapFromCur.Symbol, swapToCur.Symbol].filter((symbol) => allowedSymbols.includes(symbol))

	useEffect(() => {
		const combinedData = positionHistoryDefi.data.concat(positionHistoryCrosschain.history)
		setPortfolioData(combinedData)
	}, [setEthPriceInUsd, setPortfolioData, positionHistoryDefi.data, positionHistoryCrosschain.history])

	useEffect(() => {
		if (path === '/tradeIndex') {
			const data = activeIndexType === 'defi' ? positionHistoryDefi.data : combinedPositionTableData
			const dataToShow = data.filter((data: { indexName: string }) => {
				return data.indexName === activeTicker[0]
			})
			if (JSON.stringify(dataToShow) !== JSON.stringify(positionHistoryData)) {
				setPositionHistoryData(dataToShow)
			}
		} else if (path === '/pwa_tradeIndex') {
			const dataTotal = combinedPositionTableData.concat(positionHistoryDefi.data).sort((a, b) => b.timestamp - a.timestamp)

			const data = dataTotal.filter((data) => {
				if (selectedIndex == "CRYPTO5" || selectedIndex == "CRYPTO 5" || selectedIndex == "CR5") {
					return "CRYPTO5" === data.indexName
				}
				else {
					return selectedIndex.toUpperCase() === data.indexName
				}
			})

			setPositionHistoryData(data)
		} else if (path === '/portfolio' || path === '/history' || path === '/pwa_history') {
			const data = positionHistoryCrosschain.history.concat(positionHistoryDefi.data).sort((a, b) => b.timestamp - a.timestamp)
			setPositionHistoryData(data)
		} else if (path === '/assetActivity') {
			const dataTotal = combinedPositionTableData.concat(positionHistoryDefi.data).sort((a, b) => b.timestamp - a.timestamp)
			const data = dataTotal.filter((data) => {
				return assetName.toUpperCase() === data.indexName
			})

			setPositionHistoryData(data)
		}
	}, [path, positionHistoryDefi.data, assetName, swapFromCur.Symbol, swapToCur.Symbol, ownedAssetInActivity, combinedPositionTableData])

	useEffect(() => {
		if (tradeTableReload) {
			activeIndexType === 'defi' ? positionHistoryDefi.reload() : positionHistoryCrosschain.reload()
			setTradeTableReload(false)
		}
	}, [positionHistoryDefi, setTradeTableReload, tradeTableReload, activeIndexType, positionHistoryCrosschain])

	useEffect(() => {
		async function getUsdPrices() {
			sepoliaTokens.map(async (token) => {
				if (ethPriceInUsd > 0) {
					const obj = usdPrices
					obj[token.address] = (await convertToUSD({ tokenAddress: token.address, tokenDecimals: token.decimals }, ethPriceInUsd, false)) || 0 // false as for testnet tokens
					if (Object.keys(usdPrices).length === sepoliaTokens.length - 1) {
						setUsdPrices(obj)
					}
				}
			})
		}

		getUsdPrices()
	}, [ethPriceInUsd, usdPrices])

	const dataToShow: PositionType[] = Array.from(
		{ length: Math.max(5, positionHistoryData.length) },
		(_, index) =>
			positionHistoryData[index] || {
				timestamp: 0,
				indexName: '',
				inputAmount: 0,
				outputAmount: 0,
				tokenAddress: '',
				side: '',
				sendStatus: '',
				receiveStatus: '',
			}
	)

	
	const handleExportPDF = () => {
		toast.dismiss()
		GenericToast({
			type: 'loading',
			message: 'Generating PDF...',
		})

		const dataToExport = []
		const heading = ['Time', 'Pair', 'Request Side', 'Input Amount', 'Output Amount', 'Transaction hash']
		dataToExport.push(heading)
		positionHistoryData
			.sort((a, b) => b.timestamp - a.timestamp)
			.forEach((position) => {
				const side = position.side.split(' ')[0]

				dataToExport.push([
					convertTime(position.timestamp),
					position.indexName,
					{ text: side, bold: true, color: 'white', alignment: 'center', fillColor: side.toLowerCase() === 'mint' ? '#089981' : '#F23645' },
					{
						text: [
							`${FormatToViewNumber({ value: position.inputAmount, returnType: 'string' })} ${side.toLowerCase() === 'mint' ? Object.keys(sepoliaTokenAddresses).find((key) => sepoliaTokenAddresses[key] === position.tokenAddress) : position.indexName
							}`,
						],
					},
					{
						text: [
							`${FormatToViewNumber({ value: position.outputAmount, returnType: 'string' })} ${side.toLowerCase() === 'burn' ? Object.keys(sepoliaTokenAddresses).find((key) => sepoliaTokenAddresses[key] === position.tokenAddress) : position.indexName
							}`,
						],
					},
					position.txHash,
				])
			})

		const tableData = dataToExport

		exportPDF(tableData, 'landscape', address as string)
	}

	const timestampstring = new Date().toISOString().replace(/[-:]/g, '').split('.')[0].split('T').join('')
	const fileName = `NEX-TX-HISTORY-${timestampstring}`

	const csvData: any[][] = [
		['Time', 'Pair', 'Request Side', 'Input Amount', 'Output Amount', 'Transaction hash'],
		...positionHistoryData
			.sort((a, b) => b.timestamp - a.timestamp)
			.map((position) => [
				convertTime(position.timestamp) || '', // Using empty string if date is undefined
				position.indexName || '',
				position.side.split(' ')[0] || '',
				`${FormatToViewNumber({ value: position.inputAmount, returnType: 'string' })} ${position.side.toLowerCase() === 'mint request' ? Object.keys(sepoliaTokenAddresses).find((key) => sepoliaTokenAddresses[key] === position.tokenAddress) : position.indexName
				}` || '',
				`${FormatToViewNumber({ value: position.outputAmount, returnType: 'string' })} ${position.side.toLowerCase() === 'burn request' ? Object.keys(sepoliaTokenAddresses).find((key) => sepoliaTokenAddresses[key] === position.tokenAddress) : position.indexName
				}` || '',
				position.txHash || '',
			]),
	]

	const handleExportCSV = () => {
		toast.dismiss()
		GenericToast({
			type: 'success',
			message: 'CSV file downloaded successfully...',
		})
	}



	const t = "test"

	const contextValue = {
		test: t,
		positionHistoryDefi: positionHistoryDefi,
		positionHistoryCrosschain: positionHistoryCrosschain,
		positionHistoryData: positionHistoryData,
		combinedPositionTableData: combinedPositionTableData,
		usdPrices: usdPrices,
		activeIndexType: activeIndexType,
		path: path,
		searchQuery: searchQuery,
		assetName: assetName,
		allowedSymbols: allowedSymbols,
		activeTicker: activeTicker,
		dataToShow: dataToShow,
		handleExportPDF: handleExportPDF,
		timestampstring: timestampstring,
		fileName: fileName,
		csvData: csvData,
		handleExportCSV: handleExportCSV
	}

	return (
		<HistoryContext.Provider value={contextValue}>
			{children}
		</HistoryContext.Provider>
	)

}

export { HistoryProvider, HistoryContext, useHistory }