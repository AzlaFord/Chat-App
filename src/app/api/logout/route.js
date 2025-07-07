import { cookies } from "next/headers";

export async function GET(request) {
    const cookie = await cookies()
    cookie.delete('token')

    return new Response(null, {
        status: 302,
        headers: { Location: '/login' },
    })}