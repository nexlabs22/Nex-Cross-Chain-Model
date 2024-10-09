import { FormatToViewNumber, num } from '@/hooks/math';
import { indexDetailsType } from '@/types/nexTokenData';
import { rawStakeDataType, StakingChartType } from '@/types/stakingTypes'

export async function getStakeChartData(rawData: { stakeds: rawStakeDataType[]; unstakeds: rawStakeDataType[] }, latestPoolSize: number, selectedStakingIndex: indexDetailsType ): Promise<StakingChartType[]> {

    const combinedRawDataArray = [...rawData.stakeds, ...rawData.unstakeds].filter((obj)=>{
        return selectedStakingIndex.tokenAddress.toLowerCase() === obj.tokenAddress.toLowerCase()
    }).sort((a,b)=> Number(a.timestamp) - Number(b.timestamp))

    const uniqueArray = [...new Map(combinedRawDataArray.map(item => [item.timestamp, item])).values()]

    const chartData = uniqueArray.map((obj)=>{
        return {
            time: Number(obj.timestamp),
            value: FormatToViewNumber({value:num(obj.poolSize), returnType: 'number'}) as number
        }
    })
    const lastestTimestamp = Math.floor(new Date().getTime() / 1000)
    
    const poolSize = FormatToViewNumber({value:latestPoolSize, returnType: 'number'}) as number    

    if((chartData.length>0) && (poolSize > 0 )&& (poolSize !== chartData[chartData.length-1].value)){
        chartData.push({time: lastestTimestamp, value:latestPoolSize })
    }

    const sortedData = chartData.sort((a,b)=> a.time - b.time)
    
    return sortedData
}
