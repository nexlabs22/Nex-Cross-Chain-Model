import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

// Components :
import { Menu } from '@szhsin/react-menu'
import '@szhsin/react-menu/dist/index.css'
import '@szhsin/react-menu/dist/transitions/slide.css'
import TradingViewChart from '@/components/TradingViewChart'
const Chart = dynamic(() => import('@/components/dashboard/dashboardChart'), { loading: () => <p>Loading ...</p>, ssr: false })

// Store
import { useChartDataStore, useLandingPageStore } from '@/store/store'
import useTradePageStore from '@/store/tradeStore'

// Icons and logos :

import { GoTriangleDown } from 'react-icons/go'

const TradeChartBox = () => {
	const router = useRouter()
	const { index: selectedTradingProduct } = router.query
	const { mode } = useLandingPageStore()
	const { fetchIndexData, removeIndex, selectedDuration, selectDuration, loading, dayChange, ANFIData, CR5Data } = useChartDataStore()

	useEffect(() => {
		fetchIndexData({ tableName: 'histcomp', index: 'OurIndex' })
	}, [fetchIndexData])

	const chartData = selectedTradingProduct === 'ANFI' ? ANFIData : CR5Data
	const todayPrice = chartData[chartData.length - 1]?.value
	const yesterdayPrice = chartData[chartData.length - 2]?.value
	const chart24hchange = ((todayPrice - yesterdayPrice) / yesterdayPrice) * 100

	return (
		<>
			<section className="h-full w-full">
				{/* <div className="h-full w-full p-3 rounded-2xl border border-gray-300/50 bg-gray-100/20 shadow-md shadow-gray-300"> */}
				<div className={`h-full w-full p-3 rounded-2xl border border-gray-300/50 ${mode=== 'dark' ? 'bg-[#131722]': 'bg-[#FFFFFF]'} shadow-md shadow-gray-300`}>
					{/* <div className="flex flex-row items-start justify-between px-2 mt-2 mb-6"> */}
						{/* <div className="flex flex-col items-start justify-start">
							<h5 className="interBlack text-lg text-blackText-500">{selectedTradingProduct}</h5>
							<h5 className={`interMedium text-sm ${chart24hchange > 0 ? 'text-nexLightGreen-500' : 'text-nexLightRed-500'}`}>
								{chart24hchange ? (chart24hchange > 0 ? '+ ' + chart24hchange.toFixed(2) : chart24hchange.toFixed(2)) : '0.00'}%
							</h5>
						</div> */}
						{/* <Menu
							menuButton={
								<div className="w-fit h-fit px-3 py-2 ml-2 hidden lg:flex flex-row items-center justify-center gap-1 rounded-md bg-colorSeven-500 shadow-sm shadow-blackText-500">
									<h5 className="text-sm interExtraBold titleShadow text-whiteText-500">
										{selectedDuration == 30 ? '1M' : selectedDuration == 60 ? '2M' : selectedDuration == 180 ? '6M' : selectedDuration == -1 ? 'YTD' : selectedDuration == 360 ? '1Y' : selectedDuration == 1080 ? '3Y' : selectedDuration == 1800 ? '5Y' : ''}
									</h5>
									<GoTriangleDown color="#F2F2F2" size={12}></GoTriangleDown>
								</div>
							}
							transition
							direction="bottom"
							align="end"
							className="durationMenu mt-10"
						>
							<div className="w-full h-fit py-1 px-2 flex flex-col items-start justify-start gap-1 bg-colorSeven-500">
								<h5
									className="interMedium text-sm text-whiteText-500 px-3 py-1 cursor-pointer titleShadow w-full hover:bg-[#7fa5b8]/50 rounded-md"
									onClick={() => {
										selectDuration(30)
									}}
								>
									1 Month
								</h5>
								<h5
									className="interMedium text-sm text-whiteText-500 px-3 py-1 cursor-pointer titleShadow w-full hover:bg-[#7fa5b8]/50 rounded-md"
									onClick={() => {
										selectDuration(60)
									}}
								>
									2 Months
								</h5>
								<h5
									className="interMedium text-sm text-whiteText-500 px-3 py-1 cursor-pointer titleShadow w-full hover:bg-[#7fa5b8]/50 rounded-md"
									onClick={() => {
										selectDuration(180)
									}}
								>
									6 Months
								</h5>
								<h5
									className="interMedium text-sm text-whiteText-500 px-3 py-1 cursor-pointer titleShadow w-full hover:bg-[#7fa5b8]/50 rounded-md"
									onClick={() => {
										selectDuration(-1)
									}}
								>
									YTD
								</h5>
								<h5
									className="interMedium text-sm text-whiteText-500 px-3 py-1 cursor-pointer titleShadow w-full hover:bg-[#7fa5b8]/50 rounded-md"
									onClick={() => {
										selectDuration(360)
									}}
								>
									1 Year
								</h5>
								<h5
									className="interMedium text-sm text-whiteText-500 px-3 py-1 cursor-pointer titleShadow w-full hover:bg-[#7fa5b8]/50 rounded-md"
									onClick={() => {
										selectDuration(1080)
									}}
								>
									3 Years
								</h5>
								<h5
									className="interMedium text-sm text-whiteText-500 px-3 py-1 cursor-pointer titleShadow w-full hover:bg-[#7fa5b8]/50 rounded-md"
									onClick={() => {
										selectDuration(1800)
									}}
								>
									5 Years
								</h5>
							</div>
						</Menu> */}
					{/* </div> */}
					{/* <Chart data={chartData} /> */}
					<div className='h-[70vh] w-full'>
						<TradingViewChart selectedIndices={[]} index={selectedTradingProduct}  />
					</div>
					
				</div>
			</section>
		</>
	)
}

export default TradeChartBox
