import { NextRequest, NextResponse } from "next/server"
import { clearCollection } from "@/utils/MongoDbClient"

export async function DELETE(request: NextRequest) {
  const table = request.nextUrl.searchParams.get("table")
  if (!table) {
    return NextResponse.json({ message: "Table not found" })
  }

  await clearCollection(table)
  return NextResponse.json({ message: `${table} collection cleared` })
}
