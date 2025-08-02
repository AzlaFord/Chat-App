
import { findChatsByMessages } from "@/lib/auth"

export async function POST(request) {
  const { chatId } = await request.json()

  if (!chatId) {
    return new Response(JSON.stringify({ success: false, message: "Lipsește chatId" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    })
  }

  const result = await findChatsByMessages(chatId)

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  })
}
