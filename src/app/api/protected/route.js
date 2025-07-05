import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

export async function GET(request) {
    const cookieStore = cookies()
    const rawToken = cookieStore.get('token')?.value
    const token = rawToken ? decodeURIComponent(rawToken) : null;

    if (!token) {
        return new Response(
        JSON.stringify({ message: "Token lipsă sau invalid" }),
        {
            status: 401,
            headers: { "Content-Type": "application/json" }
        })
    }
    try{
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        
            return new Response(
            JSON.stringify({ message: "Token valid", user: payload }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" }
            }
        )
    }catch{
        return new Response(
            JSON.stringify({ message: "Token invalid sau expirat" }),
            {
                status: 401,
                headers: { "Content-Type": "application/json" }
            }
            )
        }
    }
