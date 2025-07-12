"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LoginForm } from "@/components/login-form"

export default function Login() {
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  async function handleSubmit(e) {
    e.preventDefault()

    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({ userName, password }),
      credentials: "include"
    })

    const data = await res.json()

    if(res.ok){
      router.push(`/home`)
    } else {
      console.log(data)
    }
  }

  return (
    <>
      <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <LoginForm
            userName={userName}
            password={password}
            onUserNameChange={setUserName}
            onPasswordChange={setPassword}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </>
  )
}