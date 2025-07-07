import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

export default async function HomePage() {
  const cookieStore = await cookies()
  const rawToken = cookieStore.get('token')?.value
  let user = "necunoscut"

  if(rawToken){
    try{
      const decode = jwt.verify(rawToken,process.env.JWT_SECRET)
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
