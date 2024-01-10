'use client'

import Image from 'next/image'
import DappNavbar from '@/components/DappNavbar'
import dynamic from 'next/dynamic'
import Footer from '@/components/Footer'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'
import { useAddress, useContract, useContractRead } from '@thirdweb-dev/react'
import GenericAvatar from '@/components/GenericAvatar'
import { useEffect, useState } from 'react'
import useTradePageStore from '@/store/tradeStore'
import TipsBox2 from '@/components/TipsBox'
import ProgressBar from '@ramonak/react-progress-bar'

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
import { FormatToViewNumber, num } from '@/hooks/math'
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
import { GoArrowRight } from 'react-icons/go'
import { IoMdArrowUp } from 'react-icons/io'
import NewHistoryTable from '@/components/NewHistoryTable'
import { useSearchParams } from 'next/navigation'

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

export default function OwnedAsset({ params, searchParams }: { params: { slug: string }; searchParams: { [key: string]: string | string[] | undefined } }) {
	const address = useAddress()
	const [QRModalVisible, setQRModalVisible] = useState<boolean>(false)
	const { selectedPortfolioChartSliceIndex, setSelectedPortfolioChartSliceIndex } = useTradePageStore()

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

	const router = useRouter()

	const [uploadedPPLink, setUploadedPPLink] = useState<string>('none')
	const [chosenPPType, setChosenPPType] = useState<string>('none')

	const [connectedUser, setConnectedUser] = useState<User>()
	const [connectedUserId, setConnectedUserId] = useState<String>('')

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

	return (
		<>
			<Head>
				<title>Nexlabs.io</title>
				<meta
					name="description"
					content="Take a peek at your Nex Labs portfolio and see how you leverage the platform. Check your balance, wallet, transaction history, account destribution and more on the portfolio page. Get the inside view."
				/>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main className="min-h-screen overflow-x-hidden h-fit w-screen bg-whiteBackground-500">
				<section className="h-full w-fit overflow-x-hidde">
					<DappNavbar />
					<section className="w-screen h-fit pt-10">
						<div className="w-full h-fit px-20 py-5 flex flex-col xl:flex-row items-center justify-between mb-10">
							<div className="w-full lg:w-2/5 h-fit flex flex-col lg:flex-row items-center justify-between gap-8">
								<Image src={anfiLogo} alt="anfi" width={150} height={150} className=" rounded-full"></Image>
								<div className="w-full lg:w-2/3 h-fit flex flex-col items-center lg:items-start justify-start gap-2">
									<h5 className="text-2xl text-blackText-500 montrealBold">2,219.3 ANFI</h5>
									<div className="flex flex-col xl:flex-row items-center justify-start gap-2">
										<h5 className="text-xl text-gray-500 interMedium">$21,913.4</h5>
									</div>
								</div>
							</div>
							{/* <div className="lg:flex w-3/5 h-fit justify-end" id="smallChartBox">
							<Chart data={complexData} />
						</div> */}
							<div className="lg:flex w-2/5 "></div>
							<div className="lg:flex flex-col w-2/5 items-end gap-2 justify-end mr-0 relative mt-5 xl:mt-0" id="smallChartBox">
								<div className="w-full h-fit flex flex-row items-center justify-end gap-3">
									<h5 className="interBold text-base text-blackText-500 ">Total Traded Balance</h5>
									<h5 className="interBold text-base text-[#646464] ">$1,248,217.81</h5>
								</div>
								<div className="w-full h-fit flex flex-row items-center justify-end gap-3">
									<h5 className="interBold text-base text-blackText-500 ">24h Change</h5>
									<div className="w-fill h-fit flex flex-row items-center justify-center gap-1">
										<h5 className="interExtraBold text-base text-nexLightGreen-500 ">$261.3</h5>
										<div className="w-fit h-fit rounded-lg bg-nexLightGreen-500 p-1">
											<IoMdArrowUp color="#FFFFFF" size={10} />
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className=" w-full h-fit px-20 py-5 flex flex-col xl:flex-row items-center justify-center mb-10 ">
							<div className="w-full h-fit flex flex-row items-center justify-start pb-4 px-2 border-b-[2px] border-b-[#E4E4E4] ">
                            <button className="py-1 px-3 rounded-full text-[#646464] cursor-pointer interMedium text-lg" onClick={() => {
													router.push(`/ownedAsset?asset=anfi`)
												}}>Overview</button>
                                <button className="py-1 px-3 shadow shadow-[#5E869B] cursor-pointer rounded-full border-[2px] border-[#5E869B] text-[#5E869B] interMedium text-lg" onClick={() => {
													router.push(`/assetActivity?asset=anfi`)
												}} >Activity</button>
								
							</div>
						</div>
						<div className="w-full px-20 h-fit">
							<div className="w-full my-6 h-fit bg-gradient-to-tl from-colorFour-500 to-colorSeven-500 rounded-2xl flex flex-row items-stretch justify-start">
								<div className="h-fit w-9/12 border-r border-r-whiteBackground-500 p-10">
									<h5 className="interBold mb-3 text-lg xl:text-2xl lg:text-2xl text-white titleShadow">Anti Inflation Index</h5>
									<h5 className="interMedium hidden xl:block w-full text-lg leading-normal text-white titleShadow">
										The Anti-inflation Index provides investors with an innovative and resilient strategy, combining two assets to offer a hedge against inflationary pressures.
										<br />
										Gold has traditionally been a reliable investment. Nevertheless, it{"'"}s worth considering that Bitcoin, often referred to as {"'"}digital gold,{"'"} has the potential
										to assume a prominent role in everyday life in the future.
									</h5>
								</div>
								<div className="flex-grow w-3/12 border-r border-r-whiteBackground-500">
									<div className="h-1/2 w-full border-b border-b-whiteText-500 flex flex-col items-start justify-center px-4 gap-1">
										<h5 className="interMedium text-base text-white titleShadow">Market Cap</h5>
										<h5 className="interExtraBold text-2xl text-white titleShadow">$1,248,217.81</h5>
									</div>
                                    <div className="h-1/2 w-full flex flex-col items-start justify-center px-4 gap-1">
										<h5 className="interMedium text-base text-white titleShadow">24h Change</h5>
										<div className="w-fill h-fit flex flex-row items-center justify-center gap-1">
										<h5 className="interExtraBold text-2xl text-whiteText-500 titleShadow ">$261.3</h5>
										<div className="w-fit h-fit rounded-md bg-whiteText-500 p-1">
											<IoMdArrowUp color="#089981" size={14} />
										</div>
									</div>
									</div>
								</div>
							</div>
						</div>
					</section>
				</section>
				<section className="w-full h-fit mb-10 px-20">
					<h5 className="text-blackText-500 text-2xl interBold mb-6">ANFI Transactions History</h5>
					<NewHistoryTable />
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
									<h5 className="interBold text-whiteText-500 titleShadow text-4xl mb-6">Automatic Rebalancing Mechanism</h5>
									<p className="interMedium text-whiteText-500 text-base w-full xl:w-3/5 mb-3">
										Our automatic rebalancing system ensures the proper distribution of assets in the index by regularly monitoring market capitalizations, triggering adjustments as needed
										to align with the desired weights, and executing trades accordingly.
									</p>
									<Link href={'https://nex-labs.gitbook.io/nex-dex/protocol-structure/automatic-rebalancing-mechanism'}>
										<button className="h-fit w-fit flex flex-row items-center justify-center gap-1 bg-white shadow rounded-md px-4 py-1 interBold text-blackText-500 text-base">
											<span>Learn More</span>
											<GoArrowRight color="#5E869B" size={30} />
										</button>
									</Link>
								</div>
							</div>
						</div>
					</div>
					<div id="d2" className="w-full xl:w-3/12 flex flex-row items-center justify-center flex-grow-0 max-h-full">
						<TipsBox2></TipsBox2>
					</div>
				</section>
				<div className="w-fit h-fit xl:pt-16">
					<Footer />
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
