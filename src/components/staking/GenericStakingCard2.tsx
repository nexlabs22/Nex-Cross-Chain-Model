import Image from 'next/image'
import Link from 'next/link'

import { Stack, Box, Typography, Button, Grid } from '@mui/material'
import Divider from '@mui/material/Divider'
import { useLandingPageStore } from '@/store/store'

import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { CircularProgressbarWithChildren } from 'react-circular-progressbar'
import { BsArrowRight } from 'react-icons/bs'

import anfiLogo from '@assets/images/anfi.png'
import cr5Logo from '@assets/images/cr5.png'
import mag7Logo from '@assets/images/mag7.png'
import arbLogo from '@assets/images/arb.png'

import { CiStickyNote } from 'react-icons/ci'
import { useStaking } from '@/providers/StakingProvider'
import { FormatToViewNumber } from '@/hooks/math'
import { useEffect } from 'react'

interface GenericStakingCardProps {
	index: string
}

const GenericStakingCard2: React.FC<GenericStakingCardProps> = ({ index }) => {
	const { theme } = useLandingPageStore()
	const { selectedStakingIndex, userPoolSharePercentage,vTokenAmountToApprove,vaultTokenAddress, stakedIndexAmountInt } = useStaking()


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
			<Stack width={'100%'} height={'fit-content'} direction={'row'} alignItems={'center'} justifyContent={'space-between'} gap={2} paddingX={4} paddingY={3}>
				<Stack width={'fit-content'} height={'fit-content'} direction={'column'} alignItems={'start'} justifyContent={'start'}>
					<Typography variant="subtitle1" component="h6" sx={{ fontWeight: 700 }}>
						Staking {index.toUpperCase()}
					</Typography>
					<Typography variant="caption" component="p" sx={{ color: '#D3D3D3' }}>
						Rewards are in {selectedStakingIndex?.symbol} or other NEX index products
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
					<Typography variant="subtitle1" sx={{ fontWeight: 700, whiteSpace: 'nowrap' }} component="label">
						Stake Now
					</Typography>
				</Stack>
			</Stack>
			<Stack width={'100%'} height={'1px'} sx={{ backgroundColor: 'white' }}></Stack>
			<Stack direction={'column'} alignItems={'center'} justifyContent={'center'} width={'100%'} height={'fit-content'} paddingY={4}>
				<Stack title={userPoolSharePercentage ? userPoolSharePercentage.toFixed(2)+'%': '0.00%'} width={'40%'} direction={'row'} alignItems={'center'} justifyContent={'center'} sx={{ aspectRatio: '1' }}>
					<CircularProgressbarWithChildren
						value={userPoolSharePercentage}
						strokeWidth={2}
						styles={buildStyles({
							rotation: 0.25,
							pathColor: index == 'ANFI' ? '#E8BB31' : index == 'CRYPTO5' ? '#DA3E49' : index == 'MAG7' ? '#D67DEC' : index == 'ARBEI' || index == 'ARBIn' ? '#255596' : '',
							trailColor: 'rgba(211,211,211,0.42)',
						})}
					>
						<Stack direction={'column'} alignItems={'center'} justifyContent={'center'} gap={1}>
							<Image
								src={index == 'ANFI' ? anfiLogo : index == 'CRYPTO5' ? cr5Logo : index == 'MAG7' ? mag7Logo : index == 'ARBEI' || index == 'ARBEI' ? arbLogo : ''}
								alt={index + ' logo'}
								height={100}
								width={100}
								className=" rounded-full"
							/>
							<Typography variant="caption" component="label" sx={{ fontWeight: 700 }}>
								Staked {index.toUpperCase()}
							</Typography>
						</Stack>
					</CircularProgressbarWithChildren>
				</Stack>
				<Typography variant="h6" sx={{ marginTop: '1.2rem' }}>
					{FormatToViewNumber({ value: stakedIndexAmountInt, returnType: 'currency' })}
				</Typography>
				<Typography
					variant="caption"
					sx={{
						color: index == 'ANFI' ? '#E8BB31' : '#E8BB31',
					}}
				>
					{/* $21.856,53 */}
					${FormatToViewNumber({ value: ((selectedStakingIndex?.mktPrice||0)*stakedIndexAmountInt), returnType: 'currency' })}
				</Typography>
				<Stack width={'100%'} height="fit-content" direction={'row'} alignItems={'center'} justifyContent={'center'} marginTop={'1.8rem'}>
					<Link target="_blank" href={`https://sepolia.etherscan.io/address/${vaultTokenAddress}`}>
						<Typography variant="caption">Check on Etherscan</Typography>
					</Link>
					<BsArrowRight size={20} color={theme.palette.text.primary} />
				</Stack>
			</Stack>
		</Stack>
	)
}

export default GenericStakingCard2
