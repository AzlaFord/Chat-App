import { register } from "./../../lib/auth";

export async function POST(request) {

    const body = await request.json()
    const {birthdate,email,userName,password} = body
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return new Response(JSON.stringify({message:"Email invalid"}),{
            status:400,
            headers:{"Content-Type":"application/json"}
        })        
    }
    
    if(!birthdate){
        return new Response(JSON.stringify({message:"nu e completat campul ziua nastere"}),{
            status:400,
            headers:{"Content-Type":"application/json"}
        })        
    }
    if(!userName || !password){
        return new Response(JSON.stringify({message:"user name gol sau parola goala"}),{
            status:400,
            headers:{"Content-Type":"application/json"}
        })
    }
    if (userName.length < 4 ) {
        return new Response(JSON.stringify({ message: "Username minim 4" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }
    if(password.length < 8){
        return new Response(JSON.stringify({ message: "parola trebuie sa aiba minim 8" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }
    const result = await register(birthdate,email,userName,password)
    
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