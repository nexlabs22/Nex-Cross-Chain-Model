import { FormatToViewNumber, num } from '@/hooks/math';
import { indexDetailsType } from '@/types/nexTokenData';
import { rawStakeDataType, StakingChartType } from '@/types/stakingTypes'

export async function getStakeChartData(rawData: { stakeds: rawStakeDataType[]; unstakeds: rawStakeDataType[] }, latestPoolSize: number, selectedStakingIndex: indexDetailsType ): Promise<StakingChartType[]> {

    const combinedRawDataArray = [...rawData.stakeds, ...rawData.unstakeds].filter((obj)=>{
        return selectedStakingIndex.tokenAddress.toLowerCase() === obj.tokenAddress.toLowerCase()
    })

    const chartData = combinedRawDataArray.map((obj)=>{
        return {
            time: Number(obj.timestamp),
            value: FormatToViewNumber({value:num(obj.poolSize), returnType: 'number'}) as number
        }
    })
    const lastestTimestamp = Math.floor(new Date().getTime() / 1000)
    if(chartData.length>0){
        chartData.push({time: lastestTimestamp, value:latestPoolSize })
    }

    const sortedData = chartData.sort((a,b)=> a.time - b.time)
    
    return sortedData
}
