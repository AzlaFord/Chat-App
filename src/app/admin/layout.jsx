import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import jwt from "jsonwebtoken"

export default async function HomeLayout({ children }) {
  const cookie = await cookies()
  const token = cookie.get("token")?.value
  if (!token) {
    redirect('/login')
  }

  let payload
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET)
  } catch (err) {
    redirect('/login')
  }

  if (!payload.role || payload.role !== "admin") {
    redirect('/login')
  }
  
  return <>{children}</>
}
