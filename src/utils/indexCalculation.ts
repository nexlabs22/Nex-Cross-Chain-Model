import { dataFromDatabasetype } from '@store/storeTypes'

export default function getIndexData(index: string, data: dataFromDatabasetype[]) {

	if (index === 'ANFI') {
		const ANFIData: { time: number; value: number }[] = []
		const startData = data.find((data)=>{
			return (data.btc !== null && data.xaut !== null)
		})
		const startBTCPrice = startData ? startData.btc : 0
		const startGoldPrice = startData ? startData.xaut : 0

		data.map((item) => {
			const dataObj: { time: number; value: number } = { time: 0, value: 0 }
			if (item.btc !== null && item.xaut !== null) {
				const price = (0.3 * item.btc) / startBTCPrice + (0.7 * item.xaut) / startGoldPrice
				dataObj.time = item.time
				dataObj.value = price
				ANFIData.push(dataObj)
			}
		})

		return ANFIData
	} else if (index === 'CRYPTO5') {

		const CRYPTO5Data: { time: number; value: number }[] = []	
 
		const startData = data.find((data)=>{
			return (data.btc !== null && data.eth !== null && data.bnb !== null && data.usdt !== null && data.usdc !== null)
		})

		const startBtcPrice = startData ? startData.btc : 0
		const startEthPrice = startData ? startData.eth : 0
		const startBnbPrice = startData ? startData.bnb : 0
		const startUsdtPrice = startData ? startData.usdt : 0
		const startUsdcPrice = startData ? startData.usdc : 0

		data.map((item) => {
			const dataObj: { time: number; value: number } = { time: 0, value: 0 }
			if (item.btc !== null && item.eth !== null && item.bnb !== null && item.usdt !== null && item.usdc !== null) {
				const price =
					(0.5 * item.btc) / startBtcPrice +
					(0.25 * item.eth) / startEthPrice + 
					(0.12 * item.usdt) / startUsdtPrice + 
					(0.08 * item.bnb) / startBnbPrice + 
					(0.05 * item.usdc) / startUsdcPrice
				dataObj.time = item.time
				dataObj.value = price
				CRYPTO5Data.push(dataObj)
			}
		})

		return CRYPTO5Data
	}
}
