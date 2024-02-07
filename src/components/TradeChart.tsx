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
				<div className={`h-full w-full rounded-2xl border border-gray-300/50 ${mode=== 'dark' ? 'bg-[#131722]': 'bg-[#FFFFFF]'} shadow-md shadow-gray-300`}>
					
					<div className='h-full max-h-full w-full'>
						<TradingViewChart selectedIndices={[]} index={selectedTradingProduct} />
					</div>
					
				</div>
			</section>
		</>
	)
}

export default TradeChartBox
