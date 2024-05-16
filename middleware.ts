import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const { nextUrl: url, geo } = req;
  const country = req.geo?.country || 'US'; // Set default if geo is missing

  url.searchParams.set('country', country);

  return NextResponse.rewrite(url);
}