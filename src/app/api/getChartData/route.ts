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


    "bitcoin": "BTC"

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

            return NextResponse.json(data, { status: 200 })
        }

    } catch (err) {
        console.log(err)
        return NextResponse.json({ err }, { status: 400 })
    } finally {
        await client.end()
    }


}