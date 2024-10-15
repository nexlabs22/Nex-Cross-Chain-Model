import { useEffect, useState, useCallback } from 'react'

import { GET_STAKING_EVENT_LOGS } from '@/uniswap/graphQuery'
import apolloIndexClient from '@/utils/apollo-client'
import { getStakeLeaderBoardData } from '@/utils/getStakeLeaderboardData'
import { useStaking } from '@/providers/StakingProvider'
import { indexDetailsType } from '@/types/nexTokenData'
import { getStakeChartData } from '@/utils/getStakeChartData'
import { LeaderBoardDataType, rawStakeDataType, StakingChartType } from '@/types/stakingTypes'

export function GetStakingDataFromGraph() {

	const [data, setData] = useState<{ stakeds: rawStakeDataType[]; unstakeds: rawStakeDataType[] }>({ stakeds: [], unstakeds: [] })

	const getStakingData = useCallback(async () => {
		try {
			const { data: dataStaking } = await apolloIndexClient.query({
				query: GET_STAKING_EVENT_LOGS,
				fetchPolicy: 'network-only',
			})

			setData(dataStaking)
		} catch (err) {
			console.log(err)
		}
	}, [])

	useEffect(() => {
		getStakingData()
	}, [getStakingData])

	function handleReload() {
		getStakingData()
	}

	return {
		data,
		reload: handleReload,
	}
}
