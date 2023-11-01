import { useEffect, useState } from 'react'
import Image from 'next/image'

import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { BsChevronCompactRight, BsCheckCircleFill, BsChevronCompactLeft } from 'react-icons/bs'
import { IoIosCheckmarkCircleOutline } from 'react-icons/io'
import dynamic from 'next/dynamic'
import { useChartDataStore, useLandingPageStore } from '@/store/store'
import { comparisonIndices } from '@/constants/comparisionIndices'
const Chart = dynamic(() => import('@components/dashboardChart'), { loading: () => <p>Loading ...</p>, ssr: false })

const DashboardChartBox = () => {
	const { defaultIndex } = useLandingPageStore()
	const [selectedIndices, setSelectedIndices] = useState<string[]>([])
	const { IndexData, fetchIndexData, removeIndex, selectedDuration, selectDuration } = useChartDataStore()
	useEffect(() => {
		fetchIndexData({ tableName: 'histcomp', index: defaultIndex})
	}, [defaultIndex, fetchIndexData, selectedDuration])

	const PrevArrow = ({ onClick }: { onClick: () => void }) => (
		<div
			className="absolute top-[30%] left-0 z-50 flex aspect-square h-fit w-fit flex-row items-center justify-center rounded-full bg-slate-100 p-5 opacity-0 shadow shadow-gray-400 hover:opacity-100"
			onClick={onClick}
		>
			<BsChevronCompactLeft size={20} color="#2A2A2A" />
		</div>
	)

	const NextArrow = ({ onClick }: { onClick: () => void }) => (
		<div
			className="absolute top-[30%] right-3 z-50 flex aspect-square h-fit w-fit flex-row items-center justify-center rounded-full bg-slate-100 p-5 opacity-0 shadow shadow-gray-400 hover:opacity-100"
			onClick={onClick}
		>
			<BsChevronCompactRight size={20} color="#2A2A2A" />
		</div>
	)

	const settings = {
		dots: false,
		infinite: false,
		speed: 500,
		slidesToShow: 3,
		slidesToScroll: 3,
		autoplay: false,
		centerMode: false,
		arrows: true,
		prevArrow: (
			<PrevArrow
				onClick={function (): void {
					throw new Error('Function not implemented.')
				}}
			/>
		), // Use custom Left Arrow component
		nextArrow: (
			<NextArrow
				onClick={function (): void {
					throw new Error('Function not implemented.')
				}}
			/>
		), // Use custom Right Arrow component
	}

	return (
		<div className="h-full w-full p-3">
			<div className="w-full relative z-50 h-fit flex flex-row gap-3 overflow-x-scroll lg:overflow-x-hidden items-center justify-start lg:justify-center">
				{comparisonIndices.map((item, index) => {
					return (
						<div key={index} className="indexContainer h-fit w-screen lg:w-1/4">
							<div
								className="flex h-fit w-full cursor-pointer flex-row items-center justify-between rounded-3xl px-3 py-[10px] hover:bg-gray-200/50"
								id="comparisonItem"
								onClick={() => {
									if (!selectedIndices.includes(item.columnName)) {
										fetchIndexData({ tableName: 'histcomp', index: item.columnName})
										setSelectedIndices((prevState) => [...prevState, item.columnName])
									} else {
										removeIndex(item.columnName)
										setSelectedIndices((prevState) =>
											prevState.filter((i) => {
												return i != item.columnName
											})
										)
									}
								}}
							>
								<div className="flex w-full lg:w-10/12 flex-row items-center py-4 justify-start">
									<Image src={item.logo} width={50} height={50} alt="zef" className="mr-3 ml-3 rounded-full"></Image>
									<div className="indexDataContainer flex h-fit w-3/5 flex-col items-start justify-center">
										<h5
											className="montrealBold mb-2 text-base"
											style={{
												color: selectedIndices.includes(item.columnName) ? item.selectionColor : '#2A2A2A',
											}}
										>
											{item.name}
										</h5>
										<div className="flex w-full flex-row items-center justify-start">
											<h5 className="pangramCompact lg:mr-5 text-sm text-blackText-500">{item.price} USD</h5>
											<h5 className="hidden lg:block pangramCompact text-sm text-nexLightRed-500">{item.change}%</h5>
										</div>
									</div>
								</div>
								<div className="flex w-2/12 flex-row items-center justify-end pr-5">
									{selectedIndices.includes(item.columnName) ? <BsCheckCircleFill color={item.selectionColor} size={25} /> : <IoIosCheckmarkCircleOutline color="#CCCCCC" size={25} />}
								</div>
							</div>
						</div>
					)
				})}
			</div>
			
			<div className="flex flex-row items-start justify-start px-2">
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
				<button
					type="button"
					className={
						selectedDuration == -1
							? 'selectedDurationBtn flex flex-row items-center justify-center rounded-lg border border-solid border-black px-2 py-1 mx-1'
							: 'flex flex-row items-center justify-center rounded-lg px-2 py-1 hover:bg-darkModeAccordionBackground-500 mx-1'
					}
					onClick={() => {
						selectDuration(-1)
					}}
				>
					<p className="circularMedium text-base text-black">YTD</p>
				</button>
				<button
					type="button"
					className={
						selectedDuration == 360
							? 'selectedDurationBtn flex flex-row items-center justify-center rounded-lg border border-solid border-black px-2 py-1 mx-1'
							: 'flex flex-row items-center justify-center rounded-lg px-2 py-1 hover:bg-darkModeAccordionBackground-500 mx-1'
					}
					onClick={() => {
						selectDuration(360)
					}}
				>
					<p className="circularMedium text-base text-black">1Y</p>
				</button>
				<button
					type="button"
					className={
						selectedDuration == 1080
							? 'selectedDurationBtn flex flex-row items-center justify-center rounded-lg border border-solid border-black px-2 py-1 mx-1'
							: 'flex flex-row items-center justify-center rounded-lg px-2 py-1 hover:bg-darkModeAccordionBackground-500 mx-1'
					}
					onClick={() => {
						selectDuration(1080)
					}}
				>
					<p className="circularMedium text-base text-black">3Y</p>
				</button>
				<button
					type="button"
					className={
						selectedDuration == 1800
							? 'selectedDurationBtn flex flex-row items-center justify-center rounded-lg border border-solid border-black px-2 py-1 mx-1'
							: 'flex flex-row items-center justify-center rounded-lg px-2 py-1 hover:bg-darkModeAccordionBackground-500 mx-1'
					}
					onClick={() => {
						selectDuration(1800)
					}}
				>
					<p className="circularMedium text-base text-black">5Y</p>
				</button>
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
			<Chart data={IndexData} />
		</div>
	)
}

export default DashboardChartBox
