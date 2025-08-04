import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return new Response(
      JSON.stringify({ message: "Token lipsă" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    return new Response(
      JSON.stringify({
        message: "Token valid",
        userId: payload.userId,
        userName: payload.userName,
        role: payload.role,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({ message: "Token invalid", error: err.message }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }
}
