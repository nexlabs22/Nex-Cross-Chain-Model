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
import TradingViewChart from '@/components/TradingViewChart'
// import { TVChartContainer } from '@/components/TVChartContainer'
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
import stock5 from '@assets/images/STOCK5.png'
import microsoft from '@assets/images/microsoft.png'
import paypal from '@assets/images/paypal.png'
import asml from '@assets/images/asml.png'
import copper from '@assets/images/copper.png'
import lithium from '@assets/images/lithium.png'
import apple from '@assets/images/apple.png'
import alphabet from '@assets/images/alphabet.png'
import amazon from '@assets/images/amazon.png'
import berkshirehathway from '@assets/images/berkshirehathway.png'
import chevron from '@assets/images/chevron.png'
import exxon_mobile from '@assets/images/exxon_mobile.png'
import jnj from '@assets/images/jnj.png'
import jpmorgan from '@assets/images/jpmorgan.png'
import lvmh from '@assets/images/lvmh.png'
import mastercard from '@assets/images/mastercard.png'
import meta from '@assets/images/meta.png'
import nvidia from '@assets/images/nvidia.png'
import silver from '@assets/images/silver.png'
import spy from '@assets/images/spy.png'
import tencent from '@assets/images/tencent.png'
import tesla from '@assets/images/tesla.png'
import tsmc from '@assets/images/tsmc.png'
import unitedhealth from '@assets/images/unitedhealth.png'
import visa from '@assets/images/visa.png'
import walmart from '@assets/images/walmart.png'

import { BsPlus } from 'react-icons/bs'
import { BsChevronCompactRight, BsChevronCompactLeft } from 'react-icons/bs'
import { GoTriangleDown } from 'react-icons/go'
import mesh1 from '@assets/images/mesh1.png'
import mesh2 from '@assets/images/mesh2.png'
import { CiCircleCheck } from 'react-icons/ci'

const DashboardChartBox = () => {
	const { defaultIndex, mode } = useLandingPageStore()

	const [selectedIndices, setSelectedIndices] = useState<string[]>([])
	const { fetchIndexData, removeIndex, clearChartData, selectedDuration, selectDuration, loading, dayChange, STOCK5Data, CR5Data, chartData, comparisionIndices, setComparisonIndices } =
		useChartDataStore()
	const [classesModalOpen, setClassesModalOpen] = useState(false)
	const [classesCategory, setClassesCategory] = useState('indices')

	useEffect(() => {
		clearChartData()
		setSelectedIndices([])
	}, [defaultIndex, clearChartData])

	const openClassesModal = () => {
		setClassesModalOpen(true)
	}

	const closeClassesModal = () => {
		setClassesModalOpen(false)
	}

	const [stc5DayChange, setStc5DayChange] = useState(0)
	useEffect(() => {
		const stock5 = STOCK5Data.sort((a, b) => b.time - a.time)
		if (stock5.length > 2) {
			const currentPrice = stock5[0].value
			const previousPrice = stock5[1].value
			const change = ((currentPrice - previousPrice) / previousPrice) * 100
			setStc5DayChange(Number(change.toFixed(2)))
		}
	}, [STOCK5Data])

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
					name: 'STOCK5',
					colName: 'stock5',
					logo: stock5.src,
				},
				{
					name: 'btc',
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
					name: 'STOCK5',
					colName: 'stock5',
					logo: stock5.src,
				},
				{
					name: 'GSPC',
					colName: 'sandp',
					logo: sandp.src,
					selectionColor: comparisonIndices.find((index) => index.columnName === 'sandp')?.selectionColor,
				},
				{
					name: 'DJI',
					colName: 'dow',
					logo: dow.src,
					selectionColor: comparisonIndices.find((index) => index.columnName === 'dow')?.selectionColor,
				},
				{
					name: 'IXIC',
					colName: 'nasdaq',
					logo: nasdaq.src,
					selectionColor: comparisonIndices.find((index) => index.columnName === 'nasdaq')?.selectionColor,
				},
				{
					name: 'NYA ',
					colName: 'nyse',
					logo: nyse.src,
					selectionColor: comparisonIndices.find((index) => index.columnName === 'nyse')?.selectionColor,
				},
			],
		},
	]

	// const allClasses = [
	// 	{
	// 		name: 'BTC',
	// 		colName: 'bitcoin',
	// 		logo: btc.src,
	// 		category: 'cryptocurrencies',
	// 	},
	// 	{
	// 		name: 'gold',
	// 		colName: 'gold',
	// 		logo: gold.src,
	// 		category: 'commodities',
	// 	},
	// 	{
	// 		name: 'oil',
	// 		colName: 'oil',
	// 		logo: oil.src,
	// 		category: 'commodities',
	// 	},

	// 	{
	// 		name: 'GSPC',
	// 		colName: 'sandp',
	// 		logo: sandp.src,
	// 		category: 'indices',
	// 	},
	// 	{
	// 		name: 'DJI',
	// 		colName: 'dow',
	// 		logo: dow.src,
	// 		category: 'indices',
	// 	},
	// 	{
	// 		name: 'IXIC',
	// 		colName: 'nasdaq',
	// 		logo: nasdaq.src,
	// 		category: 'indices',
	// 	},
	// 	{
	// 		name: 'NYA',
	// 		colName: 'nyse',
	// 		logo: nyse.src,
	// 		category: 'indices',
	// 	},
	// 	{
	// 		name: 'MSFT',
	// 		colName: 'microsoft',
	// 		logo: microsoft.src,
	// 		category: 'stocks',
	// 	},
	// 	{
	// 		name: 'PYPL',
	// 		colName: 'paypal',
	// 		logo: paypal.src,
	// 		category: 'stocks',
	// 	},
	// 	{
	// 		name: 'ASML',
	// 		colName: 'asml',
	// 		logo: asml.src,
	// 		category: 'stocks',
	// 	},
	// 	{
	// 		name: 'Copper',
	// 		colName: 'copper',
	// 		logo: copper.src,
	// 		category: 'commodities',
	// 	},
	// 	{
	// 		name: 'Lithium',
	// 		colName: 'lithium',
	// 		logo: lithium.src,
	// 		category: 'commodities',
	// 	},
	// 	{
	// 		name: 'AAPL',
	// 		colName: 'apple',
	// 		logo: apple.src,
	// 		category: 'stocks',
	// 	},
	// 	{
	// 		name: 'GOOGL',
	// 		colName: 'alphabet',
	// 		logo: alphabet.src,
	// 		category: 'stocks',
	// 	},
	// 	{
	// 		name: 'AMZN',
	// 		colName: 'amazon',
	// 		logo: amazon.src,
	// 		category: 'stocks',
	// 	},
	// 	{
	// 		name: 'TCEHY',
	// 		colName: 'tencent',
	// 		logo: tencent.src,
	// 		category: 'stocks',
	// 	},
	// 	{
	// 		name: 'Silver',
	// 		colName: 'silver',
	// 		logo: silver.src,
	// 		category: 'commodities',
	// 	},
	// 	{
	// 		name: 'V',
	// 		colName: 'visa',
	// 		logo: visa.src,
	// 		category: 'stocks',
	// 	},
	// 	{
	// 		name: 'TSM',
	// 		colName: 'tsmc',
	// 		logo: tsmc.src,
	// 		category: 'stocks',
	// 	},
	// 	{
	// 		name: 'XOM',
	// 		colName: 'exxon_mobile',
	// 		logo: exxon_mobile.src,
	// 		category: 'stocks',
	// 	},
	// 	{
	// 		name: 'UNH',
	// 		colName: 'unitedhealth_group',
	// 		logo: unitedhealth.src,
	// 		category: 'stocks',
	// 	},
	// 	{
	// 		name: 'JNJ',
	// 		colName: 'johnson_n_johnson',
	// 		logo: jnj.src,
	// 		category: 'stocks',
	// 	},
	// 	{
	// 		name: 'NVDA',
	// 		colName: 'nvidia',
	// 		logo: nvidia.src,
	// 		category: 'stocks',
	// 	},
	// 	{
	// 		name: 'LVMHF',
	// 		colName: 'LVMHF',
	// 		logo: lvmh.src,
	// 		category: 'stocks',
	// 	},
	// 	{
	// 		name: 'TSLA',
	// 		colName: 'tesla',
	// 		logo: tesla.src,
	// 		category: 'stocks',
	// 	},
	// 	{
	// 		name: 'JPM',
	// 		colName: 'jpmorgan',
	// 		logo: jpmorgan.src,
	// 		category: 'stocks',
	// 	},
	// 	{
	// 		name: 'WMT',
	// 		colName: 'walmart',
	// 		logo: walmart.src,
	// 		category: 'stocks',
	// 	},
	// 	{
	// 		name: 'META',
	// 		colName: 'meta',
	// 		logo: meta.src,
	// 		category: 'stocks',
	// 	},
	// 	{
	// 		name: 'SPY',
	// 		colName: 'spdr',
	// 		logo: spy.src,
	// 		category: 'stocks',
	// 	},
	// 	{
	// 		name: 'MA',
	// 		colName: 'mastercard',
	// 		logo: mastercard.src,
	// 		category: 'stocks',
	// 	},
	// 	{
	// 		name: 'CVX',
	// 		colName: 'chevron_corp',
	// 		logo: chevron.src,
	// 		category: 'stocks',
	// 	},
	// 	{
	// 		name: 'BRK-A',
	// 		colName: 'BRK-A',
	// 		logo: berkshirehathway.src,
	// 		category: 'stocks',
	// 	},
	// ]

	return (
		<>
			<section className="h-fit w-full">
				<div className="w-full h-fit py-2 px-1 mb-2">
					<h5 className={`interBold text-lg ${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500'}  mb-1`}>Featured comparisons</h5>
					<div className="w-full hidden md:flex h-fit flex-row items-center justify-start gap-2">
						{priorityAssetClasses.map((item, id) => {
							if (item.index == defaultIndex) {
								return item.assetClasses.map((assetClass, key) => {
									return (
										<div
											key={key}
											onClick={() => {
												if (!selectedIndices.includes(assetClass.colName)) {
													// fetchIndexData({ tableName: 'histcomp', index: assetClass.colName })
													setSelectedIndices((prevState) => [...prevState, assetClass.colName])
												} else {
													// removeIndex(assetClass.colName)
													setSelectedIndices((prevState) =>
														prevState.filter((i) => {
															return i != assetClass.colName
														})
													)
												}
											}}
											className={`w-fit h-fit py-2 px-2 rounded-full flex flex-row items-center justify-around gap-10 ${
												mode == 'dark' ? 'border border-whiteText-500/50 shadow-sm shadow-whiteText-500/50' : 'border border-gray-300/50 bg-gray-100/20 shadow-md shadow-gray-300 '
											}  cursor-pointer hover:bg-gray-200`}
											style={{
												backgroundColor: selectedIndices.includes(assetClass.colName) ? '#2962FF99' : 'transparent',
												boxShadow: mode == 'dark' && selectedIndices.includes(assetClass.colName) ? `0px 0px 6px 1px #2962FF` : '',
												// backgroundColor: selectedIndices.includes(assetClass.colName) ? selectedIndices.includes(assetClass.colName) : 'transparent',
												// boxShadow: mode == 'dark' && selectedIndices.includes(assetClass.colName) ? `0px 0px 6px 1px ${assetClass.selectionColor}` : '',
											}}
										>
											<div className="flex flex-row items-center justify-start gap-2">
												<div
													className={`w-10 p-3 ${
														selectedIndices.includes(assetClass.colName) ? 'border-2 border-white p-3' : ''
													} aspect-square rounded-full bg-contain bg-center bg-no-repeat cursor-pointer`}
													style={{
														backgroundImage: `url('${assetClass.logo}')`,
													}}
												></div>
												<h5
													className={`interBold ${mode == 'dark' ? ' text-whiteText-500' : ' text-blackText-500'} text-lg uppercase ${
														selectedIndices.includes(assetClass.colName) ? 'titleShadow' : ''
													}`}
													style={{
														color: selectedIndices.includes(assetClass.colName) ? '#FFFFFF' : mode == 'dark' ? '#FFFFFF' : '#2A2A2A',
													}}
												>
													{assetClass.name}
												</h5>
											</div>
											<h5
												className={`pangramCompact ${selectedIndices.includes(assetClass.colName) ? ' bg-whiteText-500 p-1 rounded-full border border-gray-400' : ''} text-sm ${
													(assetClass.name === 'STOCK5' ? stc5DayChange : Number(dayChange[assetClass.colName])) > 0 ? 'text-nexLightGreen-500' : 'text-nexLightRed-500'
												}`}
											>{`${
												(assetClass.name === 'STOCK5' ? stc5DayChange : Number(dayChange[assetClass.colName])) > 0
													? '+' + (assetClass.name === 'STOCK5' ? stc5DayChange : dayChange[assetClass.colName])
													: assetClass.name === 'STOCK5'
													? stc5DayChange
													: dayChange[assetClass.colName]
											}`}</h5>
										</div>
									)
								})
							}
						})}
						{/* <div
							className={`h-14 aspect-square rounded-full flex flex-row items-center justify-center border ${
								mode == 'dark' ? ' border-whiteText-500/50 shadow shadow-whiteText-500/50' : 'border-gray-300/50 bg-gray-100/20 shadow-md shadow-gray-300 '
							} cursor-pointer hover:bg-gray-200`}
							onClick={openClassesModal}
						>
							{mode == 'dark' ? <BsPlus color="#FFFFFF" size={30} /> : <BsPlus color="#2A2A2A" size={30} />}
						</div> */}
					</div>
					<div className="w-full flex md:hidden h-fit flex-row items-center justify-start gap-2">
						{priorityAssetClasses.map((item, id) => {
							if (item.index == defaultIndex) {
								return item.assetClasses.map((assetClass, key) => {
									if (key == 0 || key == 1) {
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
												className="w-5/12 h-fit py-2 px-2 rounded-full flex flex-row items-center justify-around border border-gray-300/50 bg-gray-100/20 shadow-md shadow-gray-300 cursor-pointer hover:bg-gray-200"
												// style={{
												// 	backgroundColor: selectedIndices.includes(assetClass.colName) ? assetClass.selectionColor : 'transparent',
												// }}
											>
												<div className="flex flex-row w-full items-center justify-between pr-2">
													<div
														className={`w-10 p-3 ${
															selectedIndices.includes(assetClass.colName) ? 'border-2 border-white p-3' : ''
														} aspect-square rounded-full bg-contain bg-center bg-no-repeat cursor-pointer`}
														style={{
															backgroundImage: `url('${assetClass.logo}')`,
														}}
													></div>
													<h5
														className={`interBold ${mode == 'dark' ? ' text-whiteText-500' : ' text-blackText-500'} text-lg uppercase ${
															selectedIndices.includes(assetClass.colName) ? 'titleShadow' : ''
														}`}
														style={{
															color: selectedIndices.includes(assetClass.colName) ? '#FFFFFF' : mode == 'dark' ? '#FFFFFF' : '#2A2A2A',
														}}
													>
														{assetClass.name}
													</h5>
												</div>
											</div>
										)
									}
								})
							}
						})}
						{/* <div
						className={`h-14 aspect-square rounded-full flex flex-row items-center justify-center border ${
							mode == 'dark' ? ' border-whiteText-500/50 shadow shadow-whiteText-500/50' : 'border-gray-300/50 bg-gray-100/20 shadow-md shadow-gray-300 '
						} cursor-pointer hover:bg-gray-200`}
							onClick={openClassesModal}
						>
							{mode == 'dark' ? <BsPlus color="#FFFFFF" size={30} /> : <BsPlus color="#2A2A2A" size={30} />}
						</div> */}
					</div>
				</div>

				<div
					// className={`h-[50px] md:h-[40vh] xl:h-[50px] w-[600px] p-3 rounded-2xl border border-gray-300/50 ${mode == 'dark' ? ' bg-[#101010] ' : 'bg-gray-100/20 shadow-md shadow-gray-300'} `}
					className={`h-[80vh] md:h-[40vh] xl:h-[80vh] w-full p-2 rounded-2xl border border-gray-300/50 ${mode == 'dark' ? ' bg-[#181C27] ' : 'bg-[#FFFFFF] shadow-md shadow-gray-300'} `}
					// className={`h-[500px] w-full p-0 rounded-2xl border border-gray-300/50 ${mode == 'dark' ? ' bg-[#101010] ' : 'bg-[#FFFFFF] shadow-md shadow-gray-300'} `}
					// className={`h-full md:h-[40vh] xl:h-fit w-full p-3 rounded-2xl border border-gray-300/50 ${mode == 'dark' ? ' bg-[#101010] ' : 'bg-[#FFFFFF] shadow-md shadow-gray-300' } `}
					style={{
						boxShadow: mode == 'dark' ? `0px 0px 6px 1px rgba(91,166,153,0.68)` : '',
					}}
				>
					<TradingViewChart selectedIndices={selectedIndices} index={defaultIndex} />
					{/* <div className="flex flex-row items-start justify-end px-2 mt-2 mb-6">
						<Menu
							menuButton={
								<div className="w-fit h-fit px-3 py-2 ml-2 hidden lg:flex flex-row items-center justify-center gap-1 rounded-md bg-gradient-to-tl from-colorFour-500 to-colorSeven-500 active:translate-y-[1px] active:shadow-black shadow-sm shadow-blackText-500">
									<h5 className="text-sm interExtraBold titleShadow text-whiteText-500">
										{selectedDuration == 30
											? '1M'
											: selectedDuration == 60
											? '2M'
											: selectedDuration == 180
											? '6M'
											: selectedDuration == -1
											? 'YTD'
											: selectedDuration == 360
											? '1Y'
											: selectedDuration == 1080
											? '3Y'
											: selectedDuration == 1800
											? '5Y'
											: ''}
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
					</div>  */}
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
					{/* {defaultIndex === 'ANFI' ? <Chart data={ANFIData} /> : <Chart data={CR5Data} />} */}
				</div>
				{/* <div className='h-1'> */}
				{/* </div> */}
			</section>
			<GenericModal isOpen={classesModalOpen} onRequestClose={closeClassesModal} modalWidth={40}>
				<div className="w-full h-max-[10px] px-2 flex flex-row items-center justify-start">
					{/* <div className="h-fit w-2/5 border-r border-r-blackText-500/30 px-2 pt-3 pb-10 flex flex-col items-start justify-start gap-10"> */}
					<div
						className={`h-max-[10px] w-2/5 border-r ${
							mode == 'dark' ? ' border-r-whiteBackground-500/50' : 'border-r-blackText-500/30'
						} px-2 pt-3 pb-10 flex flex-col items-start justify-start gap-10`}
					>
						<h5
							className={`montrealBold text-base py-2 px-3 w-11/12 rounded-full cursor-pointer ${
								classesCategory == 'indices'
									? mode == 'dark'
										? ' bg-cover border-transparent bg-center bg-no-repeat text-whiteText-500'
										: ' text-whiteText-500 bg-colorSeven-500'
									: mode == 'dark'
									? ' text-whiteText-500'
									: 'text-blackText-500 bg-transparent'
							}`}
							style={{
								boxShadow: mode == 'dark' && classesCategory == 'indices' ? `0px 0px 6px 1px rgba(91,166,153,0.68)` : '',
								backgroundImage: mode == 'dark' && classesCategory == 'indices' ? `url('${mesh1.src}')` : '',
							}}
							onClick={() => {
								setClassesCategory('indices')
							}}
						>
							Indices
						</h5>
						<h5
							className={`montrealBold text-base py-2 px-3 w-11/12 rounded-full cursor-pointer ${
								classesCategory == 'commodities'
									? mode == 'dark'
										? ' bg-cover border-transparent bg-center bg-no-repeat text-whiteText-500'
										: ' text-whiteText-500 bg-colorSeven-500'
									: mode == 'dark'
									? ' text-whiteText-500'
									: 'text-blackText-500 bg-transparent'
							}`}
							style={{
								boxShadow: mode == 'dark' && classesCategory == 'commodities' ? `0px 0px 6px 1px rgba(91,166,153,0.68)` : '',
								backgroundImage: mode == 'dark' && classesCategory == 'commodities' ? `url('${mesh1.src}')` : '',
							}}
							onClick={() => {
								setClassesCategory('commodities')
							}}
						>
							Commodities
						</h5>
						<h5
							className={`montrealBold text-base py-2 px-3 w-11/12 rounded-full cursor-pointer ${
								classesCategory == 'cryptocurrencies'
									? mode == 'dark'
										? ' bg-cover border-transparent bg-center bg-no-repeat text-whiteText-500'
										: ' text-whiteText-500 bg-colorSeven-500'
									: mode == 'dark'
									? ' text-whiteText-500'
									: 'text-blackText-500 bg-transparent'
							}`}
							style={{
								boxShadow: mode == 'dark' && classesCategory == 'cryptocurrencies' ? `0px 0px 6px 1px rgba(91,166,153,0.68)` : '',
								backgroundImage: mode == 'dark' && classesCategory == 'cryptocurrencies' ? `url('${mesh1.src}')` : '',
							}}
							onClick={() => {
								setClassesCategory('cryptocurrencies')
							}}
						>
							Cryptocurrencies
						</h5>
						<h5
							className={`montrealBold text-base py-2 px-3 w-11/12 rounded-full cursor-pointer ${
								classesCategory == 'stocks'
									? mode == 'dark'
										? ' bg-cover border-transparent bg-center bg-no-repeat text-whiteText-500'
										: ' text-whiteText-500 bg-colorSeven-500'
									: mode == 'dark'
									? ' text-whiteText-500'
									: 'text-blackText-500 bg-transparent'
							}`}
							style={{
								boxShadow: mode == 'dark' && classesCategory == 'stocks' ? `0px 0px 6px 1px rgba(91,166,153,0.68)` : '',
								backgroundImage: mode == 'dark' && classesCategory == 'stocks' ? `url('${mesh1.src}')` : '',
							}}
							onClick={() => {
								setClassesCategory('stocks')
							}}
						>
							Stocks
						</h5>
					</div>
					{/* <div className="h-full w-3/5 grid grid-cols-3 auto-rows-max justify-start items-start gap-y-5 px-3"> */}
					<div className="max-h-[300px] overflow-y-scroll w-3/5 flex flex-col justify-start items-start gap-y-5 px-3">
						{comparisionIndices.map((cls, key) => {
							if (cls.category == classesCategory) {
								return (
									<div
										key={key}
										// onClick={() => {
										// 	if (!selectedIndices.includes(cls.columnName)) {
										// 		fetchIndexData({ tableName: 'histcomp', index: cls.columnName })
										// 		setSelectedIndices((prevState) => [...prevState, cls.columnName])
										// 	} else {
										// 		removeIndex(cls.columnName)
										// 		setSelectedIndices((prevState) =>
										// 			prevState.filter((i) => {
										// 				return i != cls.columnName
										// 			})
										// 		)
										// 	}
										// }}
										className={`flex flex-row items-center justify-center rounded-xl cursor-pointer w-full p-3 hover:bg-gray-200/50 ${
											selectedIndices.includes(cls.columnName) ? ' bg-gray-800' : ''
										}`}
									>
										<div className="w-1/3 ">
											<div
												className=" bg-center bg-contain w-2/5 bg-no-repeat bg-white border border-gray-100 shadow-md shadow-gray-200 aspect-square rounded-full"
												style={{
													backgroundImage: `url(${cls.logo})`,
												}}
												// onClick={() => closeClassesModal()}
												onClick={() => {
													closeClassesModal()
													if (!selectedIndices.includes(cls.columnName)) {
														fetchIndexData({ tableName: 'histcomp', index: cls.columnName })
														setSelectedIndices((prevState) => [...prevState, cls.columnName])
													} else {
														removeIndex(cls.columnName)
														setSelectedIndices((prevState) =>
															prevState.filter((i) => {
																return i != cls.columnName
															})
														)
													}
												}}
											></div>
										</div>
										<h5
											className={`interBold w-1/3 flex items-center justify-center text-base ${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500'} uppercase`}
											onClick={() => {
												closeClassesModal()
												if (!selectedIndices.includes(cls.columnName)) {
													fetchIndexData({ tableName: 'histcomp', index: cls.columnName })
													setSelectedIndices((prevState) => [...prevState, cls.columnName])
												} else {
													removeIndex(cls.columnName)
													setSelectedIndices((prevState) =>
														prevState.filter((i) => {
															return i != cls.columnName
														})
													)
												}
											}}
										>
											{cls.shortName}
										</h5>

										<div className="w-1/3 flex flex-row gap-1 items-center justify-end">
											<input
												type="color"
												name="comparisionChart"
												className="h-6 w-5 rounded-full border-none bg-transparent"
												value={cls.selectionColor}
												onChange={(event) => {
													const newColor = event.target.value
													const newObj = { ...cls }
													newObj.selectionColor = newColor
													setComparisonIndices(newObj)
													// closeClassesModal()
												}}
											/>
											{selectedIndices.includes(cls.columnName) ? <CiCircleCheck size={25} strokeWidth={1.5} color="#089981" /> : ''}
										</div>
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
