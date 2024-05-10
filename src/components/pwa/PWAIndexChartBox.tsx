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

const PWAChartBox = () => {
	const { defaultIndex, mode, selectedIndex, selectedComparisonIndices } = useLandingPageStore()

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

	return (
		<>
			<section className="h-fit w-full">


				<div
					className={`h-[60vh] w-full my-2 py-2 px-1 rounded-2xl `}
					style={{
						boxShadow: mode == 'dark' ? `0px 0px 6px 1px rgba(37,37,37,0.3)` : '',
					}}
				>
					<TradingViewChart selectedIndices={selectedComparisonIndices} index={selectedIndex} page={'dashboard'} pwa={true} />

				</div>

			</section>

		</>
	)
}

export default PWAChartBox
