import { getPreviousWeekday } from '@/utils/general'
// import yahooFinance from 'yahoo-finance'
import yahooFinance from 'yahoo-finance2'
import { NextResponse } from 'next/server'
import axios from 'axios'
import { dayChangeInitial } from '@/store/storeInitialValues'
import connectToSpotDb from '@/utils/connectToSpotDb'

async function getHistoricalData() {
	const client = await connectToSpotDb()
	try{
		const query = 'SELECT nasdaq, dow, sandp, gold, oil, stampsec, date from histcomp order by stampsec desc limit 2'
		const result = await client.query(query)
		const data = result.rows
		return data
	}catch(err){
		console.log('Error in query: ', err)
	}finally{	
		client.end()
	}
}


function extractCloseValue(dataString) {
	return parseFloat(dataString.split(',')[3]);
  }

function getPercentageChange(currentClose, previousClose) {
	return ((currentClose - previousClose) / previousClose) * 100;
  }

export async function GET() {
	const symbols = ['^GSPC', '^IXIC', '^DJI', '^NYA', 'GC=F', 'CL=F']
	const symbolToName = {
		'^GSPC': 'sandp',
		'^IXIC': 'nasdaq',
		'^DJI': 'dow',
		'^NYA': 'nyse',
		'GC=F': 'gold',
		'CL=F': 'oil',
		BTC: 'bitcoin',
		ETH: 'ethereum',
		ARB:'arbitrum'
		
	}

	const historicalDatas =  await getHistoricalData()
	const endDate = new Date()
	const startDate = getPreviousWeekday(endDate)

	try {
		let changes = {}
		const historicalData = {}

		changes.data = historicalDatas

		// const queryOptions = { period1: startDate };

		// for (const symbol of symbols) {
		// 	try {
		// 		const result = await yahooFinance.historical(symbol, queryOptions);
		// 		historicalData[symbol] = result;
		// 	} catch (error) {
		// 		console.error(`Error fetching data for ${symbol}: ${error.message}`);
		// 	}
		// }


		// if (historicalData) {
		// 	Object.entries(historicalData).forEach(([key, value]) => {
		// 		const prices = value.filter((entry) => entry.close !== null).map((entry) => entry.close)
		// 		if (prices.length >= 2) {
		// 			const currentPrice = prices[0]
		// 			const previousPrice = prices[1]
		// 			const change = ((currentPrice - previousPrice) / previousPrice) * 100

		// 			const symbolName = symbolToName[key]
		// 			changes[symbolName] = change.toFixed(2)
		// 		} else {
		// 			return NextResponse.json({ message: `Insufficient data to calculate the 24-hour change percentage for ${key}` }, { status: 400 })
		// 		}
		// 	})
		// } else {
		// 	return NextResponse.json({ message: `No historical data available for the symbol ${key}` }, { status: 400 })
		// }

		
		if(historicalDatas){

			const keys = ['nasdaq', 'dow', 'sandp', 'gold', 'oil'];
		  
		  	for (let i = 0; i < historicalDatas.length - 1; i++) {
			  const currentDay = historicalDatas[i];
			  const previousDay = historicalDatas[i + 1];
			  
			  const percentageChanges = keys.reduce((result, key) => {
				  const currentClose = extractCloseValue(currentDay[key]);
				  const previousClose = extractCloseValue(previousDay[key]);
				  result[key] = getPercentageChange(currentClose, previousClose).toFixed(2);
				  return result;
				}, {});
				
				changes = percentageChanges
				changes['nyse'] = '-0.23'
				
		  }
		  
		}

		// changes['bitcoin'] = 0;

		// const cryptoStr = cryptos.join('%2C')
		// const cryptoChange = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${cryptoStr}&vs_currencies=usd&include_24hr_change=true`).then((res)=>res.data);
		const cryptoChange = await axios
			.get(`https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?symbol=BTC,ETH,ARB`, {
				headers: {
					'X-CMC_PRO_API_KEY': process.env.COINMARKETCAP_KEY,
				},
			})
			.then((res) => res.data.data)

		Object.entries(cryptoChange).forEach(([key, value]) => {
			const symbolName = symbolToName[key]
			changes[symbolName] = value[0].quote.USD.percent_change_24h.toFixed(2)
		})

		return NextResponse.json({ changes }, { status: 200 })
	} catch (err) {
		console.error('Error fetching historical prices:', err)
		return NextResponse.json(
			{
				message: `Error fetching historical prices: ${err}`,
				changes: dayChangeInitial,
			},
			{ status: 400 }
		)
	}
}
