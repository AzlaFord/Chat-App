import { createMessage } from "../../lib/auth";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function POST(request) {
  const cookie = await cookies();
  const body = await request.json();
  const { text, chatId } = body;
  const token = cookie.get("token")?.value;

  if (!token) {
    return new Response(
      JSON.stringify({ message: "token nu exista / nu a fost gasit" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  if (!text) {
    return new Response(
      JSON.stringify({ message: "nu exista text" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  if (!chatId) {
    return new Response(
      JSON.stringify({ message: "nu exista chatId sau nu e introdus corect" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const mesaj = await createMessage(payload, text, chatId);

    if (!mesaj.success) {
      return new Response(
        JSON.stringify({ message: "nu a fost creat mesajul" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ message: "mesajul a fost creat", data: mesaj.data }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ message: "Eroare server", error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
