import Image from 'next/image'
import Link from 'next/link'

import { Stack, Box, Typography, Button, Grid } from '@mui/material'
import Divider from '@mui/material/Divider'
import { useLandingPageStore } from '@/store/store'

import anfiLogo from '@assets/images/anfi.png'
import cr5Logo from '@assets/images/cr5.png'
import mag7Logo from '@assets/images/mag7.png'
import arbLogo from '@assets/images/arb.png'

import { CiStickyNote } from 'react-icons/ci'
import { useStaking } from '@/providers/StakingProvider'
import { FormatToViewNumber, num } from '@/hooks/math'
import { useEffect } from 'react'

interface GenericStakingCardProps {
	index: string
}

const GenericStakingCard1: React.FC<GenericStakingCardProps> = ({ index }) => {
	const { theme } = useLandingPageStore()
	const { selectedStakingIndex, stakedIndexAmountInt, userIndexAmountInt,vTokenAmountToApprove, previewRedeemAmountInt, profitPercentage, vIndexTokenPoolSizeInt,rewardAmount, poolHoldersInt } = useStaking()

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
				backgroundImage:
					index == 'ANFI'
						? 'linear-gradient(#000000, #5F5126);'
						: index == 'CRYPTO5'
						? 'linear-gradient(#000000, #562C2F);'
						: index == 'MAG7'
						? 'linear-gradient(#000000, #682C77)'
						: index == 'ARBEI' || index == 'ARBIn'
						? 'linear-gradient(#000000, #112643)'
						: '',
			}}
		>
			<Stack width={'100%'} height={'fit-content'} direction={'row'} alignItems={'center'} justifyContent={'start'} gap={2} paddingX={4} paddingY={3}>
				<Image
					src={index == 'ANFI' ? anfiLogo : index == 'CRYPTO5' ? cr5Logo : index == 'MAG7' ? mag7Logo : index == 'ARBEI' || index == 'ARBEI' ? arbLogo : ''}
					alt={index + ' logo'}
					height={70}
					width={70}
					className=" rounded-full"
				/>
				<Stack width={'fit-content'} height={'fit-content'} direction={'column'} alignItems={'start'} justifyContent={'start'}>
					<Typography variant="subtitle1" component="h6" sx={{ fontWeight: 700 }}>
						Staking {index.toUpperCase()}
					</Typography>
					<Typography variant="caption" component="p" sx={{ color: '#D3D3D3' }}>
						Rewards are in {selectedStakingIndex?.symbol} or other NEX index products
					</Typography>
				</Stack>
			</Stack>
			<Stack width={'100%'} height={'1px'} sx={{ backgroundColor: 'white' }}></Stack>
			<Stack direction={'column'} width="100%" height="fit-content" alignItems={'start'} justifyContent={'start'} border={'none'} gap={5} paddingX={4} paddingY={3}>
				<Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'} width={'100%'} height={'fit-content'}>
					<Typography variant="caption" component="label" sx={{ color: '#D3D3D3' }}>
						{/* Available Quota */}
						Staked Amount
					</Typography>
					<Typography variant="caption" component="label">
						{FormatToViewNumber({ value: stakedIndexAmountInt, returnType: 'currency' })} {index.toUpperCase()}
					</Typography>
				</Stack>
				<Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'} width={'100%'} height={'fit-content'}>
					<Typography variant="caption" component="label" sx={{ color: '#D3D3D3' }}>
						Reward Amount
					</Typography>
					<Typography variant="caption" component="label">
						{rewardAmount < 0 ? '-' : ''}
						{FormatToViewNumber({ value: rewardAmount, returnType: 'currency' })} {index.toUpperCase()}
					</Typography>
				</Stack>
				<Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'} width={'100%'} height={'fit-content'}>
					<Typography variant="caption" component="label" sx={{ color: '#D3D3D3' }}>
						Profit Percentage
					</Typography>
					<Typography variant="caption" component="label">
						{profitPercentage === 0 ? '' : profitPercentage < 0 ? '-' : '+'}
						{FormatToViewNumber({ value: profitPercentage, returnType: 'percent' })}
					</Typography>
				</Stack>
				<Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'} width={'100%'} height={'fit-content'}>
					<Typography variant="caption" component="label" sx={{ color: '#D3D3D3' }}>
						Pool Size
					</Typography>
					<Typography variant="caption" component="label">
						{FormatToViewNumber({ value: vIndexTokenPoolSizeInt, returnType: 'string' })} {index.toUpperCase()}
					</Typography>
				</Stack>
				<Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'} width={'100%'} height={'fit-content'}>
					<Typography variant="caption" component="label" sx={{ color: '#D3D3D3' }}>
						Pool Holders
					</Typography>
					<Typography variant="caption" component="label">
						{FormatToViewNumber({ value: poolHoldersInt, returnType: 'string' })}
					</Typography>
				</Stack>
			</Stack>
			<Stack width={'100%'} height={'1px'} sx={{ backgroundColor: 'white' }}></Stack>
			<Stack direction={'row'} width="100%" height="fit-content" alignItems={'center'} justifyContent={'start'} border={'none'} gap={2} paddingX={4} paddingY={3}>
				<CiStickyNote size={50} color={theme.palette.text.primary} />
				<Typography variant="caption" component="p">
					By Investing in Nex Token, you will get rewards in NEX token or in NEX indices tokens.
				</Typography>
			</Stack>
			<Stack width={'100%'} height={'1px'} sx={{ backgroundColor: 'white' }}></Stack>
			<Stack direction={'row'} width="100%" height="fit-content" alignItems={'center'} justifyContent={'space-between'} border={'none'} gap={2} paddingX={4} paddingY={3}>
				<Stack direction={'column'}>
					<Typography variant="caption" sx={{ color: '#D3D3D3', fontSize: '0.9rem' }} component="p">
						Available Balance
					</Typography>
					<Typography variant="subtitle2" sx={{ fontWeight: 700 }} component="p">
						{FormatToViewNumber({ value: userIndexAmountInt, returnType: 'currency' })} {index.toUpperCase()}
					</Typography>
				</Stack>
				<Stack
					width={'fit-content'}
					height="fit-content"
					borderRadius={'0.8rem'}
					paddingX={4}
					paddingY={1}
					sx={{
						background: 'rgb(95,81,38)',
						backgroundImage:
							index == 'ANFI'
								? 'linear-gradient(180deg, rgba(95,81,38,1) 0%, rgba(54,46,22,1) 61%, rgba(54,46,22,1) 73%, rgba(34,29,14,1) 100%);'
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
					<Typography variant="subtitle1" sx={{ fontWeight: 700 }} component="label">
						Stake Now
					</Typography>
				</Stack>
			</Stack>
		</Stack>
	)
}

export default GenericStakingCard1
