"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import Script from "next/script"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BirthDatePicker } from "@/components/BirthDatePicker"

export default function Register() {
  const [user, setUser] = useState("")
  const [pass, setPass] = useState("")
  const [mail, setMail] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()



  function handleCredentialResponse(response) {
    const id_token = response.credential;

    fetch("/api/loginGoogle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_token }),
    })
      .then(res => {
        if (res.ok) {
          router.push("/home")
        } else {
          setError("Login with Google failed")
        }
      });
  }

  async function submitRegister(e) {
    e.preventDefault()

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ birthdate: birthDate, email: mail, userName: user, password: pass }),
    })

    if (res.ok) {
      const res2 = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName: user, password: pass }),
        credentials: "include"
      })

      if (res2.ok) {
        router.push("/home")
      } else {
        setError("Login failed")
      }
    } else {
      const data = await res.json()
      setError(data.message)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
      <Script
        src="https://accounts.google.com/gsi/client"
        async
        defer
        onLoad={() => {
          console.log("✅ Google script loaded");

          if (!window.google) {
            return;
          }
          
          window.google.accounts.id.initialize({
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            callback: handleCredentialResponse,
          });

          window.google.accounts.id.renderButton(
            document.getElementById("googleSignInDiv"),
            { theme: "outline", size: "large" }
          );

          window.google.accounts.id.prompt();
        }}
      />
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle>Register your account</CardTitle>
            <CardDescription>
              Enter your username and password to register.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submitRegister}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-3">
                  <Label>Username</Label>
                  <Input value={user} onChange={e => setUser(e.target.value)} />
                </div>
                <div className="grid gap-3">
                  <Label>Email</Label>
                  <Input type="email" value={mail} onChange={e => setMail(e.target.value)} />
                </div>
                <div className="grid gap-3">
                  <Label>Password</Label>
                  <Input type="password" value={pass} onChange={e => setPass(e.target.value)} />
                </div>
                <div className="grid gap-3">
                  <Label>Birthdate</Label>
                  <BirthDatePicker value={birthDate} onChange={setBirthDate} />
                </div>

                <div className="flex flex-col gap-3">
                  <Button type="submit" className="w-full">Register</Button>
                </div>
                  <div id="googleSignInDiv" className="w-full flex justify-center"></div>
                {error && <p className="text-red-500">{error}</p>}

                <div className="mt-4 text-center text-sm">
                  Already have an account? <Link href="/login" className="underline">Log in</Link>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
