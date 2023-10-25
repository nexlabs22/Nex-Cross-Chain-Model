
//small change
import { NextResponse, NextRequest } from 'next/server'
import TestNFT from '../../../components/TestNFT';
import { NextApiResponse } from 'next';

export async function GET(request: NextRequest, response: NextResponse) {


	try {

        const url = request.url as string
	    const { searchParams } = new URL(url)
        
	    const requestType = searchParams.get('type') ? searchParams.get('type') : 'mint'
	    const requestAmount = searchParams.get('amount') ? searchParams.get('amount') : 100e18
	    const requestTime = searchParams.get('time') ? searchParams.get('time') : 1697687662

	
        


        const oldSvg = `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="lightgray" />
        <text x="50%" y="30%" dominant-baseline="middle" text-anchor="middle" font-size="16">
        requestType:
        ${requestType}
        </text>
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="16">
        Amount:
        ${Number(requestAmount)/1e18}
        </text>
        <text x="50%" y="70%" dominant-baseline="middle" text-anchor="middle" font-size="16">
        Time:
        ${requestTime}
        </text>
        </svg>`
		
	

    return new NextResponse(
        oldSvg,
        { status: 200, headers: { 'content-type': 'image/svg+xml' } }
    )
        
	} catch (error) {
		console.log(error)
		return NextResponse.json({ message: 'incorrect axios combine request nftfloor', error }, { status: 404 })
	}
}

export const dynamic = 'force-dynamic'
