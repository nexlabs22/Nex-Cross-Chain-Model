// import { useEffect, useRef, useState } from 'react'
// // import './index.css';
// import { ChartingLibraryWidgetOptions, LanguageCode, ResolutionString } from '../charting_library'
// // import {widget} from "../../public/charting_library"
// // import TradingView from "../charting_library/charting_library.standalone";
// import {widget } from "../charting_library/charting_library"
// // import {widget } from "../charting_library/charting_library.ts"
// // import * as React from 'react';
// import Datafeed from './trading-view/datafeed'
// import { useChartDataStore } from '@/store/store'

// export interface ChartContainerProps {
// 	symbol: ChartingLibraryWidgetOptions['symbol']
// 	interval: ChartingLibraryWidgetOptions['interval']

// 	// BEWARE: no trailing slash is expected in feed URL
// 	datafeedUrl: string
// 	libraryPath: ChartingLibraryWidgetOptions['library_path']
// 	chartsStorageUrl: ChartingLibraryWidgetOptions['charts_storage_url']
// 	chartsStorageApiVersion: ChartingLibraryWidgetOptions['charts_storage_api_version']
// 	clientId: ChartingLibraryWidgetOptions['client_id']
// 	userId: ChartingLibraryWidgetOptions['user_id']
// 	fullscreen: ChartingLibraryWidgetOptions['fullscreen']
// 	autosize: ChartingLibraryWidgetOptions['autosize']
// 	studiesOverrides: ChartingLibraryWidgetOptions['studies_overrides']
// 	container: ChartingLibraryWidgetOptions['container']
// }

// const getLanguageFromURL = (): LanguageCode | null => {
// 	const regex = new RegExp('[\\?&]lang=([^&#]*)')
// 	const results = regex.exec(location.search)
// 	return results === null ? null : (decodeURIComponent(results[1].replace(/\+/g, ' ')) as LanguageCode)
// }

// function compareArrays(oldArray: string[], newArray: string[]): { addedStrings: string[]; removedStrings: string[] } {
// 	const addedStrings = newArray.filter((item) => !oldArray.includes(item))
// 	const removedStrings = oldArray.filter((item) => !newArray.includes(item))

// 	return { addedStrings, removedStrings }
// }

// const colNameToSymbol: { [key: string]: string } = {
// 	sandp: 'GSPC',
// 	nasdaq: 'IXIC',
// 	dow: 'DJI',
// 	nyse: 'NYA',
// 	// "GC=F": "gold",
// 	// "CL=F": "oil",
// 	asml: 'ASML',
// 	paypal: 'PYPL',
// 	// "HG=F": "copper",
// 	microsoft: 'MSFT',
// 	apple: 'AAPL',
// 	alphabet: 'GOOGL',
// 	// "SI=F": "silver",
// 	amazon: 'AMZN',
// 	tencent: 'TCEHY',
// 	visa: 'V',
// 	tsmc: 'TSM',
// 	exxon_mob: 'XOM',
// 	unitedhealth_group: 'UNH',
// 	nvidia: 'NVDA',
// 	johnson_n_johnson: 'JNJ',
// 	lvmh: 'LVMHF',
// 	tesla: 'TSLA',
// 	jpmorgan: 'JPM',
// 	walmart: 'WMT',
// 	meta: 'META',
// 	spdr: 'SPY',
// 	mastercard: 'MA',
// 	chevron_corp: 'CVX',
// 	berkshire_hathaway: 'BRKA',
// }

// interface TVChartProps {
// 	selectedIndices: string[]
// 	index: string
// }

// export const TVChartContainer: React.FC<TVChartProps> = ({ selectedIndices, index }) => {
// 	const chartData = useChartDataStore().chartData
// 	const chartContainerRef = useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>

// 	const defaultProps: Omit<ChartContainerProps, 'container'> = {
// 		symbol: 'NexLabs:CRYPTO5/USD',
// 		interval: 'D' as ResolutionString,
// 		datafeedUrl: 'https://demo_feed.tradingview.com',
// 		libraryPath: '/charting_library/',
// 		chartsStorageUrl: 'https://saveload.tradingview.com',
// 		chartsStorageApiVersion: '1.1',
// 		clientId: 'tradingview.com',
// 		userId: 'public_user_id',
// 		fullscreen: false,
// 		autosize: true,
// 		studiesOverrides: {},
// 	}

// 	const [wid, setWid] = useState<any>()

// 	useEffect(() => {
// 		const widgetOptions: ChartingLibraryWidgetOptions = {
// 			symbol: defaultProps.symbol as string,
// 			datafeed: Datafeed,
// 			interval: defaultProps.interval as ChartingLibraryWidgetOptions['interval'],
// 			container: chartContainerRef.current,
// 			library_path: defaultProps.libraryPath as string,	
// 			locale: getLanguageFromURL() || 'en',
// 			disabled_features: ['use_localstorage_for_settings'],
// 			enabled_features: ['study_templates'],
// 			charts_storage_url: defaultProps.chartsStorageUrl,
// 			charts_storage_api_version: defaultProps.chartsStorageApiVersion,
// 			client_id: defaultProps.clientId,
// 			user_id: defaultProps.userId,
// 			fullscreen: defaultProps.fullscreen,
// 			autosize: defaultProps.autosize,
// 			studies_overrides: defaultProps.studiesOverrides,
// 			overrides: {
// 				'mainSeriesProperties.style': 2,
// 			},
// 			// time_frames: [
// 			// 	{ text: '1m', resolution: '1M' as ResolutionString, description: '1 month', title: '1 month' },
// 			// 	{ text: '2m', resolution: '2M' as ResolutionString, description: '2 month', title: '2 month' },
// 			// 	{ text: '6m', resolution: '6M' as ResolutionString, description: '6 month', title: '6 month' },
// 			// 	{ text: '1y', resolution: '1Y' as ResolutionString, description: '1 year', title: ' 1 year' },
// 			// 	{ text: '3y', resolution: '3Y' as ResolutionString, description: '3 year', title: ' 3 year' },
// 			// 	{ text: '5y', resolution: '5Y' as ResolutionString, description: '5 year', title: ' 5 year' },
// 			// 	// { text: "3d", resolution: "5", description: "3 Days" },
// 			// 	// { text: "1000y", resolution: "1W", description: "All", title: "All" },
// 			// ],
// 		}

// 		const tvWidget = new widget(widgetOptions)
// 		// const tvWidget = new TradingView.widget(widgetOptions)

// 		tvWidget.onChartReady(() => {
// 			setWid(tvWidget)
// 		})

// 		return () => {
// 			tvWidget.remove()
// 		}
// 	}, [])

// 	useEffect(()=>{
// 		if(wid && wid.setSymbol){
// 			wid.setSymbol(`NexLabs:${index}/USD`, 'D', () => {
// 				// Your callback function
// 			});
// 		}
// 	},[index, wid])

// 	const [oldSelectedIndices, setOldSelectedIndices] = useState<string[]>([])
// 	const [ids, setIds] = useState<{ [key: string]: string }>({})
// 	useEffect(() => {
// 		if (wid && wid.activeChart) {
// 			const newSelectedIndices = selectedIndices
// 			const { addedStrings, removedStrings } = compareArrays(oldSelectedIndices, newSelectedIndices)

// 			addedStrings.map((index) => {
// 				const indName = index && colNameToSymbol[index] ? `NexLabs:${colNameToSymbol[index]}/USD` : ''
// 				wid.activeChart()
// 					.createStudy('Compare', false, false, { source: 'open', symbol: `${indName}` })
// 					.then((id: string) => {
// 						const idList = ids
// 						idList[index] = id
// 						setIds(idList)
// 					})
// 			})
// 			removedStrings.map((index) => {
// 				const id = ids[index]
// 				wid.activeChart().removeEntity(id)
// 			})
// 			setOldSelectedIndices(newSelectedIndices)
// 		}
// 	}, [selectedIndices, chartData, wid])

// 	return (
// 		<div
// 			ref={chartContainerRef}
// 			className="w-screen"
// 			style={{
// 				width: '100%',
// 				height: '100%',
// 				overflow: 'hidden',
// 				zIndex: 1,
// 			}}
// 			// className={ 'TVChartContainer' }
// 		/>
// 	)
// }
