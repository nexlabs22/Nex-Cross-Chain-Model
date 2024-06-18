'use client'

import React, { useEffect, useRef, useState } from 'react'
import Datafeed from './trading-view/datafeed'
import TradingView from '../charting_library/charting_library.standalone'
import { useLandingPageStore } from '@/store/store'
import useTradePageStore from '@/store/tradeStore'
import { useRouter } from 'next/router'


function compareArrays(oldArray, newArray) {
	const addedStrings = newArray.filter((item) => !oldArray.includes(item))
	const removedStrings = oldArray.filter((item) => !newArray.includes(item))

	return { addedStrings, removedStrings }
}

const colNameToSymbol = {
	sandp: 'GSPC',
	nasdaq: 'IXIC',
	dow: 'DJI',
	nyse: 'NYA',
	asml: 'ASML',
	paypal: 'PYPL',
	microsoft: 'MSFT',
	apple: 'AAPL',
	alphabet: 'GOOGL',
	amazon: 'AMZN',
	tencent: 'TCEHY',
	visa: 'V',
	tsmc: 'TSM',
	exxon_mob: 'XOM',
	unitedhealth_group: 'UNH',
	nvidia: 'NVDA',
	johnson_n_johnson: 'JNJ',
	lvmh: 'LVMHF',
	tesla: 'TSLA',
	jpmorgan: 'JPM',
	walmart: 'WMT',
	meta: 'META',
	spdr: 'SPY',
	mastercard: 'MA',
	chevron_corp: 'CVX',
	berkshire_hathaway: 'BRKA',
	gold: 'GOLD',
	oil: 'CRUDEOIL',
	copper: 'COPPER',
	silver: 'SILVER',
	bitcoin: 'BTC',
	mag7: 'MAG7',
}

const TradingViewChart = ({ index, selectedIndices, page, pwa }) => {
	const [wid, setWid] = useState()
	const chartContainerRef = useRef()
	const { mode } = useLandingPageStore()
	const router = useRouter()
	const location = router.pathname

	// function getDisabledFeatures(page) {
	// 	if (page === 'dashboard') {
	// 		return ['header_widget', 'left_toolbar']
	// 	} else if (page === 'trade') {
	// 		return []
	// 	}
	// }

	const { swapFromCur, swapToCur } = useTradePageStore()

	useEffect(() => {
		const script = document.createElement('script')
		script.type = 'text/jsx'
		script.src = 'public/charting_library/charting_library.js'
		document.head.appendChild(script)
		const ind = index ? index : 'CRYPTO5'
		const widget = (window.tvWidget = new TradingView.widget({
			symbol: `Nexlabs:${ind}/USD`,
			interval: '1D',
			height: chartContainerRef.current.clientHeight - 10,
			width: chartContainerRef.current.clientWidth,
			style: '2',
			fullscreen: false,
			theme: pwa ? 'light' : mode,
			container: chartContainerRef.current,
			allow_symbol_change: false,
			datafeed: Datafeed,
			autosize: true,
			enabled_features: ["header_in_fullscreen_mode"],
			
			
    //   disabled_features: getDisabledFeatures(page),
			overrides: {
				'mainSeriesProperties.style': 2,
				'paneProperties.background': pwa ? "#FFFFFF" : '#020024',
			},
			// custom_css_url: 'css/style.css',
			library_path: '/charting_library/',
			time_frames: [
				{ text: '1M', resolution: '1D', description: '1 month', title: '1M' },
				{ text: '3M', resolution: '1D', description: '2 month', title: '3M' },
				{ text: '6m', resolution: '1D', description: '6 month', title: '6M' },
				{ text: '1y', resolution: '1D', description: '1 year', title: '1Y' },
				{ text: '3y', resolution: '1D', description: '3 year', title: '3Y' },
				{ text: '5y', resolution: '1D', description: '5 year', title: '5Y' },
				{ text: '100y', resolution: '1D', description: 'All', title: 'All' },
			],
		}))

		widget.onChartReady(() => {
			setWid(widget)
		})

		

		

		return () => script.remove()
	}, [])

	useEffect(() => {
		if (wid && wid.setSymbol) {
			wid.setSymbol(`Nexlabs:${index}/USD`, 'D')
		}
	}, [index, wid])

	useEffect(() => {
		if (wid && wid.setSymbol && location === '/tradeIndex') {
			const allowedSymbols = ['ANFI', 'CRYPTO5','MAG7']
			const activeTicker = [swapFromCur.Symbol, swapToCur.Symbol].filter((symbol) => allowedSymbols.includes(symbol))
			wid.setSymbol(`Nexlabs:${activeTicker[0]}/USD`, 'D')
		}
	}, [location, wid, swapFromCur.Symbol, swapToCur.Symbol])

	useEffect(() => {
		if (wid && wid.changeTheme) {
			if(pwa){
				wid.changeTheme('light')
			}else{
				wid.changeTheme(mode)
			}
		}
	}, [mode, wid, pwa])

	const [oldSelectedIndices, setOldSelectedIndices] = useState([])
	const [ids, setIds] = useState({})
	const width = chartContainerRef?.current?.clientWidth || 0
	const height = chartContainerRef?.current?.clientHeight || 0
	useEffect(() => {
		if (wid && wid.activeChart) {
			const newSelectedIndices = selectedIndices
			const { addedStrings, removedStrings } = compareArrays(oldSelectedIndices, newSelectedIndices)

			addedStrings.map((index) => {
				const indName = index && colNameToSymbol[index] ? `Nexlabs:${colNameToSymbol[index]}/USD` : ''
				wid.activeChart()
					.createStudy('Compare', false, false, { source: 'open', symbol: `${indName}` })
					.then((id) => {
						const idList = ids
						idList[index] = id
						setIds(idList)
					})
			})
			removedStrings.map((index) => {
				const id = ids[index]
				wid.activeChart().removeEntity(id)
			})
			setOldSelectedIndices(newSelectedIndices)
		}
	}, [selectedIndices, wid])

	// useEffect(() => {
	//   if (wid) {
	//     // const val = wid.chart.barSpacingChanged()
	//     const timeScaleApi = wid.activeChart().getTimeScale();

	//     const scale = timeScaleApi.barSpacing()

	//     const time = wid.activeChart().getTimeScale().barSpacingChanged()

	//     // Subscribe to changes in bar spacing
	//     timeScaleApi.barSpacingChanged().subscribe(function (newBarSpacing) {
	//       console.log("New bar spacing:", newBarSpacing);
	//       // Do something with the new bar spacing, if needed
	//     });
	//     console.log("time--->", time)
	//     console.log("scale--->", scale)
	//   }
	// }, [wid, width, height])

	return (
		<div
			ref={chartContainerRef}
			style={{
				width: '100%',
				height: '100%',
				zIndex: 1,
			}}
		/>
	)
}

export default TradingViewChart
