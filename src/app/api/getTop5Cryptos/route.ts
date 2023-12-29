import connectToSpotDb from '@/utils/connectToSpotDb'
import { NextResponse, NextRequest } from 'next/server'

export async function GET() {
    const client = await connectToSpotDb();
    try {
        const query = `SELECT * from top5crypto order by top5crypto desc limit 1`
        const result = await client.query(query).then((res => res.rows[0]))

        const cryptoString = result.top5;
        const cryptoArray = cryptoString.split(',');

        const dataToReturn:{[key:string]: number} = {timestamp: Number(result.timestamp)};

        cryptoArray.forEach((pair:string)=> {
            const [cryptoName, marketCap] = pair.split(':');
            dataToReturn[cryptoName] = Number(marketCap);
        });

        return NextResponse.json({ data: dataToReturn }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error }, { status: 400 })
    }finally{
        await client.end();
    }
}