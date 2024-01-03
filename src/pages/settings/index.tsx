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
import { BsInfo } from 'react-icons/bs'

import HistoryTable from '@/components/TradeTable'
import TopHolders from '@/components/topHolders'
import { reduceAddress } from '@/utils/general'
import { GoArrowRight } from 'react-icons/go'
import { CiEdit } from 'react-icons/ci'

import { IoMdArrowUp } from 'react-icons/io'
import NewHistoryTable from '@/components/NewHistoryTable'
import { useSearchParams } from 'next/navigation'
import Switch from 'react-switch'

export default function Settings() {
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

	const [option1, setOption1] = useState<boolean>(false)
	const [option2, setOption2] = useState<boolean>(false)
	const [option3, setOption3] = useState<boolean>(false)
	const [option4, setOption4] = useState<boolean>(false)
	const [option5, setOption5] = useState<boolean>(false)

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
								{address && address != '' ? <GenericAvatar walletAddress={address}></GenericAvatar> : <div className="w-40 lg:w-2/5 aspect-square bg-colorSeven-500 rounded-full"></div>}
								<div className="w-full lg:w-2/3 h-fit flex flex-col items-center lg:items-start justify-start gap-2">
									<h5 className="text-xl text-blackText-500 montrealBold">ID: 88320</h5>
									<div className="flex flex-col xl:flex-row items-center justify-start gap-2">
										<h5 className="text-base text-gray-500 interMedium">{address && address != '' ? reduceAddress(address) : 'Connect your wallet'}</h5>
										<div className="w-fit h-fit flex flex-row items-center justify-between gap-2">
											<div className=" bg-colorSeven-500/50 w-fit cursor-pointer h-fit p-4 xl:p-2 rounded-full">
												<CopyToClipboard text={address as string} onCopy={handleCopy}>
													<BiCopy color="#000000" size={15} className="scale-150 xl:scale-100" />
												</CopyToClipboard>
											</div>
											<div
												className=" bg-colorSeven-500/50 w-fit h-fit p-4 xl:p-2 rounded-full cursor-pointer"
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
									<div className=" bg-colorSeven-500 w-fit mt-5 xl:mt-0 h-fit py-1 px-3 rounded-2xl flex flex-row items-center justify-center gap-2">
										<BsCalendar4 color="#FFFFFF" size={15} />
										<h5 className="text-base text-whiteText-500 montrealBold">Joined 45 days ago</h5>
									</div>
								</div>
							</div>
							{/* <div className="lg:flex w-3/5 h-fit justify-end" id="smallChartBox">
							<Chart data={complexData} />
						</div> */}
							<div className="lg:flex w-2/5 "></div>
							<div className="lg:flex w-1/5 justify-end mr-0 relative mt-5 xl:mt-0" id="smallChartBox">
								{/* <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-bold italic text-black text-5xl z-10`}>
									${portfolio24hChange ? portfolio24hChange.toFixed(2) : 0}
								</div> */}
								<PNLChart
									data={address && (num(anfiTokenBalance.data) > 0 || num(crypto5TokenBalance.data) > 0) ? chartArr : emptyData}
									change={address && (num(anfiTokenBalance.data) > 0 || num(crypto5TokenBalance.data) > 0) ? portfolio24hChange : 0}
								/>
							</div>
						</div>
					</section>
				</section>
				<div className=" w-full h-fit px-16 py-5 flex flex-col xl:flex-row items-center justify-center ">
					<div className="w-full h-fit flex flex-row items-center justify-start pb-2 px-2 border-b-[2px] border-b-[#E4E4E4] ">
						<div className="py-1 px-3 rounded-full text-[#646464] cursor-pointer interMedium text-lg">General Information</div>
					</div>
				</div>
				<div className=" w-full h-fit px-20 py-1 flex flex-col items-center justify-center mb-4 ">
					<h5 className="text-base interMedium text-[#181818] w-full">
						You can personalize your account by editing the general account information. This would also help us enhance your user experience.
					</h5>
					<div className="w-full h-fit flex flex-row items-center justify-between gap-3 my-6">
						<div className="w-4/12 h-fit">
							<div className="w-full h-fit flex flex-row items-center justify-between">
								<h5 className="text-sm interMedium text-[#6B6B6B] w-full">Display Name</h5>
								<CiEdit size={20} color="#6B6B6B" />
							</div>
							<input type="text" placeholder="Name" className="px-2 py-4 h-10 my-2 interMedium text-blackText-500 rounded-md border border-black/50 w-full bg-transparent" />
						</div>
						<div className="w-4/12 h-fit">
							<div className="w-full h-fit flex flex-row items-center justify-between">
								<h5 className="text-sm interMedium text-[#6B6B6B] w-full">Email</h5>
								<CiEdit size={20} color="#6B6B6B" />
							</div>
							<input type="email" placeholder="youraddress@xyz.com" className="px-2 py-4 h-10 my-2 interMedium text-blackText-500 rounded-md border border-black/50 w-full bg-transparent" />
						</div>
						<div className="w-4/12 h-fit">
							<div className="w-full h-fit flex flex-row items-center justify-between">
								<h5 className="text-sm interMedium text-[#6B6B6B] w-full">Main Wallet</h5>
								<CiEdit size={20} color="#6B6B6B" />
							</div>
							<input
								type="text"
								placeholder={address ? address : 'Address'}
								className="px-2 py-4 h-10 my-2 interMedium text-blackText-500 rounded-md border border-black/50 w-full bg-transparent"
							/>
						</div>
					</div>
				</div>
				<div className=" w-full h-fit px-16 pb-5 flex flex-col xl:flex-row items-center justify-center ">
					<div className="w-full h-fit flex flex-row items-center justify-start pb-2 px-2 border-b-[2px] border-b-[#E4E4E4] ">
						<div className="py-1 px-3 rounded-full text-[#646464] cursor-pointer interMedium text-lg">Notifications & Insights</div>
					</div>
				</div>
				<div className=" w-full h-fit px-20 py-1 flex flex-col items-center justify-center mb-4 ">
					<h5 className="text-base interMedium text-[#181818] w-full">
						You can chose which notifications you would like to receive by email. At Nex Labs, we are committed to communication with users, keeping them updated with the last market news,
						investing insights and much more.
					</h5>
					<div className="w-full h-fit flex flex-col items-start justify-start gap-3 my-6">
						<div className="flex flex-row items-center justify-start gap-1">
							<Switch onChange={() => setOption1(!option1)} checked={option1} height={14} width={35} handleDiameter={20} />
							<h5 className="text-base interMedium text-[#646464] w-full">Receive emails about new features of Nex Labs</h5>
						</div>

						<div className="flex flex-row items-center justify-start gap-1">
							<Switch onChange={() => setOption2(!option2)} checked={option2} height={14} width={35} handleDiameter={20} />
							<h5 className="text-base interMedium text-[#646464] w-full">Receive emails about new features of Nex Labs</h5>
						</div>
						<div className="flex flex-row items-center justify-start gap-1">
							<Switch onChange={() => setOption3(!option3)} checked={option3} height={14} width={35} handleDiameter={20} />
							<h5 className="text-base interMedium text-[#646464] w-full">Receive emails about new features of Nex Labs</h5>
						</div>
						<div className="flex flex-row items-center justify-start gap-1">
							<Switch onChange={() => setOption4(!option4)} checked={option4} height={14} width={35} handleDiameter={20} />
							<h5 className="text-base interMedium text-[#646464] w-full">Receive emails about new features of Nex Labs</h5>
						</div>
						<div className="flex flex-row items-center justify-start gap-1">
							<Switch onChange={() => setOption5(!option5)} checked={option5} height={14} width={35} handleDiameter={20} />
							<h5 className="text-base interMedium text-[#646464] w-full">Receive emails about new features of Nex Labs</h5>
						</div>
						{option1 || option2 || option3 || option4 || option5 ? (
							<div className="w-fit h-fit flex flex-row items-center justify-start">
								<h5 className="interMedium text-xs text-[#181818] opacity-80 mt-4">
									** We will not sell your data to third parties or use your data for anything else rather than the sole purpose of the subscription or something slightly funny
								</h5>
							</div>
						) : (
							''
						)}
					</div>
				</div>
				<div className='w-full h-fit px-20 py-1 mb-4'>
					<button
						className={`text-xl text-white titleShadow interBold bg-gradient-to-tl from-colorFour-500 to-colorSeven-500 active:translate-y-[1px] active:shadow-black shadow-sm shadow-blackText-500 w-fit px-6 py-3 rounded-md hover:bg-colorTwo-500/30`}
					>
						Save Settings
					</button>
				</div>

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
