import {createChat} from "../../lib/auth"
import { cookies } from "next/headers";
import jwt from "jsonwebtoken"

export async function POST(request) {
    const cookie = await cookies()
    const tokenCookie = cookie.get("token")
    const token = tokenCookie?.value;
    const body = await request.json()
    const {chatName} = body
    if(!token){
        return new Response(JSON.stringify({message:"tokenu nu exista nu a fost gasit"}),{
            status:400,
            headers:{"Content-Type":"application/json"}
        })
    }
    if(!chatName){
        return new Response(JSON.stringify({message:"nu exista text"}),{
            status:400,
            headers:{"Content-Type":"application/json"}
        })
    }
    try {
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            const userForCreateChat = { _id: payload.userId };
            const chat = await createChat(userForCreateChat, chatName);
    
            if (!chat.success) {
                return  Response.json({ message: "nu a fost creat mesajul" }, { status: 400 });
            }
    
            return  Response.json({ message: "mesajul a fost creat", data: chat.data });
            
    } catch (err) {
            console.error(err);
            return  Response.json({ message: "Eroare server", error: err.message }, { status: 500 });
    }
}