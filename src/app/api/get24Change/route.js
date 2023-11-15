import getPreviousWeekday from '@/utils/general';
import yahooFinance from 'yahoo-finance';
import { NextResponse } from 'next/server';
import axios from 'axios';


export async function GET() {
    const symbols = ['^GSPC', '^IXIC', '^DJI', '^NYA', 'GC=F', 'CL=F'];
    const cryptos = ['bitcoin']
    const symbolToName = {
        "^GSPC": "sandp",
        "^IXIC": "nasdaq",
        "^DJI": "dow",
        "^NYA": "nyse",
        "GC=F": "gold",
        "CL=F": "oil",
    };
    const endDate = new Date();
    const startDate = getPreviousWeekday(endDate);

    try {
        const changes = {};
        const historicalData = await yahooFinance.historical({
            symbols: symbols,
            from: startDate.toISOString(),
            to: endDate.toISOString(),
        });

        if (historicalData) {
            Object.entries(historicalData).forEach(([key, value]) => {
                console.log(key, value);

                const prices = value.map(entry => entry.close);

                if (prices.length >= 2) {
                    const currentPrice = prices[prices.length - 1];
                    const previousPrice = prices[0];
                    const change = ((previousPrice - currentPrice) / currentPrice) * 100;

                    const symbolName = symbolToName[key];
                    changes[symbolName] = change.toFixed(2);
                } else {
                    return NextResponse.json({ message: `Insufficient data to calculate the 24-hour change percentage for ${key}` }, { status: 400 })
                }
            });
        } else {
            return NextResponse.json({ message: `No historical data available for the symbol ${key}` }, { status: 400 })
        }
        changes['bitcoin'] = 0;
        
        // const cryptoStr = cryptos.join('%2C')
        // const cryptoChange = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${cryptoStr}&vs_currencies=usd&include_24hr_change=true`).then((res)=>res.data);
		// Object.entries(cryptoChange).forEach(([key, value]) => {
		// 	changes[key] = value.usd_24h_change.toFixed(2);
		//   });

        return NextResponse.json({ changes }, { status: 200 })

    } catch (err) {
        console.error('Error fetching historical prices:', err);
        return NextResponse.json({ message: `Error fetching historical prices: ${err}` }, { status: 400 })
    }
}
