import { Stack, Box, Typography, Button } from '@mui/material'
import { lightTheme } from '@/theme/theme'
import PWATopBar from '@/components/pwa/PWATopBar'
import PWABottomNav from '@/components/pwa/PWABottomNav'
import PWAIndexChartBox from '@/components/pwa/PWAIndexChartBox'
import PWAIndexComparisonBox from '@/components/pwa/PWAIndexComparisonBox'
import { useChartDataStore, useLandingPageStore } from '@/store/store'

import { IoChevronDownOutline, IoChevronUpOutline } from 'react-icons/io5'
import { MdOutlineStarBorder } from 'react-icons/md'
import { MdOutlineStar } from 'react-icons/md'

import { MdMoreHoriz } from 'react-icons/md'

// import HistoryTable from "@/components/TradeTable";
import { NewHistoryTable as HistoryTable } from '@/components/NewHistoryTable'
import { useState } from 'react'
import Sheet from 'react-modal-sheet'

import router from 'next/router'

import useTradePageStore from '@/store/tradeStore'

import { reduceAddress } from '@/utils/general'
import { FormatToViewNumber, num } from '@/hooks/math'

import { AssetChips, PWAGradientStack } from '@/theme/overrides'
import Link from 'next/link'
import Skeleton from '@mui/material/Skeleton'
import { useDashboard } from '@/providers/DashboardProvider'

export default function PWATradeIndex() {
	const [isSheetOpen, setSheetOpen] = useState<boolean>(false)
	const [isReadMore, setIsReadMore] = useState<boolean>(true)
	const { selectedIndex, changeSelectedIndex } = useLandingPageStore()
	const [isFavorite, setIsFavorite] = useState<boolean>(false)
	const { changeDefaultIndex } = useTradePageStore()
	const { indexDetailsMap, indexUnderlyingAssetsMap } = useDashboard()


	const defaultIndexObject = indexDetailsMap[selectedIndex]

	return (
		<Box
			width={'100vw'}
			height={'fit-content'}
			display={'flex'}
			flexDirection={'column'}
			alignItems={'center'}
			justifyContent={'start'}
			paddingTop={5}
			paddingBottom={2}
			paddingX={3}
			bgcolor={lightTheme.palette.background.default}
		>
			<PWATopBar></PWATopBar>
			<Stack width={'100%'} height={'fit-content'} paddingTop={2} direction={'column'} alignItems={'start'} justifyContent={'start'} gap={0.2}>
				<Stack direction={'row'} width={'100%'} height={'fit-content'} alignItems={'center'} justifyContent={'space-between'}>
					<Stack direction={'row'} alignItems={'center'} justifyContent={'start'} width={'fit-content'} height={'fit-content'}>
						<Typography
							variant="h6"
							sx={{
								color: lightTheme.palette.text.primary,
								fontWeight: 700,
							}}
						>
							{defaultIndexObject?.symbol}
						</Typography>
						<Stack
							marginX={1}
							direction="row"
							alignItems="center"
							justifyContent="start"
							onClick={() => {
								setSheetOpen(true)
							}}
						>
							<Stack direction="row" alignItems="center" justifyContent="start">
								{indexUnderlyingAssetsMap[selectedIndex]
									?.sort((a, b) => b.percentage - a.percentage)
									.slice(0, 2)
									.map((asset, key) => {
										return (
											<Stack key={key} padding={'4px'} marginLeft={`${(key * -1 * 8) / 2}px`} zIndex={key * 10} width={'fit-content'} borderRadius={'0.5rem'} sx={AssetChips}>
												<span className={`text-whiteText-500`}>{asset.logo}</span>
											</Stack>
										)
									})}
							</Stack>
						</Stack>
						<MdMoreHoriz
							size={25}
							color={lightTheme.palette.text.primary}
							className=" mt-4"
							onClick={() => {
								setSheetOpen(true)
							}}
						/>
					</Stack>
					{isFavorite ? (
						<MdOutlineStar
							size={28}
							color="#ffd700"
							className="mb-[2px]"
							onClick={() => {
								setIsFavorite(!isFavorite)
							}}
						/>
					) : (
						<MdOutlineStarBorder
							size={28}
							color={lightTheme.palette.text.primary}
							className="mb-[2px]"
							onClick={() => {
								setIsFavorite(!isFavorite)
							}}
						/>
					)}
				</Stack>
			</Stack>
			<PWAIndexComparisonBox />
			<PWAIndexChartBox />
			<Stack width={'100%'} height={'fit-content'} marginY={1} direction={'row'} alignItems={'center'} justifyContent={'center'} gap={1}>
				<Button
					onClick={() => {
						//changePWATradeoperation("sell")
						if (defaultIndexObject?.shortDescription) {
							changeDefaultIndex(defaultIndexObject.shortSymbol.toString())
							changeSelectedIndex(defaultIndexObject.symbol.toString())
						}
						router.push('/pwa_trade_console_defi')
					}}
					sx={{
						width: '100%',
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
						Trade
					</Typography>
				</Button>
			</Stack>
			<Stack width={'100%'} height={'fit-content'} paddingTop={5} direction={'column'} alignItems={'start'} justifyContent={'start'} gap={0.2}>
				<Typography
					variant="h6"
					sx={{
						color: lightTheme.palette.text.primary,
						fontWeight: 700,
					}}
				>
					More About {defaultIndexObject?.symbol.toString().toUpperCase()}
				</Typography>
				<Typography
					variant="body1"
					sx={{
						color: lightTheme.palette.text.primary,
						fontWeight: 500,
					}}
				>
					{isReadMore ? defaultIndexObject?.description.slice(0, 100) + '...' : defaultIndexObject?.description}
				</Typography>
				<Link
					className="w-full h-fit flex flex-row items-center justify-center"
					href=""
					onClick={(e) => {
						e.preventDefault()
						setIsReadMore(!isReadMore)
					}}
				>
					{isReadMore ? (
						<Stack width={'100%'} height={'fit-content'} direction={'row'} alignItems={'center'} justifyContent={'center'} gap={0.5} padding={0} marginTop={'0.6rem'}>
							<Typography
								variant="subtitle1"
								sx={{
									color: lightTheme.palette.gradientHeroBg,
									fontWeight: 700,
								}}
							>
								Show More
							</Typography>
							<IoChevronDownOutline color={lightTheme.palette.gradientHeroBg} size={20} />
						</Stack>
					) : (
						<Stack width={'100%'} height={'fit-content'} direction={'row'} alignItems={'center'} justifyContent={'center'} gap={0.5}>
							<Typography
								variant="subtitle1"
								sx={{
									color: lightTheme.palette.gradientHeroBg,
									fontWeight: 700,
								}}
							>
								Show Less
							</Typography>
							<IoChevronUpOutline color={lightTheme.palette.gradientHeroBg} size={20} />
						</Stack>
					)}
				</Link>
			</Stack>

			<Stack
				width={'100%'}
				height={'fit-content'}
				marginY={2}
				direction={'column'}
				alignItems={'center'}
				justifyContent={'start'}
				paddingY={'1rem'}
				paddingX={'0.8rem'}
				borderRadius={'1.2rem'}
				marginTop={'1.4rem'}
				sx={PWAGradientStack}
			>
				<Typography
					variant="h6"
					sx={{
						color: lightTheme.palette.text.primary,
						fontWeight: 700,
						width: '100%',
						textAlign: 'left',
						marginBottom: '1rem',
					}}
				>
					Key Information
				</Typography>
				<Stack width={'100%'} height={'fit-content'} direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
					<Typography
						variant="caption"
						sx={{
							color: lightTheme.palette.text.primary,
							fontWeight: 600,
						}}
					>
						Market Cap
					</Typography>
					<Typography
						variant="caption"
						sx={{
							color: '#374952',
							fontWeight: 500,
						}}
					>
						{defaultIndexObject?.mktCap ? (
							<>{FormatToViewNumber({ value: Number(defaultIndexObject?.mktCap), returnType: 'string' }) + ' ' + defaultIndexObject?.shortSymbol}</>
						) : (
							<>
								<Skeleton variant="rounded" width={100} height={12} sx={{ bgcolor: '#D4D4D4' }} />
							</>
						)}
					</Typography>
				</Stack>
				<Stack width={'100%'} height={'0.5px'} marginY={'0.8rem'} sx={{ backgroundColor: '#000000' }} />
				<Stack width={'100%'} height={'fit-content'} direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
					<Typography
						variant="caption"
						sx={{
							color: lightTheme.palette.text.primary,
							fontWeight: 600,
						}}
					>
						Market Price
					</Typography>
					<Typography
						variant="caption"
						sx={{
							color: '#374952',
							fontWeight: 500,
						}}
					>
						{defaultIndexObject?.mktPrice ? (
							<>${FormatToViewNumber({ value: Number(defaultIndexObject?.mktPrice), returnType: 'string' })}</>
						) : (
							<>
								<Skeleton variant="rounded" width={100} height={12} sx={{ bgcolor: '#D4D4D4' }} />
							</>
						)}
					</Typography>
				</Stack>
				<Stack width={'100%'} height={'0.5px'} marginY={'0.8rem'} sx={{ backgroundColor: '#000000' }} />
				<Stack width={'100%'} height={'fit-content'} direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
					<Typography
						variant="caption"
						sx={{
							color: lightTheme.palette.text.primary,
							fontWeight: 600,
						}}
					>
						24h Change
					</Typography>
					<Typography
						variant="caption"
						sx={{
							color: defaultIndexObject?.chg24h && Number(defaultIndexObject?.chg24h) < 0 ? '#F23645' : '#089981',
							fontWeight: 600,
							fontSize: '.8rem',
							backgroundColor: lightTheme.palette.pageBackground.main,
							paddingX: '0.8rem',
							paddingY: '0.2rem',
							borderRadius: '1rem',
							border: 'solid 1px rgba(37, 37, 37, 0.5)',
							boxShadow: '0px 1px 1px 1px rgba(37, 37, 37, 0.3)',
						}}
					>
						{defaultIndexObject?.chg24h ? (
							<>{defaultIndexObject?.chg24h}%</>
						) : (
							<>
								<Skeleton variant="rounded" width={100} height={12} sx={{ bgcolor: '#D4D4D4' }} />
							</>
						)}
					</Typography>
				</Stack>
				<Stack width={'100%'} height={'0.5px'} marginY={'0.8rem'} sx={{ backgroundColor: '#000000' }} />
				<Stack width={'100%'} height={'fit-content'} direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
					<Typography
						variant="caption"
						sx={{
							color: lightTheme.palette.text.primary,
							fontWeight: 600,
						}}
					>
						Token Address
					</Typography>
					<Link target="_blank" href={`https://sepolia.etherscan.io/token/${defaultIndexObject?.tokenAddress}`}>
						<Typography
							variant="caption"
							sx={{
								color: '#374952',
								fontWeight: 500,
							}}
						>
							{defaultIndexObject?.tokenAddress ? (
								<>{reduceAddress(defaultIndexObject?.tokenAddress as string)}</>
							) : (
								<>
									<Skeleton variant="rounded" width={100} height={12} sx={{ bgcolor: '#D4D4D4' }} />
								</>
							)}
						</Typography>
					</Link>
				</Stack>
				<Stack width={'100%'} height={'0.5px'} marginY={'0.8rem'} sx={{ backgroundColor: '#000000' }} />
				<Stack width={'100%'} height={'fit-content'} direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
					<Typography
						variant="caption"
						sx={{
							color: lightTheme.palette.text.primary,
							fontWeight: 600,
						}}
					>
						Managment Fees
					</Typography>
					<Typography
						variant="caption"
						sx={{
							color: '#374952',
							fontWeight: 500,
						}}
					>
						{defaultIndexObject?.managementFee ? (
							<>{defaultIndexObject?.managementFee} %</>
						) : (
							<>
								<Skeleton variant="rounded" width={100} height={12} sx={{ bgcolor: '#D4D4D4' }} />
							</>
						)}
					</Typography>
				</Stack>
			</Stack>
			<HistoryTable maxPWAHeight={false} />
			<Sheet isOpen={isSheetOpen} onClose={() => setSheetOpen(false)} snapPoints={selectedIndex == 'ANFI' ? [250, 250, 0, 0] : [370, 370, 0, 0]} initialSnap={1}>
				<Sheet.Container>
					<Sheet.Header />
					<Sheet.Content>
						<Stack direction={'column'} height={'100%'} width={'100%'} alignItems={'center'} justifyContent={'start'} paddingX={2} paddingY={1}>
							<Typography
								variant="h6"
								align="center"
								sx={{
									color: lightTheme.palette.text.primary,
									fontWeight: 700,
								}}
							>
								{defaultIndexObject?.symbol} Composition
							</Typography>

							<Stack width={'100%'} height={'fit-content'} direction={'column'} alignItems={'start'} justifyContent={'start'} marginY={3} id="haha">
								<Stack direction="column" alignItems="center" justifyContent="start" width={'100%'} gap={1.5}>
									{indexUnderlyingAssetsMap[selectedIndex]
										?.sort((a, b) => b.percentage - a.percentage)
										.map((asset, key) => {
											return (
												<Stack key={key} direction={'row'} alignItems={'center'} justifyContent={'space-between'} width={'100%'} height={'fit-content'}>
													<Stack width={'fit-content'} height={'fit-content'} direction="row" alignItems={'center'} justifyContent={'center'} gap={1}>
														<Stack key={key} padding={'4px'} marginLeft={`${(key * -1 * 3) / 2}px`} zIndex={key * 10} width={'fit-content'} borderRadius={'0.5rem'} sx={AssetChips}>
															<span className={`text-whiteText-500`}>{asset.logo}</span>
														</Stack>
														<Typography
															variant="body1"
															sx={{
																color: lightTheme.palette.text.primary,
																fontWeight: 700,
															}}
														>
															{asset.name}
														</Typography>
													</Stack>

													<Typography
														variant="body1"
														sx={{
															color: lightTheme.palette.gradientHeroBg,
															fontWeight: 600,
														}}
													>
														{asset.percentage}%
													</Typography>
												</Stack>
											)
										})}
								</Stack>
							</Stack>
						</Stack>
					</Sheet.Content>
				</Sheet.Container>
				<Sheet.Backdrop
					onTap={() => {
						setSheetOpen(false)
					}}
				/>
			</Sheet>
			<PWABottomNav />
		</Box>
	)
}
