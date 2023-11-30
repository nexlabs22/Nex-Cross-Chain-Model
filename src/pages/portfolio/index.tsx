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

import bg from '@assets/images/3d hologram.png'
import anfiLogo from '@assets/images/anfi.png'
import cr5Logo from '@assets/images/cr5.png'
const Chart = dynamic(() => import('@/components/portfolioPNLChart'), { loading: () => <p>Loading ...</p>, ssr: false })
import { BiCopy } from 'react-icons/bi'
import { PiQrCodeDuotone } from 'react-icons/pi'
import { BsCalendar4 } from 'react-icons/bs'
import { goerliAnfiIndexToken, goerliCrypto5IndexToken, crypto5PoolAddress, anfiPoolAddress, zeroAddress } from '@/constants/contractAddresses'
import { indexTokenAbi } from '@/constants/abi'
import { FormatToViewNumber, num } from '@/hooks/math'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { GenericToast } from '@/components/GenericToast'
import GenericModal from '@/components/GenericModal'
import QRCode from 'react-qr-code'

import GenericPieChart from '@/components/GenericPieChart'
import Link from 'next/link'
import Head from 'next/head'

import { useQuery } from '@apollo/client'
import { GET_HISTORICAL_PRICES } from '@/uniswap/query'
import { getTimestampDaysAgo } from '@/utils/conversionFunctions'


export default function Portfolio() {
	const address = useAddress()
	const [QRModalVisible, setQRModalVisible] = useState<boolean>(false)
	const { selectedPortfolioChartSliceIndex, setSelectedPortfolioChartSliceIndex } = useTradePageStore()

	const anfiTokenContract = useContract(goerliAnfiIndexToken, indexTokenAbi)
	const crypto5TokenContract = useContract(goerliCrypto5IndexToken, indexTokenAbi)

	const anfiTokenBalance = useContractRead(anfiTokenContract.contract, 'balanceOf', [!!address ? address : zeroAddress])
	const crypto5TokenBalance = useContractRead(crypto5TokenContract.contract, 'balanceOf', [!!address ? address : zeroAddress])

	const anfiPercent = (num(anfiTokenBalance.data) / (num(crypto5TokenBalance.data) + num(anfiTokenBalance.data))) * 100
	const crypto5Percent = (num(crypto5TokenBalance.data) / (num(crypto5TokenBalance.data) + num(anfiTokenBalance.data))) * 100

	const {
		loading: loadingAnfi,
		error: errorAnfi,
		data: dataAnfi
	} = useQuery(GET_HISTORICAL_PRICES, {
		variables: { poolAddress: anfiPoolAddress.toLowerCase(), startingDate: getTimestampDaysAgo(90) },
	});

	const {
		loading: loadingCR5,
		error: errorCR5,
		data: dataCR5
	} = useQuery(GET_HISTORICAL_PRICES, {
		variables: { poolAddress: crypto5PoolAddress.toLowerCase(), startingDate: getTimestampDaysAgo(90) },
	});

	// let anfiPrice = 0; let cr5Price = 0;
	// let anfi24hChng = 0; let cr524hChng = 0;
	const [chartArr, setChartArr] = useState<{ time: number, value: number }[]>([]);
	const [indexPrices, setIndexPrices] = useState({anfi: 0, cr5:0});
	const [index24hChange, setIndex24hChange] = useState({anfi: 0, cr5:0});
	
	if ((!loadingCR5 && !loadingAnfi) && (!errorCR5 && !errorAnfi) && chartArr.length == 0 && !!anfiPercent && !!crypto5Percent) {
		const chartData: { time: number, value: number }[] = [];
		const ANFIData = dataAnfi.poolDayDatas
		const CR5Data = dataCR5.poolDayDatas
		for (let i = 0; i <= ANFIData.length - 1; i++) {
			const chartObj: { time: number, value: number } = { time: 0, value: 0 };
			const value = num(anfiTokenBalance.data) * Number(ANFIData[i].token0Price) + num(crypto5TokenBalance.data) * Number(CR5Data[i].token0Price)
			chartObj.time = ANFIData[i].date
			chartObj.value = value
			chartData.push(chartObj)
		}
		setChartArr(chartData)

		const anfiPrice = ANFIData[ANFIData.length - 1].token0Price  * num(anfiTokenBalance.data)
		const cr5Price = CR5Data[CR5Data.length - 1].token0Price * num(crypto5TokenBalance.data)
		setIndexPrices({anfi: anfiPrice, cr5:cr5Price})

		const todayANFIPrice = ANFIData[ANFIData.length - 1].token0Price
		const yesterdayANFIPrice = ANFIData[ANFIData.length - 2].token0Price
		const anfi24hChng = ((todayANFIPrice - yesterdayANFIPrice) / yesterdayANFIPrice) * 100;

		const todayCR5Price = CR5Data[CR5Data.length - 1].token0Price
		const yesterdayCR5Price = CR5Data[CR5Data.length - 2].token0Price
		const cr524hChng = ((todayCR5Price - yesterdayCR5Price) / yesterdayCR5Price) * 100;
		setIndex24hChange({anfi:anfi24hChng, cr5:cr524hChng})

	}

	const todayPortfolioPrice = chartArr[chartArr.length - 1]?.value
	const yesterdayPortfolioPrice = chartArr[chartArr.length - 2]?.value
	const portfolio24hChange = ((todayPortfolioPrice - yesterdayPortfolioPrice) / yesterdayPortfolioPrice) * 100;

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
		['ANFI', anfiPercent ? anfiPercent:0],
		['FIAT', anfiPercent ? 0 : 5],
	]

	const PieChartdata = [
		{
			label: 'ANFI',
			percentage: !!anfiPercent ? anfiPercent + '%' : '37%',
			color: '#133140',
		},
		{
			label: 'CRYPTO 5',
			percentage: !!crypto5Percent ? crypto5Percent + '%' : '63%',
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
		{ time: '2018-04-04', value: 0 }
	]

	return (
		<>
			<Head>
				<title>Nexlabs.io, welcome!</title>
				<meta name="description" content="NexLabs: decentralized trading platform" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main className="min-h-screen overflow-x-hidden h-fit w-screen bg-whiteBackground-500">
				<section className="h-full w-fit overflow-x-hidde">
					<DappNavbar />
					<section className="w-screen h-fit pt-10">
						<div className="w-full h-fit px-20 py-5 flex flex-row items-center justify-between mb-10">
							<div className="w-full lg:w-2/5 h-fit flex flex-col lg:flex-row items-center justify-between gap-8">
								{address && address != '' ? <GenericAvatar walletAddress={address}></GenericAvatar> : <div className="w-40 lg:w-2/5 aspect-square bg-colorSeven-500 rounded-full"></div>}
								<div className="w-full lg:w-2/3 h-fit flex flex-col items-center lg:items-start justify-start gap-2">
									<h5 className="text-xl text-blackText-500 montrealBold">ID: 88320</h5>
									<div className="flex flex-row items-center justify-start gap-2">
										<h5 className="text-base text-gray-500 interMedium">
											{address && address != '' ? address.toString().slice(0, 7) + '...' + address.toString().substring(address.toString().length - 7) : 'Connect your wallet'}
										</h5>
										<div className=" bg-colorSeven-500/50 w-fit cursor-pointer h-fit p-2 rounded-full">
											<CopyToClipboard text={address as string} onCopy={handleCopy}>
												<BiCopy color="#000000" size={15} />
											</CopyToClipboard>
										</div>
										<div
											className=" bg-colorSeven-500/50 w-fit h-fit p-2 rounded-full cursor-pointer"
											onClick={() => {
												if (address) setQRModalVisible(true)
												else
													GenericToast({
														type: 'error',
														message: `Please connect your wallet!`,
													})
											}}
										>
											<PiQrCodeDuotone color="#000000" size={15} />
										</div>
									</div>
									<div className=" bg-colorSeven-500 w-fit h-fit py-1 px-3 rounded-2xl flex flex-row items-center justify-center gap-2">
										<BsCalendar4 color="#FFFFFF" size={15} />
										<h5 className="text-base text-whiteText-500 montrealBold">45 Days</h5>
									</div>
								</div>
							</div>
							{/* <div className="lg:flex w-3/5 h-fit justify-end" id="smallChartBox">
							<Chart data={complexData} />
						</div> */}
							<div className="lg:flex w-2/5 "></div>
							<div className="lg:flex w-1/5 justify-end mr-0 relative" id="smallChartBox">
								{/* <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-bold italic text-black text-5xl z-10`}>
									${portfolio24hChange ? portfolio24hChange.toFixed(2) : 0}
								</div> */}
								<Chart data={address && (num(anfiTokenBalance.data) > 0 || num(crypto5TokenBalance.data) > 0) ? chartArr : emptyData} change={address && (num(anfiTokenBalance.data) > 0 || num(crypto5TokenBalance.data) > 0) ? portfolio24hChange:0} />
							</div>
						</div>
						<div className="w-full h-fit px-2 lg:px-20">
							<Tabs>
								<TabList>
									<Tab>
										<h5 className="montrealBold text-xl">Indices</h5>
									</Tab>
								</TabList>

								<TabPanel>
									<div className="w-full h-fit p-4">
										<div className="px-4 py-8 grid grid-cols-8 grid-rows-auto lg:rid-cols-8 lg:grid-rows-1 rounded-2xl bg-gradient-to-b from-colorSeven-500 to-lightBlueBackground-500 shadow-sm shadow-blackText-500">
											<div className="w-full h-fit px-4 py-2 flex flex-col items-center justify-center">
												<Image src={anfiLogo} alt="anfi logo" width={80} height={80} className="mb-3"></Image>
												<h5 className="interBlack text-xl text-white titleShadow">ANFI</h5>
												<h5 className="interBold text-2xl text-white titleShadow mb-2">
													{/* $ {anfiTokenBalance.data ? FormatToViewNumber({ value: num(anfiTokenBalance.data), returnType: 'string' }) : 0} */}
													{/* $ {indexPrices.anfi ? FormatToViewNumber({ value: indexPrices.anfi, returnType: 'string' }) : 0} */}
													$ {address && (num(anfiTokenBalance.data) > 0 || num(crypto5TokenBalance.data) > 0) && indexPrices.anfi ? indexPrices.anfi.toFixed(2) : 0}
												</h5>
												<h5 className="interMedium italic text-base text-white titleShadow">{address && (num(anfiTokenBalance.data) > 0 || num(crypto5TokenBalance.data) > 0) ? index24hChange.anfi.toFixed(2): 0}%</h5>
											</div>
											<div className="w-full h-fit px-4 py-2 flex flex-col items-center justify-center">
												<Image src={cr5Logo} alt="cr5 logo" width={80} height={80} className="mb-3"></Image>
												<h5 className="interBlack text-xl text-white titleShadow">CRYPTO 5</h5>
												<h5 className="interBold text-2xl text-white titleShadow mb-2">
													{/* $ {crypto5TokenBalance.data ? FormatToViewNumber({ value: num(crypto5TokenBalance.data), returnType: 'string' }) : 0} */}
													{/* $ {indexPrices.cr5 ? FormatToViewNumber({ value: indexPrices.cr5, returnType: 'string' }) : 0} */}
													$ {address && (num(anfiTokenBalance.data) > 0 || num(crypto5TokenBalance.data) > 0) && indexPrices.cr5 ? indexPrices.cr5.toFixed(2) : 0}
												</h5>
												<h5 className="interMedium italic text-base text-white titleShadow">{address && (num(anfiTokenBalance.data) > 0 || num(crypto5TokenBalance.data) > 0) ? index24hChange.cr5.toFixed(2): 0}%</h5>
											</div>
										</div>
									</div>
								</TabPanel>
							</Tabs>
						</div>
						<div className="w-full h-fit px-5 lg:px-20 mt-10">
							<h5 className="interBlack text-3xl text-blackText-500">Assets Distribution</h5>
							<div className="w-full h-full flex flex-row items-start justify-around">
								<div className="w-1/2 h-fit flex flex-row items-center justify-start mb-20">
									<GenericPieChart data={PieChartdata} />
								</div>
								<div className="w-1/2 h-full flex flex-col items-start justify-start gap-4 pt-28">
									<h5 className="interBold text-xl text-blackText-500">
										Index / Asset : <span className="interMedium">{selectedPortfolioChartSliceIndex}</span>
									</h5>
									<div className="flex flex-row items-center justify-between gap-2">
										<h5 className="interBold text-xl text-blackText-500">
											Smart contract : <span className="interMedium">0xJN820...093NEZ</span>
										</h5>
										<div className=" bg-colorSeven-500/50 w-fit h-fit p-2 rounded-full">
											<BiCopy color="#000000" size={12} />
										</div>
									</div>
									<div className="flex flex-row items-center justify-between gap-2">
										<h5 className="interBold text-xl text-blackText-500">
											Last transaction : <span className="interMedium">0xJN820...093NEZ</span>
										</h5>
										<div className=" bg-colorSeven-500/50 w-fit h-fit p-2 rounded-full">
											<BiCopy color="#000000" size={12} />
										</div>
									</div>
									<div className="flex flex-row items-center justify-between gap-2">
										<h5 className="interBold text-xl text-blackText-500">
											Owned amount : <span className="interMedium">283.2</span>
										</h5>
									</div>
									<div className="flex flex-row items-center justify-between gap-2">
										<h5 className="interBold text-xl text-blackText-500">
											Txn history :{' '}
											<span className="interMedium text-colorSeven-500">
												<Link href="">See More</Link>
											</span>
										</h5>
									</div>
								</div>
							</div>
						</div>
					</section>
				</section>

				<div className="w-fit h-fit pt-16">
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
