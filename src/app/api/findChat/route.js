
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { findChatsByUserId } from "@/lib/auth"

export async function GET(request) {
  const cookieStore = await cookies()
  const tokenCookie = cookieStore.get("token")
  const token = tokenCookie?.value

  if (!token) {
    return new Response(JSON.stringify({ success: false, message: "No token" }), { status: 401 })
  }

  let userId
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    userId = decoded.userId
    console.log(decoded)
  } catch {
    return new Response(JSON.stringify({ success: false, message: "Invalid token" }), { status: 401 })
  }
  
  const result = await findChatsByUserId(userId)

  return new Response(JSON.stringify(result), { status: 200 })
}
