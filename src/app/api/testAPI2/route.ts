import connectToSpotDb from '@/utils/connectToSpotDb'
import { NextResponse } from 'next/server'


export async function GET() {
			const client = await connectToSpotDb()
		try{	
			const query = 'SELECT * from nexlabindex order by stampsec desc limit 1'
			// const query = `DELETE from nexlabindex where stampsec > '1714089600'`
			const rows = await client.query(query).then((res)=> res.rows[0])
			rows.date = new Date(Number(rows.stampsec)*1000).toDateString()
			return NextResponse.json({ rows }, { status: 200 })
		}catch(err){
			return NextResponse.json({ err }, { status: 400 })
		}
		
}
