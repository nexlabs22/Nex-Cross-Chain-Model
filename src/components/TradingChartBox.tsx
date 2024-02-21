import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

// Components :
import { Menu } from '@szhsin/react-menu'
import '@szhsin/react-menu/dist/index.css'
import '@szhsin/react-menu/dist/transitions/slide.css'
const Chart = dynamic(() => import('@/components/dashboard/dashboardChart'), { loading: () => <p>Loading ...</p>, ssr: false })


// Store
import { useChartDataStore, useLandingPageStore } from '@/store/store'

// Icons and logos :

import { GoTriangleDown } from 'react-icons/go'

const TradeChartBox = () => {
	const { defaultIndex } = useLandingPageStore()
	const [selectedIndices, setSelectedIndices] = useState<string[]>([])
	const { fetchIndexData, removeIndex, selectedDuration, selectDuration, loading, dayChange, ANFIData, CR5Data } = useChartDataStore()
	const [classesModalOpen, setClassesModalOpen] = useState(false)
	const [classesCategory, setClassesCategory] = useState('indices')

	useEffect(() => {
		console.log('dayChange', dayChange)
	}, [dayChange])


	return (
		<>
			<section className="h-fit w-full">
				<div className="h-[50vh] w-full p-3 rounded-2xl border border-gray-300/50 bg-gray-100/20 shadow-md shadow-gray-300">
					<div className="flex flex-row items-start justify-end px-2 mt-2 mb-6">
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
					{/* <div className="flex flex-row items-start justify-start px-2">
				<button
					type="button"
					className={
						selectedDuration == 30
							? 'selectedDurationBtn flex flex-row items-center justify-center rounded-lg border border-solid border-black px-2 py-1 mx-1'
							: 'flex flex-row items-center justify-center rounded-lg px-2 py-1 hover:bg-darkModeAccordionBackground-500 mx-1'
					}
					onClick={() => {
						selectDuration(30)
					}}
				>
					<p className="circularMedium text-base text-black">1M</p>
				</button>
				<button
					type="button"
					className={
						selectedDuration == 180
							? 'selectedDurationBtn flex flex-row items-center justify-center rounded-lg border border-solid border-black px-2 py-1 mx-1'
							: 'flex flex-row items-center justify-center rounded-lg px-2 py-1 hover:bg-darkModeAccordionBackground-500 mx-1'
					}
					onClick={() => {
						selectDuration(180)
					}}
				>
					<p className="circularMedium text-base text-black">6M</p>
				</button>
			</div> */}
					{
						// loading ? (
						// 	<div className="flex items-center justify-center h-full">
						// 		<p>Loading...</p>
						// 	</div>
						// ) : (
						defaultIndex === 'ANFI' ? <Chart data={ANFIData} /> : <Chart data={CR5Data} />

						// )
					}
				</div>
			</section>
			
		</>
	)
}

export default TradeChartBox;
