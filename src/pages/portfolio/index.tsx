'use client'
import { usePortfolio, PortfolioProvider, PortfolioContext } from "@/providers/PortfolioProvider";
import { Stack, Container, Box, Paper, Typography, Button, BottomNavigation, BottomNavigationAction } from "@mui/material";
import { lightTheme } from "@/theme/theme";
import Image from 'next/image'
import DappNavbar from '@/components/DappNavbar'
import dynamic from 'next/dynamic'
import Footer from '@/components/newFooter'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'
import { useAddress, useContract, useContractRead } from '@thirdweb-dev/react'
import GenericAvatar from '@/components/GenericAvatar'
import { useContext, useEffect, useState } from 'react'
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
import { NewHistoryTable } from '@/components/NewHistoryTable'
import { useSearchParams } from 'next/navigation'
import { nexTokens } from '@/constants/nexIndexTokens'
import { nexTokenDataType } from '@/types/nexTokenData'
import convertToUSD from '@/utils/convertToUsd'
import usePortfolioPageStore from '@/store/portfolioStore'

// Firebase :
import { getDatabase, ref, onValue, set, update } from 'firebase/database'
import { database } from '@/utils/firebase'
import 'react-image-upload/dist/index.css'
import { Menu, MenuButton } from '@szhsin/react-menu'
import '@szhsin/react-menu/dist/index.css'
import '@szhsin/react-menu/dist/transitions/slide.css'
import ConnectButton from '@/components/ConnectButton'
import { PositionType } from '@/types/tradeTableTypes'
import MobileFooterSection from '@/components/mobileFooter'
import { GetPositionsHistoryDefi } from '@/hooks/getPositionsHistoryDefi'
import { GetTradeHistoryCrossChain } from '@/hooks/getTradeHistoryCrossChain'
import { emptyData } from '@/constants/emptyChartData'

// PWA : 
import PWABanner from "@/components/pwa/PWABanner";
import dca from "@assets/images/dca.png"
import logo from "@assets/images/xlogo2.png"
import { PWAGradientStack, PWAGradientTradeButton } from "@/theme/overrides";
import PWATopBar from "@/components/pwa/PWATopBar";
import PWABottomNav from "@/components/pwa/PWABottomNav";
import PWAPNLChart from "@/components/pwa/PWAPNLChart";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useChartDataStore, useLandingPageStore } from "@/store/store";


const GenericGradientAreaChart = dynamic(
	() => import("@components/pwa/PWAGenericAreaChart"),
	{
		ssr: false,
	}
);

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
	const { 
		testValue, 
		user, 
		showPortfolioData, 
		chartArr,
		indexPercent, 
		todayPortfolioPrice, 
		yesterdayPortfolioPrice, 
		portfolio24hChange,
		anfiTokenContract,
		crypto5TokenContract,
		anfiTokenBalance,
		crypto5TokenBalance,
		anfiPercent,
		crypto5Percent,
		pieData,
		nexTokenAssetData,
		totalPortfolioBalance,
		positionHistoryDefi,
		positionHistoryCrosschain,
		combinedData,
		latestObjectsMap,
		indexDetails,
		indexDetailsMap,
		uploadedPPLink,
        chosenPPType,
		handleCopyFunction,
		handleCopyIndexDetailsFunction
	} = usePortfolio()
	const router = useRouter()
	const [QRModalVisible, setQRModalVisible] = useState(false)
	const { portfolioData, indexSelectedInPie } = usePortfolioPageStore()
	const [chartType, setChartType] = useState('pie')
	const { mode } = useLandingPageStore()
	
	
	

	

	const [isStandalone, setIsStandalone] = useState(false)
	const [os, setOs] = useState<String>('')
	const [browser, setBrowser] = useState<String>('')

	function detectMobileBrowserOS() {
		const userAgent = navigator.userAgent

		let browser: string | undefined
		let os: string | undefined

		browser = ''
		os = ''
		// Check for popular mobile browsers
		if (/CriOS/i.test(userAgent)) {
			browser = 'Chrome'
		} else if (/FxiOS/i.test(userAgent)) {
			browser = 'Firefox'
		} else if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) {
			browser = 'Safari'
		}

		// Check for common mobile operating systems
		if (/iP(ad|hone|od)/i.test(userAgent)) {
			os = 'iOS'
		} else if (/Android/i.test(userAgent)) {
			os = 'Android'
		}

		setOs(os.toString())
		setBrowser(browser.toString())
	}

	useEffect(() => {
		detectMobileBrowserOS()
	}, [])

	useEffect(() => {
		// Client-side detection using window.matchMedia (optional)
		if (typeof window !== 'undefined') {
			const mediaQuery = window.matchMedia('(display-mode: standalone)')
			const handleChange = (event: MediaQueryListEvent) => setIsStandalone(event.matches)
			mediaQuery.addEventListener('change', handleChange)
			setIsStandalone(mediaQuery.matches) // Set initial client-side state
			//alert(mediaQuery.matches)
			return () => mediaQuery.removeEventListener('change', handleChange)
		}
	}, [])

	const PWAProfileOverviewHeader = () => {
		return (
			<Stack width={"100%"} height={"fit-content"} direction={"row"} alignItems={"stretch"} justifyContent={"space-between"} position={"relative"} overflow={"hidden"} marginTop={3} marginBottom={1} paddingX={2} paddingY={2} borderRadius={"1.2rem"} sx={PWAGradientStack}>
				<Stack direction={"column"} alignItems={"start"} justifyContent={"center"} width={"fit-content"} minWidth={"50%"} height={"fit-content"} >
					<Typography variant="caption" marginBottom={1} sx={{
						color: lightTheme.palette.text.primary
					}}>
						My Portfolio
					</Typography>
					<Typography variant="body1" width={"95%"} sx={{
						color: lightTheme.palette.text.primary,
						fontWeight: 600,

					}}>
						$
						{showPortfolioData && totalPortfolioBalance
							? totalPortfolioBalance < 0.01 && totalPortfolioBalance > 0
								? '≈ 0.00 '
								: FormatToViewNumber({ value: totalPortfolioBalance, returnType: 'string' })
							: '0.00'}
					</Typography>
					<Typography variant="caption" width={"95%"} sx={{
						color: portfolio24hChange > 0 ? lightTheme.palette.nexGreen.main : portfolio24hChange < 0 ? lightTheme.palette.nexRed.main : lightTheme.palette.text.primary,
						fontWeight: 400,

					}}>
						{portfolio24hChange < 0 ? "-" : "+"}
						$
						{showPortfolioData && chartArr && chartArr[chartArr.length - 1]
							? Math.abs(chartArr[chartArr.length - 1].value - (chartArr[chartArr.length - 2].value || 0)).toFixed(2)
							: '0.00'}
					</Typography>
				</Stack>
				<Stack width={"45%"} maxWidth={"45%"} flexGrow={1} borderRadius={"0.8rem"}>
					<PWAPNLChart data={showPortfolioData ? chartArr : emptyData} totalPortfolioBalance={totalPortfolioBalance} change={showPortfolioData ? portfolio24hChange : 0} />
				</Stack>
			</Stack>
		)
	}

	const PWA3DCHARTBOX = () => {
		return (
			<Stack id="PWAPNLChartBox" width={"100%"} height={"fit-content"} marginTop={0} direction={"column"} alignItems={"center"} justifyContent={"start"}>
				<Stack width={"100%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"space-between"} marginBottom={1} paddingY={2}>
					<Typography variant="body1" sx={{
						color: lightTheme.palette.text.primary,
						fontWeight: 600,
						marginBottom: "1.2rem"
					}}>
						Porftolio Distribution
					</Typography>


				</Stack>
				<Stack width={"100vw"} height={"25vh"} borderRadius={"1.2rem"} direction={"row"} alignItems={"center"} justifyContent={"center"} >
					{/*chartType == 'Pie Chart' ? <New3DPieChart data={pieData} /> : <TreemapChart percentage={indexPercent} />*/}
					<New3DPieChart data={pieData} />
				</Stack>
			</Stack>
		)
	}

	const { changeSelectedIndex } = useLandingPageStore()
	

	const PWAMyAssets = () => {
		return (
			<Stack width={"100%"} height={"fit-content"} marginTop={6}>
				<Stack width={"100%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"space-between"} marginBottom={1}>
					<Typography variant="h6" sx={{
						color: lightTheme.palette.text.primary,
						fontWeight: 700
					}}>
						My Assets
					</Typography>
				</Stack>
				<Stack width={"100%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"start"} id="PWAIndexSlider">
					<Slider
						dots={false}
						infinite={false}
						speed={500}
						slidesToShow={4}
						slidesToScroll={4}
						autoplay={false}
						centerMode={false}
						arrows={false}
						className="relative m-0 h-full w-full p-0"
						responsive={[
							{
								breakpoint: 1024,
								settings: {
									slidesToShow: 3,
									slidesToScroll: 3,
									infinite: true,
									dots: true,
								},
							},
							{
								breakpoint: 600,
								settings: {
									slidesToShow: 2,
									slidesToScroll: 2,
									initialSlide: 2,
								},
							},
							{
								breakpoint: 480,
								settings: {
									slidesToShow: 2,
									slidesToScroll: 1,
								},
							},
						]}
					>
						{
							nexTokenAssetData.map((asset) => {
								return (
									<Stack key={asset.symbol} width={"50vw"} marginX={1} height={"fit-content"} paddingY={2} paddingX={1.5} borderRadius={"1rem"} sx={PWAGradientStack} onClick={() => {
										changeSelectedIndex(asset.shortName);
										router.push('/pwa_tradeIndex')
									}}>
										<Image alt="index logo" src={asset.logo} width={40} height={40} className="rounded-full mb-2"></Image>
										<Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"} width={"100%"} height={"fit-content"} marginBottom={1.5} padding={0}>
											<Typography variant="subtitle1" sx={{
												color: lightTheme.palette.text.primary,
												fontWeight: 600,
											}}>
												{
													asset.symbol
												}
											</Typography>
											<Typography variant="caption" sx={{
												color: lightTheme.palette.nexGreen.main,
												fontWeight: 600,
												fontSize: ".8rem",
												backgroundColor: lightTheme.palette.pageBackground.main,
												paddingX: "0.8rem",
												paddingY: "0.2rem",
												borderRadius: "1rem",
												border: "solid 1px rgba(37, 37, 37, 0.5)",
												boxShadow: "0px 1px 1px 1px rgba(37, 37, 37, 0.3)"
											}}>
												{
													asset.percentage
												}%
											</Typography>
										</Stack>
										<Typography variant="subtitle1" sx={{
											color: lightTheme.palette.text.primary,
											fontWeight: 600,
											fontSize: "1rem",
											width: "90%"
										}}>
											{Number(asset.totalToken?.toFixed(2)).toLocaleString()} (≈${
												Number(asset.totalTokenUsd?.toFixed(2)).toLocaleString()
											})

										</Typography>


									</Stack>
								)
							})
						}
					</Slider>
				</Stack>
			</Stack>
		)
	}

	

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
			{
				!isStandalone ? (
					<>
						
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
																		: uploadedPPLink == 'none' && user?.ppType != 'identicon'
																			? `url('${user?.ppLink}')`
																			: '',
															}}
														>
															{user?.ppType == 'identicon' || (chosenPPType == 'identicon' && uploadedPPLink == 'none') ? <GenericAvatar walletAddress={address}></GenericAvatar> : ''}
														</div>
													) : (
														<div className="w-40 lg:w-2/5 aspect-square bg-colorSeven-500 rounded-full"></div>
													)}
													<div className="w-full lg:w-2/3 h-fit flex flex-col items-center lg:items-start justify-start gap-2">
														<h5 className={`text-xl ${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500'} interBold text-center lg:whitespace-nowrap lg:text-left`}>
															{user && user.main_wallet == address
																? user.inst_name != 'x'
																	? user.inst_name
																	: user.name != 'x'
																		? user.name
																		: 'Nex User'
																: 'Nex User'}
														</h5>
														
														<div className="flex flex-col lg:flex-row items-center justify-start gap-2">
															<h5 className={`text-base ${mode == 'dark' ? ' text-whiteText-500/70' : ' text-blackText-500'}  interMedium`}>
																{address && address != '' ? reduceAddress(address) : 'Connect your wallet'}
															</h5>
															<div className="w-fit h-fit flex flex-row items-center justify-between gap-2">
																<div className={` ${mode == 'dark' ? ' bg-whiteText-500' : 'bg-colorSeven-500/50'} w-fit cursor-pointer h-fit p-4 xl:p-2 rounded-full`}>
																	<CopyToClipboard text={address as string} onCopy={handleCopyFunction}>
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
															? totalPortfolioBalance < 0.01 && totalPortfolioBalance > 0
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
														{nexTokenAssetData.map((asset) => (
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
																		≈ ${Number(asset.totalTokenUsd?.toFixed(2)).toLocaleString()}
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
																			className={`h-fit w-fit px-4 py-2 interBold text-base ${mode == 'dark' ? ' text-whiteText-500' : ' text-blackText-500'} rounded-xl ${mode == 'dark'
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
																className={`w-full xl:w-[14vw] ${mode == 'dark' ? ' text-whiteText-500' : ' text-blackText-500'
																	} relative z-10 h-fit px-2 py-2 flex flex-row items-center justify-between rounded-md ${mode == 'dark' ? ' bg-cover border-transparent bg-center bg-no-repeat' : 'bg-gradient-to-tr from-colorFour-500 to-colorSeven-500 hover:to-colorSeven-500'
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
														{chartType == 'pie' ? <New3DPieChart data={pieData} /> : <TreemapChart percentage={indexPercent} />}

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
																	<CopyToClipboard text={indexDetailsMap.get(indexSelectedInPie).smartContract} onCopy={handleCopyIndexDetailsFunction}>
																		<BiCopy color="#000000" size={15} className="scale-150 xl:scale-100" />
																	</CopyToClipboard>
																</div>
															</div>
															<div className="flex flex-row items-center justify-between gap-2">
																<h5 className={`interBold text-xl ${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500'}`}>
																	Last transaction : <span className="interMedium">{reduceAddress(indexDetailsMap.get(indexSelectedInPie).lastTnx)}</span>
																</h5>
																<div className={` ${mode == 'dark' ? ' bg-whiteBackground-500' : 'bg-colorSeven-500/50'} w-fit h-fit p-4 xl:p-2 rounded-full`}>
																	<CopyToClipboard text={indexDetailsMap.get(indexSelectedInPie).lastTnx} onCopy={handleCopyIndexDetailsFunction}>
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
														className={`w-4/12 h-fit ${mode == 'dark' ? ' bg-[#151515] shadow-whiteBackground-500 border-whiteBackground-500/50' : 'bg-whiteBackground-500 shadow-blackText-500 border-blackText-500/50'
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
														className={`w-11/12 h-fit ${mode == 'dark' ? 'bg-[#151515] shadow-whiteBackground-500 border-whiteBackground-500/50' : 'bg-whiteBackground-500 shadow-blackText-500 border-blackText-500/50'
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
															className={`interBold mt-8 mb-4 flex h-fit w-fit flex-row items-center justify-center gap-1 rounded-2xl ${mode == 'dark' ? 'titleShadow bg-cover bg-center bg-no-repeat text-whiteText-500' : 'bg-gradient-to-br from-colorFour-500 to-colorSeven-500 text-blackText-500'
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
				) : (
					<>
						<Box width={"100vw"} height={"fit-content"} display={"flex"} flexDirection={"column"} alignItems={"center"} justifyContent={"start"} paddingTop={4} paddingBottom={10} paddingX={3} bgcolor={lightTheme.palette.background.default}>
							<PWATopBar></PWATopBar>
							<PWAProfileOverviewHeader></PWAProfileOverviewHeader>
							<PWA3DCHARTBOX></PWA3DCHARTBOX>
							<PWAMyAssets></PWAMyAssets>
							<PWABanner image={dca.src} bigText="Nex DCA Calculator" smallText="Nex Dollar Cost Averaging (DCA) Calculator, a strategic tool designed for investors." link="/dcaCalculator" linkText="Learn More"></PWABanner>
							<PWABottomNav></PWABottomNav>
						</Box>
					</>
				)
			}

		</>
	)
}


