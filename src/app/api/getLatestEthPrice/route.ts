import { NextResponse, NextRequest } from 'next/server'
import connectToSpotDb from '@/utils/connectToSpotDb';

export async function GET() {
    const client = await connectToSpotDb()
    try {
        const queryToGetPrice = 'SELECT  ethereum as price, date from histcomp order by stampsec desc limit 1'
        const indexDataHistcomp = await client.query(queryToGetPrice).then((res)=>res.rows[0])
        return NextResponse.json(indexDataHistcomp, { status: 200 })

    } catch (err) {
        console.log(err)
        return NextResponse.json({ err }, { status: 400 })
    } finally {
        await client.end()
    }

}