// import useTradePageStore from '@/store/tradeStore'
import axios from 'axios'

export default async function convertToUSD(tokenPrice: number){
    const wethPriceinUsd = await axios.get("https://api.coingecko.com/api/v3/simple/price?ids=weth&vs_currencies=usd")
	.then(res => res.data.weth.usd)
	.catch(err=> console.log(err))
    // const wethPriceinUsd = 2370.13

	// const {setEthUSDPrice} = useTradePageStore()
	// setEthUSDPrice(wethPriceinUsd)

    return wethPriceinUsd/tokenPrice

}