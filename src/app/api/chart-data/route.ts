import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    data: [{ name: "A", value: 100 }],
    meta: {
      message: "Data fetched successfully",
    },
  })
}
