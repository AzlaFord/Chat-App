import { findChat } from "@/lib/mongo/findChat" 
import { NextResponse } from "next/server"

export async function POST(req) {
  const body = await req.json()
  const { userId, chatName } = body

  const result = await findChat(userId, chatName)
  return NextResponse.json(result)
}
