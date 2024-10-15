import Image from 'next/image'
import Link from 'next/link'

import { Stack, Box, Typography, Button, Grid, TextField } from '@mui/material'
import { alpha, styled } from '@mui/material/styles'
import { pink, red } from '@mui/material/colors'
import Divider from '@mui/material/Divider'
import { useLandingPageStore } from '@/store/store'
import { Menu, MenuButton, MenuItem } from '@szhsin/react-menu'
import '@szhsin/react-menu/dist/index.css'
import '@szhsin/react-menu/dist/transitions/slide.css'

import mesh2 from '@assets/images/mesh2.png'
import anfiLogo from '@assets/images/anfi.png'
import cr5Logo from '@assets/images/cr5.png'
import mag7Logo from '@assets/images/mag7.png'
import arbLogo from '@assets/images/arb.png'

import { CiStickyNote } from 'react-icons/ci'
import { GoChevronDown } from 'react-icons/go'
import { CgArrowsExchangeAlt } from 'react-icons/cg'

import Switch from '@mui/material/Switch'
import { useStaking } from '@/providers/StakingProvider'
import { FormatToViewNumber, num } from '@/hooks/math'
import { useEffect } from 'react'

interface StakingConsoleProps {
	index: string
	generic: boolean
}

const PinkSwitch = styled(Switch)(({ theme }) => ({
	'& .MuiSwitch-switchBase.Mui-checked': {
		color: red[600],
		'&:hover': {
			backgroundColor: alpha(red[600], theme.palette.action.hoverOpacity),
		},
	},
	'& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
		backgroundColor: red[600],
	},
}))

const StakingConsole: React.FC<StakingConsoleProps> = ({ index, generic }) => {
	const { theme } = useLandingPageStore()
	const {
		selectedStakingIndex,
		userStakedTokenAmount,
		stakingInputAmount,
		vTokenValAsPerInputAmount,
		stakedIndexAmountInt,
		userIndexAmountInt,
		userIndexAllowanceInt,
		uservTokenAllowanceInt,
		pureRewardAmountInt,
		convertRewardAmountInt,
		uservTokenBalanceInt,
		userStakingStartTime,
		isUnStake,
		supportedRewardTokens,
		selectedRewardToken,
		epyPercentage,
		setSelectedRewardToken,
		approve,
		vTokenApprove,
		stake,
		unstake,
		setIsUnstake,
		setStakingInputAmount,
		changeStakingInputAmount,
	} = useStaking()

	const label = { inputProps: { 'aria-label': 'Switch demo' } }
	const rewardAmountString =
		selectedRewardToken.Symbol === selectedStakingIndex?.symbol
			? FormatToViewNumber({ value: pureRewardAmountInt, returnType: 'currency' }) + ' ' + index.toUpperCase()
			: FormatToViewNumber({ value: convertRewardAmountInt, returnType: 'currency' }) + ' ' + selectedRewardToken.Symbol.toUpperCase()

	return (
		<Stack
			width={'100%'}
			height={'fit-content'}
			direction={'column'}
			alignItems={'start'}
			justifyContent={'start'}
			borderRadius={'1.2rem'}
			sx={{
				border:
					index == 'ANFI'
						? 'solid 1px rgba(95,81,38,0.6)'
						: index == 'CRYPTO5'
						? 'solid 1px rgba(91,28,33,0.6)'
						: index == 'MAG7'
						? 'solid 1px rgba(104,44,119,0.6)'
						: index == 'ARBEI' || index == 'ARBIn'
						? 'solid 1px rgba(25,54,95,0.6)'
						: '',
				backgroundImage: generic
					? `url('${mesh2.src}')`
					: index == 'ANFI'
					? 'linear-gradient(#000000, #5F5126);'
					: index == 'CRYPTO5'
					? 'linear-gradient(#000000, #562C2F);'
					: index == 'MAG7'
					? 'linear-gradient(#000000, #682C77)'
					: index == 'ARBEI' || index == 'ARBIn'
					? 'linear-gradient(#000000, #112643)'
					: '',
				backgroundPosition: generic ? 'center' : '',
				backgroundSize: generic ? 'cover' : '',
				backgroundRepeat: generic ? 'no-repeat' : '',
			}}
		>
			<Stack width={'100%'} height={'fit-content'} direction={'row'} alignItems={'center'} justifyContent={'start'} gap={2} padding={3}>
				<Stack width={'fit-content'} height={'fit-content'} direction={'column'} alignItems={'start'} justifyContent={'start'}>
					<Typography
						onClick={() => {
							setIsUnstake(false)
						}}
						variant="subtitle1"
						component="h6"
						sx={{ fontWeight: 700, cursor: 'pointer' }}
					>
						Stake {index.toUpperCase()}
					</Typography>
				</Stack>
				<Stack width="fit-content" height="fit-content" direction="row" alignItems="center" justifyContent="center" gap={0.5} flexGrow={1}>
					<PinkSwitch
						checked={isUnStake}
						onChange={() => {
							setIsUnstake(!isUnStake)
						}}
					/>
				</Stack>
				<Stack width={'fit-content'} height={'fit-content'} direction={'column'} alignItems={'start'} justifyContent={'start'}>
					<Typography
						onClick={() => {
							setIsUnstake(true)
						}}
						variant="subtitle1"
						component="h6"
						sx={{ fontWeight: 700, cursor: 'pointer' }}
					>
						Unstake {index.toUpperCase()}
					</Typography>
				</Stack>
			</Stack>
			<Stack width={'100%'} height={'0.5px'} sx={{ backgroundColor: 'white' }}></Stack>
			{isUnStake && (
				<>
					<Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingY: '1rem', marginBottom: 1 }}>
						<Typography variant="subtitle2" component="label" sx={{ fontWeight: 700, color: '#D3D3D3', marginTop: '1.2rem', paddingX: 3 }}>
							Reward Type
						</Typography>
						<Stack width="fit-content" height="fit-content" direction="row" alignItems={'center'} justifyContent={'end'} gap={0.5} sx={{ paddingX: 3 }}>
							<Menu
								menuButton={
									<MenuButton>
										<div className="w-[74vw] xl:w-fit h-fit px-2 py-2 flex flex-row items-center justify-between rounded-md bg-gradient-to-tr from-colorFour-500 to-colorSeven-500 hover:to-colorSeven-500 shadow-sm shadow-blackText-500 gap-8 cursor-pointer">
											<div className="flex flex-row items-center justify-start gap-2">
												<Image src={selectedRewardToken.logo} width={25} height={25} alt={selectedRewardToken.name} />
												<h5 className="text-sm text-whiteBackground-500 titleShadow interBold uppercase">{selectedRewardToken.Symbol}</h5>
											</div>
											<GoChevronDown color="#F2F2F2" size={20} />
										</div>
									</MenuButton>
								}
								transition
								direction="bottom"
								align="end"
								className="subCatgoriesMenu"
							>
								{supportedRewardTokens.map((token, id) => {
									return (
										<div
											key={id}
											className="w-fit h-fit px-2 py-2 flex flex-row items-center justify-between gap-8 cursor-pointer hover:bg-[#7fa5b8]/50"
											onClick={() => {
												setSelectedRewardToken(token)
											}}
										>
											<div className="flex flex-row items-center justify-start gap-2">
												<Image src={token.logo} width={25} height={25} alt={token.Symbol} />
												<h5 className="text-sm text-whiteBackground-500 interMedium uppercase whitespace-nowrap">{token.Symbol}</h5>
											</div>
											<GoChevronDown className="opacity-0" color="#2A2A2A" size={20} />
										</div>
									)
								})}
							</Menu>
						</Stack>
					</Box>
					<Stack width={'100%'} height={'0.5px'} sx={{ backgroundColor: 'white' }}></Stack>
				</>
			)}

			<Stack width={'100%'} height={'fit-content'} direction={'row'} alignItems={'center'} justifyContent={'space-between'} paddingX={3} paddingY={'1.2rem'}>
				<Typography variant="subtitle2" component="label" sx={{ fontWeight: 700, color: '#D3D3D3' }}>
					{isUnStake ? 'Unlocked' : 'Locked'} Amount
				</Typography>
				<Stack width="fit-content" height="fit-content" direction="row" alignItems="center" justifyContent="end" gap={0.5}>
					<Stack
						width="fit-content"
						height="fit-content"
						paddingX={1}
						paddingY={0.3}
						borderRadius={'0.4rem'}
						onClick={() => {
							setStakingInputAmount('1')
						}}
						sx={{ backgroundColor: '#44A4A4', cursor: 'pointer' }}
					>
						<Typography
							onClick={() => {
								setStakingInputAmount('1')
							}}
							variant="caption"
							component="label"
							sx={{ fontSize: '0.8rem' }}
						>
							MIN
						</Typography>
					</Stack>
					<Stack
						width="fit-content"
						height="fit-content"
						paddingX={1}
						paddingY={0.3}
						borderRadius={'0.4rem'}
						onClick={() => {
							setStakingInputAmount(((!isUnStake ? userIndexAmountInt : stakedIndexAmountInt) / 2).toString())
						}}
						sx={{ backgroundColor: '#44A4A4', cursor: 'pointer' }}
					>
						<Typography variant="caption" component="label" sx={{ fontSize: '0.8rem' }}>
							HALF
						</Typography>
					</Stack>
					<Stack
						width="fit-content"
						height="fit-content"
						paddingX={1}
						paddingY={0.3}
						borderRadius={'0.4rem'}
						onClick={() => {
							setStakingInputAmount((!isUnStake ? userIndexAmountInt : stakedIndexAmountInt).toString())
						}}
						sx={{ backgroundColor: '#44A4A4', cursor: 'pointer' }}
					>
						<Typography variant="caption" component="label" sx={{ fontSize: '0.8rem' }}>
							MAX
						</Typography>
					</Stack>
				</Stack>
			</Stack>
			<Stack width={'100%'} height={'fit-content'} direction={'row'} alignItems={'center'} justifyContent={'start'} paddingTop={'1.2rem'} paddingBottom={'0.4rem'} paddingX={3}>
				<Stack
					width="100%"
					height={'fit-content'}
					direction={'row'}
					alignItems={'center'}
					justifyContent={'space-between'}
					borderRadius={'0.8rem'}
					border={'solid 0.5px white'}
					paddingY={1.3}
					paddingX={1.5}
				>
					<input
						type="number"
						className=" bg-transparent border-none w-10/12 h-fit p-1 interMedium outline-none text-white text-lg"
						placeholder="Enter Amount..."
						onChange={changeStakingInputAmount}
						value={stakingInputAmount}
					/>
					<Stack width="fit-content" height={'fit-content'} direction={'row'} alignItems={'center'} justifyContent={'end'} gap={1}>
						<Stack width={'1px'} height={'80%'} minHeight={'1.1rem'} sx={{ backgroundColor: 'white' }}></Stack>
						<Stack width="fit-content" height={'fit-content'} direction={'row'} alignItems={'center'} justifyContent={'start'} gap={0.5}>
							<Image src={selectedStakingIndex?.logo!} alt={index + ' logo'} height={20} width={20} className=" rounded-full" />
							<Typography variant="caption" component={'label'} sx={{ fontSize: '0.8rem' }}>
								{selectedStakingIndex?.symbol}
							</Typography>
						</Stack>
					</Stack>
				</Stack>
			</Stack>
			{(isUnStake && !!stakingInputAmount) && (
				<Typography
					variant="caption"
					component="label"
					sx={{
						fontSize: '0.7rem',
						color: '#D3D3D3',
						textAlign: 'ledt',
						width: '100%',
						paddingX: 4,
						transform: 'skewX(-10deg)',
						marginBottom: 1,
					}}
				>
					Final Amount: {`${stakingInputAmount} ${selectedStakingIndex?.symbol} + ${rewardAmountString} (as reward)`}
				</Typography>
			)}
			<Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
				{isUnStake && (
					<Typography variant="caption" component="label" sx={{ fontSize: '0.8rem', color: '#D3D3D3', textAlign: 'left', width: '100%', paddingX: 3, paddingTop: 1 }}>
						Reward Amount: <span style={{ color: '#34FFDA' }}> {rewardAmountString}</span>
					</Typography>
				)}
				<Typography variant="caption" component="label" sx={{ fontSize: '0.8rem', color: '#D3D3D3', textAlign: 'right', width: '100%', paddingX: 3, paddingTop: 1 }}>
					{!isUnStake ? 'Available:' : 'Total Staked:'}{' '}
					<span style={{ color: '#34FFDA' }}>
						{' '}
						{!isUnStake ? FormatToViewNumber({ value: userIndexAmountInt, returnType: 'currency' }) : Math.floor(stakedIndexAmountInt * 100) / 100} {index.toUpperCase()}
					</span>
				</Typography>
			</Box>
			<Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
				{isUnStake && (
					<Typography variant="caption" component="label" sx={{ fontSize: '0.8rem', color: '#D3D3D3', textAlign: 'left', width: '100%', paddingX: 3 }}>
						vToken Burn Amount:{' '}
						<span style={{ color: '#34FFDA' }}>
							{' '}
							{vTokenValAsPerInputAmount ? FormatToViewNumber({ value: vTokenValAsPerInputAmount, returnType: 'currency' }) : 0} v{index.toUpperCase()}
						</span>
					</Typography>
				)}
				<Typography variant="caption" component="label" sx={{ fontSize: '0.8rem', color: '#D3D3D3', textAlign: 'right', width: '100%', paddingX: 3, paddingBottom: 1 }}>
					vToken Balance:{' '}
					<span style={{ color: '#34FFDA' }}>
						{' '}
						{FormatToViewNumber({ value: uservTokenBalanceInt, returnType: 'currency' })} v{index.toUpperCase()}
					</span>
				</Typography>
			</Box>
			{/* <Stack width={'94%'} height={'1px'} marginX={'auto'} marginY={1} sx={{ backgroundColor: 'white' }}></Stack>
			<Stack width={'100%'} height={'fit-content'} direction={'row'} alignItems={'center'} justifyContent={'space-between'} paddingX={3} paddingTop={'0.8rem'}>
				<Typography variant="subtitle2" component="label" sx={{ fontWeight: 700, color: '#D3D3D3' }}>
					Auto Compound Rewards
				</Typography>
				<Stack width="fit-content" height="fit-content" direction="row" alignItems="center" justifyContent="end" gap={0.5}>
					<Switch {...label} color="primary" />
				</Stack>
			</Stack>
			<Typography variant="caption" component="p" sx={{ paddingX: 3, fontSize: '0.9rem', marginTop: '0.6rem', marginBottom: '1.2rem' }}>
				By Investing in Nex Token, you will get rewards in NEX token or in NEX indices tokens.
			</Typography> */}
			<Stack width={'94%'} height={'1px'} marginX={'auto'} marginY={1} sx={{ backgroundColor: 'white' }}></Stack>
			<Stack width={'100%'} height={'fit-content'} direction={'row'} alignItems={'center'} justifyContent={'space-between'} paddingX={3} paddingTop={'0.8rem'}>
				<Typography variant="subtitle2" component="label" sx={{ fontWeight: 700, color: '#D3D3D3' }}>
					Summary
				</Typography>
			</Stack>
			<Stack width={'100%'} height="fit-content" direction="column" alignItems={'start'} justifyContent={'start'} paddingX={3} paddingY={2} gap={0.5}>
				{userStakingStartTime !== 0 && (
					<Stack direction={'row'} alignItems={'center'} justifyContent={'start'} gap={1} width={'100%'}>
						<Typography variant="caption" sx={{ fontSize: '0.9rem', color: 'lightgray' }}>
							Start Date:
						</Typography>
						{/* <Typography variant="caption">{new Date().toDateString() + ' - ' + new Date().toTimeString().split('(')[0]}</Typography> */}
						<Typography variant="caption">{new Date(userStakingStartTime).toDateString() + ' - ' + new Date(userStakingStartTime).toTimeString().split('(')[0]}</Typography>
					</Stack>
				)}
				<Stack direction={'row'} alignItems={'center'} justifyContent={'start'} gap={1} width={'100%'}>
					<Typography variant="subtitle2" sx={{ fontSize: '0.9rem', color: 'lightgray' }}>
						Est. APY:
					</Typography>
					<Typography variant="caption">{FormatToViewNumber({value: epyPercentage, returnType:'percent'})}</Typography>
				</Stack>
				{/* <Stack direction={'row'} alignItems={'center'} justifyContent={'start'} gap={1} width={'100%'}>
					<Typography variant="subtitle2" sx={{ fontSize: '0.9rem', color: 'lightgray' }}>
						Est. APY:
					</Typography>
					<Typography variant="caption">{poolSizeInUsd} {index}</Typography>
				</Stack> */}
			</Stack>
			<Stack width={'94%'} height={'1px'} marginX={'auto'} marginY={1} sx={{ backgroundColor: 'white' }}></Stack>
			<Stack width="100%" height="fit-content" direction="row" alignItems={'center'} justifyContent={'center'} paddingX={3} paddingY={2}>
				<Stack
					width={'100%'}
					height="fit-content"
					borderRadius={'0.8rem'}
					paddingX={4}
					paddingY={1}
					sx={{
						background: !isUnStake ? 'rgb(95,81,38)' : 'rgb(95,56,38)',
						backgroundImage:
							index == 'ANFI'
								? !isUnStake
									? 'linear-gradient(180deg, rgba(95,81,38,1) 0%, rgba(54,46,22,1) 61%, rgba(54,46,22,1) 73%, rgba(34,29,14,1) 100%)'
									: 'linear-gradient(180deg, rgba(95,38,38,1) 0%, rgba(34,29,14,1) 100%)'
								: index == 'CRYPTO5'
								? 'linear-gradient(180deg, #562C2F 0%, #391D1F 66.5%, #341B1D 79.5%, #390004 100%)'
								: index == 'MAG7'
								? 'linear-gradient(180deg, #682C77 0%, #2A1030 100%)'
								: index == 'ARBEI' || index == 'ARBIn'
								? 'linear-gradient(180deg, #1D4275 0%, #071426 100%)'
								: '',
						boxShadow:
							index == 'ANFI'
								? '0px 0px 1.5px 6px rgba(95,81,38,0.3)'
								: index == 'CRYPTO5'
								? '0px 0px 6px 1.5px #3E2022'
								: index == 'MAG7'
								? '0px 0px 6px 1.5px #682C77'
								: index == 'ARBEI' || index == 'ARBIn'
								? '0px 0px 6px 1.5px #1E457A'
								: '',
					}}
				>
					{(!isUnStake ? userIndexAllowanceInt < Number(stakingInputAmount) : uservTokenAllowanceInt < vTokenValAsPerInputAmount) ? (
						<Typography
							variant="subtitle1"
							align="center"
							onClick={() => {
								!isUnStake ? approve() : vTokenApprove()
							}}
							sx={{ fontWeight: 700, cursor: 'pointer' }}
							component="label"
						>
							Approve
						</Typography>
					) : (
						<Typography
							variant="subtitle1"
							align="center"
							onClick={() => {
								!isUnStake ? stake() : unstake()
							}}
							sx={{ fontWeight: 700, cursor: 'pointer' }}
							component="label"
						>
							{!isUnStake ? 'Stake' : 'Unstake'}
						</Typography>
					)}
				</Stack>
			</Stack>
		</Stack>
	)
}

export default StakingConsole
