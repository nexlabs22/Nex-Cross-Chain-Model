import { useAddress, useContract, useContractRead, useContractWrite } from '@thirdweb-dev/react'
import { createContext, useContext, useEffect, useState } from 'react'
import { useDashboard } from './DashboardProvider'
import { indexObjectType } from '@/types/tradeTableTypes'
import { indexDataObjectInitial } from '@/store/storeInitialValues'
import { stakingAbi, tokenAbi, vaultAbi } from '@/constants/abi'
import Big from 'big.js'
import { GenericToast } from '@/components/GenericToast'
import { parseUnits } from 'viem'
import { num } from '@/hooks/math'
import { sepoliaStakingAddress, zeroAddress } from '@/constants/contractAddresses'
import { toast } from 'react-toastify'
import apolloIndexClient from '@/utils/apollo-client'
import { GET_STAKING_EVENT_LOGS } from '@/uniswap/graphQuery'
import { useQuery } from '@apollo/client'
import { getStakeLeaderBoardData } from '@/utils/getStakeLeaderboardData'
import { indexDetailsType } from '@/types/nexTokenData'
import { LeaderBoardDataType, StakingChartType } from '@/types/stakingTypes'
import { getStakeChartData } from '@/utils/getStakeChartData'

interface StakingContextProps {
	selectedStakingIndex: indexObjectType | undefined
	userIndexTokenBalance: any
	uservTokenBalance: any
	userIndexTokenAllowance: any
	uservTokenAllowance: any
	userStakedTokenAmount: any
	vTokenValAsPerInputAmount: any
	previewRedeemAmount: any
	vIndexTokenPoolSizeInt: number
	stakedIndexAmountInt: number
	userIndexAmountInt: number
	userIndexAllowanceInt: number
	uservTokenAllowanceInt: number
	uservTokenBalanceInt: number
	previewRedeemAmountInt: number
	profitPercentage: number
	userPoolSharePercentage: number
	poolHoldersInt: number
	userStakingStartTime: number
	pureRewardAmountInt: number
	rewardAmount: number
	isUnStake: boolean
	stakingInputAmount: string
	vTokenAmountToApprove: number
	leaderBoardData: LeaderBoardDataType[]
	stakeChartData: StakingChartType[]
	chartLineColorMapping: {[key:string]: string}
	vaultTokenAddress: `0x${string}`
	approve(): Promise<void>
	vTokenApprove(): Promise<void>
	stake(): Promise<void>
	unstake(): Promise<void>
	setIsUnstake: React.Dispatch<React.SetStateAction<boolean>>
	setStakingInputAmount: React.Dispatch<React.SetStateAction<string>>
	changeStakingInputAmount: (e: React.ChangeEvent<HTMLInputElement>) => void
	handleStakingIndexChange: (index: indexObjectType) => void
}

const StakingContext = createContext<StakingContextProps>({
	selectedStakingIndex: indexDataObjectInitial,
	userIndexTokenBalance: 0,
	uservTokenBalance: 0,
	userIndexTokenAllowance: 0,
	uservTokenAllowance: 0,
	userStakedTokenAmount: 0,
	vTokenValAsPerInputAmount: 0,
	previewRedeemAmount: 0,
	vIndexTokenPoolSizeInt: 0,
	stakedIndexAmountInt: 0,
	userIndexAmountInt: 0,
	userIndexAllowanceInt: 0,
	uservTokenAllowanceInt: 0,
	uservTokenBalanceInt: 0,
	previewRedeemAmountInt: 0,
	poolHoldersInt: 0,
	profitPercentage: 0,
	userPoolSharePercentage: 0,
	userStakingStartTime: 0,
	pureRewardAmountInt: 0,
	isUnStake: false,
	stakingInputAmount: '',
	vTokenAmountToApprove: 0,
	rewardAmount: 0,
	chartLineColorMapping:{},
	leaderBoardData: [],
	stakeChartData: [],
	vaultTokenAddress: zeroAddress,
	approve: () => Promise.resolve(),
	vTokenApprove: () => Promise.resolve(),
	stake: () => Promise.resolve(),
	unstake: () => Promise.resolve(),
	setIsUnstake: () => {},
	setStakingInputAmount: () => {},
	changeStakingInputAmount: () => {},
	handleStakingIndexChange: () => {},
})

const useStaking = () => {
	return useContext(StakingContext)
}

const StakingProvider = ({ children }: { children: React.ReactNode }) => {
	const { anfiIndexObject } = useDashboard()
	const userAccountAddress = useAddress()

	const [stakingInputAmount, setStakingInputAmount] = useState('')
	const [selectedStakingIndex, setSelectedStakingIndex] = useState(anfiIndexObject)
	const [leaderBoardData, setLeaderBoardData] = useState<LeaderBoardDataType[]>([])
	const [stakeChartData, setStakeChartData] = useState<StakingChartType[]>([])
	const [isUnStake, setIsUnstake] = useState(false)

	const stakingTokenContract = useContract(selectedStakingIndex?.tokenAddress, tokenAbi)
	const stakingContract = useContract(sepoliaStakingAddress, stakingAbi)
	const userIndexTokenBalance = useContractRead(stakingTokenContract.contract, 'balanceOf', [userAccountAddress])
	const userIndexTokenAllowance = useContractRead(stakingTokenContract.contract, 'allowance', [userAccountAddress, sepoliaStakingAddress])
	const userStakedTokenAmount = useContractRead(stakingContract.contract, 'positions', [userAccountAddress, selectedStakingIndex?.tokenAddress])
	const poolHolders = useContractRead(stakingContract.contract, 'numberOfStakersByTokenAddress', [selectedStakingIndex?.tokenAddress])
	const approveHook = useContractWrite(stakingTokenContract.contract, 'approve')
	const stakeHook = useContractWrite(stakingContract.contract, 'stake')
	const unstakeHook = useContractWrite(stakingContract.contract, 'unstake')

	const inputValueNum = new Big(stakingInputAmount || 0)
	const result = inputValueNum
	const valueWithCorrectDecimals = result.toFixed(18)

	// Convert to BigNumber using parseUnits
	const convertedValue = parseUnits(valueWithCorrectDecimals, 18)

	const getSharesToApproveHook = useContractRead(stakingContract.contract, 'getSharesToRedeemAmount', [selectedStakingIndex?.tokenAddress, userAccountAddress, convertedValue.toString()])
	const pureRewardAmountHook = useContractRead(stakingContract.contract, 'getPureRewardAmount', [selectedStakingIndex?.tokenAddress, userAccountAddress, convertedValue.toString()])

	// const vaultTokenAddress = userStakedTokenAmount.data?.vaultToken
	const vaultTokenAddress = useContractRead(stakingContract.contract,'tokenAddressToVaultAddress',[selectedStakingIndex?.tokenAddress]).data
	const vaultTokenContract = useContract(vaultTokenAddress, vaultAbi)
	const uservTokenBalance = useContractRead(vaultTokenContract.contract, 'balanceOf', [userAccountAddress])
	const uservTokenAllowance = useContractRead(vaultTokenContract.contract, 'allowance', [userAccountAddress, sepoliaStakingAddress])
	const previewRedeemAmount = useContractRead(vaultTokenContract.contract, 'previewRedeem', [uservTokenBalance.data])
	const vIndexTokenPoolSize = useContractRead(stakingTokenContract.contract, 'balanceOf', [vaultTokenAddress])
	const vTokenApproveHook = useContractWrite(vaultTokenContract.contract, 'approve')

	const stakedIndexAmountInt = num(userStakedTokenAmount.data?.stakeAmount) || 0
	const userIndexAmountInt = num(userIndexTokenBalance.data) || 0
	const userIndexAllowanceInt = num(userIndexTokenAllowance.data) || 0
	const uservTokenAllowanceInt = num(uservTokenAllowance.data) || 0
	const uservTokenBalanceInt = num(uservTokenBalance.data) || 0
	const previewRedeemAmountInt = num(previewRedeemAmount.data) || 0
	const vIndexTokenPoolSizeInt = num(vIndexTokenPoolSize.data) || 0
	const poolHoldersInt = Number(poolHolders.data) || 0
	const userStakingStartTime = Number(userStakedTokenAmount.data?.startTime * 1000) || 0
	const vTokenAmountToApprove = getSharesToApproveHook.data
	const pureRewardAmountInt = num(pureRewardAmountHook.data) || 0

	const profitPercentage = (previewRedeemAmountInt / stakedIndexAmountInt - 1) * 100 || 0
	const userPoolSharePercentage = (stakedIndexAmountInt / vIndexTokenPoolSizeInt) * 100
	const rewardAmount = previewRedeemAmountInt - stakedIndexAmountInt

	const chartLineColorMapping = {
		'ANFI': '#5D5025',
		'CRYPTO5': '#542B2E',
		'MAG7': '#662B75',
		'ARBEI': '#1B3D6C'
	}

	const { loading: loadingStaking, error: errorStaking, data: dataStaking } = useQuery(GET_STAKING_EVENT_LOGS)



	useEffect(() => {
		async function fetchLeaderboardData() {
			const dataToSet = await getStakeLeaderBoardData(dataStaking, selectedStakingIndex as indexDetailsType)
			setLeaderBoardData(dataToSet)
		}

		if (!loadingStaking && !!dataStaking) {
			fetchLeaderboardData()
		} else if (!loadingStaking && !!errorStaking) {
			console.log('Error on fetching staking data from graph: ', errorStaking)
		}
	}, [dataStaking,selectedStakingIndex,loadingStaking,errorStaking,stakeHook.isSuccess,unstakeHook.isSuccess  ])

	useEffect(() => {
		async function fetchStakingChartData() {
			const dataToSet = await getStakeChartData(dataStaking,vIndexTokenPoolSizeInt, selectedStakingIndex as indexDetailsType)
			setStakeChartData(dataToSet)
		}

		if (!loadingStaking && !!dataStaking ) {
			fetchStakingChartData()
		} else if (!loadingStaking && !!errorStaking) {
			console.log('Error on fetching staking data from graph: ', errorStaking)
		}
	}, [dataStaking,selectedStakingIndex,vIndexTokenPoolSizeInt,loadingStaking,errorStaking,stakeHook.isSuccess,unstakeHook.isSuccess  ])

	console.log({stakeChartData})

	const handleStakingIndexChange = (stakingIndex: indexObjectType) => {
		setSelectedStakingIndex(stakingIndex)
	}

	const changeStakingInputAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
		const enteredValue = e?.target?.value
		if (Number(enteredValue) != 0 && Number(enteredValue) < 0.00001) {
			GenericToast({
				type: 'error',
				message: 'Please enter the input value greater than this value...',
			})
			return
		}
		setStakingInputAmount(e?.target?.value)
	}

	useEffect(() => {
		if (approveHook.isSuccess) {
			userIndexTokenAllowance.refetch()
			approveHook.reset()
		}
	}, [approveHook.isSuccess, approveHook, userIndexTokenAllowance])
	useEffect(() => {
		if (vTokenApproveHook.isSuccess) {
			uservTokenAllowance.refetch()
			vTokenApproveHook.reset()
		}
	}, [vTokenApproveHook.isSuccess, vTokenApproveHook, uservTokenAllowance])

	useEffect(() => {
		if (stakeHook.isSuccess) {
			userIndexTokenBalance.refetch()
			userIndexTokenAllowance.refetch()
			uservTokenBalance.refetch()
			vIndexTokenPoolSize.refetch()
			previewRedeemAmount.refetch()

			stakeHook.reset()
		}
	}, [stakeHook.isSuccess, stakeHook,uservTokenBalance, vIndexTokenPoolSize, previewRedeemAmount, userIndexTokenBalance, userIndexTokenAllowance])

	useEffect(() => {
		if (stakeHook.isLoading) {
			toast.dismiss()
			GenericToast({
				type: 'loading',
				message: 'Staking...',
			})
		} else if (stakeHook.isSuccess) {
			toast.dismiss()
			GenericToast({
				type: 'success',
				message: 'Staked Successfully!',
			})
		} else if (stakeHook.isError) {
			toast.dismiss()
			GenericToast({
				type: 'error',
				message: `Staking Failed!`,
			})
		}
	}, [stakeHook.isLoading, stakeHook.isSuccess, stakeHook.isError])

	useEffect(() => {
		if (unstakeHook.isSuccess) {
			userIndexTokenBalance.refetch()
			userStakedTokenAmount.refetch()
			uservTokenBalance.refetch()
			userIndexTokenAllowance.refetch()
			uservTokenAllowance.refetch()
			previewRedeemAmount.refetch()
			vIndexTokenPoolSize.refetch()
			previewRedeemAmount.refetch()
			unstakeHook.reset()
		}
	}, [unstakeHook, userIndexTokenBalance, vIndexTokenPoolSize, previewRedeemAmount, userStakedTokenAmount, uservTokenAllowance, uservTokenBalance, userIndexTokenAllowance])

	useEffect(() => {
		if (unstakeHook.isLoading) {
			toast.dismiss()
			GenericToast({
				type: 'loading',
				message: 'Unstaking...',
			})
		} else if (unstakeHook.isSuccess) {
			toast.dismiss()
			GenericToast({
				type: 'success',
				message: 'Unstaked Successfully!',
			})
		} else if (unstakeHook.isError) {
			toast.dismiss()
			GenericToast({
				type: 'error',
				message: `Unstaking Failed!`,
			})
		}
	}, [unstakeHook.isLoading, unstakeHook.isSuccess, unstakeHook.isError])

	useEffect(() => {
		if (approveHook.isLoading) {
			toast.dismiss()
			GenericToast({
				type: 'loading',
				message: 'Approving...',
			})
		} else if (approveHook.isSuccess) {
			toast.dismiss()
			GenericToast({
				type: 'success',
				message: 'Approved Successfully!',
			})
		} else if (approveHook.isError) {
			toast.dismiss()
			GenericToast({
				type: 'error',
				message: `Approving Failed!`,
			})
		}
	}, [approveHook.isLoading, approveHook.isSuccess, approveHook.isError])

	useEffect(() => {
		if (vTokenApproveHook.isLoading) {
			toast.dismiss()
			GenericToast({
				type: 'loading',
				message: 'Approving...',
			})
		} else if (vTokenApproveHook.isSuccess) {
			toast.dismiss()
			GenericToast({
				type: 'success',
				message: 'Approved Successfully!',
			})
		} else if (vTokenApproveHook.isError) {
			toast.dismiss()
			GenericToast({
				type: 'error',
				message: `Approving Failed!`,
			})
		}
	}, [vTokenApproveHook.isLoading, vTokenApproveHook.isSuccess, vTokenApproveHook.isError])

	async function stake() {
		if (num(userIndexTokenBalance.data) < Number(stakingInputAmount)) {
			return GenericToast({
				type: 'error',
				message: `You don't have enough ${selectedStakingIndex?.symbol} balance!`,
			})
		} else if (Number(stakingInputAmount) <= 0) {
			return GenericToast({
				type: 'error',
				message: `Please enter amount you want to stake`,
			})
		}

		try {
			await stakeHook.mutateAsync({ args: [selectedStakingIndex?.tokenAddress, BigInt(convertedValue.toString())] })
		} catch (error) {
			console.log('stake error', error)
		}
	}

	async function unstake() {
		console.log(selectedStakingIndex?.symbol, selectedStakingIndex?.tokenAddress)
		if (num(userStakedTokenAmount.data?.stakeAmount) < Number(stakingInputAmount)) {
			return GenericToast({
				type: 'error',
				message: `Amount is more than total amount staked`,
			})
		} else if (Number(stakingInputAmount) <= 0) {
			return GenericToast({
				type: 'error',
				message: `Please enter amount you want to unstake`,
			})
		}

		try {
			await unstakeHook.mutateAsync({ args: [selectedStakingIndex?.tokenAddress, selectedStakingIndex?.tokenAddress, BigInt(convertedValue.toString())] })
		} catch (error) {
			console.log('stake error', error)
		}
	}

	async function approve() {
		try {
			if (num(userIndexTokenBalance.data) < Number(stakingInputAmount)) {
				return GenericToast({
					type: 'error',
					message: `You don't have enough ${selectedStakingIndex?.symbol} balance!`,
				})
			} else if (Number(stakingInputAmount) <= 0) {
				return GenericToast({
					type: 'error',
					message: `Please enter amount you want to approve`,
				})
			}
			await approveHook.mutateAsync({ args: [sepoliaStakingAddress, BigInt(convertedValue.toString())] })
		} catch (error) {
			console.log('approve error', error)
		}
	}

	// const convertedvTokenInputAmount = (num(uservTokenBalance.data) * Number(stakingInputAmount)) / num(userStakedTokenAmount.data?.stakeAmount)
	// const inputValuevTokenNum = new Big(vTokenAmountToApprove || 0)
	const vTokenValAsPerInputAmount = num(vTokenAmountToApprove)

	async function vTokenApprove() {
		// Convert to BigNumber using parseUnits
		// const convertedValue = parseUnits(vTokenValAsPerInputAmount, 18)

		try {
			if (num(userStakedTokenAmount.data?.stakeAmount) < Number(stakingInputAmount)) {
				return GenericToast({
					type: 'error',
					message: `You don't have enough v${selectedStakingIndex?.symbol} balance!`,
				})
			} else if (Number(stakingInputAmount) <= 0) {
				return GenericToast({
					type: 'error',
					message: `Please enter amount you want to approve`,
				})
			}

			await vTokenApproveHook.mutateAsync({ args: [sepoliaStakingAddress, vTokenAmountToApprove] })
		} catch (error) {
			console.log('approve error', error)
		}
	}

	const contextValue = {
		selectedStakingIndex,
		userIndexTokenBalance,
		uservTokenBalance,
		userIndexTokenAllowance,
		uservTokenAllowance,
		userStakedTokenAmount,
		stakingInputAmount,
		isUnStake,
		vaultTokenAddress,
		vTokenValAsPerInputAmount,
		previewRedeemAmount,
		vIndexTokenPoolSizeInt,
		stakedIndexAmountInt,
		userIndexAmountInt,
		userIndexAllowanceInt,
		uservTokenAllowanceInt,
		uservTokenBalanceInt,
		previewRedeemAmountInt,
		profitPercentage,
		userPoolSharePercentage,
		poolHoldersInt,
		rewardAmount,
		leaderBoardData,
		stakeChartData,
		vTokenAmountToApprove,
		userStakingStartTime,
		pureRewardAmountInt,
		chartLineColorMapping,
		approve,
		vTokenApprove,
		stake,
		unstake,
		setIsUnstake,
		setStakingInputAmount,
		changeStakingInputAmount,
		handleStakingIndexChange,
	}

	return <StakingContext.Provider value={contextValue}>{children}</StakingContext.Provider>
}

export { StakingContext, StakingProvider, useStaking }
