import { NextResponse, NextRequest } from 'next/server'
import connectToSpotDb from '@/utils/connectToSpotDb';

const colNameToSymbol: { [key: string]: string } = {
    "sandp": "GSPC",
    "nasdaq": "IXIC",
    "dow": "DJI",
    "nyse": "NYA",
    "asml": "ASML",
    "paypal": "PYPL",
    "microsoft": "MSFT",
    "apple": "AAPL",
    "alphabet": "GOOGL",
    "amazon": "AMZN",
    "tencent": "TCEHY",
    "visa": "V",
    "tsmc": "TSM",
    "exxon_mob": "XOM",
    "unitedhealth_group": "UNH",
    "nvidia": "NVDA",
    "johnson_n_johnson": "JNJ",
    "lvmh": "LVMHF",
    "tesla": "TSLA",
    "jpmorgan": "JPM",
    "walmart": "WMT",
    "meta": "META",
    "spdr": "SPY",
    "mastercard": "MA",
    "chevron_corp": "CVX",
    "berkshire_hathaway": "BRKA",

    "gold": "GOLD",
    "oil": "CRUDEOIL",
    "copper": "COPPER",
    "lithium": "LITHIUM",
    "silver": "SILVER",


    "bitcoin": "BTC",
    "ethereum": 'ETH',
    "arbitrum": 'ARB'

};

interface OHLC {
    open: number;
    high: number;
    low: number;
    close: number;
    time: number;
}

interface ProcessedData {
    [symbol: string]: OHLC[];
}


export async function GET() {
    const client = await connectToSpotDb()
    try {
        const queryNexlabs = 'SELECT * FROM nexlabindex order by stampsec'
        const queryHistcomp = 'SELECT * FROM histcomp order by stampsec'
        const indexDataNexlabs = await client.query(queryNexlabs)
        const indexDataHistcomp = await client.query(queryHistcomp)
        const inputArray = indexDataNexlabs.rows
        const inputArrayHistcomp = indexDataHistcomp.rows


        if (inputArray) {

            const CRYPTO5: OHLC[] = [];
            const ANFI: OHLC[] = [];
            const MAG7: OHLC[] = [];
            const ARBIn: OHLC[] = [];
            const ARBIn10: OHLC[] = [];

            inputArray.forEach(item => {
                const time = parseInt(item.stampsec, 10);

                CRYPTO5.push({
                    time: time,
                    open: parseFloat(item.crypto5),
                    high: parseFloat(item.crypto5),
                    low: parseFloat(item.crypto5),
                    close: parseFloat(item.crypto5)
                });

                if (item.anfi !== null) {
                    ANFI.push({
                        time: time,
                        open: parseFloat(item.anfi),
                        high: parseFloat(item.anfi),
                        low: parseFloat(item.anfi),
                        close: parseFloat(item.anfi),
                    });
                }

                if (item.mag7 !== null) {
                    MAG7.push({
                        time: time,
                        open: parseFloat(item.mag7),
                        high: parseFloat(item.mag7),
                        low: parseFloat(item.mag7),
                        close: parseFloat(item.mag7),
                    });
                }

                if (item.sci !== null && item.stampsec >= '1698811200') {
                    ARBIn.push({
                        time: time,
                        open: parseFloat(item.sci),
                        high: parseFloat(item.sci),
                        low: parseFloat(item.sci),
                        close: parseFloat(item.sci),
                    });
                }

                if (item.arb10 !== null) {
                    ARBIn10.push({
                        time: time,
                        open: parseFloat(item.arb10),
                        high: parseFloat(item.arb10),
                        low: parseFloat(item.arb10),
                        close: parseFloat(item.arb10),
                    });
                }
            });

            const data: ProcessedData = {};

            inputArrayHistcomp.forEach(item => {
                for (const [colName, symbol] of Object.entries(colNameToSymbol)) {
                    if (item[colName]) {
                        const values = item[colName].split(',').map(parseFloat);

                        let open, high, low, close;

                        if (values.length === 1) {
                            open = high = low = close = values[0];
                        } else if (values.length === 4) {
                            [open, high, low, close] = values;
                        }

                        if (!isNaN(open) && !isNaN(high) && !isNaN(low) && !isNaN(close)) {
                            if (!data[symbol]) {
                                data[symbol] = [];
                            }

                            data[symbol].push({ time: item.stampsec, open, high, low, close });
                        }
                    }
                }
            });

            data.CRYPTO5 = CRYPTO5
            data.ANFI = ANFI
            data.MAG7 = MAG7
            data.ARBIn = ARBIn
            data.ARBIn10 = ARBIn10

            return NextResponse.json(data, { status: 200 })
        }

    } catch (err) {
        console.log(err)
        return NextResponse.json({ err }, { status: 400 })
    } finally {
        await client.end()
    }


}