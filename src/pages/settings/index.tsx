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
	isRetailer: boolean
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
	showTradePopUp: boolean
}

export default function Settings() {
	const { mode } = useLandingPageStore()
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

	const [imageViwerOpened, setImageViwerOpened] = useState<boolean>(false)
	const [imageUploaderOpened, setImageUploaderOpened] = useState<boolean>(false)

	const [isRetailerAccount, setIsRetailerAccount] = useState<boolean>(false)

	const [option1, setOption1] = useState<boolean>(false)
	const [option2, setOption2] = useState<boolean>(false)
	const [option3, setOption3] = useState<boolean>(false)
	const [option4, setOption4] = useState<boolean>(false)
	const [option5, setOption5] = useState<boolean>(false)

	const [editable1, setEditable1] = useState<boolean>(false)
	const [editable2, setEditable2] = useState<boolean>(false)
	const [editable3, setEditable3] = useState<boolean>(false)
	const [editable4, setEditable4] = useState<boolean>(false)
	const [editable5, setEditable5] = useState<boolean>(false)
	const [editable6, setEditable6] = useState<boolean>(false)

	const [name, setName] = useState<string>('')
	const [instName, setInstName] = useState<string>('')
	const [email, setEmail] = useState<string>('')
	const [adr, setAdr] = useState<string>('')
	const [vatin, setVatin] = useState<string>('')
	const [uploadedPPLink, setUploadedPPLink] = useState<string>('none')
	const [chosenPPType, setChosenPPType] = useState<string>('none')

	const [connectedUser, setConnectedUser] = useState<User>()
	const [connectedUserId, setConnectedUserId] = useState<String>('')

	const uploader = Uploader({
		apiKey: 'free', // Get production API keys from Bytescale
	})
	const ImageUploaderOptions = { multi: false }

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
						setIsRetailerAccount(potentialUser.isRetailer)
						setConnectedUserId(key)
						setOption1(potentialUser.p1)
						setOption2(potentialUser.p2)
						setOption3(potentialUser.p3)
						setOption4(potentialUser.p4)
						setOption5(potentialUser.p5)
					}
				}
			})
		}
		getUser()
	}, [address])

	function saveSettings() {
		update(ref(database, 'users/' + connectedUserId), {
			isRetailer: isRetailerAccount != connectedUser?.isRetailer ? isRetailerAccount : connectedUser.isRetailer,
			name: name != connectedUser?.name && name != '' ? name : connectedUser?.name,
			email: email != connectedUser?.email && email != '' ? email : connectedUser?.email,
			address: adr != connectedUser?.address && adr != '' ? adr : connectedUser?.address,
			vatin: vatin != connectedUser?.vatin && vatin != '' ? vatin : connectedUser?.vatin,
			inst_name: instName != connectedUser?.inst_name && instName != '' ? instName : connectedUser?.inst_name,
			p1: option1 != connectedUser?.p1 ? option1 : connectedUser.p1,
			p2: option2 != connectedUser?.p2 ? option2 : connectedUser.p2,
			p3: option3 != connectedUser?.p3 ? option3 : connectedUser.p3,
			p4: option4 != connectedUser?.p4 ? option4 : connectedUser.p4,
			p5: option5 != connectedUser?.p5 ? option5 : connectedUser.p5,
			ppLink: uploadedPPLink != 'none' ? uploadedPPLink : connectedUser?.ppLink,
			ppType: chosenPPType != 'none' && chosenPPType != connectedUser?.ppType ? chosenPPType : connectedUser?.ppType,
		})
		GenericToast({
			type: 'success',
			message: 'Info & settings updated !',
		})
		router.push('/portfolio')
	}

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
			<main className={`min-h-screen overflow-x-hidden h-fit w-screen ${mode == 'dark' ? 'bg-gradient-to-tl from-[#050505] to-[#050505]' : 'bg-whiteBackground-500'}`}>
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
										<h5 className={`text-base${mode == "dark" ? " text-whiteText-500/70" : "text-gray-500"}  interMedium`}>{address && address != '' ? reduceAddress(address) : 'Connect your wallet'}</h5>
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
											mode == "dark" ? <BsCalendar4 color="#000000" size={15} /> : <BsCalendar4 color="#FFFFFF" size={15} />
										}

										<h5 className={`text-base ${mode != "dark" ? " text-whiteText-500" : "text-blackText-500"}  interBold`}>Joined 1 day ago</h5>
									</div>
								</div>
							</div>
							{/* <div className="lg:flex w-3/5 h-fit justify-end" id="smallChartBox">
							<Chart data={complexData} />
						</div> */}
							<div className="lg:flex w-2/5 "></div>
						</div>
					</section>
				</section>
				<div className=" w-full h-fit px-4 xl:px-16 pb-5 flex flex-col xl:flex-row items-center justify-center ">
					<div className="w-full h-fit flex flex-row items-center justify-start pb-2 xl:px-2 border-b-[2px] border-b-[#E4E4E4] ">
						<div className={`py-1 xl:px-3 rounded-full ${mode == "dark" ? " text-whiteText-500" : "text-[#646464]"} cursor-pointer interMedium text-lg`}>General Information</div>
					</div>
				</div>
				<div className=" w-full h-fit px-4 xl:px-20 py-1 flex flex-col items-center justify-center ">
					<h5 className={`text-base interMedium ${mode == "dark" ? " text-whiteText-500" : "text-[#181818]"} w-full`}>
						You can personalize your account by editing the general account information. This would also help us enhance your user experience.
					</h5>
					<div className="w-full h-fit">
						<h5 className={`text-sm interMedium ${mode == "dark" ? " text-whiteText-500" : "text-[#6B6B6B]"} w-full mt-6 mb-4`}>Account Type</h5>
					</div>
					<div className="flex flex-row w-full h-fit items-center justify-start gap-2 mb-3">
						<h5 className={`text-base interMedium py-1 px-2 rounded-lg ${!isRetailerAccount ? mode == "dark" ? "bg-cover border-transparent bg-center bg-no-repeat text-whiteText-500" : 'bg-gradient-to-tl from-colorFour-500 to-colorSeven-500 titleShadow' : 'text-[#646464]'}`} style={{
														boxShadow:
															mode == "dark" && !isRetailerAccount ? `0px 0px 6px 1px rgba(91,166,153,0.68)` : "",
														backgroundImage: mode == "dark" && !isRetailerAccount ? `url('${mesh1.src}')` : "",

													}}>
							Retailer
						</h5>
						<Switch
							onChange={() => setIsRetailerAccount(!isRetailerAccount)}
							checked={isRetailerAccount}
							height={14}
							width={35}
							handleDiameter={20}
							checkedIcon={false}
							uncheckedIcon={false}
							onColor="#5E869B"
							offColor="#5E869B"
						/>
						<h5 className={`text-base interMedium py-1 px-2 rounded-lg ${isRetailerAccount ? mode == "dark" ? "bg-cover border-transparent bg-center bg-no-repeat text-whiteText-500" : 'bg-gradient-to-tl from-colorFour-500 to-colorSeven-500 titleShadow' : 'text-[#646464]'}`} style={{
														boxShadow:
															mode == "dark" && isRetailerAccount ? `0px 0px 6px 1px rgba(91,166,153,0.68)` : "",
														backgroundImage: mode == "dark" && isRetailerAccount ? `url('${mesh1.src}')` : "",

													}}>
							Institutional Investor
						</h5>
					</div>
					<div className="w-full h-fit flex flex-col xl:flex-row items-center justify-between gap-3 my-6">
						<div className="w-full xl:w-4/12 h-fit">
							<div className="w-full h-fit flex flex-row items-center justify-between">
								<h5 className={`text-sm interMedium ${mode == "dark" ? " text-whiteText-500" : "text-[#6B6B6B]"} w-full`}>Name</h5>
								{!editable1 ? (
									<CiEdit
										size={20}
										color={editable1 ? '#089981' : mode == "dark" ? "#FFFFFF" : '#6B6B6B'}
										className=" cursor-pointer"
										onClick={() => {
											setEditable1(!editable1)
										}}
									/>
								) : (
									<FaCheck
										size={20}
										color={editable1 ? '#089981' : '#089981'}
										className="cursor-pointer"
										onClick={() => {
											setEditable1(!editable1)
										}}
									/>
								)}
							</div>
							<input
								type="text"
								placeholder={connectedUser && connectedUser.name != '' ? connectedUser.name : 'Name'}
								disabled={!editable1}
								className={`px-2 py-4 h-10 my-2 interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"} text-blackText-500 rounded-md border ${
									editable1 ? ' border-nexLightGreen-500 shadow-sm shadow-nexLightGreen-500' : mode == "dark" ? " border-white" : 'border-black/50'
								} w-full bg-transparent`}
								onChange={(e) => {
									setName(e.target.value.toString())
								}}
							/>
						</div>
						<div className="w-full xl:w-4/12 h-fit">
							<div className="w-full h-fit flex flex-row items-center justify-between">
								<h5 className={`text-sm interMedium ${mode == "dark" ? " text-whiteText-500" : "text-[#6B6B6B]"} w-full`}>Email</h5>
								{!editable2 ? (
									<CiEdit
										size={20}
										color={editable2 ? '#089981' : mode == "dark" ? "#FFFFFF" :'#6B6B6B'}
										className=" cursor-pointer"
										onClick={() => {
											setEditable2(!editable2)
										}}
									/>
								) : (
									<FaCheck
										size={20}
										color={editable2 ? '#089981' : '#089981'}
										className="cursor-pointer"
										onClick={() => {
											setEditable2(!editable2)
										}}
									/>
								)}
							</div>
							<input
								type="email"
								placeholder={connectedUser && connectedUser.email != '' ? connectedUser.email : 'xyz@email.com'}
								disabled={!editable2} 
								className={`px-2 py-4 h-10 my-2 interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"} text-blackText-500 rounded-md border ${
									editable2 ? ' border-nexLightGreen-500 shadow-sm shadow-nexLightGreen-500' : mode == "dark" ? " border-white" : 'border-black/50'
								} w-full bg-transparent`}
								onChange={(e) => {
									setEmail(e.target.value.toString())
								}}
							/>
						</div>
						<div className="w-full xl:w-4/12 h-fit">
							<div className="w-full h-fit flex flex-row items-center justify-between">
								<h5 className={`text-sm interMedium ${mode == "dark" ? " text-whiteText-500" : "text-[#6B6B6B]"} w-full`}>Main Wallet</h5>
							</div>
							<input
								type="text"
								placeholder={address ? address : 'Address'}
								disabled
								className="px-2 py-4 cursor-not-allowed h-10 my-2 interMedium text-blackText-500 rounded-md border border-black/50 w-full bg-transparent"
							/>
						</div>
					</div>
				</div>
				<div className={`${!isRetailerAccount ? 'hidden' : ''} w-full h-fit px-4 xl:px-16 py-5 flex flex-col xl:flex-row items-center justify-center `}>
					<div className="w-full h-fit flex flex-row items-center justify-start pb-2 xl:px-2 border-b-[2px] border-b-[#E4E4E4] ">
						<div className={`py-1 xl:px-3 rounded-full ${mode == "dark" ? " text-whiteText-500" : "text-[#646464]"} cursor-pointer interMedium text-lg`}>Legal Information</div>
					</div>
				</div>
				<div className={`${!isRetailerAccount ? 'hidden' : ''} w-full h-fit px-4 xl:px-20 py-1 flex flex-col items-center justify-center mb-4 `}>
					<h5 className="text-base interMedium text-[#181818] w-full">
						You can personalize your account by editing the general account information. This would also help us enhance your user experience.
					</h5>
					<div className="w-full h-fit flex flex-col xl:flex-row items-center justify-between gap-3 my-6">
						<div className="w-full xl:w-6/12 h-fit">
							<div className="w-full h-fit flex flex-row items-center justify-between">
								<h5 className={`text-sm interMedium ${mode == "dark" ? " text-whiteText-500" : "text-[#6B6B6B]"} w-full`}>Institutional Name</h5>
								{!editable3 ? (
									<CiEdit
										size={20}
										color={editable3 ? '#089981' : mode == "dark" ? "#FFFFFF" : '#6B6B6B'}
										className=" cursor-pointer"
										onClick={() => {
											setEditable3(!editable3)
										}}
									/>
								) : (
									<FaCheck
										size={20}
										color={editable3 ? '#089981' : '#089981'}
										className="cursor-pointer"
										onClick={() => {
											setEditable3(!editable3)
										}}
									/>
								)}
							</div>
							<input
								type="text"
								disabled={!editable3}
								placeholder={connectedUser && connectedUser.inst_name != '' ? connectedUser.inst_name : 'Institutional Name'}
								className={`px-2 py-4 h-10 my-2 interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"} text-blackText-500 rounded-md border ${
									editable3 ? ' border-nexLightGreen-500 shadow-sm shadow-nexLightGreen-500' : mode == "dark" ? " border-white" : 'border-black/50'
								} w-full bg-transparent`}
								onChange={(e) => {
									setInstName(e.target.value.toString())
								}}
							/>
						</div>

						<div className="w-full xl:w-6/12 h-fit">
							<div className="w-full h-fit flex flex-row items-center justify-between">
								<h5 className={`text-sm interMedium ${mode == "dark" ? " text-whiteText-500" : "text-[#6B6B6B]"} w-full`}>Address</h5>
								{!editable4 ? (
									<CiEdit
										size={20}
										color={editable4 ? '#089981' : mode == "dark" ? "#FFFFFF" : '#6B6B6B'}
										className=" cursor-pointer"
										onClick={() => {
											setEditable4(!editable4)
										}}
									/>
								) : (
									<FaCheck
										size={20}
										color={editable4 ? '#089981' : '#089981'}
										className="cursor-pointer"
										onClick={() => {
											setEditable4(!editable4)
										}}
									/>
								)}
							</div>
							<input
								type="text"
								disabled={!editable4}
								placeholder={connectedUser && connectedUser.address != '' ? connectedUser.address : 'Professional Address'}
								className={`px-2 py-4 h-10 my-2 interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"} text-blackText-500 rounded-md border ${
									editable4 ? ' border-nexLightGreen-500 shadow-sm shadow-nexLightGreen-500' : mode == "dark" ? " border-white" : 'border-black/50'
								} w-full bg-transparent`}
								onChange={(e) => {
									setAdr(e.target.value.toString())
								}}
							/>
						</div>
					</div>
					<div className="w-full h-fit flex flex-row items-center justify-between gap-3 mb-6">
						<div className="w-full xl:w-6/12 h-fit">
							<div className="w-full h-fit flex flex-row items-center justify-between">
								<h5 className={`text-sm interMedium ${mode == "dark" ? " text-whiteText-500" : "text-[#6B6B6B]"} w-full`}>VATIN (VAT registration number)</h5>
								{!editable5 ? (
									<CiEdit
										size={20}
										color={editable5 ? '#089981' : mode == "dark" ? "#FFFFFF" : '#6B6B6B'}
										className=" cursor-pointer"
										onClick={() => {
											setEditable5(!editable5)
										}}
									/>
								) : (
									<FaCheck
										size={20}
										color={editable5 ? '#089981' : '#089981'}
										className="cursor-pointer"
										onClick={() => {
											setEditable5(!editable5)
										}}
									/>
								)}
							</div>
							<input
								type="text"
								disabled={!editable5}
								placeholder={connectedUser && connectedUser.vatin != '' ? connectedUser.vatin : 'VAT Registration Number'}
								className={`px-2 py-4 h-10 my-2 interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"} text-blackText-500 rounded-md border ${
									editable5 ? ' border-nexLightGreen-500 shadow-sm shadow-nexLightGreen-500' : mode == "dark" ? " border-white" : 'border-black/50'
								} w-full bg-transparent`}
							
								onChange={(e) => {
									setVatin(e.target.value.toString())
								}}
							/>
						</div>
						<div className="w-full xl:w-6/12 h-fit">
							<div className="w-full h-fit flex flex-row items-center justify-between">
								<h5 className={`text-sm interMedium ${mode == "dark" ? " text-whiteText-500" : "text-[#6B6B6B]"} w-full`}>Number of Commerce Chambre</h5>
								{!editable6 ? (
									<CiEdit
										size={20}
										color={editable6 ? '#089981' : mode == "dark" ? "#FFFFFF" : '#6B6B6B'}
										className=" cursor-pointer"
										onClick={() => {
											setEditable6(!editable6)
										}}
									/>
								) : (
									<FaCheck
										size={20}
										color={editable6 ? '#089981' : '#089981'}
										className="cursor-pointer"
										onClick={() => {
											setEditable6(!editable6)
										}}
									/>
								)}
							</div>
							<input
								type="text"
								disabled={!editable6}
								placeholder={connectedUser && connectedUser.vatin != '' ? connectedUser.vatin : 'Number of Commerce Chambre'}
								className={`px-2 py-4 h-10 my-2 interMedium ${mode == "dark" ? " text-whiteText-500" : " text-blackText-500"} text-blackText-500 rounded-md border ${
									editable6 ? ' border-nexLightGreen-500 shadow-sm shadow-nexLightGreen-500' : mode == "dark" ? " border-white" : 'border-black/50'
								} w-full bg-transparent`}
								
							/>
						</div>
					</div>
				</div>
				<div className=" w-full h-fit px-4 xl:px-16 pb-5 flex flex-col xl:flex-row items-center justify-center ">
					<div className="w-full h-fit flex flex-row items-center justify-start pb-2 xl:px-2 border-b-[2px] border-b-[#E4E4E4] ">
						<div className={`py-1 xl:px-3 rounded-full ${mode == "dark" ? " text-whiteText-500" : "text-[#646464]"} cursor-pointer interMedium text-lg`}>Notifications & Insights</div>
					</div>
				</div>
				<div className=" w-full h-fit px-4 xl:px-20 py-1 flex flex-col items-center justify-center mb-4 ">
					<h5 className={`text-base interMedium ${mode == "dark" ? " text-whiteText-500" : "text-[#181818]"} w-full`}>
						You can chose which notifications you would like to receive by email. At Nex Labs, we are committed to communication with users, keeping them updated with the last market news,
						investing insights and much more.
					</h5>
					<div className="w-full h-fit flex flex-col items-start justify-start gap-3 my-6">
						<div className="flex flex-row items-center justify-start gap-3 xl:gap-1">
							<Switch onChange={() => setOption1(!option1)} checked={option1} height={14} width={35} handleDiameter={20} />
							<h5 className={`text-base interMedium ${mode == "dark" ? " text-whiteText-500" : "text-[#646464]"} w-full`}>Receive emails about new features of Nex Labs</h5>
						</div>

						<div className="flex flex-row items-center justify-start gap-3 xl:gap-1">
							<Switch onChange={() => setOption2(!option2)} checked={option2} height={14} width={35} handleDiameter={20} />
							<h5 className={`text-base interMedium ${mode == "dark" ? " text-whiteText-500" : "text-[#646464]"} w-full`}>Receive emails about different Nex Labs products</h5>
						</div>
						<div className="flex flex-row items-center justify-start gap-3 xl:gap-1">
							<Switch onChange={() => setOption3(!option3)} checked={option3} height={14} width={35} handleDiameter={20} />
							<h5 className={`text-base interMedium ${mode == "dark" ? " text-whiteText-500" : "text-[#646464]"} w-full`}>Receive weekly recap about events, market news ... </h5>
						</div>
						<div className="flex flex-row items-center justify-start gap-3 xl:gap-1">
							<Switch onChange={() => setOption4(!option4)} checked={option4} height={14} width={35} handleDiameter={20} />
							<h5 className={`text-base interMedium ${mode == "dark" ? " text-whiteText-500" : "text-[#646464]"} w-full`}>Receive emails about activities of your account</h5>
						</div>
						<div className="flex flex-row items-center justify-start gap-3 xl:gap-1">
							<Switch onChange={() => setOption5(!option5)} checked={option5} height={14} width={35} handleDiameter={20} />
							<h5 className={`text-base interMedium ${mode == "dark" ? " text-whiteText-500" : "text-[#646464]"} w-full`}>Receive monthly reports of your accont</h5>
						</div>
						{option1 || option2 || option3 || option4 || option5 ? (
							<div className="w-fit h-fit flex flex-row items-center justify-start">
								<h5 className={`interMedium text-sm xl:text-xs ${mode == "dark" ? " text-whiteText-500" : "text-[#181818]"} opacity-80 mt-4`}>
									** We will not sell your data to third parties or use your data for anything else rather than the sole purpose of the subscription or something slightly funny
								</h5>
							</div>
						) : (
							''
						)}
					</div>
				</div>
				<div className="w-full h-fit px-4 xl:px-20 py-1 mb-4">
					<button
						onClick={() => {
							saveSettings()
						}}
						disabled={
							name == '' &&
							email == '' &&
							adr == '' &&
							instName == '' &&
							vatin == '' &&
							uploadedPPLink == 'none' &&
							chosenPPType == connectedUser?.ppType &&
							option1 == connectedUser.p1 &&
							option2 == connectedUser.p2 &&
							option3 == connectedUser.p3 &&
							option4 == connectedUser.p4 &&
							option5 == connectedUser.p5
								? true
								: false
						}
						className={`text-xl text-white titleShadow interBold ${
							name == '' &&
							email == '' &&
							adr == '' &&
							instName == '' &&
							vatin == '' &&
							uploadedPPLink == 'none' &&
							chosenPPType == connectedUser?.ppType &&
							option1 == connectedUser.p1 &&
							option2 == connectedUser.p2 &&
							option3 == connectedUser.p3 &&
							option4 == connectedUser.p4 &&
							option5 == connectedUser.p5
								? 'grayscale'
								: ''
						} ${mode == "dark" ? " bg-cover border-transparent bg-center bg-no-repeat" : "bg-gradient-to-tl from-colorFour-500 to-colorSeven-500 hover:bg-colorTwo-500/30"}  active:translate-y-[1px] active:shadow-black shadow-sm shadow-blackText-500 w-fit px-6 py-3 rounded-md `}
						style={{
							boxShadow:
								mode == "dark" ? `0px 0px 6px 1px rgba(91,166,153,0.68)` : "",
							backgroundImage: mode == "dark" ? `url('${mesh1.src}')` : "",

						}}
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
				<GenericModal
					isOpen={imageUploaderOpened}
					onRequestClose={() => {
						setImageUploaderOpened(false)
					}}
				>
					<div className="w-full h-fit px-2 flex flex-col items-center justify-center">
						<h5 className="text-center interBold text-blackText-500 mb-4">Edit Profile Picture</h5>
						<UploadDropzone
							uploader={uploader}
							options={ImageUploaderOptions}
							onUpdate={(files) => {
								setUploadedPPLink(files.map((x) => x.fileUrl).join('\n'))
								setChosenPPType('image')
								setImageUploaderOpened(false)
								GenericToast({
									type: 'success',
									message: "Image uploaded succesfully, don't foget to save the chages!",
								})
							}}
							width="600px"
							height="250px"
						/>
						<p className="interBold text-blackText-500 text-sm my-6">Or</p>
						<button
							onClick={() => {
								setChosenPPType('identicon')
								setImageUploaderOpened(false)
								GenericToast({
									type: 'success',
									message: "Switched to auto generated Image, don't foget to save the chages!",
								})
							}}
							className={`text-xl mb-6 w-11/12 text-white titleShadow interBold bg-gradient-to-tl from-colorFour-500 to-colorSeven-500 active:translate-y-[1px] active:shadow-black shadow-sm shadow-blackText-500 px-6 py-3 rounded-md hover:bg-colorTwo-500/30`}
						>
							Use Auto Generated Images
						</button>
					</div>
				</GenericModal>
				{imageViwerOpened ? (
					<ImageViewer
						src={[connectedUser ? connectedUser?.ppLink.toString() : '']}
						currentIndex={0}
						disableScroll={false}
						closeOnClickOutside={true}
						onClose={() => {
							setImageViwerOpened(false)
						}}
					/>
				) : (
					''
				)}
			</main>
		</>
	)
}
