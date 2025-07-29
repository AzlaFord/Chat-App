import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import jwt from "jsonwebtoken"

export default function HomeLayout({ children }) {
  const cookie = cookies()
  const token = cookie.get("token")?.value

  if (!token) {
    redirect('/api/logout')
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET)
  } catch {
    redirect("/api/logout")
  }

  return (
    <>
      {children}
    </>
  )
}
