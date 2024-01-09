import { NextResponse, NextRequest } from 'next/server'
import connectToSpotDb from '@/utils/connectToSpotDb';
import { QueryforIndex } from '@/constants/query';
import getANFIWeights from '@/utils/anfiWeights';
import axios from 'axios';

export async function GET(request: NextRequest, response: NextResponse) {
    const client = await connectToSpotDb()
    try {

        const tableName = 'histcomp'
        const columnName = 'bitcoin,gold,binancecoin,ethereum,ripple,solana,litecoin, dogecoin,monero,stellar,ethereumclassic,bitcoincash,cardano,eos,bitcoincashsv,chainlink,polkadot,okb'

        let query = ''
        query = QueryforIndex(tableName, columnName)
        const res = await client.query(query)
        const data = res.rows
        const anfiWeights = getANFIWeights(data);

        const symbolDetails = await axios.get("https://api.bitfinex.com/v1/symbols_details").then(res => res.data).catch((err) => { console.log(err) })

        const minimumOrderSizes = ['btcusd', 'xaut:usd'].map(pair =>
            symbolDetails.find((data: { pair: string }) => data.pair === pair)?.minimum_order_size
        );

        const dataToReturn = {
            timestamp: anfiWeights[0],
            bitcoin: {
                weight: anfiWeights[1][0].weightBtc,
                minTradeValueBitfinex: Number(minimumOrderSizes[0]) || 'N/A'
            },
            gold: {
                weight: anfiWeights[1][0].weightGold,
                minTradeValueBitfinex: Number(minimumOrderSizes[1]) || 'N/A',
            }
        }

        return NextResponse.json({ data: dataToReturn }, { status: 200 })

    } catch (error) {
        return NextResponse.json({ error }, { status: 400 })
    } finally {
        await client.end();
    }
}
