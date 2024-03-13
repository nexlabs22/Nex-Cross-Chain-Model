'use client'

import Image from 'next/image'
import DappNavbar from '@/components/DappNavbar'
import dynamic from 'next/dynamic'
import Footer from '@/components/newFooter'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'
import { useAddress, useContract, useContractRead } from '@thirdweb-dev/react'
import GenericAvatar from '@/components/GenericAvatar'
import { useEffect, useState } from 'react'
import useTradePageStore from '@/store/tradeStore'
import TipsBox2 from '@/components/TipsBox'
import ProgressBar from '@ramonak/react-progress-bar'
import New3DPieChart from '@/components/new3DPieChart'
import mesh1 from '@assets/images/mesh1.png'
import mesh2 from '@assets/images/mesh2.png'

import bg from '@assets/images/3d hologram.png'
import anfiLogo from '@assets/images/anfi.png'
import cr5Logo from '@assets/images/cr5.png'
import { useRouter } from 'next/navigation'
import btc from '@assets/images/btc.png'
import { MdOutlineDangerous } from 'react-icons/md'
const PNLChart = dynamic(() => import('@/components/portfolioPNLChart'), { loading: () => <p>Loading ...</p>, ssr: false })
const TreemapChart = dynamic(() => import('@/components/GenericTreemapChart'), { loading: () => <p>Loading ...</p>, ssr: false })
import { BiCopy } from 'react-icons/bi'
import { PiQrCodeDuotone } from 'react-icons/pi'
import { BsCalendar4 } from 'react-icons/bs'
import { Shimmer } from 'react-shimmer'
import {
	goerliAnfiIndexToken,
	goerliCrypto5IndexToken,
	crypto5PoolAddress,
	goerlianfiPoolAddress,
	zeroAddress,
	goerliAnfiV2IndexToken,
	goerliUsdtAddress,
	goerliLinkAddress,
	goerliLinkWethPoolAddress,
	sepoliaAnfiV2IndexToken,
	sepoliaCrypto5V2IndexToken,
	goerliCR5PoolAddress,
} from '@/constants/contractAddresses'
import { indexTokenAbi, indexTokenV2Abi } from '@/constants/abi'
import { FormatToViewNumber, formatNumber, num } from '@/hooks/math'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { GenericToast } from '@/components/GenericToast'
import AccountRebalancingSection from '@/components/AccountRebalancingSection'
import GenericModal from '@/components/GenericModal'
import QRCode from 'react-qr-code'

import GenericPieChart from '@/components/GenericPieChart'
import Link from 'next/link'
import Head from 'next/head'

import { useQuery } from '@apollo/client'
import { GET_HISTORICAL_PRICES } from '@/uniswap/query'
import { getTimestampDaysAgo } from '@/utils/conversionFunctions'

import bg2 from '@assets/images/bg-2.png'
import HistoryTable from '@/components/TradeTable'
import TopHolders from '@/components/topHolders'
import { reduceAddress } from '@/utils/general'
import { GoArrowRight, GoChevronDown } from 'react-icons/go'
import { IoMdArrowDown, IoMdArrowUp } from 'react-icons/io'
import NewHistoryTable from '@/components/NewHistoryTable'
import { useSearchParams } from 'next/navigation'
import { nexTokens } from '@/constants/nexIndexTokens'
import { nexTokenDataType } from '@/types/nexTokenData'
import convertToUSD from '@/utils/convertToUsd'
import usePortfolioPageStore from '@/store/portfolioStore'
import { GetPositionsHistory2 } from '@/hooks/getTradeHistory2'

// Firebase :
import { getDatabase, ref, onValue, set, update } from 'firebase/database'
import { database } from '@/utils/firebase'
import { FaCheck } from 'react-icons/fa6'
import { MdOutlineEdit, MdOutlineRemoveRedEye } from 'react-icons/md'
import ImageViewer from 'react-simple-image-viewer'
import { Uploader } from 'uploader'
import { UploadDropzone } from 'react-uploader'
import 'react-image-upload/dist/index.css'
import { Menu, MenuButton } from '@szhsin/react-menu'
import '@szhsin/react-menu/dist/index.css'
import '@szhsin/react-menu/dist/transitions/slide.css'
import { useLandingPageStore } from '@/store/store'
import ConnectButton from '@/components/ConnectButton'
import getPoolAddress from '@/uniswap/utils'
import { sepoliaTokens } from '@/constants/goerliTokens'
import getPriceHistory from '@/utils/getHistoryPriceByDate'
import { Positions } from '@/types/tradeTableTypes'
import MobileFooterSection from '@/components/mobileFooter'

interface User {
	email: string
	inst_name: string
	main_wallet: string
	name: string
	vatin: string
	address: string
	ppLink: string
	p1: boolean
	p2: boolean
	p3: boolean
	p4: boolean
	p5: boolean
	ppType: string
	creationDate: string
}

export default function Portfolio() {
	const address = useAddress()
	const router = useRouter()
	const [QRModalVisible, setQRModalVisible] = useState(false)
	const { selectedPortfolioChartSliceIndex, setSelectedPortfolioChartSliceIndex, setEthPriceInUsd, ethPriceInUsd } = useTradePageStore()
	const { portfolioData, setDayChange, indexSelectedInPie } = usePortfolioPageStore()
	const [chartType, setChartType] = useState('pie')
	const { mode } = useLandingPageStore()

	// console.log("ethPriceInUsd--->",ethPriceInUsd)
	// useEffect(() => {
	// 	setEthPriceInUsd()
	// }, [setEthPriceInUsd])

	const anfiTokenContract = useContract(sepoliaAnfiV2IndexToken, indexTokenV2Abi)
	const crypto5TokenContract = useContract(sepoliaCrypto5V2IndexToken, indexTokenAbi)
	// const anfiTokenContract = useContract(goerliAnfiV2IndexToken, indexTokenV2Abi)
	// const crypto5TokenContract = useContract(goerliCrypto5IndexToken, indexTokenAbi)

	const anfiTokenBalance = useContractRead(anfiTokenContract.contract, 'balanceOf', [!!address ? address : zeroAddress])
	const crypto5TokenBalance = useContractRead(crypto5TokenContract.contract, 'balanceOf', [!!address ? address : zeroAddress])

	const anfiPercent = (num(anfiTokenBalance.data) / (num(crypto5TokenBalance.data) + num(anfiTokenBalance.data))) * 100
	const crypto5Percent = (num(crypto5TokenBalance.data) / (num(crypto5TokenBalance.data) + num(anfiTokenBalance.data))) * 100
	const anfiDetails = sepoliaTokens.filter((token) => token.symbol === 'ANFI')
	const cr5Details = sepoliaTokens.filter((token) => token.symbol === 'CRYPTO5')

	const {
		loading: loadingAnfi,
		error: errorAnfi,
		data: dataAnfi,
	} = useQuery(GET_HISTORICAL_PRICES, {
		// variables: { poolAddress: getPoolAddress(anfiDetails[0].address, anfiDetails[0].decimals, false ), startingDate: getTimestampDaysAgo(90), limit: 10, direction: 'asc' },
		variables: { poolAddress: goerlianfiPoolAddress.toLowerCase(), startingDate: getTimestampDaysAgo(1000), limit: 10, direction: 'asc' },
	})

	const {
		loading: loadingCR5,
		error: errorCR5,
		data: dataCR5,
	} = useQuery(GET_HISTORICAL_PRICES, {
		variables: { poolAddress: goerliLinkWethPoolAddress.toLowerCase(), startingDate: getTimestampDaysAgo(1000), limit: 10, direction: 'asc' },
	})

	// *** FUNCTION TO GET THE INDEX PRICE HISTORY *** // Commented for later use
	// useEffect(()=>{
	// 	async function getCR5PriceHistory() {
	// 		//  const cr5poolAddress = getPoolAddress(cr5Details[0].address, cr5Details[0].decimals, false )
	// 		const cr5poolAddress = '0x70393314c70C903ebf6ef073783B7F207cC9A5e2'
	// 		const numberOfDays = 45
	// 		const priceList = []
	// 		for  (let i=0; i<=numberOfDays; i++) {
	// 			const price = await getPriceHistory(cr5poolAddress as string, 86400 * i)
	// 			priceList.push({date : new Date().getTime() - (86400 * i), price})
	// 		}
	// 		console.log(priceList)
	// 		return priceList
	// 	}

	// 	// getCR5PriceHistory()
	// })

	let [chartArr, setChartArr] = useState<{ time: number; value: number }[]>([])
	const indexPercent = { anfi: anfiPercent, cr5: crypto5Percent }

	if (!loadingCR5 && !loadingAnfi && !errorCR5 && !errorAnfi && chartArr.length == 0 && (!!anfiPercent || !!crypto5Percent)) {
		const chartData: { time: number; value: number }[] = []
		const ANFIData = dataAnfi.poolDayDatas
		const CR5Data = dataCR5.poolDayDatas
		for (let i = 0; i <= ANFIData.length - 1; i++) {
			const chartObj: { time: number; value: number } = { time: 0, value: 0 }
			const value = num(anfiTokenBalance.data) * Number(ANFIData[i].token0Price) + num(crypto5TokenBalance.data) * Number(CR5Data[i]?.token0Price || 0)
			chartObj.time = ANFIData[i].date
			chartObj.value = value
			chartData.push(chartObj)
		}
		setChartArr(chartData)

		const anfiPrice = ANFIData[ANFIData.length - 1].token0Price * num(anfiTokenBalance.data)
		const cr5Price = CR5Data[CR5Data.length - 1].token0Price * num(crypto5TokenBalance.data)
		// setIndexPrices({ anfi: anfiPrice, cr5: cr5Price })

		const todayANFIPrice = ANFIData[ANFIData.length - 1].token0Price || 0
		const yesterdayANFIPrice = ANFIData[ANFIData.length - 2].token0Price || 0
		const anfi24hChng = ((todayANFIPrice - yesterdayANFIPrice) / yesterdayANFIPrice) * 100

		const todayCR5Price = CR5Data[CR5Data.length - 1].token0Price || 0
		const yesterdayCR5Price = CR5Data[CR5Data.length - 2]?.token0Price || 0
		const cr524hChng = ((todayCR5Price - yesterdayCR5Price) / yesterdayCR5Price) * 100

		setDayChange({ anfi: todayANFIPrice - yesterdayANFIPrice, cr5: todayCR5Price - yesterdayCR5Price })
	}

	const todayPortfolioPrice = chartArr[chartArr.length - 1]?.value
	const yesterdayPortfolioPrice = chartArr[chartArr.length - 2]?.value
	const portfolio24hChange = ((todayPortfolioPrice - yesterdayPortfolioPrice) / yesterdayPortfolioPrice) * 100

	const handleCopy = () => {
		if (address) {
			GenericToast({
				type: 'success',
				message: 'Copied !',
			})
		} else {
			GenericToast({
				type: 'error',
				message: 'Please connect your wallet !',
			})
		}
	}

	const handleCopyIndexDetails = () => {
		GenericToast({
			type: 'success',
			message: 'Copied !',
		})
	}

	const data = [
		['Asset', 'Percentage'],
		['CRYPTO5', crypto5Percent ? crypto5Percent : 0],
		['ANFI', anfiPercent ? anfiPercent : 0],
		// ['FIAT', anfiPercent ? 0 : 5],
	]

	// const data = [
	//     ["Asset", "Percentage"],
	//     ["ANFI", 11],
	//     ["CRYPTO5", 2],
	//     ["ETH", 2],
	//     ["BTC", 2],
	//     ["MATIC", 7],
	// ];

	const PieChartdata = [
		{
			label: 'ANFI',
			percentage: !!anfiPercent ? FormatToViewNumber({ value: anfiPercent, returnType: 'string' }) + '%' : '0%',
			color: '#133140',
		},
		{
			label: 'CRYPTO 5',
			percentage: !!crypto5Percent ? FormatToViewNumber({ value: crypto5Percent, returnType: 'string' }) + '%' : '0%',
			color: '#b5e7ff',
		},
	]

	const options = {
		is3D: true,
		fontName: 'montrealBold',
		slices: [{ color: '#9c4f29' }, { color: '#d3bf24' }, { color: '#73cbf3' }],
		tooltip: { text: 'percentage' },
		backgroundColor: 'transparent',
		legend: {
			position: 'right', // Set the legend position to the right
			alignment: 'center', // Horizontally center the legend
		},
	}

	const emptyData = [
		{ time: '2018-01-04', value: 0 },
		{ time: '2018-01-05', value: 0 },
		{ time: '2018-01-08', value: 0 },
		{ time: '2018-01-09', value: 0 },
		{ time: '2018-01-10', value: 0 },
		{ time: '2018-01-11', value: 0 },
		{ time: '2018-01-12', value: 0 },
		{ time: '2018-01-16', value: 0 },
		{ time: '2018-01-17', value: 0 },
		{ time: '2018-01-18', value: 0 },
		{ time: '2018-01-19', value: 0 },
		{ time: '2018-01-22', value: 0 },
		{ time: '2018-01-23', value: 0 },
		{ time: '2018-01-24', value: 0 },
		{ time: '2018-01-25', value: 0 },
		{ time: '2018-01-26', value: 0 },
		{ time: '2018-01-29', value: 0 },
		{ time: '2018-01-30', value: 0 },
		{ time: '2018-01-31', value: 0 },
		{ time: '2018-02-01', value: 0 },
		{ time: '2018-02-02', value: 0 },
		{ time: '2018-02-05', value: 0 },
		{ time: '2018-02-06', value: 0 },
		{ time: '2018-02-07', value: 0 },
		{ time: '2018-02-08', value: 0 },
		{ time: '2018-02-09', value: 0 },
		{ time: '2018-02-12', value: 0 },
		{ time: '2018-02-13', value: 0 },
		{ time: '2018-02-14', value: 0 },
		{ time: '2018-02-15', value: 0 },
		{ time: '2018-02-16', value: 0 },
		{ time: '2018-02-20', value: 0 },
		{ time: '2018-02-21', value: 0 },
		{ time: '2018-02-22', value: 0 },
		{ time: '2018-02-23', value: 0 },
		{ time: '2018-02-26', value: 0 },
		{ time: '2018-02-27', value: 0 },
		{ time: '2018-02-28', value: 0 },
		{ time: '2018-03-01', value: 0 },
		{ time: '2018-03-02', value: 0 },
		{ time: '2018-03-05', value: 0 },
		{ time: '2018-03-06', value: 0 },
		{ time: '2018-03-07', value: 0 },
		{ time: '2018-03-08', value: 0 },
		{ time: '2018-03-09', value: 0 },
		{ time: '2018-03-12', value: 0 },
		{ time: '2018-03-13', value: 0 },
		{ time: '2018-03-14', value: 0 },
		{ time: '2018-03-15', value: 0 },
		{ time: '2018-03-16', value: 0 },
		{ time: '2018-03-19', value: 0 },
		{ time: '2018-03-20', value: 0 },
		{ time: '2018-03-21', value: 0 },
		{ time: '2018-03-22', value: 0 },
		{ time: '2018-03-23', value: 0 },
		{ time: '2018-03-26', value: 0 },
		{ time: '2018-03-27', value: 0 },
		{ time: '2018-03-28', value: 0 },
		{ time: '2018-03-29', value: 0 },
		{ time: '2018-04-02', value: 0 },
		{ time: '2018-04-03', value: 0 },
		{ time: '2018-04-04', value: 0 },
	]

	const showPortfolioData = address && (num(anfiTokenBalance.data) > 0 || num(crypto5TokenBalance.data) > 0) ? true : false

	const [assetData, setAssetData] = useState<nexTokenDataType[]>([])

	useEffect(() => {
		async function getTokenDetails() {
			const data = await Promise.all(
				nexTokens.map(async (item: nexTokenDataType) => {
					const calculatedUsdValue = (await convertToUSD(item.address, ethPriceInUsd, false)) || 0
					const totalToken = item.symbol === 'ANFI' ? num(anfiTokenBalance.data) || 0 : item.symbol === 'CRYPTO5' ? num(crypto5TokenBalance.data) || 0 : 0
					const totalTokenUsd = calculatedUsdValue * totalToken || 0
					const percentage = (item.symbol === 'ANFI' ? anfiPercent : crypto5Percent) || 0

					return {
						...item,
						totalToken,
						totalTokenUsd,
						percentage,
					}
				})
			)

			setAssetData(data)
		}

		getTokenDetails()
	}, [anfiTokenBalance.data, crypto5TokenBalance.data, ethPriceInUsd, anfiPercent, crypto5Percent])
	// roundedPercentages.reduce((acc, { weight }) => acc + weight, 0)
	const totalPortfolioBalance = assetData.reduce((total, data) => total + Number(data.totalTokenUsd), 0)

	// const storedData = localStorage.getItem('totalTradedBalance')
	// const totalTradedBalanceObj:{anfi:number,cr5:number} = storedData ? JSON.parse(storedData) : {anfi:0,cr5:0}
	// const totalTradedBalance = totalTradedBalanceObj.anfi + totalTradedBalanceObj.cr5

	// useEffect(() => {
	// let totalTradedBalance = 0
	// if (typeof window !== 'undefined') {
	//   	const storedData = localStorage.getItem('totalTradedBalance');
	// 	const totalTradedBalanceObj:{anfi:number,cr5:number} = storedData ? JSON.parse(storedData) : {anfi:0,cr5:0}
	// 	totalTradedBalance = totalTradedBalanceObj.anfi + totalTradedBalanceObj.cr5
	// }
	//   }, []);
	const positionHistory = GetPositionsHistory2()
	const latestObjectsMap: Map<string, Positions> = new Map()

	for (const item of positionHistory.data) {
		if (!latestObjectsMap.has(item.indexName)) {
			latestObjectsMap.set(item.indexName, item)
		}
	}

	const [uploadedPPLink, setUploadedPPLink] = useState('none')
	const [chosenPPType, setChosenPPType] = useState('none')

	const [connectedUser, setConnectedUser] = useState<User>()
	const [connectedUserId, setConnectedUserId] = useState('')

	useEffect(() => {
		function getUser() {
			const usersRef = ref(database, 'users/')
			onValue(usersRef, (snapshot) => {
				const users = snapshot.val()
				for (const key in users) {
					// console.log(users[key])
					const potentialUser: User = users[key]
					if (address && potentialUser.main_wallet == address) {
						setConnectedUser(potentialUser)
						setConnectedUserId(key)
					}
				}
			})
		}
		getUser()
	}, [address])

	const indexDetails = [
		{
			index: 'ANFI',
			smartContract: sepoliaAnfiV2IndexToken || 'N/A',
			lastTnx: latestObjectsMap.get('ANFI')?.txHash || 'N/A',
			ownedAmount: FormatToViewNumber({ value: num(anfiTokenBalance.data), returnType: 'string' }) + ' ANFI',
			// tnxHistory: ,
		},
		{
			index: 'CRYPTO5',
			smartContract: sepoliaCrypto5V2IndexToken || 'N/A',
			lastTnx: latestObjectsMap.get('CRYPTO5')?.txHash || 'N/A',
			ownedAmount: FormatToViewNumber({ value: num(crypto5TokenBalance.data), returnType: 'string' }) + ' CRYPTO5',
			// tnxHistory: ,
		},
	]

	const indexDetailsMap: Map<string, any> = new Map()

	indexDetails.forEach((detail) => {
		indexDetailsMap.set(detail.index, detail)
	})

	chartArr = chartArr.filter((obj) => obj.time !== 1702512000)

	return (
		<>
			<Head>
				<title>Nex Labs - Portfolio</title>
				<meta
					name="description"
					content="Take a peek at your Nex Labs portfolio and see how you leverage the platform. Check your balance, wallet, transaction history, account destribution and more on the portfolio page. Get the inside view."
				/>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main className={`min-h-screen overflow-x-hidden h-fit w-screen ${mode == 'dark' ? 'bg-gradient-to-tl from-[#050505] to-[#050505]' : 'bg-whiteBackground-500'}`}>
				<section className="h-full w-fit overflow-x-hidde">
					<DappNavbar />
					{address ? (
						<section className="w-screen h-fit pt-10">
							<div className="w-full h-fit px-20 xl:px-20 py-5 flex flex-col lg:flex-row items-center justify-between mb-10">
								<div className="w-full lg:w-2/5  h-fit flex flex-col lg:flex-row items-center justify-between gap-8">
									{address && address != '' ? (
										<div
											className="w-40 lg:h-44 lg:w-auto xl:w-40 aspect-square flex rounded-full relative bg-center bg-cover bg-no-repeat"
											style={{
												backgroundImage:
													uploadedPPLink != 'none'
														? `url('${uploadedPPLink}')`
														: uploadedPPLink == 'none' && connectedUser?.ppType != 'identicon'
														? `url('${connectedUser?.ppLink}')`
														: '',
											}}
										>
											{connectedUser?.ppType == 'identicon' || (chosenPPType == 'identicon' && uploadedPPLink == 'none') ? <GenericAvatar walletAddress={address}></GenericAvatar> : ''}
										</div>
									) : (
										<div className="w-40 lg:w-2/5 aspect-square bg-colorSeven-500 rounded-full"></div>
									)}
									<div className="w-full lg:w-2/3 h-fit flex flex-col items-center lg:items-start justify-start gap-2">
										<h5 className={`text-xl ${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500'} interBold text-center lg:whitespace-nowrap lg:text-left`}>
											{connectedUser && connectedUser.main_wallet == address
												? connectedUser.inst_name != 'x'
													? connectedUser.inst_name
													: connectedUser.name != 'x'
													? connectedUser.name
													: 'Nex User'
												: 'Nex User'}
										</h5>
										<div className="flex flex-col lg:flex-row items-center justify-start gap-2">
											<h5 className={`text-base ${mode == 'dark' ? ' text-whiteText-500/70' : ' text-blackText-500'}  interMedium`}>
												{address && address != '' ? reduceAddress(address) : 'Connect your wallet'}
											</h5>
											<div className="w-fit h-fit flex flex-row items-center justify-between gap-2">
												<div className={` ${mode == 'dark' ? ' bg-whiteText-500' : 'bg-colorSeven-500/50'} w-fit cursor-pointer h-fit p-4 xl:p-2 rounded-full`}>
													<CopyToClipboard text={address as string} onCopy={handleCopy}>
														<BiCopy color="#000000" size={15} className="scale-150 xl:scale-100" />
													</CopyToClipboard>
												</div>
												<div
													className={` ${mode == 'dark' ? ' bg-whiteText-500' : 'bg-colorSeven-500/50'} w-fit cursor-pointer h-fit p-4 xl:p-2 rounded-full`}
													onClick={() => {
														if (address) setQRModalVisible(true)
														else
															GenericToast({
																type: 'error',
																message: `Please connect your wallet!`,
															})
													}}
												>
													<PiQrCodeDuotone color="#000000" size={15} className="scale-150 xl:scale-100" />
												</div>
											</div>
										</div>
										<div
											className={` ${
												mode == 'dark' ? ' bg-whiteBackground-500' : 'bg-colorSeven-500'
											} w-fit mt-5 xl:mt-0 h-fit py-1 px-3 rounded-2xl flex flex-row items-center justify-center gap-2`}
										>
											{mode == 'dark' ? <BsCalendar4 color="#000000" size={15} /> : <BsCalendar4 color="#000000" size={15} />}

											<h5 className={`text-base ${mode != 'dark' ? ' text-blackText-500' : 'text-blackText-500'}  interBold`}>Joined N/A day ago</h5>
										</div>
									</div>
								</div>
								{/* <div className="lg:flex w-3/5 h-fit justify-end" id="smallChartBox">
							<Chart data={complexData} />
						</div> */}
								<div className="lg:flex w-2/5 "></div>
								<div className="hidden lg:flex w-1/5 justify-end mr-0 relative mt-5 xl:mt-0" id="smallChartBox">
									{/* <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-bold italic text-black text-5xl z-10`}>
									${portfolio24hChange ? portfolio24hChange.toFixed(2) : 0}
								</div> */}
									<PNLChart data={showPortfolioData ? chartArr : emptyData} totalPortfolioBalance={totalPortfolioBalance} change={showPortfolioData ? portfolio24hChange : 0} />
								</div>
							</div>
							<div className=" w-full h-fit px-4 xl:px-20 py-5 flex flex-wrap xl:flex-row items-stretch justify-between xl:justify-center mb-10 ">
								<div className="w-1/2 lg:w-1/3 flex-grow flex flex-col items-center justify-center gap-2">
									<h5 className={`interBold text-xl ${mode == 'dark' ? ' text-whiteText-500/80' : 'text-blackText-500'}  text-center lg:text-left`}>Total Portfolio Balance</h5>
									<h5
										className={`interExtraBold text-2xl ${mode == 'dark' ? ' text-whiteText-500' : ' text-blackText-500'}  text-center lg:text-left`}
										title={totalPortfolioBalance.toString()}
										// title={
										// 	showPortfolioData && chartArr && chartArr[chartArr.length - 1] && chartArr[chartArr.length - 1].value < 0.01
										// 		? formatNumber(totalPortfolioBalance).toString()
										// 		: '0.00'
										// }
									>
										$
										{showPortfolioData && totalPortfolioBalance
											? totalPortfolioBalance < 0.01
												? '≈ 0.00 '
												: FormatToViewNumber({ value: totalPortfolioBalance, returnType: 'string' })
											: '0.00'}
									</h5>
								</div>
								<div className="w-1/2 lg:w-1/3 flex-grow flex flex-col items-center justify-center gap-2">
									<h5 className={`interBold text-xl ${mode == 'dark' ? ' text-whiteText-500/80' : 'text-blackText-500'}  text-center lg:text-left`}>Total Traded Balance</h5>
									<h5 className={`interExtraBold text-2xl ${mode == 'dark' ? ' text-whiteText-500' : ' text-blackText-500'}  text-center lg:text-left`}>
										${portfolioData && portfolioData.tradedBalance ? Number(portfolioData.tradedBalance.total.toFixed(2)).toLocaleString() : '0.00'}
									</h5>
								</div>
								<div className="w-1/2 mt-8 lg:mt-0 lg:w-1/3 flex-grow flex flex-col items-center justify-center gap-2">
									<h5 className={`interBold text-xl ${mode == 'dark' ? ' text-whiteText-500/80' : 'text-blackText-500'}  text-center lg:text-left`}>24h Change</h5>
									<div className="w-fill h-fit flex flex-row items-center justify-center gap-1">
										<h5
											className={`interExtraBold text-2xl ${
												showPortfolioData ? (portfolio24hChange > 0 ? 'text-nexLightGreen-500' : portfolio24hChange < 0 ? 'text-nexLightRed-500' : 'text-[#646464]') : 'text-[#646464]'
											} `}
										>
											$
											{showPortfolioData && chartArr && chartArr[chartArr.length - 1]
												? Math.abs(chartArr[chartArr.length - 1].value - (chartArr[chartArr.length - 2].value || 0)).toFixed(2)
												: '0.00'}
										</h5>
										<div
											className={`w-fit h-fit rounded-lg ${
												showPortfolioData ? (portfolio24hChange > 0 ? 'bg-nexLightGreen-500' : portfolio24hChange < 0 ? 'bg-nexLightRed-500' : '') : ''
											} p-1`}
										>
											{showPortfolioData ? (
												portfolio24hChange > 0 ? (
													<IoMdArrowUp color="#FFFFFF" size={15} />
												) : portfolio24hChange < 0 ? (
													<IoMdArrowDown color="#FFFFFF" size={15} />
												) : (
													''
												)
											) : (
												''
											)}
										</div>
									</div>
								</div>
							</div>
							<div className="w-full h-fit px-4 xl:px-20 pt-5 flex flex-col items-start justify-start mb-10">
								<h5 className={` ${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500'} text-2xl interBold mb-6`}>Asset Balances</h5>
								<div className="w-full h-fit border border-gray-300 rounded-xl  pt-6 shadow overflow-scroll xl:overflow-auto">
									<div className="w-full h-fit pb-6 flex flex-row items-center gap-16 xl:gap-0 justify-start px-3 border-b border-b-[#E4E4E4] ">
										<div className="w-[30vw] xl:w-1/4 mr-14 xl:mr-0 h-fit pr-8 xl:px-1">
											<h5 className={`interExtraBold ${mode == 'dark' ? ' text-whiteText-500' : ' text-blackText-500'} text-base whitespace-nowrap`}>Asset</h5>
										</div>
										<div className="w-fit xl:w-1/4 h-fit pr-8 xl:px-1">
											<h5 className={`interExtraBold ${mode == 'dark' ? ' text-whiteText-500' : ' text-blackText-500'} text-base whitespace-nowrap`}>Total Balance</h5>
										</div>
										<div className="w-fit xl:w-1/4 h-fit pr-8 xl:px-1">
											<h5 className={`interExtraBold ${mode == 'dark' ? ' text-whiteText-500' : ' text-blackText-500'} text-base whitespace-nowrap`}>Portfolio %</h5>
										</div>
										<div className="w-fit xl:w-1/4 h-fit pr-8 xl:px-1">
											<h5 className={`interExtraBold ${mode == 'dark' ? ' text-whiteText-500' : ' text-blackText-500'} text-base whitespace-nowrap`}>Action</h5>
										</div>
									</div>
									<div>
										{assetData.map((asset) => (
											// <>
											<div
												key={asset.symbol}
												className="w-fit xl:w-full h-fit px-3 py-4 flex -flex-row items-center justify-start xl:justify-center border-b gap-16 xl:gap-0 border-b-[#E4E4E4]"
											>
												<div className="w-[30vw] xl:w-1/4 h-fit px-1 flex flex-row items-center justify-start gap-3">
													<Image
														src={asset.logo}
														alt="anfi"
														width={50}
														height={50}
														className="cursor-pointer"
														onClick={() => {
															router.push(`/ownedAsset?asset=${asset.symbol.toLowerCase()}`)
														}}
													></Image>
													<div>
														<h5 className={`interExtraBold ${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500'}  text-lg cursor-pointer`}>{asset.symbol}</h5>
														<h5 className={`interMedium ${mode == 'dark' ? ' text-whiteText-500/80' : ' text-blackText-500'} italic text-base cursor-pointer`}>{asset.shortName}</h5>
													</div>
												</div>
												<div className="w-fit xl:w-1/4 h-fit px-1">
													<h5 className={`interExtraBold ${mode == 'dark' ? ' text-whiteText-500' : ' text-blackText-500'} text-blackText-500 whitespace-nowrap text-lg cursor-pointer`}>
														{Number(asset.totalToken?.toFixed(2)).toLocaleString()} {asset.symbol}
													</h5>
													<h5 className={`interBold whitespace-nowrap ${mode == 'dark' ? ' text-whiteText-500' : ' text-blackText-500'}  text-base cursor-pointer`}>
														≈${Number(asset.totalTokenUsd?.toFixed(2)).toLocaleString()}
													</h5>
												</div>
												<div className="w-fit xl:w-1/4 h-fit px-1">
													{mode == 'dark' ? (
														<ProgressBar
															completed={showPortfolioData ? Number(asset.percentage) : 0}
															height="10px"
															isLabelVisible={false}
															className="w-[30vw] xl:w-8/12 mb-3"
															bgColor="#089981"
															baseBgColor="#FFFFFF"
														/>
													) : (
														<ProgressBar
															completed={showPortfolioData ? Number(asset.percentage) : 0}
															height="10px"
															isLabelVisible={false}
															className="w-[30vw] xl:w-8/12 mb-3"
															bgColor="#5E869B"
															baseBgColor="#A9A9A9"
														/>
													)}

													<h5 className={`interExtraBold ${mode == 'dark' ? ' text-whiteText-500' : ' text-blackText-500'} text-base cursor-pointer`}>
														{showPortfolioData ? asset.percentage?.toFixed(2) : '0.00'}%
													</h5>
												</div>
												<div className="w-fit xl:w-1/4 h-fit px-1 flex flex-row items-center justify-normal gap-2">
													<Link href={`/tradeIndex?index=${asset.symbol}&category=defi`}>
														<button
															className={`h-fit w-fit px-4 py-2 interBold text-base ${mode == 'dark' ? ' text-whiteText-500' : ' text-blackText-500'} rounded-xl ${
																mode == 'dark'
																	? ' bg-cover border-transparent bg-center bg-no-repeat '
																	: 'bg-gradient-to-tl from-colorFour-500 to-colorSeven-500 hover:to-colorFive-500'
															}  active:translate-y-[1px] active:shadow-black shadow-sm shadow-blackText-500`}
															style={{
																boxShadow: mode == 'dark' ? `0px 0px 6px 1px rgba(91,166,153,0.68)` : '',
																backgroundImage: mode == 'dark' ? `url('${mesh1.src}')` : '',
															}}
														>
															Trade
														</button>
													</Link>
												</div>
											</div>
											// </>
										))}
									</div>
								</div>
							</div>
							<div className="w-full h-fit px-5 lg:px-20 mt-10">
								<h5 className={` ${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500'} text-2xl interBold mb-6`}>Assets Distribution</h5>
								<Menu
									menuButton={
										<MenuButton>
											<div
												className={`w-full xl:w-[14vw] ${
													mode == 'dark' ? ' text-whiteText-500' : ' text-blackText-500'
												} relative z-10 h-fit px-2 py-2 flex flex-row items-center justify-between rounded-md ${
													mode == 'dark' ? ' bg-cover border-transparent bg-center bg-no-repeat' : 'bg-gradient-to-tr from-colorFour-500 to-colorSeven-500 hover:to-colorSeven-500'
												} shadow-sm shadow-blackText-500 gap-8 cursor-pointer mt-6`}
												style={{
													boxShadow: mode == 'dark' ? `0px 0px 6px 1px rgba(91,166,153,0.68)` : '',
													backgroundImage: mode == 'dark' ? `url('${mesh1.src}')` : '',
												}}
											>
												<div className="flex flex-row items-center justify-start gap-2">
													<h5 className="text-sm  titleShadow interBold uppercase">{chartType == 'pie' ? 'Pie Chart' : 'Treemap Chart'}</h5>
												</div>
												{mode == 'dark' ? <GoChevronDown color="#F2F2F2" size={20} /> : <GoChevronDown color="#252525" size={20} />}
											</div>
										</MenuButton>
									}
									transition
									direction="bottom"
									align="start"
									className="subCatgoriesMenu"
								>
									<div
										key={0}
										className="w-full h-fit px-2 py-2 flex flex-row items-center justify-between gap-8 cursor-pointer hover:bg-[#7fa5b8]/50"
										onClick={() => {
											setChartType('pie')
										}}
									>
										<div className="flex flex-row items-center justify-start gap-2">
											<h5 className="text-sm text-whiteBackground-500 interMedium uppercase whitespace-nowrap">Pie Chart</h5>
										</div>
										<GoChevronDown className="opacity-0" color="#2A2A2A" size={20} />
									</div>
									<div
										key={1}
										className="w-fit h-fit px-2 py-2 flex flex-row items-center justify-between gap-8 cursor-pointer hover:bg-[#7fa5b8]/50"
										onClick={() => {
											setChartType('treemap')
										}}
									>
										<div className="flex flex-row items-center justify-start gap-2">
											<h5 className="text-sm text-whiteBackground-500 interMedium uppercase whitespace-nowrap">Treemap Chart</h5>
										</div>
										<GoChevronDown className="opacity-0" color="#2A2A2A" size={20} />
									</div>
								</Menu>
								<div className="w-full h-full flex flex-col xl:flex-row items-start xl:items-center justify-center xl:justify-around">
									<div className="w-full xl:w-1/2 h-fit flex flex-row items-center justify-center pt-2">
										{chartType == 'pie' ? <New3DPieChart data={data} /> : <TreemapChart percentage={indexPercent} />}
										{/* {chartType == 'pie' ? <New3DPieChart data={data} /> : <TreemapChart  data={data} />} */}
									</div>
									{indexSelectedInPie !== '' ? (
										<div className="w-full xl:w-1/2 h-full flex flex-col items-start justify-center xl:justify-start gap-4 pt-14 pb-14 xl:pb-0 xl:pt-2">
											<h5 className={`interBold text-xl ${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500'}`}>
												Index / Asset : <span className="interMedium">{indexSelectedInPie}</span>
											</h5>
											<div className="flex flex-row items-center justify-between gap-2">
												<h5 className={`interBold text-xl ${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500'}`}>
													Smart contract : <span className="interMedium">{reduceAddress(indexDetailsMap.get(indexSelectedInPie).smartContract)}</span>
												</h5>
												<div className={` ${mode == 'dark' ? ' bg-whiteBackground-500' : 'bg-colorSeven-500/50'} w-fit h-fit p-4 xl:p-2 rounded-full`}>
													<CopyToClipboard text={indexDetailsMap.get(indexSelectedInPie).smartContract} onCopy={handleCopyIndexDetails}>
														<BiCopy color="#000000" size={15} className="scale-150 xl:scale-100" />
													</CopyToClipboard>
												</div>
											</div>
											<div className="flex flex-row items-center justify-between gap-2">
												<h5 className={`interBold text-xl ${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500'}`}>
													Last transaction : <span className="interMedium">{reduceAddress(indexDetailsMap.get(indexSelectedInPie).lastTnx)}</span>
												</h5>
												<div className={` ${mode == 'dark' ? ' bg-whiteBackground-500' : 'bg-colorSeven-500/50'} w-fit h-fit p-4 xl:p-2 rounded-full`}>
													<CopyToClipboard text={indexDetailsMap.get(indexSelectedInPie).lastTnx} onCopy={handleCopyIndexDetails}>
														<BiCopy color="#000000" size={15} className="scale-150 xl:scale-100" />
													</CopyToClipboard>
												</div>
											</div>
											<div className="flex flex-row items-center justify-between gap-2">
												<h5 className={`interBold text-xl ${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500'}`}>
													Owned amount : <span className="interMedium">{indexDetailsMap.get(indexSelectedInPie).ownedAmount}</span>
												</h5>
											</div>
											<div className="flex flex-row items-center justify-between gap-2">
												<h5 className={`interBold text-xl ${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500'}`}>
													Txn history :{' '}
													<span className={`interMedium ${mode == 'dark' ? ' text-[#007271]' : 'text-colorSeven-500'} `}>
														<Link href={`https://sepolia.etherscan.io/txs?a=${address}`}>See More</Link>
													</span>
												</h5>
											</div>
										</div>
									) : (
										<div className="w-full xl:w-1/2 h-full text-lg flex flex-col items-start justify-center xl:justify-start gap-4 pt-14 pb-14 xl:pb-0 xl:pt-2">
											Please click on a slice to know more about the Index
										</div>
									)}
								</div>
							</div>
						</section>
					) : (
						<section className="w-full h-fit xl:px-20 relative z-[1] py-5 mb-10">
							<div className="w-full h-fit relative hidden xl:block">
								<div className=" absolute z-50 w-full h-full mx-auto flex flex-col items-center justify-center">
									<div
										className={`w-4/12 h-fit ${
											mode == 'dark' ? ' bg-[#151515] shadow-whiteBackground-500 border-whiteBackground-500/50' : 'bg-whiteBackground-500 shadow-blackText-500 border-blackText-500/50'
										} border shadow-sm px-4 py-12 rounded-lg`}
									>
										<h5 className={`interBold ${mode == 'dark' ? ' text-whiteText-500' : ' text-blackText-500'} text-3xl mb-3 text-center`}>Connect Your Wallet</h5>
										<p className={`interMedium ${mode == 'dark' ? ' text-whiteText-500' : ' text-blackText-500'} text-xl text-center`}>Sign-in with your wallet to manage your portfolio.</p>
										<div className="w-fit h-fit scale-150 mx-auto mt-12">
											<ConnectButton />
										</div>
									</div>
								</div>
								<div className="w-full h-fit hidden xl:flex flex-col items-start justify-start relative z-30">
									<div className="w-full lg:w-2/5 h-fit flex flex-col xl:flex-col items-start justify-start gap-8">
										<Shimmer width={300} height={300} className={`rounded-full ${mode == 'dark' ? 'invert' : ''}`} />
									</div>
									<Shimmer width={800} height={300} className={`rounded-lg mt-10 min-w-full max-w-full ${mode == 'dark' ? 'invert' : ''}`} />
									<Shimmer width={800} height={300} className={`rounded-lg mt-10 min-w-full max-w-full ${mode == 'dark' ? 'invert' : ''}`} />
								</div>
							</div>

							<div className="w-full h-fit relative block xl:hidden">
								<div className=" absolute z-50 w-full h-full mx-auto flex flex-col items-center justify-center">
									<div
										className={`w-11/12 h-fit ${
											mode == 'dark' ? 'bg-[#151515] shadow-whiteBackground-500 border-whiteBackground-500/50' : 'bg-whiteBackground-500 shadow-blackText-500 border-blackText-500/50'
										} shadow-sm border px-4 py-12 rounded-lg`}
									>
										<h5 className={`interBold ${mode == 'dark' ? ' text-whiteText-500' : ' text-blackText-500'} text-3xl mb-3 text-center`}>Connect Your Wallet</h5>
										<p className={`interMedium ${mode == 'dark' ? ' text-whiteText-500' : ' text-blackText-500'} text-xl text-center`}>Sign-in with your wallet to manage your portfolio.</p>
										<div className="w-fit h-fit mx-auto mt-12">
											<ConnectButton />
										</div>
									</div>
								</div>
								<div className="w-screen px-4 h-fit xl:hidden">
									<Shimmer width={150} height={150} className={`rounded-full max-w-[40%] ${mode == 'dark' ? 'invert' : ''}`} />
									<Shimmer width={800} height={300} className={`rounded-lg mt-10 min-w-full max-w-full ${mode == 'dark' ? 'invert' : ''}`} />
									<Shimmer width={800} height={300} className={`rounded-lg mt-10 min-w-full max-w-full ${mode == 'dark' ? 'invert' : ''}`} />
								</div>
							</div>
						</section>
					)}
				</section>
				<section className="w-full h-fit mb-10 px-4 xl:px-20">
					{address ? <h5 className={`${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500'} text-2xl interBold mb-6`}>Transactions History</h5> : ''}
					{address ? <NewHistoryTable /> : ''}
				</section>

				<section className=" w-screen flex flex-col xl:flex-row items-stretch justify-normal gap-1 px-4 xl:px-20">
					<div id="d1" className="w-full xl:w-9/12 h-full flex flex-row items-stretch justify-center flex-grow">
						<div className="w-screen h-full flex flex-col items-center justify-center">
							<div className=" relative w-full h-full overflow-hidden bg-gradient-to-bl from-colorFive-500 to-colorSeven-500 rounded-xl px-6 py-6">
								<div className="absolute overflow-hidden w-full h-full -right-10 xl:top-0 xl:right-0 z-10 flex flex-row items-center justify-normal">
									<div className="hidden xl:block w-1/2 h-full"></div>
									<div
										className="w-full xl:w-1/2 h-full bg-no-repeat xl:cefiCsDefiAnimated"
										style={{
											backgroundImage: `url('${bg2.src}')`,
										}}
									></div>
								</div>
								<div className="relative top-0 left-0 z-40 bg-transparent">
									<h5 className={`interBold ${mode == 'dark' ? 'text-whiteText-500' : 'text-blackText-500'} titleShadow text-4xl mb-6`}>Automatic Rebalancing Mechanism</h5>
									<p className={`interMedium ${mode == 'dark' ? 'text-whiteText-500' : 'text-blackText-500'} text-base w-full xl:w-3/5 mb-3`}>
										Our automatic rebalancing system ensures the proper distribution of assets in the index by regularly monitoring market capitalizations, triggering adjustments as needed
										to align with the desired weights, and executing trades accordingly.
									</p>
									<Link href={'https://nex-labs.gitbook.io/nex-dex/protocol-structure/automatic-rebalancing-mechanism'}>
										<button
											className={`interBold mt-8 mb-4 flex h-fit w-fit flex-row items-center justify-center gap-1 rounded-2xl ${
												mode == 'dark' ? 'titleShadow bg-cover bg-center bg-no-repeat text-whiteText-500' : 'bg-gradient-to-br from-colorFour-500 to-colorSeven-500 text-blackText-500'
											}  px-5 py-3 text-2xl shadow-sm shadow-blackText-500 active:translate-y-[1px] active:shadow-black `}
											style={{
												backgroundImage: mode == 'dark' ? `url('${mesh1.src}')` : '',
												boxShadow: mode == 'dark' ? `0px 0px 6px 1px rgba(91,166,153,0.68)` : '',
											}}
										>
											<span>Learn More</span>
											{mode == 'dark' ? <GoArrowRight color="#FFFFFF" size={30} /> : <GoArrowRight color="#252525" size={30} />}
										</button>
									</Link>
								</div>
							</div>
						</div>
					</div>
					<div id="d2" className="w-full xl:w-3/12 flex flex-row items-center justify-center flex-grow max-h-full">
						<TipsBox2></TipsBox2>
					</div>
				</section>
				<div className="w-fit hidden xl:block h-fit pt-0 lg:pt-16">
					<Footer />
				</div>
				<div className="block xl:hidden">
					<MobileFooterSection />
				</div>
				<GenericModal
					isOpen={QRModalVisible}
					onRequestClose={() => {
						setQRModalVisible(false)
					}}
				>
					<div className="w-full h-fit px-2 flex flex-col items-center justify-center">
						{address ? (
							<div className="h-fit w-fit">
								<QRCode size={256} style={{ height: 'auto', maxWidth: '100%', width: '100%' }} value={address} viewBox={`0 0 256 256`} />
							</div>
						) : (
							''
						)}
						{address ? <h5 className="InterMedium text-blackText-500 text-xl text-center w-full my-10">{address}</h5> : ''}
					</div>
				</GenericModal>
			</main>
		</>
	)
}
