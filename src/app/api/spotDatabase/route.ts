import QueryCommaSplit, { QueryforIndex } from '@/constants/query';
import connectToSpotDb from '@/utils/connectToSpotDb';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from "next/server";


export async function GET(request: NextApiRequest, response: NextApiResponse) {
        const client = await connectToSpotDb()

        const url = request.url as string
        const { searchParams } = new URL(url);
        const indexName = searchParams.get("indexName") as string
        const tableName = searchParams.get("tableName") as string

        if (!indexName || typeof indexName !== 'string') {
            response.status(404).send({ message: 'no such columnName exists', indexName: indexName })
            return
        }

        try {

            let columnName = indexName
            if (indexName === 'CRYPTO5') {
                columnName = 'btc,bnb,eth,usdt,usdc'
            } else if (indexName === 'ANFI') {
                columnName = 'btc,xaut'
            }

            let query = ''
            if (indexName === 'CRYPTO5' || indexName === 'ANFI') {
                query = QueryforIndex(tableName, columnName)
            } else {
                query = QueryCommaSplit(tableName, columnName)
            }
            const res = await client.query(query);

            if (res.rows === undefined || Array.isArray(res.rows) === false || res.rows.length === 0) {
                return NextResponse.json({ message: 'no good fetch', data: res.rows },{status: 400})
            }

            return NextResponse.json(res.rows, {status: 200});

        } catch (error) {
            console.log(error)
            return NextResponse.json({ message: 'incorrect axios combine request nftfloor' }, {status: 404});
        } finally {
            await client.end()
        }
}