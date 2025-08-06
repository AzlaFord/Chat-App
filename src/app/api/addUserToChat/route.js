import {addUser} from "../../lib/auth"

export async function POST(request) {
    const body = await request.json()
    const {chatId, userId} = body

    if(!userId){
        return new Response(JSON.stringify({message:"nu exista userId"}),{
            status:400,
            headers:{"Content-Type":"application/json"}
        })
    }
    if(!chatId){
        return new Response(JSON.stringify({message:"nu exista Chatu-ul"}),{
            status:400,
            headers:{"Content-Type":"application/json"}
        })
    }

    try {
            const addUse = await addUser(chatId, userId);
    
            if (!addUse.success) {
                return new Response(JSON.stringify({ message: "nu a fost creat mesajul" }), {
                    status: 400,
                    headers: { "Content-Type": "application/json" }
                });

            }
    
            return new Response(JSON.stringify({ message: "mesajul a fost creat", data: addUse.data }), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });

    } catch (err) {
        return new Response(JSON.stringify({message:"ceva nu a mers bine"}),{
                status:400,
                headers:{"Content-Type":"application/json"}
        }) 
    }    
}