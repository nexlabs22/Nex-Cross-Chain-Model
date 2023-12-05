import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

// Components :
import { Menu } from '@szhsin/react-menu'
import '@szhsin/react-menu/dist/index.css'
import '@szhsin/react-menu/dist/transitions/slide.css'
const Chart = dynamic(() => import('@/components/dashboard/dashboardChart'), { loading: () => <p>Loading ...</p>, ssr: false })


// Store
import { useChartDataStore, useLandingPageStore } from '@/store/store'
import useTradePageStore from '@/store/tradeStore'

// Icons and logos :

import { GoTriangleDown } from 'react-icons/go'

const TradeChartBox = () => {
	const { selectedTradingProduct, defaultIndex } = useTradePageStore()
	const { fetchIndexData, removeIndex, selectedDuration, selectDuration, loading, dayChange, ANFIData, CR5Data } = useChartDataStore()
	
	useEffect(() => {
		console.log('dayChange', dayChange)
		console.log(selectedTradingProduct)
	}, [dayChange])


	return (
		<>
			<section className="h-full w-full">
				<div className="h-full w-full p-3 rounded-2xl border border-gray-300/50 bg-gray-100/20 shadow-md shadow-gray-300">
					<div className="flex flex-row items-start justify-between px-2 mt-2 mb-6">
						<div className='flex flex-col items-start justify-start'>
							<h5 className='interBlack text-lg text-blackText-500'>
								{
									defaultIndex
								}
							</h5>
							<h5 className='interMedium text-sm text-nexLightGreen-500'>
								+1.23%
							</h5>
						</div>
						<Menu
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
						</Menu>
					</div>
					
					{
						defaultIndex === 'ANFI' ? <Chart data={ANFIData} /> : <Chart data={CR5Data} />
					}
				</div>
			</section>
			
		</>
	)
}

export default TradeChartBox;
