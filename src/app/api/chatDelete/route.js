import { deleteChat } from "@/lib/auth";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function DELETE(req) {
  try {
    const cookieStore = cookies();
    const tokenCookie = cookieStore.get("token");
    const token = tokenCookie?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: "Token lipsă" }, { status: 401 });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const userId = payload.userId;

    const { _id } = await req.json();
    if (!_id) {
      return NextResponse.json({ success: false, message: "ID lipsă" }, { status: 400 });
    }

    const result = await deleteChat(userId, _id);
    const status = result.success ? 200 : 403;

    return NextResponse.json(result, { status });
  } catch (err) {
    console.error("Eroare la stergere chat:", err);
    return NextResponse.json({ success: false, message: "Eroare server" }, { status: 500 });
  }
}
