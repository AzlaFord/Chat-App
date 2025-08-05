import { getuser } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("userId")

  if (!userId) {
    return NextResponse.json({ success: false, message: "Missing userId" }, { status: 400 })
  }

  const result = await getuser(userId)
  return NextResponse.json(result)
}
