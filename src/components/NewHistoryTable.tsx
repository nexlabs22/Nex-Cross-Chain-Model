import { Stack, Container, Typography, Button } from '@mui/material'
import { Menu, MenuButton, MenuItem } from '@szhsin/react-menu'
import '@szhsin/react-menu/dist/index.css'
import '@szhsin/react-menu/dist/transitions/slide.css'
import Image from 'next/image'
import Link from 'next/link'
import { lightTheme } from '@/theme/theme'
import anfiLogo from '@assets/images/anfi.png'
import cr5Logo from '@assets/images/cr5.png'
import Divider from '@mui/material/Divider'
import { goerliAnfiFactory, goerliAnfiV2Factory, goerliCrypto5Factory, sepoliaTokenAddresses } from '@/constants/contractAddresses'
import { sepoliaTokens } from '@/constants/testnetTokens'
import { FormatToViewNumber, formatNumber } from '@/hooks/math'
import usePortfolioPageStore from '@/store/portfolioStore'
import useTradePageStore from '@/store/tradeStore'
import { PositionType } from '@/types/tradeTableTypes'
import convertToUSD from '@/utils/convertToUsd'
import React, { useEffect, useState } from 'react'
import etherscan from '@assets/images/etherscan2.png'
import ccip from '@assets/images/ccip.png'
import chainlink from '@assets/images/chainlink.png'
import { useLandingPageStore } from '@/store/store'
import { BsArrowCounterclockwise } from 'react-icons/bs'
import { convertTime, reduceAddress } from '@/utils/general'
import exportPDF from '@/utils/exportTable'

import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'
import { GetPositionsHistoryDefi } from '@/hooks/getPositionsHistoryDefi'
import { GetPositionsHistoryCrossChain } from '@/hooks/getPositiontHistoryCrosschain'
import { useAddress } from '@thirdweb-dev/react'
import { IoMdLink } from 'react-icons/io'
import { PWAGradientStack } from '@/theme/overrides'
import { RiDownloadLine } from 'react-icons/ri'
import { toast } from 'react-toastify'
import { GenericToast } from './GenericToast'
import { CSVLink } from 'react-csv'

function NewHistoryTable({ initialStandalone = false }: { initialStandalone?: boolean }) {
	const address = useAddress()
	const { mode, selectedIndex } = useLandingPageStore()
	const { swapFromCur, swapToCur, setTradeTableReload, tradeTableReload, crosschainTableReload, setEthPriceInUsd, ethPriceInUsd, isMainnet } = useTradePageStore()
	const { ownedAssetInActivity, setPortfolioData } = usePortfolioPageStore()

	const positionHistoryDefi = GetPositionsHistoryDefi()
	const positionHistoryCrosschain = GetPositionsHistoryCrossChain()

	const [positionHistoryData, setPositionHistoryData] = useState<PositionType[]>([])
	const [combinedPositionTableData, setCombinedPositionTableData] = useState<PositionType[]>([])
	const [usdPrices, setUsdPrices] = useState<{ [key: string]: number }>({})

	const activeIndexType = swapFromCur?.indexType === 'defi' || swapToCur?.indexType === 'defi' ? 'defi' : 'crosschain'

	useEffect(() => {
		const crossChainRequests = positionHistoryCrosschain.requests
		const crossChainHistory = positionHistoryCrosschain.history

		const activeRequests = crossChainRequests.filter((data) => {
			const isExist = crossChainHistory.find((hist) => {
				return hist.nonce === data.nonce && hist.side === data.side
			})
			return !isExist
		})

		const combinedData = [...crossChainHistory, ...activeRequests].sort((a, b) => b.timestamp - a.timestamp)

		if (JSON.stringify(combinedData) !== JSON.stringify(combinedPositionTableData)) {
			setCombinedPositionTableData(combinedData)
		}
	}, [positionHistoryCrosschain])

	const path = typeof window !== 'undefined' ? window.location.pathname : '/'
	const searchQuery = typeof window !== 'undefined' ? window.location.search : '/'
	const assetName = searchQuery.split('=')[1]

	const allowedSymbols = sepoliaTokens.filter((token) => token.isNexlabToken).map((token) => token.Symbol)
	const activeTicker = [swapFromCur.Symbol, swapToCur.Symbol].filter((symbol) => allowedSymbols.includes(symbol))

	useEffect(() => {
		const combinedData = positionHistoryDefi.data.concat(positionHistoryCrosschain.history)
		setPortfolioData(combinedData)
	}, [setEthPriceInUsd, setPortfolioData, positionHistoryDefi.data, positionHistoryCrosschain.history])

	useEffect(() => {
		if (path === '/tradeIndex') {
			const data = activeIndexType === 'defi' ? positionHistoryDefi.data : combinedPositionTableData
			const dataToShow = data.filter((data: { indexName: string }) => {
				return data.indexName === activeTicker[0]
			})
			if (JSON.stringify(dataToShow) !== JSON.stringify(positionHistoryData)) {
				setPositionHistoryData(dataToShow)
			}
		} else if (path === '/pwa_tradeIndex') {
			const dataTotal = combinedPositionTableData.concat(positionHistoryDefi.data).sort((a, b) => b.timestamp - a.timestamp)
			const data = dataTotal.filter((data) => {
				return selectedIndex.toUpperCase() === data.indexName
			})

			setPositionHistoryData(data)
		} else if (path === '/portfolio' || path === '/history' || path === '/pwa_history') {
			const data = positionHistoryCrosschain.history.concat(positionHistoryDefi.data).sort((a, b) => b.timestamp - a.timestamp)
			setPositionHistoryData(data)
		} else if (path === '/assetActivity') {
			const dataTotal = combinedPositionTableData.concat(positionHistoryDefi.data).sort((a, b) => b.timestamp - a.timestamp)
			const data = dataTotal.filter((data) => {
				return assetName.toUpperCase() === data.indexName
			})

			setPositionHistoryData(data)
		}
	}, [path, positionHistoryDefi.data, assetName, swapFromCur.Symbol, swapToCur.Symbol, ownedAssetInActivity, combinedPositionTableData])

	useEffect(() => {
		if (tradeTableReload) {
			activeIndexType === 'defi' ? positionHistoryDefi.reload() : positionHistoryCrosschain.reload()
			setTradeTableReload(false)
		}
	}, [positionHistoryDefi, setTradeTableReload, tradeTableReload, activeIndexType, positionHistoryCrosschain])

	useEffect(() => {
		async function getUsdPrices() {
			sepoliaTokens.map(async (token) => {
				if (ethPriceInUsd > 0) {
					const obj = usdPrices
					obj[token.address] = (await convertToUSD({ tokenAddress: token.address, tokenDecimals: token.decimals }, ethPriceInUsd, false)) || 0 // false as for testnet tokens
					if (Object.keys(usdPrices).length === sepoliaTokens.length - 1) {
						setUsdPrices(obj)
					}
				}
			})
		}

		getUsdPrices()
	}, [ethPriceInUsd, usdPrices])

	const dataToShow: PositionType[] = Array.from(
		{ length: Math.max(5, positionHistoryData.length) },
		(_, index) =>
			positionHistoryData[index] || {
				timestamp: 0,
				indexName: '',
				inputAmount: 0,
				outputAmount: 0,
				tokenAddress: '',
				side: '',
				sendStatus: '',
				receiveStatus: '',
			}
	)

	useEffect(() => {
		console.log(dataToShow)
	}, [dataToShow])

	const [isStandalone, setIsStandalone] = useState(initialStandalone)
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

	const handleExportPDF = () => {
		toast.dismiss()
		GenericToast({
			type: 'loading',
			message: 'Generating PDF...',
		})

		const dataToExport = []
		const heading = ['Time', 'Pair', 'Request Side', 'Input Amount', 'Output Amount', 'Transaction hash']
		dataToExport.push(heading)
		positionHistoryData
			.sort((a, b) => b.timestamp - a.timestamp)
			.forEach((position) => {
				const side = position.side.split(' ')[0]

				dataToExport.push([
					convertTime(position.timestamp),
					position.indexName,
					{ text: side, bold: true, color: 'white', alignment: 'center', fillColor: side.toLowerCase() === 'mint' ? '#089981' : '#F23645' },
					{
						text: [
							`${FormatToViewNumber({ value: position.inputAmount, returnType: 'string' })} ${
								side.toLowerCase() === 'mint' ? Object.keys(sepoliaTokenAddresses).find((key) => sepoliaTokenAddresses[key] === position.tokenAddress) : position.indexName
							}`,
						],
					},
					{
						text: [
							`${FormatToViewNumber({ value: position.outputAmount, returnType: 'string' })} ${
								side.toLowerCase() === 'burn' ? Object.keys(sepoliaTokenAddresses).find((key) => sepoliaTokenAddresses[key] === position.tokenAddress) : position.indexName
							}`,
						],
					},
					position.txHash,
				])
			})

		const tableData = dataToExport

		exportPDF(tableData, 'landscape', address as string)
	}

	const timestampstring = new Date().toISOString().replace(/[-:]/g, '').split('.')[0].split('T').join('')
	const fileName = `NEX-TX-HISTORY-${timestampstring}`

	const csvData: any[][] = [
		['Time', 'Pair', 'Request Side', 'Input Amount', 'Output Amount', 'Transaction hash'],
		...positionHistoryData
			.sort((a, b) => b.timestamp - a.timestamp)
			.map((position) => [
				convertTime(position.timestamp) || '', // Using empty string if date is undefined
				position.indexName || '',
				position.side.split(' ')[0] || '',
				`${FormatToViewNumber({ value: position.inputAmount, returnType: 'string' })} ${
					position.side.toLowerCase() === 'mint request' ? Object.keys(sepoliaTokenAddresses).find((key) => sepoliaTokenAddresses[key] === position.tokenAddress) : position.indexName
				}` || '',
				`${FormatToViewNumber({ value: position.outputAmount, returnType: 'string' })} ${
					position.side.toLowerCase() === 'burn request' ? Object.keys(sepoliaTokenAddresses).find((key) => sepoliaTokenAddresses[key] === position.tokenAddress) : position.indexName
				}` || '',
				position.txHash || '',
			]),
	]

	const handleExportCSV = () => {
		toast.dismiss()
		GenericToast({
			type: 'success',
			message: 'CSV file downloaded successfully...',
		})
	}

	return isStandalone ? (
		<>
			<Stack id="PWAProfileHistory" width={'100%'} height={'fit-content'} minHeight={'100vh'} marginTop={1} direction={'column'} alignItems={'center'} justifyContent={'start'}>
				<Stack width={'100%'} height={'fit-content'} direction={'row'} alignItems={'center'} justifyContent={'space-between'} marginBottom={1}>
					<Typography
						variant="h6"
						sx={{
							color: lightTheme.palette.text.primary,
							fontWeight: 700,
						}}
					>
						Transactions History
					</Typography>
					<Menu
						transition
						direction="bottom"
						align="end"
						position="anchor"
						menuButton={
							<MenuButton className={'w-fit'}>
								<Stack width={'100%'} height={'fit-content'} paddingY={0.5} paddingX={1} direction={'row'} alignItems={'center'} justifyContent={'start'} gap={1}>
									<RiDownloadLine size={22} color={lightTheme.palette.text.primary}></RiDownloadLine>
								</Stack>
							</MenuButton>
						}
					>
						<MenuItem onClick={handleExportPDF}>
							<Typography
								variant="subtitle1"
								sx={{
									color: lightTheme.palette.text.primary,
									fontWeight: 600,
								}}
							>
								Export to PDF
							</Typography>
						</MenuItem>
						<MenuItem>
							<CSVLink data={csvData} filename={`${fileName}.csv`} onClick={handleExportCSV}>
								<Typography
									variant="subtitle1"
									sx={{
										color: lightTheme.palette.text.primary,
										fontWeight: 600,
									}}
								>
									Export to CSV
								</Typography>
							</CSVLink>
						</MenuItem>
					</Menu>
				</Stack>
				{address ? (
					<Stack
						width={'100%'}
						height={'fit-content'}
						direction={'column'}
						alignItems={'center'}
						justifyContent={'start'}
						gap={1}
						marginY={2}
						sx={{
							overflowY: 'scroll',
						}}
					>
						{dataToShow.map((position: PositionType, i: React.Key | null | undefined) => {
							return (
								<Stack
									key={i}
									width={'100%'}
									height={'fit-content'}
									direction={'column'}
									alignItems={'center'}
									justifyContent={'start'}
									borderRadius={'1.2rem'}
									paddingY={1}
									paddingX={1.5}
									sx={PWAGradientStack}
								>
									<Stack width={'100%'} height={'fit-content'} direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
										<Stack direction={'row'} alignItems={'center'} justifyContent={'start'} width={'fit-content'} height={'fit-content'} gap={2}>
											<Image alt="index logo" src={anfiLogo} width={60} height={60} className="rounded-full mb-2"></Image>
											<Stack direction={'column'} width={'fit-content'} height={'fit-content'} gap={1}>
												<Typography
													variant="caption"
													sx={{
														color: lightTheme.palette.text.primary,
														fontWeight: 600,
													}}
												>
													{position.indexName ? position.indexName : '-'}
												</Typography>
												<Typography
													variant="caption"
													sx={{
														color: lightTheme.palette.text.primary,
														fontWeight: 500,
													}}
												>
													{position.outputAmount && position.tokenAddress ? (
														<>
															{FormatToViewNumber({ value: Number(position.outputAmount), returnType: 'string' })}{' '}
															{position.side === 'Burn Request'
																? Object.keys(sepoliaTokenAddresses).find((key) => sepoliaTokenAddresses[key] === position.tokenAddress)
																: position?.indexName}{' '}
															{isMainnet && (
																<>
																	<div className="text-slate-500">
																		<em>
																			≈ $
																			{usdPrices
																				? position.side === 'Burn Request'
																					? formatNumber(position.outputAmount * usdPrices[position.tokenAddress])
																					: formatNumber(position.outputAmount * usdPrices[sepoliaTokenAddresses[position?.indexName as string]])
																				: 0}{' '}
																		</em>
																	</div>{' '}
																</>
															)}
														</>
													) : (
														'-'
													)}
												</Typography>
												<Typography
													variant="caption"
													sx={{
														color: lightTheme.palette.text.primary,
														fontWeight: 500,
													}}
												>
													Fees: 1%
												</Typography>
											</Stack>
										</Stack>
										<Stack paddingRight={1} direction={'column'} width={'fit-content'} height={'fit-content'} gap={1} alignItems={'end'} justifyContent={'center'}>
											<Typography
												variant="caption"
												sx={{
													color: lightTheme.palette.text.primary,
													fontWeight: 600,
												}}
											>
												Total:{' '}
												{position.inputAmount && position.tokenAddress ? (
													<>
														{FormatToViewNumber({ value: Number(position.inputAmount), returnType: 'string' })}{' '}
														{position.side === 'Mint Request'
															? Object.keys(sepoliaTokenAddresses).find((key) => sepoliaTokenAddresses[key] === position.tokenAddress)
															: position?.indexName}{' '}
														{isMainnet && (
															<>
																<div className="text-slate-500">
																	<em>
																		≈ $
																		{usdPrices
																			? position.side === 'Mint Request'
																				? formatNumber(position.inputAmount * usdPrices[position.tokenAddress])
																				: formatNumber(position.inputAmount * usdPrices[sepoliaTokenAddresses[position?.indexName as string]])
																			: 0}{' '}
																	</em>
																</div>{' '}
															</>
														)}
													</>
												) : (
													'-'
												)}
											</Typography>
											<Typography
												variant="caption"
												sx={{
													color: lightTheme.palette.text.primary,
													fontWeight: 500,
												}}
											>
												{position.timestamp ? convertTime(position.timestamp) : '-'}
											</Typography>
											<Typography
												variant="caption"
												sx={{
													color: position.side ? (position.side === 'Mint Request' ? lightTheme.palette.nexGreen.main : lightTheme.palette.nexRed.main) : lightTheme.palette.nexGreen.main,
													fontWeight: 500,
												}}
											>
												{position.side ? position.side : '-'}
											</Typography>
										</Stack>
									</Stack>
									<Stack
										width={'100%'}
										height={'fit-content'}
										borderTop={'solid 1px #252525'}
										marginTop={2}
										paddingTop={2}
										paddingBottom={1}
										direction={'row'}
										alignItems={'center'}
										justifyContent={'center'}
										divider={<Divider orientation="vertical" sx={{ backgroundColor: lightTheme.palette.text.primary }} flexItem />}
										gap={2}
									>
										<Stack width={'50%'} height={'fit-content'} direction={'row'} alignItems={'center'} justifyContent={'center'} gap={1}>
											<IoMdLink size={30} color={lightTheme.palette.text.primary}></IoMdLink>
											<Link href={`https://sepolia.etherscan.io/tx/${position.txHash}`} target="_blank">
												<Typography
													variant="caption"
													sx={{
														color: lightTheme.palette.text.primary,
														fontWeight: 600,
													}}
												>
													Etherscan
												</Typography>
											</Link>
										</Stack>
										{position.messageId && (
											<Stack width={'50%'} height={'fit-content'} direction={'row'} alignItems={'center'} justifyContent={'center'} gap={1}>
												<IoMdLink size={30} color={lightTheme.palette.text.primary}></IoMdLink>
												<Link href={`https://ccip.chain.link/msg/${position.recieveSideMessageId ? position.recieveSideMessageId : position.messageId}`} target="_blank">
													<Typography
														variant="caption"
														sx={{
															color: lightTheme.palette.text.primary,
															fontWeight: 600,
														}}
													>
														CCIP
													</Typography>
												</Link>
											</Stack>
										)}
									</Stack>
								</Stack>
							)
						})}
					</Stack>
				) : (
					''
				)}
			</Stack>
		</>
	) : (
		<>
			<div className={`w-full h-full overflow-x-auto ${mode == 'dark' ? 'darkScrollBar' : ''}`}>
				<div className={`h-full border w-full border-gray-300 rounded-2xl overflow-scroll max-h-[400px] ${mode == 'dark' ? 'darkScrollBar' : ''}`}>
					{address && path === '/tradeIndex' && activeIndexType === 'crosschain' && crosschainTableReload && (
						<Box sx={{ p: 2, width: '100%' }}>
							<LinearProgress />
						</Box>
					)}

					<table className="heir-[th]:h-9 heir-[th]:border-b dark:heir-[th]:border-[#161C10] table-fixed border-collapse w-full rounded-xl dark:border-[#161C10] min-w-[700px]">
						<thead className="sticky top-0">
							<tr className={`text-md interExtraBold ${mode == 'dark' ? ' text-whiteText-500 bg-[#000000]' : ' text-blackText-500 bg-[#F2F2F2]'} border-b border-b-[#E4E4E4]`}>
								<th className="px-4 py-3 text-left whitespace-nowrap">Time</th>
								<th className="px-4 py-3 text-left whitespace-nowrap">Pair</th>
								<th className="px-4 py-3 text-left whitespace-nowrap">Request Side</th>
								<th className="px-4 py-3 text-left whitespace-nowrap">Input Amount</th>
								<th className="px-4 py-3 text-left whitespace-nowrap">Output Amount</th>
								{path === '/tradeIndex' && activeIndexType === 'crosschain' && (
									<>
										<th className="px-4 py-3 text-left whitespace-nowrap">Send Status</th>
										<th className="px-4 py-3 text-left whitespace-nowrap">Receive Status</th>
									</>
								)}
								<th className="px-4 py-3 text-left whitespace-nowrap">
									Actions
									<div
										onClick={() => {
											activeIndexType === 'defi' ? positionHistoryDefi.reload() : positionHistoryCrosschain.reload()
										}}
										className="float-end py-1 cursor-pointer"
									>
										{mode === 'dark' ? <BsArrowCounterclockwise size={20} color="#F2F2F2" /> : <BsArrowCounterclockwise size={20} color="#252525" />}
									</div>
								</th>
							</tr>
						</thead>
						<tbody className="overflow-y-scroll overflow-x-hidden">
							{dataToShow.map((position: PositionType, i: React.Key | null | undefined) => {
								return (
									<tr key={i} className={`${mode == 'dark' ? ' text-gray-200  ' : 'text-gray-700'} interMedium text-base border-b border-blackText-500`}>
										<td className={`px-4 text-left py-3  ${position.timestamp ? '' : mode === 'dark' ? 'text-[#101010]' : 'text-[#E5E7EB]'}`}>
											{position.timestamp ? convertTime(position.timestamp) : '-'}
										</td>
										<td className={`px-4 text-left py-3 whitespace-nowrap ${position.indexName ? '' : mode === 'dark' ? 'text-[#101010]' : 'text-[#E5E7EB]'}`}>
											{position.indexName ? position.indexName : '-'}
										</td>
										<td className="px-4 text-left py-3">
											<div
												className={`h-fit w-fit rounded-lg  px-3 py-1 capitalize ${position.side ? 'interBold titleShadow' : mode === 'dark' ? 'text-[#101010]' : 'text-[#E5E7EB]'}  
										${
											position.side === 'Mint Request'
												? 'bg-nexLightGreen-500 text-whiteText-500'
												: position.side === 'Burn Request'
												? 'bg-nexLightRed-500 text-whiteText-500'
												: 'bg-transparent'
										} flex flex-row items-center justify-center`}
											>
												{position.side ? position.side.toString().split(' ')[0] : '-'}
											</div>
										</td>
										<td className={`px-4 text-left py-3 whitespace-nowrap ${position.inputAmount && position.tokenAddress ? '' : mode === 'dark' ? 'text-[#101010]' : 'text-[#E5E7EB]'}`}>
											{position.inputAmount && position.tokenAddress ? (
												<>
													{FormatToViewNumber({ value: Number(position.inputAmount), returnType: 'string' })}{' '}
													{position.side === 'Mint Request' ? Object.keys(sepoliaTokenAddresses).find((key) => sepoliaTokenAddresses[key] === position.tokenAddress) : position?.indexName}{' '}
													{isMainnet && (
														<>
															<div className="text-slate-500">
																<em>
																	≈ $
																	{usdPrices
																		? position.side === 'Mint Request'
																			? formatNumber(position.inputAmount * usdPrices[position.tokenAddress])
																			: formatNumber(position.inputAmount * usdPrices[sepoliaTokenAddresses[position?.indexName as string]])
																		: 0}{' '}
																</em>
															</div>{' '}
														</>
													)}
												</>
											) : (
												'-'
											)}
										</td>
										<td className={`px-4 text-left py-3 whitespace-nowrap ${position.outputAmount && position.tokenAddress ? '' : mode === 'dark' ? 'text-[#101010]' : 'text-[#E5E7EB]'}`}>
											{position.outputAmount && position.tokenAddress ? (
												<>
													{FormatToViewNumber({ value: Number(position.outputAmount), returnType: 'string' })}{' '}
													{position.side === 'Burn Request' ? Object.keys(sepoliaTokenAddresses).find((key) => sepoliaTokenAddresses[key] === position.tokenAddress) : position?.indexName}{' '}
													{isMainnet && (
														<>
															<div className="text-slate-500">
																<em>
																	≈ $
																	{usdPrices
																		? position.side === 'Burn Request'
																			? formatNumber(position.outputAmount * usdPrices[position.tokenAddress])
																			: formatNumber(position.outputAmount * usdPrices[sepoliaTokenAddresses[position?.indexName as string]])
																		: 0}{' '}
																</em>
															</div>{' '}
														</>
													)}
												</>
											) : (
												'-'
											)}
										</td>
										{path === '/tradeIndex' && activeIndexType === 'crosschain' && (
											<>
												<td
													className={`px-4 text-left py-3 whitespace-nowrap ${
														position.sendStatus
															? position.sendStatus === 'SUCCESS'
																? 'text-nexLightGreen-500'
																: 'text-[#FFFAA0]'
															: mode === 'dark'
															? 'text-[#101010]'
															: 'text-[#E5E7EB]'
													}`}
												>
													{position.sendStatus ? position.sendStatus : '-'}
												</td>
												<td
													className={`px-4 text-left py-3 whitespace-nowrap ${
														position.receiveStatus
															? position.receiveStatus === 'SUCCESS'
																? 'text-nexLightGreen-500'
																: 'text-[#FFFAA0]'
															: mode === 'dark'
															? 'text-[#101010]'
															: 'text-[#E5E7EB]'
													}`}
												>
													{position.receiveStatus ? position.receiveStatus : '-'}
												</td>
											</>
										)}
										<td className={`px-4 text-left py-3 whitespace-nowrap ${position.outputAmount && position.tokenAddress && mode != 'dark' ? 'text-blackText-500' : 'text-[#F2F2F2]'}`}>
											<div className="flex flex-row items-center justify-start gap-3 ">
												{allowedSymbols.includes(position.indexName) && (
													<Link title={'View in Etherscan'} className="my-auto" target="_blank" href={`https://sepolia.etherscan.io/tx/${position.txHash}`}>
														<Image src={etherscan.src} alt="etherscan Logo" width={25} height={25} />
													</Link>
												)}
												{position.messageId && (
													<Link
														title={'View in CCIP'}
														target="_blank"
														href={`https://ccip.chain.link/msg/${position.recieveSideMessageId ? position.recieveSideMessageId : position.messageId}`}
													>
														<Image src={chainlink.src} alt="chainlink Logo" width={25} height={25} />
													</Link>
												)}
											</div>
										</td>
									</tr>
								)
							})}
						</tbody>
					</table>
				</div>
			</div>
		</>
	)
}

function PWATradeIndexHistoryTable({ initialStandalone = false }: { initialStandalone?: boolean }) {
	const address = useAddress()
	const { mode } = useLandingPageStore()
	const { swapFromCur, swapToCur, setTradeTableReload, tradeTableReload, crosschainTableReload, setEthPriceInUsd, ethPriceInUsd, isMainnet } = useTradePageStore()
	const { ownedAssetInActivity, setPortfolioData } = usePortfolioPageStore()

	const positionHistoryDefi = GetPositionsHistoryDefi()
	const positionHistoryCrosschain = GetPositionsHistoryCrossChain()

	const [positionHistoryData, setPositionHistoryData] = useState<PositionType[]>([])
	const [combinedPositionTableData, setCombinedPositionTableData] = useState<PositionType[]>([])
	const [usdPrices, setUsdPrices] = useState<{ [key: string]: number }>({})

	const activeIndexType = swapFromCur?.indexType === 'defi' || swapToCur?.indexType === 'defi' ? 'defi' : 'crosschain'

	useEffect(() => {
		const crossChainRequests = positionHistoryCrosschain.requests
		const crossChainHistory = positionHistoryCrosschain.history

		const activeRequests = crossChainRequests.filter((data) => {
			const isExist = crossChainHistory.find((hist) => {
				return hist.nonce === data.nonce && hist.side === data.side
			})
			return !isExist
		})

		const combinedData = [...crossChainHistory, ...activeRequests].sort((a, b) => b.timestamp - a.timestamp)

		if (JSON.stringify(combinedData) !== JSON.stringify(combinedPositionTableData)) {
			setCombinedPositionTableData(combinedData)
		}
	}, [positionHistoryCrosschain])

	const path = typeof window !== 'undefined' ? window.location.pathname : '/'
	const searchQuery = typeof window !== 'undefined' ? window.location.search : '/'
	const assetName = searchQuery.split('=')[1]

	const allowedSymbols = sepoliaTokens.filter((token) => token.isNexlabToken).map((token) => token.Symbol)
	const activeTicker = [swapFromCur.Symbol, swapToCur.Symbol].filter((symbol) => allowedSymbols.includes(symbol))

	useEffect(() => {
		const combinedData = positionHistoryDefi.data.concat(positionHistoryCrosschain.history)
		setPortfolioData(combinedData)
	}, [setEthPriceInUsd, setPortfolioData, positionHistoryDefi.data, positionHistoryCrosschain.history])

	useEffect(() => {
		if (path === '/tradeIndex') {
			const data = activeIndexType === 'defi' ? positionHistoryDefi.data : combinedPositionTableData
			const dataToShow = data.filter((data: { indexName: string }) => {
				return data.indexName === activeTicker[0]
			})
			if (JSON.stringify(dataToShow) !== JSON.stringify(positionHistoryData)) {
				setPositionHistoryData(dataToShow)
			}
		} else if (path === '/portfolio' || path === '/history') {
			const data = positionHistoryCrosschain.history.concat(positionHistoryDefi.data).sort((a, b) => b.timestamp - a.timestamp)
			setPositionHistoryData(data)
		} else if (path === '/assetActivity') {
			const dataTotal = combinedPositionTableData.concat(positionHistoryDefi.data).sort((a, b) => b.timestamp - a.timestamp)
			const data = dataTotal.filter((data) => {
				return assetName.toUpperCase() === data.indexName
			})

			setPositionHistoryData(data)
		}
	}, [path, positionHistoryDefi.data, assetName, swapFromCur.Symbol, swapToCur.Symbol, ownedAssetInActivity, combinedPositionTableData])

	useEffect(() => {
		if (tradeTableReload) {
			activeIndexType === 'defi' ? positionHistoryDefi.reload() : positionHistoryCrosschain.reload()
			setTradeTableReload(false)
		}
	}, [positionHistoryDefi, setTradeTableReload, tradeTableReload, activeIndexType, positionHistoryCrosschain])

	useEffect(() => {
		async function getUsdPrices() {
			sepoliaTokens.map(async (token) => {
				if (ethPriceInUsd > 0) {
					const obj = usdPrices
					obj[token.address] = (await convertToUSD({ tokenAddress: token.address, tokenDecimals: token.decimals }, ethPriceInUsd, false)) || 0 // false as for testnet tokens
					if (Object.keys(usdPrices).length === sepoliaTokens.length - 1) {
						setUsdPrices(obj)
					}
				}
			})
		}

		getUsdPrices()
	}, [ethPriceInUsd, usdPrices])

	const dataToShow: PositionType[] = Array.from(
		{ length: Math.max(5, positionHistoryData.length) },
		(_, index) =>
			positionHistoryData[index] || {
				timestamp: 0,
				indexName: '',
				inputAmount: 0,
				outputAmount: 0,
				tokenAddress: '',
				side: '',
				sendStatus: '',
				receiveStatus: '',
			}
	)

	useEffect(() => {
		console.log(dataToShow)
	}, [dataToShow])

	const [isStandalone, setIsStandalone] = useState(initialStandalone)
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

	return isStandalone ? (
		<>
			<Stack id="PWAProfileHistory" width={'100%'} height={'fit-content'} minHeight={'100vh'} marginTop={1} direction={'column'} alignItems={'center'} justifyContent={'start'}>
				<Stack width={'100%'} height={'fit-content'} direction={'row'} alignItems={'center'} justifyContent={'space-between'} marginBottom={1}>
					<Typography
						variant="h6"
						sx={{
							color: lightTheme.palette.text.primary,
							fontWeight: 700,
						}}
					>
						Transactions History
					</Typography>
					<Menu
						transition
						direction="bottom"
						align="end"
						position="anchor"
						menuButton={
							<MenuButton className={'w-fit'}>
								<Stack width={'100%'} height={'fit-content'} paddingY={0.5} paddingX={1} direction={'row'} alignItems={'center'} justifyContent={'start'} gap={1}>
									<RiDownloadLine size={22} color={lightTheme.palette.text.primary}></RiDownloadLine>
								</Stack>
							</MenuButton>
						}
					>
						<MenuItem>
							<Typography
								variant="subtitle1"
								sx={{
									color: lightTheme.palette.text.primary,
									fontWeight: 600,
								}}
							>
								Export to PDF
							</Typography>
						</MenuItem>
						<MenuItem>
							<Typography
								variant="subtitle1"
								sx={{
									color: lightTheme.palette.text.primary,
									fontWeight: 600,
								}}
							>
								Export to CSV
							</Typography>
						</MenuItem>
					</Menu>
				</Stack>
				{address ? (
					<Stack
						width={'100%'}
						height={'fit-content'}
						direction={'column'}
						alignItems={'center'}
						justifyContent={'start'}
						gap={1}
						marginY={2}
						sx={{
							overflowY: 'scroll',
						}}
					>
						{dataToShow.map((position: PositionType, i: React.Key | null | undefined) => {
							return (
								<Stack
									key={i}
									width={'100%'}
									height={'fit-content'}
									direction={'column'}
									alignItems={'center'}
									justifyContent={'start'}
									borderRadius={'1.2rem'}
									paddingY={1}
									paddingX={1.5}
									sx={PWAGradientStack}
								>
									<Stack width={'100%'} height={'fit-content'} direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
										<Stack direction={'row'} alignItems={'center'} justifyContent={'start'} width={'fit-content'} height={'fit-content'} gap={2}>
											<Image alt="index logo" src={anfiLogo} width={60} height={60} className="rounded-full mb-2"></Image>
											<Stack direction={'column'} width={'fit-content'} height={'fit-content'} gap={1}>
												<Typography
													variant="caption"
													sx={{
														color: lightTheme.palette.text.primary,
														fontWeight: 600,
													}}
												>
													{position.indexName ? position.indexName : '-'}
												</Typography>
												<Typography
													variant="caption"
													sx={{
														color: lightTheme.palette.text.primary,
														fontWeight: 500,
													}}
												>
													{position.outputAmount && position.tokenAddress ? (
														<>
															{FormatToViewNumber({ value: Number(position.outputAmount), returnType: 'string' })}{' '}
															{position.side === 'Burn Request'
																? Object.keys(sepoliaTokenAddresses).find((key) => sepoliaTokenAddresses[key] === position.tokenAddress)
																: position?.indexName}{' '}
															{isMainnet && (
																<>
																	<div className="text-slate-500">
																		<em>
																			≈ $
																			{usdPrices
																				? position.side === 'Burn Request'
																					? formatNumber(position.outputAmount * usdPrices[position.tokenAddress])
																					: formatNumber(position.outputAmount * usdPrices[sepoliaTokenAddresses[position?.indexName as string]])
																				: 0}{' '}
																		</em>
																	</div>{' '}
																</>
															)}
														</>
													) : (
														'-'
													)}
												</Typography>
												<Typography
													variant="caption"
													sx={{
														color: lightTheme.palette.text.primary,
														fontWeight: 500,
													}}
												>
													Fees: 1%
												</Typography>
											</Stack>
										</Stack>
										<Stack paddingRight={1} direction={'column'} width={'fit-content'} height={'fit-content'} gap={1} alignItems={'end'} justifyContent={'center'}>
											<Typography
												variant="caption"
												sx={{
													color: lightTheme.palette.text.primary,
													fontWeight: 600,
												}}
											>
												Total:{' '}
												{position.inputAmount && position.tokenAddress ? (
													<>
														{FormatToViewNumber({ value: Number(position.inputAmount), returnType: 'string' })}{' '}
														{position.side === 'Mint Request'
															? Object.keys(sepoliaTokenAddresses).find((key) => sepoliaTokenAddresses[key] === position.tokenAddress)
															: position?.indexName}{' '}
														{isMainnet && (
															<>
																<div className="text-slate-500">
																	<em>
																		≈ $
																		{usdPrices
																			? position.side === 'Mint Request'
																				? formatNumber(position.inputAmount * usdPrices[position.tokenAddress])
																				: formatNumber(position.inputAmount * usdPrices[sepoliaTokenAddresses[position?.indexName as string]])
																			: 0}{' '}
																	</em>
																</div>{' '}
															</>
														)}
													</>
												) : (
													'-'
												)}
											</Typography>
											<Typography
												variant="caption"
												sx={{
													color: lightTheme.palette.text.primary,
													fontWeight: 500,
												}}
											>
												{position.timestamp ? convertTime(position.timestamp) : '-'}
											</Typography>
											<Typography
												variant="caption"
												sx={{
													color: lightTheme.palette.nexGreen.main,
													fontWeight: 500,
												}}
											>
												{position.receiveStatus ? position.receiveStatus : '-'}
											</Typography>
										</Stack>
									</Stack>
									<Stack
										width={'100%'}
										height={'fit-content'}
										borderTop={'solid 1px #252525'}
										marginTop={2}
										paddingTop={2}
										paddingBottom={1}
										direction={'row'}
										alignItems={'center'}
										justifyContent={'center'}
										divider={<Divider orientation="vertical" sx={{ backgroundColor: lightTheme.palette.text.primary }} flexItem />}
										gap={2}
									>
										<Stack width={'50%'} height={'fit-content'} direction={'row'} alignItems={'center'} justifyContent={'center'} gap={1}>
											<IoMdLink size={30} color={lightTheme.palette.text.primary}></IoMdLink>
											<Link href={`https://sepolia.etherscan.io/tx/${position.txHash}`} target="_blank">
												<Typography
													variant="caption"
													sx={{
														color: lightTheme.palette.text.primary,
														fontWeight: 600,
													}}
												>
													Etherscan
												</Typography>
											</Link>
										</Stack>
									</Stack>
								</Stack>
							)
						})}
					</Stack>
				) : (
					''
				)}
			</Stack>
		</>
	) : (
		<>
			<div className={`w-full h-full overflow-x-auto ${mode == 'dark' ? 'darkScrollBar' : ''}`}>
				<div className={`h-full border w-full border-gray-300 rounded-2xl overflow-scroll max-h-[400px] ${mode == 'dark' ? 'darkScrollBar' : ''}`}>
					{address && path === '/tradeIndex' && activeIndexType === 'crosschain' && crosschainTableReload && (
						<Box sx={{ p: 2, width: '100%' }}>
							<LinearProgress />
						</Box>
					)}

					<table className="heir-[th]:h-9 heir-[th]:border-b dark:heir-[th]:border-[#161C10] table-fixed border-collapse w-full rounded-xl dark:border-[#161C10] min-w-[700px]">
						<thead className="sticky top-0">
							<tr className={`text-md interExtraBold ${mode == 'dark' ? ' text-whiteText-500 bg-[#000000]' : ' text-blackText-500 bg-[#F2F2F2]'} border-b border-b-[#E4E4E4]`}>
								<th className="px-4 py-3 text-left whitespace-nowrap">Time</th>
								<th className="px-4 py-3 text-left whitespace-nowrap">Pair</th>
								<th className="px-4 py-3 text-left whitespace-nowrap">Request Side</th>
								<th className="px-4 py-3 text-left whitespace-nowrap">Input Amount</th>
								<th className="px-4 py-3 text-left whitespace-nowrap">Output Amount</th>
								{path === '/tradeIndex' && activeIndexType === 'crosschain' && (
									<>
										<th className="px-4 py-3 text-left whitespace-nowrap">Send Status</th>
										<th className="px-4 py-3 text-left whitespace-nowrap">Receive Status</th>
									</>
								)}
								<th className="px-4 py-3 text-left whitespace-nowrap">
									Actions
									<div
										onClick={() => {
											activeIndexType === 'defi' ? positionHistoryDefi.reload() : positionHistoryCrosschain.reload()
										}}
										className="float-end py-1 cursor-pointer"
									>
										{mode === 'dark' ? <BsArrowCounterclockwise size={20} color="#F2F2F2" /> : <BsArrowCounterclockwise size={20} color="#252525" />}
									</div>
								</th>
							</tr>
						</thead>
						<tbody className="overflow-y-scroll overflow-x-hidden">
							{dataToShow.map((position: PositionType, i: React.Key | null | undefined) => {
								return (
									<tr key={i} className={`${mode == 'dark' ? ' text-gray-200  ' : 'text-gray-700'} interMedium text-base border-b border-blackText-500`}>
										<td className={`px-4 text-left py-3  ${position.timestamp ? '' : mode === 'dark' ? 'text-[#101010]' : 'text-[#E5E7EB]'}`}>
											{position.timestamp ? convertTime(position.timestamp) : '-'}
										</td>
										<td className={`px-4 text-left py-3 whitespace-nowrap ${position.indexName ? '' : mode === 'dark' ? 'text-[#101010]' : 'text-[#E5E7EB]'}`}>
											{position.indexName ? position.indexName : '-'}
										</td>
										<td className="px-4 text-left py-3">
											<div
												className={`h-fit w-fit rounded-lg  px-3 py-1 capitalize ${position.side ? 'interBold titleShadow' : mode === 'dark' ? 'text-[#101010]' : 'text-[#E5E7EB]'}  
										${
											position.side === 'Mint Request'
												? 'bg-nexLightGreen-500 text-whiteText-500'
												: position.side === 'Burn Request'
												? 'bg-nexLightRed-500 text-whiteText-500'
												: 'bg-transparent'
										} flex flex-row items-center justify-center`}
											>
												{position.side ? position.side.toString().split(' ')[0] : '-'}
											</div>
										</td>
										<td className={`px-4 text-left py-3 whitespace-nowrap ${position.inputAmount && position.tokenAddress ? '' : mode === 'dark' ? 'text-[#101010]' : 'text-[#E5E7EB]'}`}>
											{position.inputAmount && position.tokenAddress ? (
												<>
													{FormatToViewNumber({ value: Number(position.inputAmount), returnType: 'string' })}{' '}
													{position.side === 'Mint Request' ? Object.keys(sepoliaTokenAddresses).find((key) => sepoliaTokenAddresses[key] === position.tokenAddress) : position?.indexName}{' '}
													{isMainnet && (
														<>
															<div className="text-slate-500">
																<em>
																	≈ $
																	{usdPrices
																		? position.side === 'Mint Request'
																			? formatNumber(position.inputAmount * usdPrices[position.tokenAddress])
																			: formatNumber(position.inputAmount * usdPrices[sepoliaTokenAddresses[position?.indexName as string]])
																		: 0}{' '}
																</em>
															</div>{' '}
														</>
													)}
												</>
											) : (
												'-'
											)}
										</td>
										<td className={`px-4 text-left py-3 whitespace-nowrap ${position.outputAmount && position.tokenAddress ? '' : mode === 'dark' ? 'text-[#101010]' : 'text-[#E5E7EB]'}`}>
											{position.outputAmount && position.tokenAddress ? (
												<>
													{FormatToViewNumber({ value: Number(position.outputAmount), returnType: 'string' })}{' '}
													{position.side === 'Burn Request' ? Object.keys(sepoliaTokenAddresses).find((key) => sepoliaTokenAddresses[key] === position.tokenAddress) : position?.indexName}{' '}
													{isMainnet && (
														<>
															<div className="text-slate-500">
																<em>
																	≈ $
																	{usdPrices
																		? position.side === 'Burn Request'
																			? formatNumber(position.outputAmount * usdPrices[position.tokenAddress])
																			: formatNumber(position.outputAmount * usdPrices[sepoliaTokenAddresses[position?.indexName as string]])
																		: 0}{' '}
																</em>
															</div>{' '}
														</>
													)}
												</>
											) : (
												'-'
											)}
										</td>
										{path === '/tradeIndex' && activeIndexType === 'crosschain' && (
											<>
												<td
													className={`px-4 text-left py-3 whitespace-nowrap ${
														position.sendStatus
															? position.sendStatus === 'SUCCESS'
																? 'text-nexLightGreen-500'
																: 'text-[#FFFAA0]'
															: mode === 'dark'
															? 'text-[#101010]'
															: 'text-[#E5E7EB]'
													}`}
												>
													{position.sendStatus ? position.sendStatus : '-'}
												</td>
												<td
													className={`px-4 text-left py-3 whitespace-nowrap ${
														position.receiveStatus
															? position.receiveStatus === 'SUCCESS'
																? 'text-nexLightGreen-500'
																: 'text-[#FFFAA0]'
															: mode === 'dark'
															? 'text-[#101010]'
															: 'text-[#E5E7EB]'
													}`}
												>
													{position.receiveStatus ? position.receiveStatus : '-'}
												</td>
											</>
										)}
										<td className={`px-4 text-left py-3 whitespace-nowrap ${position.outputAmount && position.tokenAddress && mode != 'dark' ? 'text-blackText-500' : 'text-[#F2F2F2]'}`}>
											<div className="flex flex-row items-center justify-start gap-3 ">
												{allowedSymbols.includes(position.indexName) && (
													<Link title={'View in Etherscan'} className="my-auto" target="_blank" href={`https://sepolia.etherscan.io/tx/${position.txHash}`}>
														<Image src={etherscan.src} alt="etherscan Logo" width={25} height={25} />
													</Link>
												)}
												{position.messageId && (
													<Link
														title={'View in CCIP'}
														target="_blank"
														href={`https://ccip.chain.link/msg/${position.recieveSideMessageId ? position.recieveSideMessageId : position.messageId}`}
													>
														<Image src={chainlink.src} alt="chainlink Logo" width={25} height={25} />
													</Link>
												)}
											</div>
										</td>
									</tr>
								)
							})}
						</tbody>
					</table>
				</div>
			</div>
		</>
	)
}

export { NewHistoryTable, PWATradeIndexHistoryTable }
