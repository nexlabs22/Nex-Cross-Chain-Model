import { NextResponse, NextRequest } from 'next/server'
import connectToSpotDb from '@/utils/connectToSpotDb';

export async function GET() {
    const client = await connectToSpotDb()
    try {
        const queryHistcomp = 'SELECT stampsec AS time,microsoft,apple,nvidia,alphabet,amazon FROM histcomp order by stampsec'
        const indexDataHistcomp = await client.query(queryHistcomp)
        const inputArrayHistcomp = indexDataHistcomp.rows
        return NextResponse.json(inputArrayHistcomp, { status: 200 })

    } catch (err) {
        console.log(err)
        return NextResponse.json({ err }, { status: 400 })
    } finally {
        await client.end()
    }


}