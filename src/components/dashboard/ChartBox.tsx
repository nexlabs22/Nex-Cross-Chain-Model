import { useEffect, useState } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'

// Components :
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import GenericModal from '../GenericModal'
const Chart = dynamic(() => import('@components/dashboardChart'), { loading: () => <p>Loading ...</p>, ssr: false })

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
import { BsChevronCompactRight, BsCheckCircleFill, BsChevronCompactLeft } from 'react-icons/bs'
import { IoIosCheckmarkCircleOutline } from 'react-icons/io'

const DashboardChartBox = () => {
	const { defaultIndex } = useLandingPageStore()
	const [selectedIndices, setSelectedIndices] = useState<string[]>([])
	const { IndexData, fetchIndexData, removeIndex, selectedDuration, selectDuration } = useChartDataStore()
	const [classesModalOpen, setClassesModalOpen] = useState<boolean>(false)
	const [classesCategory, setClassesCategory] = useState<string>('indices')

	const openClassesModal = () => {
		setClassesModalOpen(true)
	}

	const closeClassesModal = () => {
		setClassesModalOpen(false)
	}

	useEffect(() => {
		fetchIndexData({ tableName: 'histcomp', index: defaultIndex })
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

	const priorityAssetClasses = [
		{
			index: 'ANFI',
			assetClasses: [
				{
					name: 'bitcoin',
					colName:'bitcoin',
					logo: btc.src,
					selectionColor: "#1F51FF"
				},
				{
					name: 'gold',
					colName:'gold',
					logo: gold.src,
					selectionColor: "#FFBF00"
				},
				{
					name: 'oil',
					colName:'oil',
					logo: oil.src,
					selectionColor: "#023020"
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
					selectionColor: "#FF3232"
				},
				{
					name: 'dow30',
					colName: 'dow',
					logo: dow.src,
					selectionColor: "#1F51FF"
				},
				{
					name: 'nasdaq',
					colName: 'nasdaq',
					logo: nasdaq.src,
					selectionColor: "#FFBF00"
				},
				{
					name: 'nyse',
					colName:'nyse',
					logo: nyse.src,
					selectionColor: "#40B5AD"
				},
			],
		},
	]

	const allClasses = [
		{
			name: 'bitcoin',
			colName:'bitcoin',
			logo: btc.src,
			category: "cryptocurrencies"
		},
		{
			name: 'gold',
			colName:'gold',
			logo: gold.src,
			category: "goods"
		},
		{
			name: 'oil',
			colName:'oil',
			logo: oil.src,
			category: "goods"
		},

		{
			name: 's&p',
			colName:'sandp',
			logo: sandp.src,
			category: "indices"
		},
		{
			name: 'dow30',
			colName:'dow',
			logo: dow.src,
			category: "indices"
		},
		{
			name: 'nasdaq',
			colName:'nasdaq',
			logo: nasdaq.src,
			category: "indices"
		},
		{
			name: 'nyse',
			colName:'nyse',
			logo: nyse.src,
			category: "indices"
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
													fetchIndexData({ tableName: 'histcomp', index: assetClass.colName})
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
											
											className="w-fit h-fit py-2 px-2 rounded-full flex flex-row items-center justify-around gap-10 border border-gray-300/50 bg-gray-100/20 shadow-md shadow-gray-300 cursor-pointer hover:bg-gray-200" style={{
												backgroundColor: selectedIndices.includes(assetClass.colName) ? assetClass.selectionColor : "transparent"
											}}
										>
											<div className="flex flex-row items-center justify-start gap-2">
												<div
													className="w-10 p-3 aspect-square rounded-full bg-contain bg-center bg-no-repeat cursor-pointer shadow shadow-gray-300"
													style={{
														backgroundImage: `url('${assetClass.logo}')`,
													}}
												></div>
												<h5 className={`montrealBold text-lg uppercase ${selectedIndices.includes(assetClass.colName) ? "titleShadow" : ""}`} style={{
													color: selectedIndices.includes(assetClass.colName) ? "#FFFFFF" : "#2A2A2A"
												}}>{assetClass.name}</h5>
											</div>
											<h5 className="pangramCompact text-sm text-nexLightGreen-500">+1.02%</h5>
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
					{/*<div className="w-full relative z-50 h-fit flex flex-row gap-3 overflow-x-scroll lg:overflow-x-hidden items-center justify-start lg:justify-center">
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
			</div>*/}

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
								selectedDuration == 60
									? 'selectedDurationBtn flex flex-row items-center justify-center rounded-lg border border-solid border-black px-2 py-1 mx-1'
									: 'flex flex-row items-center justify-center rounded-lg px-2 py-1 hover:bg-darkModeAccordionBackground-500 mx-1'
							}
							onClick={() => {
								selectDuration(60)
							}}
						>
							<p className="circularMedium text-base text-black">2M</p>
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
			</section>
			<GenericModal isOpen={classesModalOpen} onRequestClose={closeClassesModal} modalWidth={40}>
				<div className="w-full h-fit px-2 flex flex-row items-center justify-start">
					<div className="h-fit w-2/5 border-r border-r-blackText-500/30 px-2 pt-3 pb-10 flex flex-col items-start justify-start gap-10">
						<h5
							className={`montrealBold text-base py-2 px-3 w-11/12 rounded-full cursor-pointer ${classesCategory == 'indices' ? ' text-whiteText-500 bg-colorOne-500' : 'text-blackText-500 bg-transparent'
								}`}
							onClick={() => {
								setClassesCategory('indices')
							}}
						>
							Indices
						</h5>
						<h5
							className={`montrealBold text-base py-2 px-3 w-11/12 rounded-full cursor-pointer ${classesCategory == 'goods' ? ' text-whiteText-500 bg-colorOne-500' : 'text-blackText-500 bg-transparent'
								}`}
							onClick={() => {
								setClassesCategory('goods')
							}}
						>
							Goods
						</h5>
						<h5
							className={`montrealBold text-base py-2 px-3 w-11/12 rounded-full cursor-pointer ${classesCategory == 'cryptocurrencies' ? ' text-whiteText-500 bg-colorOne-500' : 'text-blackText-500 bg-transparent'
								}`}
							onClick={() => {
								setClassesCategory('cryptocurrencies')
							}}
						>
							Cryptocurrencies
						</h5>
					</div>
					<div className="h-full w-3/5 grid grid-cols-3 auto-rows-max justify-start items-start gap-y-5 px-3">
						{
							allClasses.map((cls, key) => {
								// console.log(cls)
								if (cls.category == classesCategory) {
									return (
										<div key={key}
											onClick={()=>{
												if (!selectedIndices.includes(cls.colName)) {
													fetchIndexData({ tableName: 'histcomp', index: cls.colName})
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
											className={`flex flex-col items-center justify-center rounded-xl cursor-pointer w-full p-3 hover:bg-gray-200/50 ${selectedIndices.includes(cls.colName) ? 'bg-gray-200/50' : ''}`}>
											<div className=' bg-center bg-contain bg-no-repeat w-2/5 border border-gray-100 shadow-md shadow-gray-200 aspect-square rounded-full' style={{
												backgroundImage: `url(${cls.logo})`
											}}></div>
											<h5 className='montrealBold text-base text-blackText-500 uppercase'>
												{
													cls.name
												}
											</h5>
										</div>
									)
								}
							})
						}
					</div>
				</div>
			</GenericModal>
		</>
	)
}

export default DashboardChartBox
