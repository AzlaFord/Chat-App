import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import jwt from "jsonwebtoken"

export default function LogoutLayout({ children }) {
  const cookieStore = cookies()
  const token = cookieStore.get('token')?.value

  if (!token) {
    redirect('/login')
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET)
  } catch {
    redirect('/login')
  }

  return <>{children}</>
} 