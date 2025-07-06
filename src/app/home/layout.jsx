import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import jwt from "jsonwebtoken"
export default async function HomeLayout({ children }) {
  const cookie = await cookies()
  const token = cookie.get("token")?.value

  if (!token) {
    redirect('/login')
  }
  
  try{
    const payload = jwt.verify(token,process.env.JWT_SECRET)
  } catch{
    redirect("login")
  }


  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
