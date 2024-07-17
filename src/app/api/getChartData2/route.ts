import { NextResponse, NextRequest } from 'next/server'
import connectToSpotDb from '@/utils/connectToSpotDb'

const symbolToColName: { [key: string]: string } = {
	GSPC: 'sandp',
	IXIC: 'nasdaq',
	DJI: 'dow',
	NYA: 'nyse',
	ASML: 'asml',
	PYPL: 'paypal',
	MSFT: 'microsoft',
	AAPL: 'apple',
	GOOGL: 'alphabet',
	AMZN: 'amazon',
	TCEHY: 'tencent',
	V: 'visa',
	TSM: 'tsmc',
	XOM: 'exxon_mob',
	UNH: 'unitedhealth_group',
	NVDA: 'nvidia',
	JNJ: 'johnson_n_johnson',
	LVMHF: 'lvmh',
	TSLA: 'tesla',
	JPM: 'jpmorgan',
	WMT: 'walmart',
	META: 'meta',
	SPY: 'spdr',
	MA: 'mastercard',
	CVX: 'chevron_corp',
	BRKA: 'berkshire_hathaway',

	GOLD: 'gold',
	CRUDEOIL: 'oil',
	COPPER: 'copper',
	LITHIUM: 'lithium',
	SILVER: 'silver',

	BTC: 'bitcoin',
	ETH: 'ethereum',
	ARB: 'arbitrum',
}

interface OHLC {
	open: number
	high: number
	low: number
	close: number
	time: number
}


export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url)
	const symbol = searchParams.get('symbol') || ''

	const client = await connectToSpotDb()
	try {
		if (!!symbolToColName[symbol]) {
			const queryHistcomp = `SELECT ${symbolToColName[symbol]}, stampsec FROM histcomp order by stampsec`
			const indexDataHistcomp = await client.query(queryHistcomp)
			const inputArrayHistcomp = indexDataHistcomp.rows

            const indexData: OHLC[] = []

			inputArrayHistcomp.forEach((item) => {
				for (const [symbol, colName] of Object.entries(symbolToColName)) {
					if (item[colName]) {
						const values = item[colName].split(',').map(parseFloat)

						let open, high, low, close

						if (values.length === 1) {
							open = high = low = close = values[0]
						} else if (values.length === 4) {
							;[open, high, low, close] = values
						}

						if (!isNaN(open) && !isNaN(high) && !isNaN(low) && !isNaN(close) && open !== null) {
							indexData.push({ time: item.stampsec, open, high, low, close })
						}
					}
				}
			})

            return NextResponse.json({ data: indexData, status: 200 })

		} else {
			const colName = symbol.toLowerCase()
			const queryNexlabs = `SELECT ${colName}, stampsec FROM nexlabindex order by stampsec`
			const indexDataNexlabs = await client.query(queryNexlabs)
			const inputArray = indexDataNexlabs.rows


			const indexData: OHLC[] = []

			inputArray.forEach((item) => {
				const time = parseInt(item.stampsec, 10)
				const value = item[colName]

				if (value !== null) {
					indexData.push({
						time: time,
						open: parseFloat(value),
						high: parseFloat(value),
						low: parseFloat(value),
						close: parseFloat(value),
					})
				}
			})

			return NextResponse.json({ data: indexData, status: 200 })
		}

			
	
	} catch (err) {
		console.log(err)
		return NextResponse.json({ err }, { status: 400 })
	} finally {
		await client.end()
	}
}
