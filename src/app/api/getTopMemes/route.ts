//small change
import { NextResponse, NextRequest } from 'next/server'
import TestNFT from '../../../components/TestNFT';
import { NextApiResponse } from 'next';
import axios from 'axios';

export async function GET(request: NextRequest, response: NextResponse) {
	try {
		let response = null
		response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/category?id=6051a82566fc1b42617d6dc6', {
			// params: { id: 300 },
			headers: {
				'X-CMC_PRO_API_KEY': '0122ce93-1bec-4952-a816-93920e6d03ab',
			},
		})
		return NextResponse.json(response.data)
	} catch (error) {
		console.log(error)
	}
}
