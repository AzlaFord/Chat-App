export async function GET(request){
    let body
    let status
    const {searchParams} = new URL(request.url)
    const name  = searchParams.get("name") || "necunoscut"
    const age = searchParams.get("age")
    if(age){
        body = JSON.stringify({message:"Salut,",name:name,age:age});
        status = 200
    }else{
        body = JSON.stringify({error:"varsta nu e completata"})
        status =401
    }
    return new Response(
        body,
        {
        status,
        headers:{"Content-Type":"application/json"}
    })
}