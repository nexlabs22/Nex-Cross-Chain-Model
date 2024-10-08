import { ThirdwebSDK } from '@thirdweb-dev/sdk'
import { LeaderBoardDataType, rawStakeDataType } from '@/types/stakingTypes'
import { indexDetailsType } from '@/types/nexTokenData'
import { sepoliaStakingAddress } from '@/constants/contractAddresses'
import { stakingAbi, tokenAbi, vaultAbi } from '@/constants/abi'
import { num } from '@/hooks/math'
import { timeAgo } from './getTimeAgoString'

export async function getStakeLeaderBoardData(rawData: { stakeds: rawStakeDataType[]; unstakeds: rawStakeDataType[] }, selectedStakingIndex: indexDetailsType): Promise<LeaderBoardDataType[]> {
	const sdk = new ThirdwebSDK('sepolia')

	const combinedRawDataArray = [...rawData.stakeds, ...rawData.unstakeds]
	const latestStakedMap = new Map<string, rawStakeDataType>()

	combinedRawDataArray.forEach((staked) => {
		const existingEntry = latestStakedMap.get(staked.user)
        console.log(selectedStakingIndex.tokenAddress, staked.tokenAddress)

		if ((!existingEntry || staked.blockTimestamp > existingEntry.blockTimestamp) && (selectedStakingIndex.tokenAddress.toLowerCase() === staked.tokenAddress.toLowerCase())) {
			latestStakedMap.set(staked.user, staked)
		}
	})

	const uniqueUserWithLatestTimestamp = Array.from(latestStakedMap.values())

	const data = await Promise.all(
		uniqueUserWithLatestTimestamp.map(async (obj) => {
            const userAccountAddress = obj.user
			const stakingTokenContract = await sdk.getContract(selectedStakingIndex?.tokenAddress, tokenAbi)
			const stakingContract = await sdk.getContract(sepoliaStakingAddress, stakingAbi)
			const userStakedTokenAmount = await stakingContract.call('positions', [userAccountAddress, selectedStakingIndex.tokenAddress])

			const vaultTokenAddress = await stakingContract.call('tokenAddressToVaultAddress', [selectedStakingIndex.tokenAddress])
            const vaultTokenContract = await sdk.getContract(vaultTokenAddress, vaultAbi)


			const vIndexTokenPoolSize = await stakingTokenContract.call('balanceOf', [vaultTokenAddress])
            const uservTokenBalance = await vaultTokenContract.call('balanceOf', [userAccountAddress])
			const previewRedeemAmount = await vaultTokenContract.call('previewRedeem', [uservTokenBalance])
            
			const vIndexTokenPoolSizeInt = num(vIndexTokenPoolSize) || 0
			const stakedIndexAmountInt = num(userStakedTokenAmount.stakeAmount) || 0
            const previewRedeemAmountInt = num(previewRedeemAmount) || 0
            
			const userPoolSharePercentage = (stakedIndexAmountInt / vIndexTokenPoolSizeInt) * 100
            const rewardAmount = previewRedeemAmountInt - stakedIndexAmountInt
            const lastActivityString = timeAgo(Number(obj.timestamp)*1000)
            

			return {
                user: obj.user,
                timestamp: Number(obj.timestamp),
                totalStakeAmount: num(obj.totalStakedAmount),
				userPoolSharePercentage: userPoolSharePercentage,
                lastActivityString,
                rewardAmount
			}
		})
	)

    const sortedData = data.sort((a,b)=> b.totalStakeAmount - a.totalStakeAmount)

	// TotalStakedData
	// pool shared percentage
	// Reward
	// Last activity

	return sortedData;
}
