import dataFromDatabasetype from '@store/storeTypes'

export default function getIndexData(index: string, data: dataFromDatabasetype[]) {
	if (index === 'ANFI') {
		const ANFIData: { time: number; value: number }[] = []
		const startBTCPrice = data[0] ? data[0].btc : 0
		const startGoldPrice = data[0] ? data[0].xaut : 0

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
		const startBtcPrice = data[0] ? data[0].btc : 0
		const startEthPrice = data[0] ? data[0].eth : 0
		const startBnbPrice = data[0] ? data[0].bnb : 0
		const startUsdtPrice = data[0] ? data[0].usdt : 0
		const startUsdcPrice = data[0] ? data[0].usdc : 0

		data.map((item) => {
			const dataObj: { time: number; value: number } = { time: 0, value: 0 }
			if (item.btc !== null && item.eth !== null && item.bnb !== null && item.usdt !== null && item.usdc !== null) {
				const price =
					(0.5 * item.btc) / startBtcPrice + (0.25 * item.eth) / startEthPrice + (0.12 * item.usdt) / startUsdtPrice + (0.08 * item.bnb) / startBnbPrice + (0.05 * item.usdc) / startUsdcPrice

				dataObj.time = item.time
				dataObj.value = price
				CRYPTO5Data.push(dataObj)
			}
		})

		return CRYPTO5Data
	}
}
