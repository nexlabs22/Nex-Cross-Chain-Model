// example file so you can see how an api route is structured

// Import necessary modules
import { NextResponse, NextRequest } from "next/server"
import sgMail from "@sendgrid/mail"

// Set SendGrid API Key
sgMail.setApiKey(process.env.SENDGRID!)

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const body = await req.json()
    const { email, phone, query } = body

    // Define the email message
    const msg = {
      to: "info@moodglobalservices.com",
      from: "info@moodglobalservices.com", // Replace with your verified sender
      replyTo: email,
      subject: "New Query Received",
      html: `<div><h1>Query</h1><p>${query}</p><h1>Email</h1><p>${email}</p><h1>Phone</h1><p>${phone}</p></div>`,
    }

    // Send the email
    await sgMail.send(msg)

    // Return a success response
    return NextResponse.json(
      { success: true },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*", // Adjust the allowed origin as needed
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    )
  } catch (error) {
    console.error("Error sending email:", error)

    // Return an error response
    return NextResponse.json(
      { success: false, error: "Error sending email" },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*", // Adjust the allowed origin as needed
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
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
        "Access-Control-Allow-Origin": "*", // Adjust the allowed origin as needed
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    }
  )
}
