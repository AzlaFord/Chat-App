import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return new Response("No code", { status: 400 });
  }

  const data = new URLSearchParams({
    code,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: "http://localhost:3000/api/auth/callback",
    grant_type: "authorization_code",
  });

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: data.toString(),
  });

  const tokens = await tokenRes.json();
  console.log("Google token response:", tokens);
  
  if (!tokens.id_token) {
    return new Response("Failed to get tokens", { status: 400 });
  }
  
  return NextResponse.redirect(new URL("/home", req.url));
}
