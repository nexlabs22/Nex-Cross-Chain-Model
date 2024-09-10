import { Stack, Container, Typography, Button } from '@mui/material'
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Menu, MenuButton, MenuItem } from '@szhsin/react-menu'
import '@szhsin/react-menu/dist/index.css'
import '@szhsin/react-menu/dist/transitions/slide.css'
import Image from 'next/image'
import Link from 'next/link'
import { lightTheme } from '@/theme/theme'
import anfiLogo from '@assets/images/anfi.png'
import cr5Logo from '@assets/images/cr5.png'
import Divider from '@mui/material/Divider'
import { sepoliaMag7FactoryProcessor, sepoliaTokenAddresses } from '@/constants/contractAddresses'
import { FormatToViewNumber, formatNumber } from '@/hooks/math'
import useTradePageStore from '@/store/tradeStore'
import { PositionType } from '@/types/tradeTableTypes'
import React, { useEffect } from 'react'
import etherscan from '@assets/images/etherscan2.png'
import chainlink from '@assets/images/chainlink.png'
import { useLandingPageStore } from '@/store/store'
import { BsArrowCounterclockwise } from 'react-icons/bs'
import { convertTime } from '@/utils/general'

import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'
import { useAddress } from '@thirdweb-dev/react'
import { IoMdLink } from 'react-icons/io'
import { PWAGradientStack } from '@/theme/overrides'
import { RiDownloadLine } from 'react-icons/ri'
import { CSVLink } from 'react-csv'
import { usePWA } from '@/providers/PWAProvider'
import { useHistory } from '@/providers/HistoryProvider'
import { stockFactoryProcessorAbi } from '@/constants/abi';
import { getClient } from '@/app/api/client';

interface HistoryTableProps {
	maxPWAHeight?: boolean
}

function NewHistoryTable(props: HistoryTableProps) {
	const maxPWAHeight = props
	const address = useAddress()
	const client = getClient('sepolia')
	const { mode, theme, setTheme } = useLandingPageStore()
	const { isStandalone } = usePWA()
	const { crosschainTableReload, isMainnet, tradeTableReload, setTradeTableReload, stockTableReload, defiTableReload } = useTradePageStore()

	const {
		positionHistoryDefi,
		positionHistoryCrosschain,
		positionHistoryStock,
		usdPrices,
		activeIndexType,
		path,
		allowedSymbols,
		dataToShow,
		handleExportPDF,
		fileName,
		csvData,
		handleExportCSV,
	} = useHistory()

	function reloadTable(activeIndexType: string) {
		if (activeIndexType === 'defi') {
			console.log("Reloading positionHistoryDefi");
			positionHistoryDefi.reload();
		} else if (activeIndexType === 'crosschain') {
			console.log("Reloading positionHistoryCrosschain");
			positionHistoryCrosschain.reload();
		} else if (activeIndexType === 'stock') {
			console.log("Reloading positionHistoryStock");
			positionHistoryStock.reload();
		} else {
			console.error("Unknown activeIndexType:", activeIndexType);
		}
	}


	client.watchContractEvent({
		address: sepoliaMag7FactoryProcessor, 
		abi: stockFactoryProcessorAbi,        
		eventName: 'Issuanced',               
		onLogs: (logs) => {
		  logs.forEach((log:any) => {
			reloadTable(activeIndexType);
			setTradeTableReload(false)
		  });
		},
	  });
	client.watchContractEvent({
		address: sepoliaMag7FactoryProcessor, 
		abi: stockFactoryProcessorAbi,        
		eventName: 'Redemption',               
		onLogs: (logs) => {
		  logs.forEach((log:any) => {
			reloadTable(activeIndexType);
			setTradeTableReload(false)
		  });
		},
	  });
	
	useEffect(()=>{
		if(tradeTableReload){
			reloadTable(activeIndexType);
			setTradeTableReload(false)
		}
	},[tradeTableReload, activeIndexType])


	return isStandalone ? (
		<>
			<Stack id="PWAProfileHistory" width={'100%'} height={'fit-content'} maxHeight={maxPWAHeight ? "fit-content" : "30vh"} marginBottom={"6rem"} marginTop={1} direction={'column'} alignItems={'center'} justifyContent={'start'}>
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
						height={maxPWAHeight ? "fit-content" : "30vh"}
						minHeight={maxPWAHeight ? "fit-content" : "30vh"}
						maxHeight={maxPWAHeight ? "80vh" : "50vh"}
						direction={'column'}
						alignItems={'center'}
						justifyContent={'start'}
						gap={0.3}
						marginY={2}

						paddingX={"0.3rem"}
						sx={{
							overflowY: 'scroll',
						}}
					>
						{
							dataToShow.map((position: PositionType, i: React.Key | null | undefined) => {
								if (position.inputAmount && position.outputAmount) {
									return (
										<Accordion
											key={position.txHash}
											sx={{
												borderRadius: "1rem",
												background: "linear-gradient(to top right, #5E869B 0%, #8FB8CA 100%)",
												border: "none",
												width: "100%"
											}}
										>
											<AccordionSummary
												expandIcon={<ExpandMoreIcon sx={{ color: "#000000" }} />}
												aria-controls={`${position.txHash.toString()}-content`}
												id={`${position.txHash.toString()}-header`}
											>
												<Stack width={"100%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"space-between"} gap={1}>
													<Stack width={"fit-content"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"space-between"} gap={1}>
														<Image alt="index logo" src={position.indexName == "ANFI" || "anfi" ? anfiLogo : cr5Logo} width={40} height={40} className="rounded-full mb-2"/>
														<Typography
															variant="caption"
															sx={{
																color: lightTheme.palette.text.primary,
																fontWeight: 600,
															}}
														>
															{FormatToViewNumber({ value: Number(position.inputAmount), returnType: 'string' })}&nbsp;
															{position.indexName ? position.indexName : '-'}
														</Typography>
													</Stack>
													<Typography
															variant="caption"
															sx={{
																color: lightTheme.palette.text.primary,
																fontWeight: 500,
																marginRight: "0.6rem"
															}}
														>
															{position.timestamp ? convertTime(position.timestamp).toString().split(" ")[0] : '-'}
														</Typography>
												</Stack>
											</AccordionSummary>
											<AccordionDetails>
												<Stack width={"100%"} height={"fit-content"} direction={"column"} alignItems={"center"} justifyContent={"start"} gap={0.5}>
													<Stack width={"100%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
														<Typography
															variant="caption"
															sx={{
																color: lightTheme.palette.text.primary,
																fontWeight: 600,
															}}
														>
															Index:
														</Typography>
														<Typography
															variant="caption"
															sx={{
																color: lightTheme.palette.text.primary,
																fontWeight: 500,
															}}
														>
															{position.indexName}
														</Typography>
													</Stack>
													<Stack width={"100%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
														<Typography
															variant="caption"
															sx={{
																color: lightTheme.palette.text.primary,
																fontWeight: 600,
															}}
														>
															Time:
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
													</Stack>
													<Stack width={"100%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
														<Typography
															variant="caption"
															sx={{
																color: lightTheme.palette.text.primary,
																fontWeight: 600,
															}}
														>
															Request Side:
														</Typography>
														<Typography
															variant="caption"
															sx={{
																color: position.side == "Mint Request" ? "#089981" : "#F23645",
																fontWeight: 500,
															}}
														>
															{position.side ? position.side.toString().split(' ')[0] : '-'}
														</Typography>
													</Stack>
													<Stack width={"100%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
														<Typography
															variant="caption"
															sx={{
																color: lightTheme.palette.text.primary,
																fontWeight: 600,
															}}
														>
															Input Amount:
														</Typography>
														<Typography
															variant="caption"
															sx={{
																color: lightTheme.palette.text.primary,
																fontWeight: 500,
															}}
														>
															{FormatToViewNumber({ value: Number(position.inputAmount), returnType: 'string' })}{' '}
														</Typography>
													</Stack>
													<Stack width={"100%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
														<Typography
															variant="caption"
															sx={{
																color: lightTheme.palette.text.primary,
																fontWeight: 600,
															}}
														>
															Output Amount:
														</Typography>
														<Typography
															variant="caption"
															sx={{
																color: lightTheme.palette.text.primary,
																fontWeight: 500,
															}}
														>
															{FormatToViewNumber({ value: Number(position.outputAmount), returnType: 'string' })}{' '}
														</Typography>
													</Stack>
													<Stack width={"100%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
														<Typography
															variant="caption"
															sx={{
																color: lightTheme.palette.text.primary,
																fontWeight: 600,
															}}
														>
															Send Status:
														</Typography>
														<Typography
															variant="caption"
															sx={{
																color: position.sendStatus === "SUCCESS" ? "#089981" : "#FFFAA0",
																fontWeight: 500,
															}}
														>
															{position.sendStatus ? position.sendStatus : '-'}
														</Typography>
													</Stack>
													<Stack width={"100%"} height={"fit-content"} direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
														<Typography
															variant="caption"
															sx={{
																color: lightTheme.palette.text.primary,
																fontWeight: 600,
															}}
														>
															Recieve Status:
														</Typography>
														<Typography
															variant="caption"
															sx={{
																color: position.sendStatus === "SUCCESS" ? "#089981" : "#FFFAA0",
																fontWeight: 500,
															}}
														>
															{position.receiveStatus ? position.receiveStatus : '-'}
														</Typography>
													</Stack>
												</Stack>
											</AccordionDetails>
										</Accordion>
									)
								}
							})
						}
						{dataToShow.map((position: PositionType, i: React.Key | null | undefined) => {
							if (position.inputAmount && position.outputAmount) {
								return (
									<Stack
										key={i}
										width={'100%'}
										height={'fit-content'}
										direction={'column'}
										alignItems={'center'}
										justifyContent={'start'}
										borderRadius={'1.2rem'}
										paddingBottom={1}
										paddingTop={2}
										paddingX={1.5}
										sx={PWAGradientStack}
										display="none"
									>
										<Stack width={'100%'} height={'fit-content'} direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
											<Stack direction={'row'} alignItems={'center'} justifyContent={'start'} width={'fit-content'} height={'fit-content'} gap={2}>
												<Image alt="index logo" src={position.indexName == "ANFI" || "anfi" ? anfiLogo : cr5Logo} width={60} height={60} className="rounded-full mb-2"/>
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
															fontWeight: 600,
														}}
													>
														{position.outputAmount && position.tokenAddress ? (
															<>
																<span className='italic' style={{ fontWeight: "500" }}>{FormatToViewNumber({ value: Number(position.outputAmount), returnType: 'string' })}{' '}</span>

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
															fontWeight: 600,
														}}
													>

														Fees: <span style={{ fontWeight: "500" }}>1%</span>
													</Typography>

												</Stack>
											</Stack>
											<Stack paddingRight={1} direction={'column'} width={'fit-content'} height={'fit-content'} gap={1} alignItems={'end'} justifyContent={'center'}>
												<Typography
													variant="caption"
													sx={{
														color: lightTheme.palette.text.primary,
														fontWeight: 600,
														opacity: 0
													}}
												>
													test

												</Typography>
												<Typography
													variant="caption"
													sx={{
														color: lightTheme.palette.text.primary,
														fontWeight: 500,
													}}
												>

													{position.inputAmount && position.tokenAddress ? (
														<>
															<span className='italic' style={{ fontWeight: "500" }}>{FormatToViewNumber({ value: Number(position.inputAmount), returnType: 'string' })}{' '}</span>
															<span style={{ fontWeight: "600" }}>
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
															</span>

														</>
													) : (
														'-'
													)}
												</Typography>
												<Typography
													variant="caption"
													sx={{
														color: position.side ? (position.side === 'Mint Request' ? lightTheme.palette.nexGreen.main : lightTheme.palette.nexRed.main) : lightTheme.palette.nexGreen.main,
														fontWeight: 600,

														textAlign: "right"
													}}
												>
													{position.side ? position.side : '-'}
												</Typography>
											</Stack>
										</Stack>
										<Typography
											variant="caption"
											sx={{
												color: lightTheme.palette.text.primary,
												fontWeight: 500,
												width: "100%",
												textAlign: "center",
												marginTop: "0.6rem"
											}}
										>
											{position.timestamp ? convertTime(position.timestamp) : '-'}
										</Typography>
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
							}
							else {
								return ("")
							}
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
					{address && path === '/tradeIndex' && ((activeIndexType === 'crosschain' && crosschainTableReload)|| (activeIndexType === 'stock' && stockTableReload) || (activeIndexType === 'defi' && defiTableReload) ) && (
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
								{path === '/tradeIndex' && (activeIndexType === 'crosschain' || activeIndexType === 'stock') && (
									<>
										<th className="px-4 py-3 text-left whitespace-nowrap">Send Status</th>
										<th className="px-4 py-3 text-left whitespace-nowrap">Receive Status</th>
									</>
								)}
								<th className="px-4 py-3 text-left whitespace-nowrap">
									Actions
									<div
										onClick={() => {
											reloadTable(activeIndexType)
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
										${position.side === 'Mint Request'
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
													{position.side === 'Mint Request' ? Object.keys(sepoliaTokenAddresses).find((key) => sepoliaTokenAddresses[key].toLowerCase() === position.tokenAddress.toLowerCase()) : position?.indexName}{' '}
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
													{position.side === 'Burn Request' ? Object.keys(sepoliaTokenAddresses).find((key) => sepoliaTokenAddresses[key].toLowerCase() === position.tokenAddress.toLowerCase()) : position?.indexName}{' '}
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
										{path === '/tradeIndex' && (activeIndexType === 'crosschain' || activeIndexType === 'stock') && (
											<>
												<td
													className={`px-4 text-left py-3 whitespace-nowrap ${position.sendStatus
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
													className={`px-4 text-left py-3 whitespace-nowrap ${position.receiveStatus
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



export { NewHistoryTable }
