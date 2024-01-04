import { NextResponse, NextRequest } from 'next/server'
import sgMail from '@sendgrid/mail'
sgMail.setApiKey(process.env.SENDGRID!)

export async function POST(req: NextRequest) {
	try {
		const body = await req.json()
		const { email, phone, query } = body

		const msg = {
			to: 'info@moodglobalservices.com',
			from: 'info@moodglobalservices.com', // Replace with your verified sender
			replyTo: email,
			subject: 'New Query Received',
			html: `<div><h1>Query</h1><p>${query}</p><h1>Email</h1><p>${email}</p><h1>Phone</h1><p>${phone}</p></div>`,
		}

		await sgMail.send(msg)

		return NextResponse.json(
			{ success: true },
			{
				status: 200,
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
					'Access-Control-Allow-Headers': 'Content-Type, Authorization',
				},
			}
		)
	} catch (error) {
		console.error('Error sending email:', error)

		return NextResponse.json(
			{ success: false, error: 'Error sending email' },
			{
				status: 500,
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
					'Access-Control-Allow-Headers': 'Content-Type, Authorization',
				},
			}
		)
	}
}

export async function OPTIONS() {
	return NextResponse.json(
		{},
		{
			status: 200,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
				'Access-Control-Allow-Headers': 'Content-Type, Authorization',
			},
		}
	)
}
