import { NextRequest, NextResponse } from "next/server"

export function middleware(req: NextRequest) {
  if (
    process.env.VERCEL_ENV === "production" ||
    process.env.VERCEL_ENV === "preview"
  ) {
    const authHeader = req.headers.get("authorization")
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new NextResponse("Unauthorized", {
        status: 401,
      })
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: "/api/cron/:path*",
}
