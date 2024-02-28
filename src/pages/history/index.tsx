import Image from 'next/image'
import DappNavbar from '@/components/DappNavbar'
import dynamic from 'next/dynamic'
import Footer from '@/components/newFooter'
import MobileFooterSection from '@/components/mobileFooter'
import GenericAvatar from '@/components/GenericAvatar'
import { useAddress, useContract, useContractRead } from '@thirdweb-dev/react'
import ProgressBar from '@ramonak/react-progress-bar'
import useTradePageStore from '@/store/tradeStore'
import anfiLogo from '@assets/images/anfi.png'
import cr5Logo from '@assets/images/cr5.png'
import btc from '@assets/images/btc.png'
import { MdOutlineDangerous } from 'react-icons/md'
const PNLChart = dynamic(() => import('@/components/portfolioPNLChart'), { loading: () => <p>Loading ...</p>, ssr: false })
import { BiCopy } from 'react-icons/bi'
import { PiQrCodeDuotone } from 'react-icons/pi'
import { BsCalendar4 } from 'react-icons/bs'
import { useEffect, useState } from 'react'
import mesh1 from '@assets/images/mesh1.png'
import mesh2 from '@assets/images/mesh2.png'
import { useLandingPageStore } from '@/store/store'
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
} from '@/constants/contractAddresses'
import { indexTokenAbi, indexTokenV2Abi } from '@/constants/abi'
import { FormatToViewNumber, formatNumber, num } from '@/hooks/math'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { GenericToast } from '@/components/GenericToast'
import AccountRebalancingSection from '@/components/AccountRebalancingSection'
import GenericModal from '@/components/GenericModal'
import QRCode from 'react-qr-code'
import Link from 'next/link'
import Head from 'next/head'
import { useQuery } from '@apollo/client'
import { GET_HISTORICAL_PRICES } from '@/uniswap/query'
import { getTimestampDaysAgo } from '@/utils/conversionFunctions'

import bg2 from '@assets/images/bg-2.png'
import HistoryTable from '@/components/TradeTable'
import TopHolders from '@/components/topHolders'
import { reduceAddress } from '@/utils/general'
import { GoArrowRight } from 'react-icons/go'
import { CiExport } from 'react-icons/ci'

import { IoMdArrowDown, IoMdArrowUp } from 'react-icons/io'
import NewHistoryTable from '@/components/NewHistoryTable'

// Firebase :
import { getDatabase, ref, onValue, set, update } from 'firebase/database'
import { database } from '@/utils/firebase'
import { FaCheck } from 'react-icons/fa6'
import { MdOutlineEdit, MdOutlineRemoveRedEye } from 'react-icons/md'
import ImageViewer from 'react-simple-image-viewer'
import { Uploader } from 'uploader'
import { UploadDropzone } from 'react-uploader'
import 'react-image-upload/dist/index.css'

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
import usePortfolioPageStore from '@/store/portfolioStore'
import { Shimmer } from 'react-shimmer'
import ConnectButton from '@/components/ConnectButton'

function History() {
	const { mode } = useLandingPageStore()
	const address = useAddress()
	const [QRModalVisible, setQRModalVisible] = useState(false)
	const { portfolioData } = usePortfolioPageStore()

	const anfiTokenContract = useContract(goerliAnfiV2IndexToken, indexTokenV2Abi)
	const crypto5TokenContract = useContract(goerliCrypto5IndexToken, indexTokenAbi)

	const anfiTokenBalance = useContractRead(anfiTokenContract.contract, 'balanceOf', [!!address ? address : zeroAddress])
	const crypto5TokenBalance = useContractRead(crypto5TokenContract.contract, 'balanceOf', [!!address ? address : zeroAddress])

	const anfiPercent = (num(anfiTokenBalance.data) / (num(crypto5TokenBalance.data) + num(anfiTokenBalance.data))) * 100
	const crypto5Percent = (num(crypto5TokenBalance.data) / (num(crypto5TokenBalance.data) + num(anfiTokenBalance.data))) * 100

	const {
		loading: loadingAnfi,
		error: errorAnfi,
		data: dataAnfi,
	} = useQuery(GET_HISTORICAL_PRICES, {
		variables: { poolAddress: goerlianfiPoolAddress.toLowerCase(), startingDate: getTimestampDaysAgo(90), limit: 10, direction: 'asc' },
	})

	const {
		loading: loadingCR5,
		error: errorCR5,
		data: dataCR5,
	} = useQuery(GET_HISTORICAL_PRICES, {
		variables: { poolAddress: goerliLinkWethPoolAddress.toLowerCase(), startingDate: getTimestampDaysAgo(90), limit: 10, direction: 'asc' },
	})

	// let anfiPrice = 0; let cr5Price = 0;
	// let anfi24hChng = 0; let cr524hChng = 0;
	const [chartArr, setChartArr] = useState<{ time: number; value: number }[]>([])
	const [indexPrices, setIndexPrices] = useState({ anfi: 0, cr5: 0 })
	const [index24hChange, setIndex24hChange] = useState({ anfi: 0, cr5: 0 })

	if (!loadingCR5 && !loadingAnfi && !errorCR5 && !errorAnfi && chartArr.length == 0 && (!!anfiPercent || !!crypto5Percent)) {
		const chartData: { time: number; value: number }[] = []
		const ANFIData = dataAnfi.poolDayDatas
		const CR5Data = dataCR5.poolDayDatas
		for (let i = 0; i <= ANFIData.length - 1; i++) {
			const chartObj: { time: number; value: number } = { time: 0, value: 0 }
			const value = num(anfiTokenBalance.data) * Number(ANFIData[i].token0Price) + num(crypto5TokenBalance.data) * Number(CR5Data[i].token0Price)
			chartObj.time = ANFIData[i].date
			chartObj.value = value
			chartData.push(chartObj)
		}
		setChartArr(chartData)

		const anfiPrice = ANFIData[ANFIData.length - 1].token0Price * num(anfiTokenBalance.data)
		const cr5Price = CR5Data[CR5Data.length - 1].token0Price * num(crypto5TokenBalance.data)
		setIndexPrices({ anfi: anfiPrice, cr5: cr5Price })

		const todayANFIPrice = ANFIData[ANFIData.length - 1].token0Price
		const yesterdayANFIPrice = ANFIData[ANFIData.length - 2].token0Price
		const anfi24hChng = ((todayANFIPrice - yesterdayANFIPrice) / yesterdayANFIPrice) * 100

		const todayCR5Price = CR5Data[CR5Data.length - 1].token0Price
		const yesterdayCR5Price = CR5Data[CR5Data.length - 2].token0Price
		const cr524hChng = ((todayCR5Price - yesterdayCR5Price) / yesterdayCR5Price) * 100
		setIndex24hChange({ anfi: anfi24hChng, cr5: cr524hChng })
	}

	const todayPortfolioPrice = chartArr[chartArr.length - 1]?.value
	const yesterdayPortfolioPrice = chartArr[chartArr.length - 2]?.value
	const portfolio24hChange = ((todayPortfolioPrice - yesterdayPortfolioPrice) / yesterdayPortfolioPrice) * 100

	const [isCopied, setIsCopied] = useState(false)

	const handleCopy = () => {
		if (address) {
			setIsCopied(true)
			setTimeout(() => setIsCopied(false), 2000) // Reset "copied" state after 2 seconds
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

	const data = [
		['Asset', 'Percentage'],
		['CRYPTO 5', crypto5Percent ? crypto5Percent : 0],
		['ANFI', anfiPercent ? anfiPercent : 0],
		['FIAT', anfiPercent ? 0 : 5],
	]

	const PieChartdata = [
		{
			label: 'ANFI',
			percentage: !!anfiPercent ? anfiPercent + '%' : '0%',
			color: '#133140',
		},
		{
			label: 'CRYPTO 5',
			percentage: !!crypto5Percent ? crypto5Percent + '%' : '0%',
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
					console.log(users[key])
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

	const showPortfolioData = address && (num(anfiTokenBalance.data) > 0 || num(crypto5TokenBalance.data) > 0) ? true : false

	return (
		<>
			<Head>
				<title>Nex Labs - History</title>
				<meta
					name="description"
					content="Take a peek at your Nex Labs portfolio and see how you leverage the platform. Check your balance, wallet, transaction history, account destribution and more on the portfolio page. Get the inside view."
				/>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main className={`min-h-screen overflow-x-hidden h-fit w-screen ${mode == 'dark' ? 'bg-gradient-to-tl from-[#050505] to-[#050505]' : 'bg-whiteBackground-500'}`}>
				{
					address ? (
						<section className='h-full w-fit overflow-x-hidden'>
							<section className="h-full w-fit overflow-x-hidde">
								<DappNavbar />
								<section className="w-screen h-fit pt-10">
									<div className="w-full h-fit px-20 xl:px-20 py-5 flex flex-col lg:flex-row items-center justify-between mb-10">
										<div className="w-full lg:w-2/5  h-fit flex flex-col lg:flex-row items-center justify-between gap-8">
											{address && address != '' ? (
												<div
													className="w-40 lg:h-44 lg:w-auto xl:w-40 aspect-square flex rounded-full relative bg-center bg-cover bg-no-repeat"
													style={{
														backgroundImage:
															uploadedPPLink != 'none' ? `url('${uploadedPPLink}')` : uploadedPPLink == 'none' && connectedUser?.ppType != 'identicon' ? `url('${connectedUser?.ppLink}')` : '',
													}}
												>
													{connectedUser?.ppType == 'identicon' || (chosenPPType == 'identicon' && uploadedPPLink == 'none') ? <GenericAvatar walletAddress={address}></GenericAvatar> : ''}
												</div>
											) : (
												<div className="w-40 lg:w-2/5 aspect-square bg-colorSeven-500 rounded-full"></div>
											)}
											<div className="w-full lg:w-2/3 h-fit flex flex-col items-center lg:items-start justify-start gap-2">
												<h5 className={`text-xl ${mode == "dark" ? " text-whiteText-500" : "text-blackText-500"} interBold text-center lg:whitespace-nowrap lg:text-left`}>
													{connectedUser && connectedUser.main_wallet == address
														? connectedUser.inst_name != 'x'
															? connectedUser.inst_name
															: connectedUser.name != 'x'
																? connectedUser.name
																: 'Nex User'
														: 'Nex User'}
												</h5>
												<div className="flex flex-col lg:flex-row items-center justify-start gap-2">
													<h5 className={`text-base ${mode == "dark" ? " text-whiteText-500/70" : " text-blackText-500"}  interMedium`}>{address && address != '' ? reduceAddress(address) : 'Connect your wallet'}</h5>
													<div className="w-fit h-fit flex flex-row items-center justify-between gap-2">
														<div className={` ${mode == "dark" ? " bg-whiteText-500" : "bg-colorSeven-500/50"} w-fit cursor-pointer h-fit p-4 xl:p-2 rounded-full`}>
															<CopyToClipboard text={address as string} onCopy={handleCopy}>

																<BiCopy color="#000000" size={15} className="scale-150 xl:scale-100" />
															</CopyToClipboard>
														</div>
														<div
															className={` ${mode == "dark" ? " bg-whiteText-500" : "bg-colorSeven-500/50"} w-fit cursor-pointer h-fit p-4 xl:p-2 rounded-full`}
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
												<div className={` ${mode == "dark" ? " bg-whiteBackground-500" : "bg-colorSeven-500"} w-fit mt-5 xl:mt-0 h-fit py-1 px-3 rounded-2xl flex flex-row items-center justify-center gap-2`}>
													{
														mode == "dark" ? <BsCalendar4 color="#000000" size={15} /> : <BsCalendar4 color="#000000" size={15} />
													}

													<h5 className={`text-base ${mode != "dark" ? " text-blackText-500" : "text-blackText-500"}  interBold`}>Joined N/A day ago</h5>
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
											<PNLChart data={showPortfolioData ? chartArr : emptyData} change={showPortfolioData ? portfolio24hChange : 0} />
										</div>
									</div>
									<div className=" w-full h-fit px-4 xl:px-20 py-5 flex flex-wrap xl:flex-row items-stretch justify-between xl:justify-center mb-10 ">
										<div className="w-1/2 lg:w-1/3 flex-grow flex flex-col items-center justify-center gap-2">
											<h5 className={`interBold text-xl ${mode == "dark" ? " text-whiteText-500/80" : "text-blackText-500"}  text-center lg:text-left`}>Total Portfolio Balance</h5>
											<h5
												className={`interExtraBold text-2xl ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}  text-center lg:text-left`}
												title={
													showPortfolioData && chartArr && chartArr[chartArr.length - 1] && chartArr[chartArr.length - 1].value < 0.01
														? formatNumber(chartArr[chartArr.length - 1].value).toString()
														: '0.00'
												}
											>
												≈$
												{showPortfolioData && chartArr && chartArr[chartArr.length - 1]
													? chartArr[chartArr.length - 1].value < 0.01
														? ' 0.00 '
														: FormatToViewNumber({ value: chartArr[chartArr.length - 1].value, returnType: 'string' })
													: '0.00'}
											</h5>
										</div>
										<div className="w-1/2 lg:w-1/3 flex-grow flex flex-col items-center justify-center gap-2">
											<h5 className={`interBold text-xl ${mode == "dark" ? " text-whiteText-500/80" : "text-blackText-500"}  text-center lg:text-left`}>Total Traded Balance</h5>
											<h5 className={`interExtraBold text-2xl ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"}  text-center lg:text-left`}>
												${portfolioData && portfolioData.tradedBalance ? Number(portfolioData.tradedBalance.total.toFixed(2)).toLocaleString() : '0.00'}
											</h5>
										</div>
										<div className="w-1/2 mt-8 lg:mt-0 lg:w-1/3 flex-grow flex flex-col items-center justify-center gap-2">
											<h5 className={`interBold text-xl ${mode == "dark" ? " text-whiteText-500/80" : "text-blackText-500"}  text-center lg:text-left`}>24h Change</h5>
											<div className="w-fill h-fit flex flex-row items-center justify-center gap-1">
												<h5
													className={`interExtraBold text-2xl ${showPortfolioData ? (portfolio24hChange > 0 ? 'text-nexLightGreen-500' : portfolio24hChange < 0 ? 'text-nexLightRed-500' : 'text-[#646464]') : 'text-[#646464]'
														} `}
												>
													$
													{showPortfolioData && chartArr && chartArr[chartArr.length - 1]
														? Math.abs(chartArr[chartArr.length - 1].value - (chartArr[chartArr.length - 2].value || 0)).toFixed(2)
														: '0.00'}
												</h5>
												<div
													className={`w-fit h-fit rounded-lg ${showPortfolioData ? (portfolio24hChange > 0 ? 'bg-nexLightGreen-500' : portfolio24hChange < 0 ? 'bg-nexLightRed-500' : '') : ''
														} p-1`}
												>
													{showPortfolioData ? portfolio24hChange > 0 ? <IoMdArrowUp color="#FFFFFF" size={15} /> : portfolio24hChange < 0 ? <IoMdArrowDown color="#FFFFFF" size={15} /> : '' : ''}
												</div>
											</div>
										</div>
									</div>
								</section>
							</section>
							<section className="w-full h-fit mb-10 px-4 xl:px-20">
								<div className="w-full h-fit flex flex-row items-center justify-between mb-3">
									<h5 className={`${mode == "dark" ? " text-whiteText-500" : "text-blackText-500"} text-2xl interBold`}>Transactions History</h5>
									<button className={`flex flex-row items-center justify-center gap-1 ${mode == "dark" ? "bg-cover border-transparent bg-center bg-no-repeat" : "bg-gradient-to-tl from-colorFour-500 to-colorSeven-500"} active:translate-y-[1px] active:shadow-black shadow-sm shadow-blackText-500 py-2 px-6 rounded-full`} style={{
										boxShadow:
											mode == "dark" ? `0px 0px 6px 1px rgba(91,166,153,0.68)` : "",
										backgroundImage: mode == "dark" ? `url('${mesh1.src}')` : "",

									}}>
										<h5 className={`text-lg interBold ${mode == "dark" ? " text-whiteText-500" : "text-blackText-500"} `}>Export</h5>
										{
											mode == "dark" ? <CiExport size={17} color="#FFFFFF" strokeWidth={1.5} /> : <CiExport size={17} color="#252525" strokeWidth={1.5} />
										}

									</button>
								</div>

								{address ? <NewHistoryTable /> : ''}
							</section>
						</section>
					) : (
						<section className='h-full w-fit overflow-x-hidde'>
							<DappNavbar />
							<section className='w-full h-fit xl:px-20 relative z-[1] py-5 mb-10'>
								<div className='w-full h-fit relative hidden xl:block'>
									<div className=' absolute z-50 w-full h-full mx-auto flex flex-col items-center justify-center'>
										<div className={`w-4/12 h-fit ${mode == "dark" ? " bg-[#151515] shadow-whiteBackground-500 border-whiteBackground-500/50" : "bg-whiteBackground-500 shadow-blackText-500 border-blackText-500/50"} border shadow-sm px-4 py-12 rounded-lg`}>
											<h5 className={`interBold ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"} text-3xl mb-3 text-center`}>Connect Your Wallet</h5>
											<p className={`interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"} text-xl text-center`}>Sign-in with your wallet to manage your portfolio.</p>
											<div className='w-fit h-fit scale-150 mx-auto mt-12'>
												<ConnectButton />
											</div>

										</div>
									</div>
									<div className='w-full h-fit hidden xl:flex flex-col items-start justify-start relative z-30'>
										<div className='w-full lg:w-2/5 h-fit flex flex-col xl:flex-col items-start justify-start gap-8'>
											<Shimmer width={300} height={300} className={`rounded-full ${mode == "dark" ? "invert" : ""}`} />

										</div>
										<Shimmer width={800} height={300} className={`rounded-lg mt-10 min-w-full max-w-full ${mode == "dark" ? "invert" : ""}`} />
										<Shimmer width={800} height={300} className={`rounded-lg mt-10 min-w-full max-w-full ${mode == "dark" ? "invert" : ""}`} />
									</div>
								</div>

								<div className='w-full h-fit relative block xl:hidden'>
									<div className=' absolute z-50 w-full h-full mx-auto flex flex-col items-center justify-center'>
										<div className={`w-11/12 h-fit ${mode == "dark" ? "bg-[#151515] shadow-whiteBackground-500 border-whiteBackground-500/50" : "bg-whiteBackground-500 shadow-blackText-500 border-blackText-500/50"} shadow-sm border px-4 py-12 rounded-lg`}>
											<h5 className={`interBold ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"} text-3xl mb-3 text-center`}>Connect Your Wallet</h5>
											<p className={`interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"} text-xl text-center`}>Sign-in with your wallet to manage your portfolio.</p>
											<div className='w-fit h-fit mx-auto mt-12'>
												<ConnectButton />
											</div>

										</div>
									</div>
									<div className='w-screen px-4 h-fit xl:hidden'>
										<Shimmer width={150} height={150} className={`rounded-full max-w-[40%] ${mode == "dark" ? "invert" : ""}`} />
										<Shimmer width={800} height={300} className={`rounded-lg mt-10 min-w-full max-w-full ${mode == "dark" ? "invert" : ""}`} />
										<Shimmer width={800} height={300} className={`rounded-lg mt-10 min-w-full max-w-full ${mode == "dark" ? "invert" : ""}`} />
									</div>
								</div>




							</section>
						</section>
					)
				}


				<div className="w-fit hidden xl:block h-fit pt-0 lg:pt-16">
					<Footer />
				</div>
				<div className='block xl:hidden'>
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

export default History
