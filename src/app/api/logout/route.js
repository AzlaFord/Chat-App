import { cookies } from "next/headers";

export async function POST(request) {
    const cookie = await cookies()
    cookie.delete('token')
    return new Response(JSON.stringify({message:"a mers tot token sters"}),{
        status:200,
        headers:{"Content-Type":"application/json"}
    })
}