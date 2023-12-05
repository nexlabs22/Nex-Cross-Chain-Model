import { useEffect, useState } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'

// Components :
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { Menu, MenuItem, MenuButton } from '@szhsin/react-menu'
import '@szhsin/react-menu/dist/index.css'
import '@szhsin/react-menu/dist/transitions/slide.css'
import GenericModal from '../GenericModal'
const Chart = dynamic(() => import('@/components/dashboard/dashboardChart'), { loading: () => <p>Loading ...</p>, ssr: false })

// Data :
import { comparisonIndices } from '@/constants/comparisionIndices'

// Store
import { useChartDataStore, useLandingPageStore } from '@/store/store'

// Icons and logos :
import btc from '@assets/images/btc.png'
import gold from '@assets/images/gold.jpg'
import oil from '@assets/images/oil.jpg'
import sandp from '@assets/images/s&p.jpeg'
import dow from '@assets/images/dow.png'
import nasdaq from '@assets/images/nasdaq.jpg'
import nyse from '@assets/images/nyse.png'
import { BsPlus } from 'react-icons/bs'
import { BsChevronCompactRight, BsChevronCompactLeft } from 'react-icons/bs'
import { GoTriangleDown } from 'react-icons/go'

const DashboardChartBox = () => {
	const { defaultIndex } = useLandingPageStore()
	const [selectedIndices, setSelectedIndices] = useState<string[]>([])
	const { fetchIndexData, removeIndex, selectedDuration, selectDuration, loading, dayChange, ANFIData, CR5Data } = useChartDataStore()
	const [classesModalOpen, setClassesModalOpen] = useState<boolean>(false)
	const [classesCategory, setClassesCategory] = useState<string>('indices')

	const openClassesModal = () => {
		setClassesModalOpen(true)
	}

	const closeClassesModal = () => {
		setClassesModalOpen(false)
	}

	
	console.log('ANFIData', ANFIData)
	console.log('CR5Data', CR5Data)

	// useEffect(() => {
	// 	fetchIndexData({ tableName: 'histcomp', index: defaultIndex })
	// }, [defaultIndex, fetchIndexData, selectedDuration])

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

	const priorityAssetClasses = [
		{
			index: 'ANFI',
			assetClasses: [
				{
					name: 'bitcoin',
					colName: 'bitcoin',
					logo: btc.src,
					selectionColor: comparisonIndices.find((index) => index.columnName === 'bitcoin')?.selectionColor,
				},
				{
					name: 'gold',
					colName: 'gold',
					logo: gold.src,
					selectionColor: comparisonIndices.find((index) => index.columnName === 'gold')?.selectionColor,
				},
				{
					name: 'oil',
					colName: 'oil',
					logo: oil.src,
					selectionColor: comparisonIndices.find((index) => index.columnName === 'oil')?.selectionColor,
				},
			],
		},
		{
			index: 'CRYPTO5',
			assetClasses: [
				{
					name: 's&p',
					colName: 'sandp',
					logo: sandp.src,
					selectionColor: comparisonIndices.find((index) => index.columnName === 'sandp')?.selectionColor,
				},
				{
					name: 'dow30',
					colName: 'dow',
					logo: dow.src,
					selectionColor: comparisonIndices.find((index) => index.columnName === 'dow')?.selectionColor,
				},
				{
					name: 'nasdaq',
					colName: 'nasdaq',
					logo: nasdaq.src,
					selectionColor: comparisonIndices.find((index) => index.columnName === 'nasdaq')?.selectionColor,
				},
				{
					name: 'nyse',
					colName: 'nyse',
					logo: nyse.src,
					selectionColor: comparisonIndices.find((index) => index.columnName === 'nyse')?.selectionColor,
				},
			],
		},
	]

	const allClasses = [
		{
			name: 'bitcoin',
			colName: 'bitcoin',
			logo: btc.src,
			category: 'cryptocurrencies',
		},
		{
			name: 'gold',
			colName: 'gold',
			logo: gold.src,
			category: 'goods',
		},
		{
			name: 'oil',
			colName: 'oil',
			logo: oil.src,
			category: 'goods',
		},

		{
			name: 's&p',
			colName: 'sandp',
			logo: sandp.src,
			category: 'indices',
		},
		{
			name: 'dow30',
			colName: 'dow',
			logo: dow.src,
			category: 'indices',
		},
		{
			name: 'nasdaq',
			colName: 'nasdaq',
			logo: nasdaq.src,
			category: 'indices',
		},
		{
			name: 'nyse',
			colName: 'nyse',
			logo: nyse.src,
			category: 'indices',
		},
	]

	return (
		<>
			<section className="h-fit w-full">
				<div className="w-full h-fit py-2 px-1 mb-2">
					<h5 className="montrealBold text-lg text-blackText-500 mb-1">Featured comparisons</h5>
					<div className="w-full h-fit flex flex-row items-center justify-start gap-2">
						{priorityAssetClasses.map((item, id) => {
							if (item.index == defaultIndex) {
								return item.assetClasses.map((assetClass, key) => {
									return (
										<div
											key={key}
											onClick={() => {
												if (!selectedIndices.includes(assetClass.colName)) {
													fetchIndexData({ tableName: 'histcomp', index: assetClass.colName })
													setSelectedIndices((prevState) => [...prevState, assetClass.colName])
												} else {
													removeIndex(assetClass.colName)
													setSelectedIndices((prevState) =>
														prevState.filter((i) => {
															return i != assetClass.colName
														})
													)
												}
											}}
											className="w-fit h-fit py-2 px-2 rounded-full flex flex-row items-center justify-around gap-10 border border-gray-300/50 bg-gray-100/20 shadow-md shadow-gray-300 cursor-pointer hover:bg-gray-200"
											style={{
												backgroundColor: selectedIndices.includes(assetClass.colName) ? assetClass.selectionColor : 'transparent',
											}}
										>
											<div className="flex flex-row items-center justify-start gap-2">
												<div
													className="w-10 p-3 aspect-square rounded-full bg-contain bg-center bg-no-repeat cursor-pointer shadow shadow-gray-300"
													style={{
														backgroundImage: `url('${assetClass.logo}')`,
													}}
												></div>
												<h5
													className={`montrealBold text-lg uppercase ${selectedIndices.includes(assetClass.colName) ? 'titleShadow' : ''}`}
													style={{
														color: selectedIndices.includes(assetClass.colName) ? '#FFFFFF' : '#2A2A2A',
													}}
												>
													{assetClass.name}
												</h5>
											</div>
											<h5 className={`pangramCompact text-sm ${Number(dayChange[assetClass.colName]) > 0 ? 'text-nexLightGreen-500' : 'text-nexLightRed-500'}`}>{`${
												Number(dayChange[assetClass.colName]) > 0 ? '+' + dayChange[assetClass.colName] : dayChange[assetClass.colName]
											}`}</h5>
										</div>
									)
								})
							}
						})}
						<div
							className="h-14 aspect-square rounded-full flex flex-row items-center justify-center border border-gray-300/50 bg-gray-100/20 shadow-md shadow-gray-300 cursor-pointer hover:bg-gray-200"
							onClick={openClassesModal}
						>
							<BsPlus color="#2A2A2A" size={30} />
						</div>
					</div>
				</div>
				<div className="h-[80vh] w-full p-3 rounded-2xl border border-gray-300/50 bg-gray-100/20 shadow-md shadow-gray-300">
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
			<GenericModal isOpen={classesModalOpen} onRequestClose={closeClassesModal} modalWidth={40}>
				<div className="w-full h-fit px-2 flex flex-row items-center justify-start">
					<div className="h-fit w-2/5 border-r border-r-blackText-500/30 px-2 pt-3 pb-10 flex flex-col items-start justify-start gap-10">
						<h5
							className={`montrealBold text-base py-2 px-3 w-11/12 rounded-full cursor-pointer ${
								classesCategory == 'indices' ? ' text-whiteText-500 bg-colorOne-500' : 'text-blackText-500 bg-transparent'
							}`}
							onClick={() => {
								setClassesCategory('indices')
							}}
						>
							Indices
						</h5>
						<h5
							className={`montrealBold text-base py-2 px-3 w-11/12 rounded-full cursor-pointer ${
								classesCategory == 'goods' ? ' text-whiteText-500 bg-colorOne-500' : 'text-blackText-500 bg-transparent'
							}`}
							onClick={() => {
								setClassesCategory('goods')
							}}
						>
							Goods
						</h5>
						<h5
							className={`montrealBold text-base py-2 px-3 w-11/12 rounded-full cursor-pointer ${
								classesCategory == 'cryptocurrencies' ? ' text-whiteText-500 bg-colorOne-500' : 'text-blackText-500 bg-transparent'
							}`}
							onClick={() => {
								setClassesCategory('cryptocurrencies')
							}}
						>
							Cryptocurrencies
						</h5>
					</div>
					<div className="h-full w-3/5 grid grid-cols-3 auto-rows-max justify-start items-start gap-y-5 px-3">
						{allClasses.map((cls, key) => {
							if (cls.category == classesCategory) {
								return (
									<div
										key={key}
										onClick={() => {
											closeClassesModal()
											if (!selectedIndices.includes(cls.colName)) {
												fetchIndexData({ tableName: 'histcomp', index: cls.colName })
												setSelectedIndices((prevState) => [...prevState, cls.colName])
											} else {
												removeIndex(cls.colName)
												setSelectedIndices((prevState) =>
													prevState.filter((i) => {
														return i != cls.colName
													})
												)
											}
										}}
										className={`flex flex-col items-center justify-center rounded-xl cursor-pointer w-full p-3 hover:bg-gray-200/50 ${
											selectedIndices.includes(cls.colName) ? 'bg-gray-200/50' : ''
										}`}
									>
										<div
											className=" bg-center bg-contain bg-no-repeat w-2/5 border border-gray-100 shadow-md shadow-gray-200 aspect-square rounded-full"
											style={{
												backgroundImage: `url(${cls.logo})`,
											}}
										></div>
										<h5 className="montrealBold text-base text-blackText-500 uppercase">{cls.name}</h5>
									</div>
								)
							}
						})}
					</div>
				</div>
			</GenericModal>
		</>
	)
}

export default DashboardChartBox
