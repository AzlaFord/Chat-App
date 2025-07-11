import {authLoginGoogle} from "../../lib/auth"

export async function POST(request) {
    const body = await request.json();
    const { id_token } = body;
    if(!id_token){
        return new Response(JSON.stringify({message:"nu exista tokenul"}),{
            status:400,
            headers:{"Content-Type":"application/json"}
        })
    }
    const result = await authLoginGoogle(id_token)

    if (!result.success) {
    return new Response(
        JSON.stringify({ message: result.message || "eroare la login" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
    );
    }    

    return new Response(
    JSON.stringify({
        message: "autentificat corect",
        token: result.token,
        user: result.user
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
    );
}