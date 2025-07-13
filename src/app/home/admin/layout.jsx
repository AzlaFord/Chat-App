import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import jwt from "jsonwebtoken"
import Dashboard from './dashboard'

export default async function HomeLayout({ children }) {
  const cookieStore = cookies()
  const token = cookieStore.get("token")?.value

  if (!token) {
    redirect('/home')
  }

  let payload
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET)
  } catch (err) {
    redirect('/home')
  }

  if (payload.role !== "admin") {
    redirect('/home')
  }

  return (
    <>
      <Dashboard />
      {children}
    </>
  )
}
