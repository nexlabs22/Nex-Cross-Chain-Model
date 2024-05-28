// This is the DEFI swap component

'use client' // This is a client component 👈🏽

// basics :
import Image from 'next/image'
// icons :
import { BiSolidChevronDown } from 'react-icons/bi'
import { AiOutlineSwap } from 'react-icons/ai'

// Store
import useTradePageStore from '@/store/tradeStore'
import { useLandingPageStore } from '@/store/store'

// Components:
import GenericModal from './GenericModal'
import { ReactSearchAutocomplete } from 'react-search-autocomplete'

// Assets:
import mesh1 from '@assets/images/mesh1.png'
import {
	sepoliaWethAddress,
} from '@/constants/contractAddresses'
import PaymentModal from './PaymentModal'
import { BsInfoCircle } from 'react-icons/bs'
import { FormatToViewNumber, formatNumber, num } from '@/hooks/math'
import { LiaWalletSolid } from 'react-icons/lia'
import Switch from 'react-switch'
import GenericTooltip from './GenericTooltip'
import { GoArrowUpRight } from 'react-icons/go'


import { IOSSwitch, PWAProfileTextField } from '@/theme/overrides'
import { IoIosArrowBack } from 'react-icons/io'
import { Stack, Container, Box, Paper, Typography, Button, BottomNavigation, BottomNavigationAction } from '@mui/material'
import { lightTheme } from '@/theme/theme'
import Link from 'next/link'
import Sheet from 'react-modal-sheet'
import { usePWA } from '@/providers/PWAProvider'
import { useDeFiSwap } from '@/providers/DefiSwapProvider'

const SwapV2Defi = () => {

	const { isStandalone } = usePWA()
	const {
		isFromCurrencyModalOpen,
		isToCurrencyModalOpen,
		setFromCurrencyModalOpen,
		setToCurrencyModalOpen,
		isFromCurrencySheetOpen,
		isToCurrencySheetOpen,
		setFromCurrencySheetOpen,
		setToCurrencySheetOpen,
		changeSwapFromCur,
		changeSwapToCur,
		swapFromCur,
		swapToCur,
		setTradeTableReload,
		setEthPriceInUsd,
		ethPriceInUsd,
		isMainnet,
		setIsmainnet,
	} = useTradePageStore()
	const { mode } = useLandingPageStore()
	const {
		isPaymentModalOpen,
		isChecked,
		firstInputValue,
		secondInputValue,
		cookingModalVisible,
		userEthBalance,
		from1UsdPrice,
		fromConvertedPrice,
		to1UsdPrice,
		toConvertedPrice,
		coinsList,
		loadingTokens,
		currentArrayId,
		mergedCoinList,
		mintFactoryContract,
		burnFactoryContract,
		faucetContract,
		fromTokenContract,
		toTokenContract,
		fromTokenBalance,
		toTokenBalance,
		fromTokenTotalSupply,
		toTokenTotalSupply,
		fromTokenAllowance,
		convertedInputValue,
		approveHook,
		mintRequestHook,
		mintRequestEthHook,
		burnRequestHook,
		faucetHook,
		curr,
		IndexContract,
		feeRate,
		setFirstInputValue,
		setSecondInputValue,
		setCookingModalVisible,
		toggleCheckbox,
		toggleMainnetCheckbox,
		openPaymentModal,
		closePaymentModal,
		openFromCurrencyModal,
		closeFromCurrencyModal,
		openToCurrencyModal,
		closeToCurrencyModal,
		openFromCurrencySheet,
		closeFromCurrencySheet,
		openToCurrencySheet,
		closeToCurrencySheet,
		fetchAllLiFiTokens,
		Switching,
		formatResult,
		changeFirstInputValue,
		changeSecondInputValue,
		getPrimaryBalance,
		getSecondaryBalance,
		approve,
		mintRequest,
		mintRequestTokens,
		mintRequestEth,
		burnRequest,
		faucet
	} = useDeFiSwap()


	const isButtonDisabled = isMainnet || (!swapFromCur.isNexlabToken && !swapToCur.isNexlabToken) ? true : false

	return (
		<>
			{isStandalone ? (
				<>
					<PaymentModal isOpen={isPaymentModalOpen} onClose={closePaymentModal} />
					<Box
						width={'100vw'}
						height={'fit-content'}
						minHeight={'100vh'}
						minWidth={'100vw'}
						
						display={'flex'}
						flexDirection={'column'}
						alignItems={'center'}
						justifyContent={'start'}
						paddingBottom={4}
						paddingX={2}
						bgcolor={lightTheme.palette.background.default}
						sx={{
							overflowX: "hidden"
						}}
					>
						<Stack width={'100%'} height={'fit-content'} direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
							<Stack width={'fit-content'} height={'fit-content'} paddingTop={4} direction={'row'} alignItems={'center'} justifyContent={'start'} gap={8}>
								<Link href={'/pwa_tradeIndex'} className="w-fit h-fit flex flex-row items-center justify-center">
									<IoIosArrowBack size={30} color={lightTheme.palette.text.primary}></IoIosArrowBack>
									<Typography
										variant="body1"
										sx={{
											color: lightTheme.palette.text.primary,
											fontWeight: 600,
											textTransform: 'capitalize',
											marginLeft: '0.8rem',
											whiteSpace: 'nowrap',
										}}
									>
										Trading ANFI
									</Typography>
								</Link>
							</Stack>
						</Stack>
						<Stack width={'100%'} height={'fit-content'} direction="row" alignItems={'center'} justifyContent={'space-between'} paddingTop={4} paddingBottom={3}>
							<Typography
								variant="subtitle1"
								sx={{
									color: "#484848",
									fontWeight: 600,

								}}
							>
								You Pay
							</Typography>
							<Stack width={'80%'} height={'fit-content'} direction={'row'} alignItems={'center'} justifyContent={'end'} gap={1}>
								<Typography
									variant="caption"
									onClick={() => {
										if (swapFromCur.address == sepoliaWethAddress) {
											setFirstInputValue('0.00001')
										} else setFirstInputValue('1')
									}}
									sx={{
										color: lightTheme.palette.text.primary,
										fontWeight: 600,
										backgroundColor: lightTheme.palette.pageBackground.main,
										paddingX: '0.8rem',
										paddingY: '0.2rem',
										borderRadius: '0.6rem',
										border: 'solid 1px rgba(37, 37, 37, 0.5)',
										boxShadow: '0px 1px 1px 1px rgba(37, 37, 37, 0.3)',
									}}
								>
									MIN
								</Typography>
								<Typography
									variant="caption"
									onClick={() => {
										setFirstInputValue((Number(getPrimaryBalance()) / 2).toString())
									}}
									sx={{
										color: lightTheme.palette.text.primary,
										fontWeight: 600,
										backgroundColor: lightTheme.palette.pageBackground.main,
										paddingX: '0.8rem',
										paddingY: '0.2rem',
										borderRadius: '0.6rem',
										border: 'solid 1px rgba(37, 37, 37, 0.5)',
										boxShadow: '0px 1px 1px 1px rgba(37, 37, 37, 0.3)',
									}}
								>
									HALF
								</Typography>
								<Typography
									variant="caption"
									onClick={() => {
										setFirstInputValue(Number(getPrimaryBalance()).toString())
									}}
									sx={{
										color: lightTheme.palette.text.primary,
										fontWeight: 600,
										backgroundColor: lightTheme.palette.pageBackground.main,
										paddingX: '0.8rem',
										paddingY: '0.2rem',
										borderRadius: '0.6rem',
										border: 'solid 1px rgba(37, 37, 37, 0.5)',
										boxShadow: '0px 1px 1px 1px rgba(37, 37, 37, 0.3)',
									}}
								>
									MAX
								</Typography>
							</Stack>
						</Stack>
						<Stack width={'100vw'} height={'fit-content'} direction={'row'} alignItems={'center'} justifyContent={'space-between'} paddingX={3}>
							<Stack width={'50%'} height={'fit-content'} direction={'column'} alignItems={'start'} justifyContent={'start'}>
								<input
									type="number"
									className=" bg-transparent border-none w-10/12 h-fit pt-4 pb-2 interMedium outline-none text-black text-4xl"
									placeholder="0.0"
									onChange={changeFirstInputValue}
									value={firstInputValue ? firstInputValue : ''}
								/>
								<Stack width={'100vw'} height={'fit-content'} direction={'row'} alignItems={'center'} justifyContent={'space-between'} paddingRight={3}>
									{isMainnet && (
										<Typography
											variant="subtitle1"
											sx={{
												color: lightTheme.palette.text.primary,
												fontWeight: 500,
												marginTop: '.6rem',
											}}
										>
											≈$0.0
										</Typography>
									)}
									<Stack width={'100vw'} height={'fit-content'} direction={'row'} alignItems={'center'} justifyContent={'end'} gap={1} paddingX={3}>
										<LiaWalletSolid color="#5E869B" size={20} strokeWidth={1.2} className="mt-3" />
										<Typography
											variant="subtitle1"
											sx={{
												color: lightTheme.palette.text.primary,
												fontWeight: 600,
												paddingTop: '1rem',
											}}
										>
											{getPrimaryBalance()} {swapFromCur.Symbol}
										</Typography>
									</Stack>
								</Stack>
							</Stack>
							<Link
								href=""
								onClick={(event) => {
									event.preventDefault()
									openFromCurrencySheet()
								}}
								className="w-fit h-fit flex flex-row items-center justify-center relative z-50"
							>
								<Stack
									height={'12vw'}
									width={'12vw'}
									borderRadius={'9999px'}
									sx={{
										marginTop: '-2rem',
										backgroundImage: `url('${swapFromCur.logo}')`,
										backgroundPosition: 'center',
										backgroundRepeat: 'no-repeat',
										backgroundSize: 'cover',
									}}
								></Stack>
							</Link>
						</Stack>
						<Stack
							width={'100%'}
							paddingX={1}
							paddingY={2}
							direction="row"
							alignItems={'center'}
							justifyContent={'center'}
							className="w-full my-2 px-2 flex flex-row items-center justify-center"
						>
							<Stack width={'40%'} height={'1px'} bgcolor={lightTheme.palette.text.primary}></Stack>
							<Stack
								width={'fit-content'}
								height={'fit-content'}
								borderRadius={'9999px'}
								marginX={1.5}
								border={`solid 1px ${lightTheme.palette.text.primary}`}
								padding={1}

								onClick={() => {
									//Switching()
								}}
							>
								<Link href={""} onClick={(e) => { e.preventDefault(); Switching() }} className='w-fit h-fit flex flex-row items-center justify-center'>
									<Box >
										<AiOutlineSwap color={lightTheme.palette.text.primary} size={20} className="rotate-90" />
									</Box>
								</Link>

							</Stack>
							<Stack width={'40%'} height={'1px'} bgcolor={lightTheme.palette.text.primary}></Stack>
						</Stack>
						<Stack width={'100%'} height={'fit-content'} direction="row" alignItems={'center'} justifyContent={'space-between'} paddingY={1}>
							<Typography
								variant="subtitle1"
								sx={{
									color: "#484848",
									fontWeight: 600,
									
								}}
							>
								You Recieve
							</Typography>
						</Stack>
						<Stack width={'100vw'} height={'fit-content'} direction={'row'} alignItems={'center'} justifyContent={'space-between'} paddingX={3}>
							<Stack width={'50%'} height={'fit-content'} direction={'column'} alignItems={'start'} justifyContent={'start'}>
								<input
									type="number"
									className=" bg-transparent border-none w-10/12 h-fit pt-4 pb-2 interMedium outline-none text-black text-4xl"
									placeholder="0.0"
									onChange={changeSecondInputValue}
									value={secondInputValue && secondInputValue !== 'NaN' ? formatNumber(Number(secondInputValue)) : 0}
								/>
								<Stack width={'100vw'} height={'fit-content'} direction={'row'} alignItems={'center'} justifyContent={'space-between'} paddingRight={3}>
									{isMainnet && (
										<Typography
											variant="subtitle1"
											sx={{
												color: lightTheme.palette.text.primary,
												fontWeight: 500,
												marginTop: '.6rem',
											}}
										>
											≈$0.0
										</Typography>
									)}
									<Stack width={'100vw'} height={'fit-content'} direction={'row'} alignItems={'center'} justifyContent={'end'} gap={1} paddingX={3}>
										<LiaWalletSolid color="#5E869B" size={20} strokeWidth={1.2} className="mt-3" />
										<Typography
											variant="subtitle1"
											sx={{
												color: lightTheme.palette.text.primary,
												fontWeight: 600,
												paddingTop: '1rem',
											}}
										>
											{getSecondaryBalance()} {swapToCur.Symbol}
										</Typography>
									</Stack>
								</Stack>
							</Stack>
							<Link
								href=""
								onClick={(event) => {
									event.preventDefault()
									openToCurrencySheet()
								}}
								className="w-fit h-fit flex flex-row items-center justify-center"
							>
								<Stack
									height={'12vw'}
									width={'12vw'}
									borderRadius={'9999px'}
									sx={{
										marginTop: '-2rem',
										backgroundImage: `url('${swapToCur.logo}')`,
										backgroundPosition: 'center',
										backgroundRepeat: 'no-repeat',
										backgroundSize: 'cover',
									}}
								></Stack>
							</Link>
						</Stack>

						<Stack width={'100vw'} height={'fit-content'} direction={'row'} alignItems={'center'} justifyContent={'space-between'} paddingX={1.5} paddingTop={3}>
							<Stack direction={'row'} alignItems={'center'} justifyContent={'start'} width={'fit-content'} height={'fit-content'} gap={1}>
								<IOSSwitch sx={{ m: 1 }} checked={isChecked} onChange={toggleCheckbox} />
								<Typography
									variant="subtitle1"
									sx={{
										color: "#484848",
										fontWeight: 600,
									}}
								>
									FIAT Payment
								</Typography>
							</Stack>
							<Stack direction={'row'} alignItems={'center'} justifyContent={'start'} width={'fit-content'} height={'fit-content'} gap={1} onClick={() => faucet()}>
								<Typography
									variant="subtitle1"
									sx={{
										color: '#5E869B',
										fontWeight: 600,
									}}
								>
									Testnet USDT
								</Typography>
								<GoArrowUpRight color={'#5E869B'} size={20} />
							</Stack>
						</Stack>
						<Stack width={'100vw'} height={'fit-content'} direction={'row'} alignItems={'center'} justifyContent={'space-between'} paddingX={2.5} paddingTop={3}>
							<Stack direction={'row'} alignItems={'center'} justifyContent={'start'} width={'fit-content'} height={'fit-content'} gap={1}>
								<Typography
									variant="subtitle1"
									sx={{
										color: lightTheme.palette.text.primary,
										fontWeight: 600,
									}}
								>
									Platform Fees
								</Typography>
							</Stack>
							<Stack direction={'row'} alignItems={'center'} justifyContent={'start'} width={'fit-content'} height={'fit-content'} gap={1}>
								<Typography
									variant="subtitle1"
									sx={{
										color: lightTheme.palette.text.primary,
										fontWeight: 500,
									}}
								>
									1%
								</Typography>
							</Stack>
						</Stack>
						{swapToCur.hasOwnProperty('indexType') ? (
							<>
								{Number(fromTokenAllowance.data) / 1e18 < Number(firstInputValue) && swapFromCur.address != sepoliaWethAddress ? (
									<Button
										onClick={() => {
											approve()
										}}
										disabled={isButtonDisabled}
										sx={{
											width: '100%',
											paddingY: '1rem',
											background: 'linear-gradient(to top right, #5E869B 0%, #8FB8CA 100%)',
											boxShadow: 'none',
											marginTop: '2.4rem',
										}}
									>
										<Typography
											variant="h3"
											component="h3"
											className="w-full"
											sx={{
												color: lightTheme.palette.text.primary,
												fontSize: '1.6rem',
												textShadow: 'none',
											}}
										>
											Approve
										</Typography>
									</Button>
								) : (
									<Button
										onClick={() => {
											mintRequest()
										}}
										disabled={isButtonDisabled}
										sx={{
											width: '100%',
											paddingY: '1rem',
											background: 'linear-gradient(to top right, #5E869B 0%, #8FB8CA 100%)',
											boxShadow: 'none',
											marginTop: '2.4rem',
										}}
									>
										<Typography
											variant="h3"
											component="h3"
											className="w-full"
											sx={{
												color: lightTheme.palette.text.primary,
												fontSize: '1.6rem',
												textShadow: 'none',
											}}
										>
											Mint
										</Typography>
									</Button>
								)}
							</>
						) : (
							<>
								<Button
									onClick={() => {
										burnRequest()
									}}
									disabled={isButtonDisabled}
									sx={{
										width: '100%',
										paddingY: '1rem',
										background: 'linear-gradient(to top right, #5E869B 0%, #8FB8CA 100%)',
										boxShadow: 'none',
										marginTop: '2.4rem',
									}}
								>
									<Typography
										variant="h3"
										component="h3"
										className="w-full"
										sx={{
											color: lightTheme.palette.text.primary,
											fontSize: '1.6rem',
											textShadow: 'none',
										}}
									>
										Burn
									</Typography>
								</Button>
							</>
						)}
					</Box>
					<Sheet isOpen={isFromCurrencySheetOpen} onClose={() => setFromCurrencySheetOpen(false)} snapPoints={[500, 500, 0, 0]} initialSnap={1}>
						<Sheet.Container>
							<Sheet.Header />
							<Sheet.Content>
								<Stack direction={'column'} height={'100%'} width={'100%'} alignItems={'center'} justifyContent={'space-between'} paddingX={2} paddingY={2}>
									<Typography
										variant="h6"
										align="center"
										sx={{
											color: lightTheme.palette.text.primary,
											fontWeight: 700,
										}}
									>
										Swap From
									</Typography>
									<Stack direction={'column'} height={'fit-content'} width={'100%'} alignItems={'center'} justifyContent={'end'} gap={1}>
										<Stack width={'100%'} height={'30vh'} direction={'column'} alignItems={'center'} justifyContent={'start'} gap={3} sx={{ overflowY: 'scroll', overflowX: 'hidden' }}>
											{mergedCoinList[0].map((item, index) => {
												return (
													<Link
														href=""
														key={index}
														className="w-full h-fit flex flex-row items-center justify-center relative z-50"
														onClick={(event) => {
															event.preventDefault()
															changeSwapFromCur(item)
															closeFromCurrencySheet()
														}}
													>
														<Stack key={index} width={'100%'} height={'fit-content'} direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
															<Stack
																height={'12vw'}
																width={'12vw'}
																borderRadius={'9999px'}
																sx={{
																	backgroundImage: `url('${item.logo}')`,
																	backgroundPosition: 'center',
																	backgroundRepeat: 'no-repeat',
																	backgroundSize: 'cover',
																}}
															></Stack>
															<Stack direction="row" alignItems={'center'} justifyContent={'end'} width={'fit-content'} height={'fit-content'} gap={0.5}>
																<Typography
																	variant="body1"
																	align="center"
																	sx={{
																		color: lightTheme.palette.text.primary,
																		fontWeight: 700,
																	}}
																>
																	{item.name}
																</Typography>
																<Typography
																	variant="caption"
																	align="center"
																	sx={{
																		color: '#878787',
																		fontWeight: 500,
																	}}
																>
																	({item.Symbol})
																</Typography>
															</Stack>
														</Stack>
													</Link>
												)
											})}
										</Stack>
										<Stack width={'100%'} height={'fit-content'} marginY={1.5} direction={'row'} alignItems={'center'} justifyContent={'center'} gap={1}>
											<Button
												onClick={() => {
													//changePWATradeoperation("sell")
													//router.push('/pwa_trade_console_defi')
													setIsmainnet(true)
												}}
												sx={{
													width: '50%',
													paddingY: '1rem',
													background: 'linear-gradient(to top right, #5E869B 0%, #8FB8CA 100%)',
													boxShadow: 'none',
												}}
											>
												<Typography
													variant="h3"
													component="h3"
													className="w-full"
													sx={{
														color: lightTheme.palette.text.primary,
														fontSize: '1.6rem',
														textShadow: 'none',
													}}
												>
													Mainnet
												</Typography>
											</Button>
											<Button
												onClick={() => {
													//changePWATradeoperation("sell")
													//router.push('/pwa_trade_console_defi')
													setIsmainnet(false)
												}}
												sx={{
													width: '50%',
													paddingY: '1rem',
													background: 'linear-gradient(to top right, #5E869B 0%, #8FB8CA 100%)',
													boxShadow: 'none',
												}}
											>
												<Typography
													variant="h3"
													component="h3"
													className="w-full"
													sx={{
														color: lightTheme.palette.text.primary,
														fontSize: '1.6rem',
														textShadow: 'none',
													}}
												>
													Testnet
												</Typography>
											</Button>
										</Stack>
									</Stack>
								</Stack>
							</Sheet.Content>
						</Sheet.Container>
						<Sheet.Backdrop onTap={closeFromCurrencySheet} />
					</Sheet>
					<Sheet isOpen={isToCurrencySheetOpen} onClose={() => setToCurrencySheetOpen(false)} snapPoints={[500, 500, 0, 0]} initialSnap={1}>
						<Sheet.Container>
							<Sheet.Header />
							<Sheet.Content>
								<Stack direction={'column'} height={'100%'} width={'100%'} alignItems={'center'} justifyContent={'space-between'} paddingX={2} paddingY={2}>
									<Typography
										variant="h6"
										align="center"
										sx={{
											color: lightTheme.palette.text.primary,
											fontWeight: 700,
										}}
									>
										Swap To
									</Typography>
									<Stack direction={'column'} height={'fit-content'} width={'100%'} alignItems={'center'} justifyContent={'end'} gap={1}>
										<Stack width={'100%'} height={'30vh'} direction={'column'} alignItems={'center'} justifyContent={'start'} gap={3} sx={{ overflowY: 'scroll', overflowX: 'hidden' }}>
											{mergedCoinList[0].map((item, index) => {
												return (
													<Link
														href=""
														key={index}
														className="w-full h-fit flex flex-row items-center justify-center relative z-50"
														onClick={(event) => {
															event.preventDefault()
															changeSwapToCur(item)
															closeToCurrencySheet()
														}}
													>
														<Stack key={index} width={'100%'} height={'fit-content'} direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
															<Stack
																height={'12vw'}
																width={'12vw'}
																borderRadius={'9999px'}
																sx={{
																	backgroundImage: `url('${item.logo}')`,
																	backgroundPosition: 'center',
																	backgroundRepeat: 'no-repeat',
																	backgroundSize: 'cover',
																}}
															></Stack>
															<Stack direction="row" alignItems={'center'} justifyContent={'end'} width={'fit-content'} height={'fit-content'} gap={0.5}>
																<Typography
																	variant="body1"
																	align="center"
																	sx={{
																		color: lightTheme.palette.text.primary,
																		fontWeight: 700,
																	}}
																>
																	{item.name}
																</Typography>
																<Typography
																	variant="caption"
																	align="center"
																	sx={{
																		color: '#878787',
																		fontWeight: 500,
																	}}
																>
																	({item.Symbol})
																</Typography>
															</Stack>
														</Stack>
													</Link>
												)
											})}
										</Stack>
										<Stack width={'100%'} height={'fit-content'} marginY={1.5} direction={'row'} alignItems={'center'} justifyContent={'center'} gap={1}>
											<Button
												onClick={() => {
													//changePWATradeoperation("sell")
													//router.push('/pwa_trade_console_defi')
													setIsmainnet(true)
												}}
												sx={{
													width: '50%',
													paddingY: '1rem',
													background: 'linear-gradient(to top right, #5E869B 0%, #8FB8CA 100%)',
													boxShadow: 'none',
												}}
											>
												<Typography
													variant="h3"
													component="h3"
													className="w-full"
													sx={{
														color: lightTheme.palette.text.primary,
														fontSize: '1.6rem',
														textShadow: 'none',
													}}
												>
													Mainnet
												</Typography>
											</Button>
											<Button
												onClick={() => {
													//changePWATradeoperation("sell")
													//router.push('/pwa_trade_console_defi')
													setIsmainnet(false)
												}}
												sx={{
													width: '50%',
													paddingY: '1rem',
													background: 'linear-gradient(to top right, #5E869B 0%, #8FB8CA 100%)',
													boxShadow: 'none',
												}}
											>
												<Typography
													variant="h3"
													component="h3"
													className="w-full"
													sx={{
														color: lightTheme.palette.text.primary,
														fontSize: '1.6rem',
														textShadow: 'none',
													}}
												>
													Testnet
												</Typography>
											</Button>
										</Stack>
									</Stack>
								</Stack>
							</Sheet.Content>
						</Sheet.Container>
						<Sheet.Backdrop onTap={closeToCurrencySheet} />
					</Sheet>
				</>
			) : (
				<>
					<PaymentModal isOpen={isPaymentModalOpen} onClose={closePaymentModal} />
					<div
						className={`h-fit w-full rounded-xl ${mode == 'dark' ? '' : 'shadow shadow-blackText-500'} flex flex-col items-start justify-start px-4 py-3`}
						style={{
							boxShadow: mode == 'dark' ? `0px 0px 6px 1px rgba(91,166,153,0.68)` : '',
						}}
					>
						<h5 className={`text-xl ${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500 '} interBlack mb-3 text-center w-full`}>Buy/Sell</h5>
						<div className="w-full h-fit flex flex-col items-start justify-start">
							<div className="w-full h-fit flex flex-row items-center justify-between mb-1">
								<p className={`text-base interMedium ${mode == 'dark' ? ' text-whiteText-500' : 'text-gray-500'}  w-1/3`}>You pay</p>
								<div className="w-2/3 h-fit flex flex-row items-center justify-end gap-1 px-2">
									<p
										onClick={() => {
											if (swapFromCur.address == sepoliaWethAddress) {
												setFirstInputValue('0.00001')
											} else setFirstInputValue('1')
										}}
										className={`text-base lg:text-xs  interBold ${mode == 'dark'
												? ' bg-cover border-transparent bg-center bg-no-repeat text-whiteText-500'
												: 'text-blackText-500 bg-gradient-to-tr from-gray-300 to-gray-200 hover:to-gray-100 shadow-blackText-500'
											} active:translate-y-[1px] active:shadow-black px-2 py-1 rounded cursor-pointer shadow-sm`}
										style={{
											boxShadow: mode == 'dark' ? `0px 0px 2px 1px rgba(91,166,153,0.68)` : '',
											backgroundImage: mode == 'dark' ? `url('${mesh1.src}')` : '',
										}}
									>
										MIN
									</p>
									<p
										// onClick={() => setFirstInputValue((Number(getPrimaryBalance()) / 2e18).toString())}
										onClick={() => {
											setFirstInputValue((Number(getPrimaryBalance()) / 2).toString())
										}}
										className={`text-base lg:text-xs  interBold ${mode == 'dark'
												? ' bg-cover border-transparent bg-center bg-no-repeat text-whiteText-500'
												: 'text-blackText-500 bg-gradient-to-tr from-gray-300 to-gray-200 hover:to-gray-100 shadow-blackText-500'
											} active:translate-y-[1px] active:shadow-black px-2 py-1 rounded cursor-pointer shadow-sm`}
										style={{
											boxShadow: mode == 'dark' ? `0px 0px 2px 1px rgba(91,166,153,0.68)` : '',
											backgroundImage: mode == 'dark' ? `url('${mesh1.src}')` : '',
										}}
									>
										HALF
									</p>
									<p
										onClick={() => {
											setFirstInputValue(Number(getPrimaryBalance()).toString())
										}}
										className={`text-base lg:text-xs  interBold ${mode == 'dark'
												? ' bg-cover border-transparent bg-center bg-no-repeat text-whiteText-500'
												: 'text-blackText-500 bg-gradient-to-tr from-gray-300 to-gray-200 hover:to-gray-100 shadow-blackText-500'
											} active:translate-y-[1px] active:shadow-black px-2 py-1 rounded cursor-pointer shadow-sm`}
										style={{
											boxShadow: mode == 'dark' ? `0px 0px 2px 1px rgba(91,166,153,0.68)` : '',
											backgroundImage: mode == 'dark' ? `url('${mesh1.src}')` : '',
										}}
									>
										MAX
									</p>
								</div>
							</div>
							<div className="w-full h-fit flex flex-row items-center justify-end gap-1">
								<input
									type="text"
									placeholder="0.00"
									className={`w-1/2 border-none text-2xl ${mode == 'dark' ? ' text-whiteText-500 placeholder:text-whiteText-500' : 'text-blackText-500 placeholder:text-gray-400'
										}  interMedium placeholder:text-2xl  placeholder:interMedium bg-transparent active:border-none outline-none focus:border-none p-2`}
									onChange={changeFirstInputValue}
									value={firstInputValue ? firstInputValue : ''}
								/>
								<div
									className="w-fit lg:w-1/2 gap-2 p-2 h-10 flex flex-row items-center justify-end cursor-pointer"
									onClick={() => {
										openFromCurrencyModal()
									}}
								>
									<div className="flex flex-row items-center justify-start w-fit">
										<Image src={swapFromCur.logo} alt={swapFromCur.Symbol} quality={100} width={30} height={30} className=" relative z-20 rounded-full mt-1 mr-1"></Image>
										<h5 className={`text-lg ${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500'}  interBlack pt-1`}>{swapFromCur.Symbol}</h5>
									</div>
									{mode == 'dark' ? <BiSolidChevronDown color={'#FFFFFF'} size={18} className="mt-1" /> : <BiSolidChevronDown color={'#2A2A2A'} size={18} className="mt-1" />}
								</div>
							</div>
							<div className="w-full h-fit flex flex-row items-center justify-between pt-3">
								<span className={`text-sm interMedium ${mode == 'dark' ? ' text-whiteText-500' : 'text-gray-500'} `}>
									{isMainnet && <>≈ ${fromConvertedPrice ? FormatToViewNumber({ value: fromConvertedPrice, returnType: 'string' }) : '0.00'}</>}
								</span>
								<div className="flex flex-row items-center justify-end gap-1">
									{mode == 'dark' ? <LiaWalletSolid color="#FFFFFF" size={20} strokeWidth={1.2} /> : <LiaWalletSolid color="#5E869B" size={20} strokeWidth={1.2} />}

									<span className={`text-sm interMedium ${mode == 'dark' ? ' text-whiteText-500' : 'text-gray-500'} `}>
										{getPrimaryBalance()} {swapFromCur.Symbol}
									</span>
								</div>
							</div>
						</div>

						<div className="w-full my-2 px-2 flex flex-row items-center justify-center">
							<div className={`${mode == 'dark' ? ' bg-whiteText-500' : 'bg-blackText-500'} w-2/5 h-[1px]`}></div>
							<div
								className={`w-fit h-fit rounded-full mx-3 ${mode == 'dark' ? '  bg-transparent border border-whiteText-500' : 'bg-blackText-500'}  p-2 cursor-pointer`}
								onClick={() => {
									Switching()
								}}
							>
								<AiOutlineSwap color="#F2F2F2" size={20} className="rotate-90" />
							</div>
							<div className={`${mode == 'dark' ? ' bg-whiteText-500' : 'bg-blackText-500'} w-2/5 h-[1px]`}></div>
						</div>
						<div className="w-full h-fit flex flex-col items-start justify-end">
							<p className={`text-base interMedium ${mode == 'dark' ? ' text-whiteText-500' : 'text-gray-500'}  pb-1`}>You Recieve</p>
							<div className="w-full h-fit flex flex-row items-center justify-end gap-2">
								<input
									type="text"
									placeholder="0.00"
									className={`w-1/2 border-none text-2xl ${mode == 'dark' ? ' text-whiteText-500 placeholder:text-whiteText-500' : 'text-blackText-500 placeholder:text-gray-400'
										}  interMedium placeholder:text-2xl  placeholder:interMedium bg-transparent active:border-none outline-none focus:border-none p-2`}
									onChange={changeSecondInputValue}
									value={secondInputValue && secondInputValue !== 'NaN' ? formatNumber(Number(secondInputValue)) : 0}
								/>
								<div
									className="w-fit lg:w-1/2 gap-2 p-2 h-10 flex flex-row items-center justify-end  cursor-pointer"
									onClick={() => {
										openToCurrencyModal()
									}}
								>
									<div className="flex flex-row items-center justify-end ">
										<Image src={swapToCur.logo} alt={swapToCur.Symbol} quality={100} width={30} height={30} className=" relative z-20 rounded-full mt-1 mr-1"></Image>
										<h5 className={`text-lg ${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500 '} interBlack pt-1`}>{swapToCur.Symbol}</h5>
									</div>
									{mode == 'dark' ? <BiSolidChevronDown color={'#FFFFFF'} size={18} className="mt-1" /> : <BiSolidChevronDown color={'#2A2A2A'} size={18} className="mt-1" />}
								</div>
							</div>
							<div className="w-full h-fit flex flex-row items-center justify-between pt-3">
								<span className={`text-sm interMedium ${mode == 'dark' ? 'text-whiteText-500' : 'text-gray-500'}`}>
									<span className={`text-sm interMedium ${mode == 'dark' ? 'text-whiteText-500' : 'text-gray-500'}`}>
										{isMainnet && <>≈ ${toConvertedPrice ? FormatToViewNumber({ value: toConvertedPrice, returnType: 'string' }) : '0.00'}</>}
									</span>
								</span>

								<div className="flex flex-row items-center justify-end gap-1">
									{mode == 'dark' ? <LiaWalletSolid color="#FFFFFF" size={20} strokeWidth={1.2} /> : <LiaWalletSolid color="#5E869B" size={20} strokeWidth={1.2} />}
									<span className={`text-sm interMedium ${mode == 'dark' ? ' text-whiteText-500' : 'text-gray-500'} `}>
										{getSecondaryBalance()} {swapToCur.Symbol}
									</span>
								</div>
							</div>
						</div>
						<div className="pt-8 flex flex-row w-full items-center justify-between">
							<div className="flex flex-row items-center gap-2">
								<Switch onChange={toggleCheckbox} checked={isChecked} height={14} width={35} handleDiameter={20} />
								<div className="flex flex-row items-center justify-start gap-1">
									<span className={` ${mode == 'dark' ? ' text-whiteText-500' : 'text-gray-700'} interMedium text-sm`}>Fiat payment</span>
									<span>
										<GenericTooltip
											color="#5E869B"
											content={
												<div>
													<p className={`${mode == 'dark' ? 'text-whiteText-500' : 'text-blackText-500'} text-sm interBold mb-2`}>No cryptocurrencies in your wallet? No problem!</p>
													<p className={`${mode == 'dark' ? 'text-whiteText-500' : 'text-blackText-500'} text-sm interMedium`}>
														Revolutionize your trading experience with Nex Labs – introducing fiat payments for the first time, providing you seamless and convenient transactions in
														traditional currencies.
													</p>
												</div>
											}
										>
											<BsInfoCircle color="#5E869B" size={14} className="cursor-pointer" />
										</GenericTooltip>
									</span>
								</div>
							</div>
							<div className={`flex flex-row items-center justify-end`}>
								<span onClick={() => faucet()} className={` ${mode == 'dark' ? ' text-whiteText-500' : 'text-gray-700'} interMedium text-sm cursor-pointer`}>
									Testnet USDT
								</span>
								<GoArrowUpRight color={mode == 'dark' ? '#FFFFFF' : '#252525'} size={20} />
							</div>
						</div>
						<div className="h-fit w-full mt-6">
							<div className={`w-full h-fit flex flex-row items-center justify-end gap-1 px-2 py-3 mb-3`}>
								{swapToCur.hasOwnProperty('indexType') ? (
									<>
										{Number(fromTokenAllowance.data) / 1e18 < Number(firstInputValue) && swapFromCur.address != sepoliaWethAddress ? (
											<button
												onClick={approve}
												disabled={isButtonDisabled}
												className={`text-xl titleShadow interBold ${mode == 'dark'
														? ' text-whiteText-500 bg-cover border-transparent bg-center bg-no-repeat'
														: ' text-blackText-500 bg-gradient-to-tl from-colorFour-500 to-colorSeven-500 shadow-sm shadow-blackText-500'
													} active:translate-y-[1px] active:shadow-black w-full px-2 py-3 rounded ${isButtonDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
													} hover:bg-colorTwo-500/30`}
												style={{
													boxShadow: mode == 'dark' ? `0px 0px 6px 1px rgba(91,166,153,0.68)` : '',
													backgroundImage: mode == 'dark' ? `url('${mesh1.src}')` : '',
												}}
											>
												Approve
											</button>
										) : (
											<button
												onClick={mintRequest}
												disabled={isButtonDisabled}
												className={`text-xl titleShadow interBold ${mode == 'dark'
														? ' text-whiteText-500 bg-cover border-transparent bg-center bg-no-repeat'
														: ' text-blackText-500 bg-gradient-to-tl from-colorFour-500 to-colorSeven-500 shadow-sm shadow-blackText-500'
													}  active:translate-y-[1px] active:shadow-black w-full px-2 py-3 rounded-lg ${isButtonDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
													} hover:from-colorFour-500 hover:to-colorSeven-500/90`}
												style={{
													boxShadow: mode == 'dark' ? `0px 0px 6px 1px rgba(91,166,153,0.68)` : '',
													backgroundImage: mode == 'dark' ? `url('${mesh1.src}')` : '',
												}}
											>
												Mint
											</button>
										)}
									</>
								) : (
									<button
										onClick={burnRequest}
										disabled={isButtonDisabled}
										className={`text-xl text-white titleShadow interBold bg-gradient-to-tl from-nexLightRed-500 to-nexLightRed-500/80 active:translate-y-[1px] active:shadow-black shadow-sm shadow-blackText-500 w-full px-2 py-3 rounded ${isButtonDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
											} hover:bg-colorTwo-500/30`}
									>
										Burn
									</button>
								)}
								{/* <p className="text-xs text-blackText-500 pangramMedium bg-gray-200 px-2 pb-1 rounded cursor-pointer hover:bg-colorTwo-500/30">HALF</p>
							<p className="text-xs text-blackText-500 pangramMedium bg-gray-200 px-2 pb-1 rounded cursor-pointer hover:bg-colorTwo-500/30">MAX</p> */}
							</div>
							{/* <div className="w-full h-fit flex flex-row items-center justify-between mb-1">
						<p className="text-sm pangramMedium text-black/70 pb-2">Gas Fees</p>
						<p className="text-sm pangramLight text-black/70 pb-2">0.01 ETH</p>
					</div> */}
							<div className="w-full h-fit flex flex-row items-center justify-between mb-1">
								<p className={`text-sm interMedium ${mode == 'dark' ? ' text-whiteText-500' : 'text-black/70'}  pb-2`}>Platform Fees</p>
								<div className="flex flex-row items-center justify-start gap-2">
									<p className={`text-sm interMedium ${mode == 'dark' ? ' text-whiteText-500' : 'text-black/70'} `}>
										{FormatToViewNumber({ value: Number(firstInputValue) * feeRate, returnType: 'string' })} {swapFromCur.Symbol} ({feeRate * 100} %)
									</p>
									<GenericTooltip
										color="#5E869B"
										content={
											<div>
												<p className={`${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500'} text-sm interMedium`}>
													Platform fees support ongoing development and security, ensuring a sustainable and innovative decentralized financial ecosystem.
												</p>
											</div>
										}
									>
										<BsInfoCircle color="#5E869B" size={14} className="cursor-pointer" />
									</GenericTooltip>
								</div>
							</div>
							{/* <div className="w-full h-fit flex flex-row items-center justify-between mb-1">
						<p className="text-sm pangramMedium text-black/70 pb-2">Total Transaction Cost</p>
						<p className="text-sm pangramLight text-black/70 pb-2">0.02 ETH</p>
					</div> */}
						</div>
					</div>
					<GenericModal isOpen={isFromCurrencyModalOpen} onRequestClose={closeFromCurrencyModal}>
						<div className="w-full h-fit px-2">
							<div className="w-full h-fit flex flex-row items-center justify-between gap-1 my-4">
								<button
									onClick={toggleMainnetCheckbox}
									className={`w-1/2 flex flex-row items-center justify-center py-2 cursor-pointer rounded-xl ${isMainnet
											? ` ${mode == 'dark' ? ' bg-cover border-transparent bg-center bg-no-repeat' : 'bg-gradient-to-tl from-colorFour-500 to-colorSeven-500'}  text-white titleShadow`
											: ` ${mode == 'dark' ? ' bg-transparent border border-gray-300' : 'bg-gradient-to-tl from-gray-200 to-gray-100'}  text-gray-300`
										} interBold text-xl`}
									style={{
										boxShadow: mode == 'dark' && isMainnet ? `0px 0px 6px 1px rgba(91,166,153,0.68)` : '',
										backgroundImage: mode == 'dark' && isMainnet ? `url('${mesh1.src}')` : '',
									}}
								>
									Mainnet
								</button>
								<button
									onClick={toggleMainnetCheckbox}
									className={`w-1/2 flex flex-row items-center justify-center py-2 cursor-pointer rounded-xl ${!isMainnet
											? ` ${mode == 'dark' ? ' bg-cover border-transparent bg-center bg-no-repeat' : 'bg-gradient-to-tl from-colorFour-500 to-colorSeven-500'}  text-white titleShadow`
											: ` ${mode == 'dark' ? ' bg-transparent border border-gray-300' : 'bg-gradient-to-tl from-gray-200 to-gray-100'}  text-gray-300`
										} interBold text-xl`}
									style={{
										boxShadow: mode == 'dark' && !isMainnet ? `0px 0px 6px 1px rgba(91,166,153,0.68)` : '',
										backgroundImage: mode == 'dark' && !isMainnet ? `url('${mesh1.src}')` : '',
									}}
								>
									Testnet
								</button>
							</div>

							<ReactSearchAutocomplete items={mergedCoinList[0]} formatResult={formatResult} autoFocus className="relative z-50" />
							<div className={`w-full h-fit max-h-[50vh] ${mode == 'dark' ? ' bg-transparent' : 'bg-white'}  overflow-hidden my-4 px-2`}>
								<div className={`w-full h-fit max-h-[50vh] ${mode == 'dark' ? ' bg-transparent' : 'bg-white'} overflow-y-auto  py-2`} id="coinsList">
									{mergedCoinList[0].map((item, index) => {
										return (
											<div
												key={index}
												className={`flex ${item.Symbol == 'eth' || item.Symbol == 'ETH' ? 'hidden' : ''
													} flex-row items-center justify-between mb-2 px-2 py-2 rounded-xl cursor-pointer hover:bg-slate-300`}
												onClick={() => {
													changeSwapFromCur(item)
													closeFromCurrencyModal()
												}}
											>
												<div className="flex flex-row items-center justify-start gap-3">
													<Image src={item.logo} alt={item.name} width={25} height={25} className="mt-1"></Image>
													<h5 className={`text-base ${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500'}  interBold`}>{item.Symbol}</h5>
												</div>
												<h5 className={`text-sm ${mode == 'dark' ? ' text-whiteText-500' : 'text-gray-300'} inter italic`}>{item.Symbol}</h5>
											</div>
										)
									})}
								</div>
							</div>
						</div>
					</GenericModal>
					<GenericModal isOpen={isToCurrencyModalOpen} onRequestClose={closeToCurrencyModal}>
						<div className="w-full h-fit px-2">
							<div className="w-full h-fit flex flex-row items-center justify-between gap-1 my-4">
								<button
									onClick={toggleMainnetCheckbox}
									className={`w-1/2 flex flex-row items-center justify-center py-2 cursor-pointer rounded-xl ${isMainnet
											? ` ${mode == 'dark' ? ' bg-cover border-transparent bg-center bg-no-repeat' : 'bg-gradient-to-tl from-colorFour-500 to-colorSeven-500'}  text-white titleShadow`
											: ` ${mode == 'dark' ? ' bg-transparent border border-gray-300' : 'bg-gradient-to-tl from-gray-200 to-gray-100'}  text-gray-300`
										} interBold text-xl`}
									style={{
										boxShadow: mode == 'dark' && isMainnet ? `0px 0px 6px 1px rgba(91,166,153,0.68)` : '',
										backgroundImage: mode == 'dark' && isMainnet ? `url('${mesh1.src}')` : '',
									}}
								>
									Mainnet
								</button>
								<button
									onClick={toggleMainnetCheckbox}
									className={`w-1/2 flex flex-row items-center justify-center py-2 cursor-pointer rounded-xl ${!isMainnet
											? ` ${mode == 'dark' ? ' bg-cover border-transparent bg-center bg-no-repeat' : 'bg-gradient-to-tl from-colorFour-500 to-colorSeven-500'}  text-white titleShadow`
											: ` ${mode == 'dark' ? ' bg-transparent border border-gray-300' : 'bg-gradient-to-tl from-gray-200 to-gray-100'}  text-gray-300`
										} interBold text-xl`}
									style={{
										boxShadow: mode == 'dark' && !isMainnet ? `0px 0px 6px 1px rgba(91,166,153,0.68)` : '',
										backgroundImage: mode == 'dark' && !isMainnet ? `url('${mesh1.src}')` : '',
									}}
								>
									Testnet
								</button>
							</div>
							<ReactSearchAutocomplete items={mergedCoinList[1]} formatResult={formatResult} autoFocus className="relative z-50" />
							<div className={`w-full h-fit max-h-[50vh] ${mode == 'dark' ? ' bg-transparent' : 'bg-white'}  overflow-hidden my-4 px-2`}>
								<div className={`w-full h-fit max-h-[50vh] ${mode == 'dark' ? ' bg-transparent' : 'bg-white'} overflow-y-auto  py-2`} id="coinsList">
									{mergedCoinList[1].map((item, index) => {
										return (
											<div
												key={index}
												className={`flex ${item.Symbol == 'eth' || item.Symbol == 'ETH' ? 'hidden' : ''} flex-row items-center justify-between mb-5 cursor-pointer`}
												onClick={() => {
													changeSwapToCur(item)
													closeToCurrencyModal()
												}}
											>
												<div className="flex flex-row items-center justify-start gap-3">
													<Image src={item.logo} alt={item.name} width={25} height={25} className="mt-1"></Image>
													<h5 className={`text-base ${mode == 'dark' ? ' text-whiteText-500' : 'text-blackText-500'}  interBold`}>{item.Symbol}</h5>
												</div>
												<h5 className={`text-sm ${mode == 'dark' ? ' text-whiteText-500' : 'ext-gray-300'} t inter italic`}>{item.Symbol}</h5>
											</div>
										)
									})}
								</div>
							</div>
						</div>
					</GenericModal>
					<GenericModal
						isOpen={cookingModalVisible}
						onRequestClose={() => {
							setCookingModalVisible(false)
						}}
					>
						<div className="w-full h-fit px-2 flex flex-col items-center justify-center">
							{/*
						<Lottie
						animationData={cookingAnimation}
						loop={true}
						style={{
							height: 200,
							width: 400,
							overflow: 'hidden',
						}}
					/>
						*/}
							<h5 className="InterBold text-blackText-500 text-2xl text-center w-full -mt-6">THE MAGIC IS HAPPENING...</h5>
							<h5 className="interMedium text-blackText-500 text-lg text-center w-9/12 my-2">
								Your NFT receipt is being minted. Once it is ready, you can find it the {'"'}Receipts{'"'} section.
							</h5>
						</div>
					</GenericModal>
				</>
			)}
		</>
	)
}

export default SwapV2Defi
