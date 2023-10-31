//small change
import { NextResponse, NextRequest } from 'next/server'
import TestNFT from '../../../components/TestNFT'
import { NextApiResponse } from 'next'
// import {HtmlResponseComponent} from '../../../components/HtmlResponseComponent';
import { renderToStaticMarkup } from 'react-dom/server'

export async function GET(request: NextRequest, response: NextResponse) {
	try {
		const url = request.url as string
		const { searchParams } = new URL(url)

		const requestType = searchParams.get('type') ? searchParams.get('type') : 'mint'
		const requestAmount = searchParams.get('amount') ? searchParams.get('amount') : 100e18
		const requestTime = searchParams.get('time') ? searchParams.get('time') : 1698701303000
		const indexName = searchParams.get('indexName') ? searchParams.get('indexName') : 'ANFI'
		const date = new Date(requestTime as number)

		const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
            <title>Your Page Title</title>
            <style>
                .custom-card {
                    background: url('https://media.discordapp.net/attachments/981580623342862336/1166428923245121566/NEX_background_1.png?ex=654a7496&is=6537ff96&hm=8e8831a7fa9a16b5b3c6b33b045ca24b9aec4e5609411631df3281ce52ea3a9b&=&width=567&height=567') no-repeat;
                    background-size: cover;
                    width: 500px;
                    height: 500px;
                    position: relative;
                    color: #fff;
                    font-size: 20px;
                    font-weight: bold;
                }
        
                .card-content {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    text-align: center;
                }
            </style>
        </head>
        <body>
            <div class="custom-card">
                <div class="card-content">
                    <div class="font-bold text-4xl mb-2">${indexName}</div>
                    <div class="mt-4">
                        <div class="flex text-3xl items-center mt-5 justify-center gap-2">
                            <div>Type:</div>
                            <div>${requestType}</div>
                        </div>
                        <div class="flex text-3xl items-center mt-5 justify-center gap-2">
                            <div>Amount:</div>
                            <div>${Number(requestAmount) / 1e18}</div>
                        </div>
                        <div class="flex text-1xl items-center mt-5 justify-center">
                            
                            <div>${date.toUTCString()}</div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </body>
        </html>
  `
		// const html = HtmlResponseComponent();
		// const htmlContent = renderToStaticMarkup(<HtmlResponseComponent />);

		return new NextResponse(htmlContent, { status: 200, headers: { 'Content-Type': 'text/html' } })

		// return new NextResponse(
		//     C
		//     { status: 200, headers: { 'content-type': 'image/svg+xml' } }
		// )
	} catch (error) {
		console.log(error)
		return NextResponse.json({ message: 'incorrect axios combine request nftfloor', error }, { status: 404 })
	}
}

export const dynamic = 'force-dynamic'
