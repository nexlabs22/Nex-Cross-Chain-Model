import { NextResponse, NextRequest } from 'next/server'
import connectToSpotDb from '@/utils/connectToSpotDb';
import { QueryforIndex } from '@/constants/query';
import getANFIWeights from '@/utils/anfiWeights';

interface AnfiWeightObjType {
    date: string;
    weightBtc: number;
    weightGold: number;
    priceBtc: number;
    priceGold: number;
}

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
        
        const dataToReturn = {
            timestamp: anfiWeights[0],
            weightBtc: anfiWeights[1][0].weightBtc,
            weightGold: anfiWeights[1][0].weightGold
        }

        return NextResponse.json({ data: dataToReturn }, { status: 200 })

    } catch (error) {
        return NextResponse.json({ error }, { status: 400 })
    } finally {
        await client.end();
    }
}
