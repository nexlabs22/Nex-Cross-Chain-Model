// ------------------------------------------------------------------------------------------------

// import axios from 'axios'
// import { NextResponse } from 'next/server'
// import crypto from 'crypto'

// export async function GET() {

//   const apiKey = 'c619df8360c0cd3903fe6d8ddf7935df511fe987b6e'
//   const apiSecret = 'f4aeb3abede81124a8adc2c49dcb06e5118f2d43259'
//   const baseUrl = 'https://api.bitfinex.com'
//   const url = '/v1/balances'

//   const nonce = Date.now().toString()
//   const payload = {
//     request: url,
//     nonce
//   }
//   const payloadString = JSON.stringify(payload)
//   const encodedPayload = Buffer.from(payloadString).toString('base64')

//   const signature = crypto
//     .createHmac('sha384', apiSecret)
//     .update(encodedPayload)
//     .digest('hex')

// 	const options = {
// 		method: 'POST',
// 		url: 'https://api.bitfinex.com/v2/auth/r/wallets',
// 		headers: {
// 			accept: 'application/json',
// 			'Content-Type': 'application/json',
// 			'bfx-nonce': nonce,
// 			'bfx-apikey': apiKey,
// 			'bfx-signature': signature,
// 		},
// 		data: {},
// 	}

// 	await axios
// 		.request(options)
// 		.then(function (response) {
// 			console.log(response.data)
// 			return NextResponse.json(response.data, { status: 200 })
// 		})
// 		.catch(function (error) {
// 			console.error(error)
// 			return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
// 		})
// }

// import BFX,{WSv2} from 'bitfinex-api-node'
// import { NextResponse } from 'next/server'

// export async function GET() {
//   const apiKey = 'c619df8360c0cd3903fe6d8ddf7935df511fe987b6e'
//   const apiSecret = 'f4aeb3abede81124a8adc2c49dcb06e5118f2d43259'

//   // const bfxRest = new BFX(apiKey, apiSecretKey, { version: 1 }).rest
//   const bfxRest = new BFX({ apiKey, apiSecret })
//   const ws = new WSv2({ transform: true })
//   console.log(bfxRest)
//   console.log(ws)

//   try {
//     bfxRest.wallet_balances((err, walletBalances) => {
//       if (err) {
//         console.error('Error:', err)
//         return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
//       } else {
//         console.log('Wallet Balances:', walletBalances)
//         return NextResponse.json( walletBalances, { status: 200 })
//         // res.status(200).json(walletBalances)
//       }
//     })
//   } catch (error) {
//     console.error('Error:', error)
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
//   }
// }

import axios, { AxiosRequestConfig } from 'axios'
import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function GET() {
	const apiKey = process.env.BITFINEX_API_KEY
	const apiSecret = process.env.BITFINEX_SECRETE_KEY
	const baseUrl = 'https://api.bitfinex.com'
	const url = '/v1/balances'

	const nonce = Date.now().toString()
	const payload = {
		request: url,
		nonce,
	}
	const payloadString = JSON.stringify(payload)
	const encodedPayload = Buffer.from(payloadString).toString('base64')

	const signature = crypto.createHmac('sha384', apiSecret).update(encodedPayload).digest('hex')

	const options = {
		method: 'POST',
		url: baseUrl + url,
		headers: {
			'Content-Type': 'application/json',
			'X-BFX-APIKEY': apiKey,
			'X-BFX-PAYLOAD': encodedPayload,
			'X-BFX-SIGNATURE': signature,
		},
		data: payload,
	}

	const options2 = { method: 'GET', headers: { accept: 'application/json' } }

	await fetch('https://api-pub.bitfinex.com/v2/platform/status', options2)
		.then((response) => response.json())
		.then((response) => console.log('response---->', response))
		.catch((err) => console.error("Errorrr",err))

	try {
		const response = await axios(options)
		console.log('Response:', response.data)
		return NextResponse.json(response.data, { status: 200 })
	} catch (error) {
		console.error('Error:', error)
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
		// return res.status(500).json({ error: 'Internal Server Error' })
	}
}

// import crypto from 'crypto'
// import { NextResponse } from 'next/server'

// export async function GET() {
// 	const apiKey = 'c619df8360c0cd3903fe6d8ddf7935df511fe987b6e'
// 	const apiSecret = 'f4aeb3abede81124a8adc2c49dcb06e5118f2d43259'
// 	const apiSecretKey = 'f4aeb3abede81124a8adc2c49dcb06e5118f2d43259'
// 	const baseUrl = 'https://api.bitfinex.com'

// 	const url = '/v1/account_infos'
// 	const nonce = Date.now().toString()
// 	const completeURL = baseUrl + url
// 	const body = {
// 		request: url,
// 		nonce,
// 	}
// 	const payload = Buffer.from(JSON.stringify(body)).toString('base64')
// 	console.log(payload)

// 	const signature = crypto.createHmac('sha384', apiSecret).update(payload).digest('hex')

// 	const options = {
// 		method: 'POST',
// 		headers: {
// 			'Content-Type': 'application/json',
// 			'X-BFX-APIKEY': apiKey,
// 			'X-BFX-PAYLOAD': payload,
// 			'X-BFX-SIGNATURE': signature,
// 		},
// 		body: JSON.stringify(body),
// 	}

// 	try {
// 		console.log(completeURL, options)

// 		const BFX = require('bitfinex-api-node')
// 		// const bfxRest = new BFX(apiKey, apiSecretKey, { version: 1 }).rest
// 		const bfxRest = new BFX({apiKey, apiSecret})
// 		bfxRest.account_infos((err, res) => {
// 			if (err) console.log(err)
// 			console.log(res)
// 		})

// 		const response = await fetch(completeURL, options)
// 		const responseData = await response.json()
// 		console.log('response:', responseData)
// 		return NextResponse.json(responseData, { status: 200 })
// 		// res.status(response.status).json(responseData)
// 	} catch (error) {
// 		console.error('Error:', error)
// 		return NextResponse.json({ error: 'Internal Server Error' }, { status: 400 })
// 		// res.status(500).json({ error: 'Internal Server Error' })
// 	}
// }
