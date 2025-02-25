import { NextRequest, NextResponse } from "next/server"
import { clearCollection } from "@/utils/MongoDbClient"

export async function GET(request: NextRequest) {
  const table = request.nextUrl.searchParams.get("table") || "AssetOverview"
  await clearCollection(table)
  return NextResponse.json({ message: `${table} collection cleared` })
}
