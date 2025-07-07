import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import jwt from "jsonwebtoken"

export default async function HomeLayout({ children }) {
  const cookie = await cookies()
  const token = cookie.get("token")?.value
  if (!token) {
    redirect('/home')
  }
  
  let payload
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET)
  } catch (err) {
    redirect('/home')
  }

  if (!payload.role || payload.role !== "admin") {
    redirect('/home')
  }
  
  return <>{children}</>
}
