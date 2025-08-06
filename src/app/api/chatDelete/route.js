import { deleteChat } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function DELETE(req) {
  try {
    const body = await req.json()
    const { _id } = body

    if (!_id) {
      return NextResponse.json({ success: false, message: "ID lipsă" }, { status: 400 })
    }

    const result = await deleteChat(_id)
    const status = result.success ? 200 : 404

    return NextResponse.json(result, { status })

  } catch (err) {
    console.error("❌ Eroare la ștergere chat:", err)
    return NextResponse.json({ success: false, message: "Eroare server" }, { status: 500 })
  }
}
