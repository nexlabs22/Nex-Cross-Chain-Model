'use client'

import Image from 'next/image'
import DappNavbar from '@/components/DappNavbar'
import dynamic from 'next/dynamic'
import Footer from '@/components/newFooter'
import MobileFooterSection from '@/components/mobileFooter'
import 'react-tabs/style/react-tabs.css'
import { useAddress, useContract, useContractRead } from '@thirdweb-dev/react'
import TipsBox2 from '@/components/TipsBox'
import anfiLogo from '@assets/images/anfi.png'
import cr5Logo from '@assets/images/cr5.png'
// import { useRouter } from 'next/navigation'
import { useRouter } from 'next/router'
import { goerliCrypto5IndexToken, zeroAddress, goerliAnfiV2IndexToken, goerlianfiPoolAddress, goerliLinkWethPoolAddress } from '@/constants/contractAddresses'
import { indexTokenAbi, indexTokenV2Abi } from '@/constants/abi'
import { FormatToViewNumber, num } from '@/hooks/math'
import GenericModal from '@/components/GenericModal'
import QRCode from 'react-qr-code'

import Link from 'next/link'
import Head from 'next/head'

import bg2 from '@assets/images/bg-2.png'
import { GoArrowRight } from 'react-icons/go'
import { IoMdArrowDown, IoMdArrowUp } from 'react-icons/io'
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
import usePortfolioPageStore from '@/store/portfolioStore'
import { useEffect, useState } from 'react'
import { nexTokenDataType } from '@/types/nexTokenData'
import convertToUSD from '@/utils/convertToUsd'
import useTradePageStore from '@/store/tradeStore'
import { nexTokens } from '@/constants/nexIndexTokens'
import { GetPositionsHistory2 } from '@/hooks/getTradeHistory2'

import { useQuery } from '@apollo/client'
import { GET_HISTORICAL_PRICES } from '@/uniswap/query'
import { getTimestampDaysAgo } from '@/utils/conversionFunctions'

export default function OwnedAsset({ params, searchParams }: { params: { slug: string }; searchParams: { [key: string]: string | string[] | undefined } }) {
	const address = useAddress()
	const { setEthPriceInUsd, ethPriceInUsd } = useTradePageStore()
	const positionHistory = GetPositionsHistory2()
	const { portfolioData, setPortfolioData } = usePortfolioPageStore()

	useEffect(() => {
		// setEthPriceInUsd()
		setPortfolioData(positionHistory.data)
	}, [setEthPriceInUsd, setPortfolioData, positionHistory.data])

	const {
		loading: loadingAnfi,
		error: errorAnfi,
		data: dataAnfi,
	} = useQuery(GET_HISTORICAL_PRICES, {
		variables: { poolAddress: goerlianfiPoolAddress.toLowerCase(), startingDate: getTimestampDaysAgo(1000), limit: 10, direction: 'asc' },
	})

	const {
		loading: loadingCR5,
		error: errorCR5,
		data: dataCR5,
	} = useQuery(GET_HISTORICAL_PRICES, {
		variables: { poolAddress: goerliLinkWethPoolAddress.toLowerCase(), startingDate: getTimestampDaysAgo(1000), limit: 10, direction: 'asc' },
	})

	const [dayChange, setDayChange] = useState<{ anfi: number | null; cr5: number | null }>({ anfi: null, cr5: null })

	if (!loadingCR5 && !loadingAnfi && !errorCR5 && !errorAnfi && dayChange.anfi === null && dayChange.cr5 === null) {
		const ANFIData = dataAnfi.poolDayDatas
		const CR5Data = dataCR5.poolDayDatas

		const todayANFIPrice = ANFIData[ANFIData.length - 1].token0Price || 0
		const yesterdayANFIPrice = ANFIData[ANFIData.length - 2].token0Price || 0

		const todayCR5Price = CR5Data[CR5Data.length - 1].token0Price || 0
		const yesterdayCR5Price = CR5Data[CR5Data.length - 2].token0Price || 0

		setDayChange({ anfi: todayANFIPrice - yesterdayANFIPrice, cr5: todayCR5Price - yesterdayCR5Price })
	}

	const [QRModalVisible, setQRModalVisible] = useState(false)

	const anfiTokenContract = useContract(goerliAnfiV2IndexToken, indexTokenV2Abi)
	const crypto5TokenContract = useContract(goerliCrypto5IndexToken, indexTokenAbi)

	const anfiTokenBalance = useContractRead(anfiTokenContract.contract, 'balanceOf', [!!address ? address : zeroAddress])
	const crypto5TokenBalance = useContractRead(crypto5TokenContract.contract, 'balanceOf', [!!address ? address : zeroAddress])

	const anfiPercent = (num(anfiTokenBalance.data) / (num(crypto5TokenBalance.data) + num(anfiTokenBalance.data))) * 100
	const crypto5Percent = (num(crypto5TokenBalance.data) / (num(crypto5TokenBalance.data) + num(anfiTokenBalance.data))) * 100

	const router = useRouter()
	const [assetData, setAssetData] = useState<nexTokenDataType[]>([])
	const assetObj = router.query.asset || 'ANFI'
	const assetName = (Array.isArray(assetObj) ? assetObj[0] : (assetObj as string)).toUpperCase()

	useEffect(() => {
		async function getTokenDetails() {
			const data = await Promise.all(
				nexTokens.map(async (item: nexTokenDataType) => {
					const calculatedUsdValue = !['CRYPTO5'].includes(item.symbol) ? (await convertToUSD({tokenAddress:item.address, tokenDecimals:item.decimals}, ethPriceInUsd, false)) || 0 : 0
					const totalToken = item.symbol === 'ANFI' ? num(anfiTokenBalance.data) : item.symbol === 'CRYPTO5' ? num(crypto5TokenBalance.data) : 0
					const indexDayChange = Math.abs(item.symbol === 'ANFI' ? dayChange.anfi || 0 : item.symbol === 'ANFI' ? dayChange.cr5 || 0 : 0)
					const totalTokenUsd = calculatedUsdValue * totalToken
					const percentage = item.symbol === 'ANFI' ? anfiPercent : crypto5Percent

					return {
						...item,
						totalToken,
						totalTokenUsd,
						percentage,
						indexDayChange,
					}
				})
			)

			setAssetData(data)
		}

		getTokenDetails()
	}, [anfiTokenBalance.data, crypto5TokenBalance.data, ethPriceInUsd, anfiPercent, crypto5Percent, dayChange.anfi, dayChange.cr5])

	const dataToshow = assetData.filter((asset) => asset.symbol === assetName)[0]
	const showPortfolioData = address && (num(anfiTokenBalance.data) > 0 || num(crypto5TokenBalance.data) > 0) ? true : false

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

	return (
		<>
			<Head>
				<title>Nex Labs - Asset Activity</title>
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
								<Image src={dataToshow ? dataToshow.logo : anfiLogo} alt="anfi" width={150} height={150} className=" rounded-full"></Image>
								<div className="w-full lg:w-2/3 h-fit flex flex-col items-center lg:items-start justify-start gap-2">
									<h5 className="text-2xl text-blackText-500 montrealBold">
										{showPortfolioData && dataToshow ? Number(dataToshow.totalToken?.toFixed(2)).toLocaleString() : '0.00'} {dataToshow ? dataToshow.symbol : 'ANFI'}
									</h5>
									<div className="flex flex-col xl:flex-row items-center justify-start gap-2">
										<h5 className="text-xl text-gray-500 interMedium">${showPortfolioData && dataToshow ? Number(dataToshow.totalTokenUsd?.toFixed(2)).toLocaleString() : '0.00'}</h5>
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
									<h5 className="interBold text-base text-[#646464] ">
										${showPortfolioData && portfolioData && portfolioData.tradedBalance ? Number(portfolioData.tradedBalance[assetName.toLowerCase()].toFixed(2)).toLocaleString() : '0.00'}
									</h5>
								</div>
								<div className="w-full h-fit flex flex-row items-center justify-end gap-3">
									<h5 className="interBold text-base text-blackText-500 ">24h Change</h5>
									<div className="w-fill h-fit flex flex-row items-center justify-center gap-1">
										<h5
											className={`interExtraBold text-base ${
												showPortfolioData && dataToshow && dataToshow.indexDayChange
													? dataToshow.indexDayChange > 0
														? 'text-nexLightGreen-500'
														: dataToshow.indexDayChange < 0
														? 'text-nexLightRed-500'
														: 'text-[#646464]'
													: 'text-[#646464]'
											}`}
											title={dataToshow && dataToshow.indexDayChange ? FormatToViewNumber({ value: dataToshow.indexDayChange, returnType: 'string' }).toString() : '0.00'}
										>
											$
											{showPortfolioData && dataToshow && dataToshow.indexDayChange
												? dataToshow.indexDayChange < 0.01
													? '≈ 0.00 '
													: FormatToViewNumber({ value: dataToshow.indexDayChange, returnType: 'string' })
												: '0.00'}
										</h5>
										<div
											className={`w-fit h-fit rounded-lg ${
												showPortfolioData && dataToshow && dataToshow.indexDayChange
													? dataToshow.indexDayChange > 0
														? 'bg-nexLightGreen-500'
														: dataToshow.indexDayChange < 0
														? 'bg-nexLightRed-500'
														: ''
													: ''
											} p-1`}
										>
											{showPortfolioData && dataToshow && dataToshow.indexDayChange ? (
												dataToshow.indexDayChange > 0 ? (
													<IoMdArrowUp color="#FFFFFF" size={10} />
												) : dataToshow.indexDayChange < 0 ? (
													'bg-nexLightRed-500'
												) : (
													<IoMdArrowDown color="#FFFFFF" size={10} />
												)
											) : (
												''
											)}
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className=" w-full h-fit px-20 py-5 flex flex-col xl:flex-row items-center justify-center mb-10 ">
							<div className="w-full h-fit flex flex-row items-center justify-start pb-4 px-2 border-b-[2px] border-b-[#E4E4E4] ">
								<button
									className="py-1 px-3 rounded-full text-[#646464] cursor-pointer interMedium text-lg"
									onClick={() => {
										router.push(`/ownedAsset?asset=anfi`)
									}}
								>
									Overview
								</button>
								<button
									className="py-1 px-3 shadow shadow-[#5E869B] cursor-pointer rounded-full border-[2px] border-[#5E869B] text-[#5E869B] interMedium text-lg"
									onClick={() => {
										router.push(`/assetActivity?asset=anfi`)
									}}
								>
									Activity
								</button>
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
											<h5
												className="interExtraBold text-2xl text-whiteText-500 titleShadow"
												title={dataToshow && dataToshow.indexDayChange ? FormatToViewNumber({ value: dataToshow.indexDayChange, returnType: 'string' }).toString() : '0.00'}
											>
												$
												{showPortfolioData && dataToshow && dataToshow.indexDayChange
													? dataToshow.indexDayChange < 0.01
														? '≈ 0.00 '
														: FormatToViewNumber({ value: dataToshow.indexDayChange, returnType: 'string' })
													: '0.00'}
											</h5>
											<div className="w-fit h-fit rounded-md bg-whiteText-500 p-1">
												{showPortfolioData && dataToshow && dataToshow.indexDayChange ? (
													dataToshow.indexDayChange > 0 ? (
														<IoMdArrowUp color="#089981" size={14} />
													) : dataToshow.indexDayChange < 0 ? (
														'bg-nexLightRed-500'
													) : (
														<IoMdArrowDown color="#F23645" size={14} />
													)
												) : (
													<></>
												)}
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
