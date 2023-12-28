import { getPreviousWeekday } from '@/utils/general';
import yahooFinance from 'yahoo-finance';

export default async function get24hDayChangePer() {
    const symbols = ['^GSPC', '^IXIC', '^DJI', '^NYA', 'GC=F', 'CL=F'];
    const symbolToName = {
        "^GSPC": "sandp",
        "^IXIC": "nasdaq",
        "^DJI" : "dow",
        "^NYA" : "nyse",
        "GC=F" : "gold",
        "CL=F" : "oil",
    };
    const endDate = new Date();
    const startDate = getPreviousWeekday(endDate);

    try {
        const changes = {};

        for (const symbol of symbols) {
            const quotes = await yahooFinance.historical({
                symbols: [symbol],
                from: startDate.toISOString(),
                to: endDate.toISOString(),
            });

            const historicalData = quotes[symbol];

            if (historicalData) {
                const prices = historicalData.map(entry => entry.close);

                if (prices.length >= 2) {
                    const currentPrice = prices[prices.length - 1];
                    const previousPrice = prices[0];
                    const change = ((previousPrice - currentPrice) / currentPrice) * 100;

                    const symbolName = symbolToName[symbol];
                    changes[symbolName] = change.toFixed(2);
                } else {
                    console.log(`Insufficient data to calculate the 24-hour change percentage for ${symbol}`);
                }
            } else {
                console.log(`No historical data available for the symbol ${symbol}`);
            }
        }

        return changes;

    } catch (err) {
        console.error('Error fetching historical prices:', err);
    }
}
