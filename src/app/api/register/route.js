import { register } from "./../../lib/auth";

export async function POST(request) {

    const body = await request.json()
    const {userName,password} = body
    if(!userName || !password){
        return new Response(JSON.stringify({message:"user name gol sau parola goala"}),{
            status:422,
            headers:{"Content-Type":"application/json"}
        })
    }
    if (userName.length < 4 || password.length < 8) {
        return new Response(JSON.stringify({ message: "Username minim 4 caractere și parola minim 8" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }
    const result = await register(userName,password)
    
    if(result){
        return new Response(JSON.stringify({message:"user deja exista"}),{
            status:400,
            headers:{"Content-Type":"application/json"}
        })
    }

    return new Response(JSON.stringify({message:"creat cu success"}),{
        status:200,
        headers:{"Content-Type":"application/json"}
    })
}