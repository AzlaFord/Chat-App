import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

export default async function HomePage() {
  const cookieStore = await cookies()
  const rawToken = cookieStore.get('token')?.value
  const token = rawToken ? decodeURIComponent(rawToken) : null;
  console.log(JSON.stringify({...{token}}))
  let user = "necunoscut"
  if(token){
    try{
      const decode = jwt.verify(token,process.env.JWT_SECRET)
      user = decode.userName
    }catch(err){
      user = "invalid token"
    }
  }
  return (
    <main>
      <h1 className="text-2xl font-bold">Salut, {user}!</h1>
    </main>
  );
}
