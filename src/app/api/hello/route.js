export async function GET(request){
    return new  Response(JSON.stringify({message:"Salut lume"}),{
        status:200,
        headers:{"Content-Type":"application/json"}
    })
}