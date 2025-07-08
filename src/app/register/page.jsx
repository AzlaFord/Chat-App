"use client"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from 'next/navigation'

export default function Register() {
  const [user, setUser] = useState("")
  const [pass, setPass] = useState("")
  const router = useRouter()
  const [mail,setMail] = useState("")
  const [error, setError] = useState("")

  async function submithething(e) {
    e.preventDefault()

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({email:mail, userName: user, password: pass }),
    })
    if(res.ok){
      const res2 = await fetch("/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ userName:user, password:pass }),
        credentials: "include"
      })
        const data2 = await res2.json()

      if(res2.ok){
        router.push(`/home`)
      } else {

        setError("Login failed")
      }
    }else{
      const data = await res.json()
      setError(data.message)
      console.log("nu a mers register")
    }
  }
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
        <Card>
            <CardHeader>
            <CardTitle>Register your account</CardTitle>
            <CardDescription>
                Enter your username and password to register.
            </CardDescription>
            </CardHeader>
            <CardContent>
            <form onSubmit={submithething}>
                <div className="flex flex-col gap-6">
                <div className="grid gap-3">
                    <Label htmlFor="username">Username</Label>
                    <Input
                    id="username"
                    required
                    value={user}
                    onChange={(e) => {
                      setUser(e.target.value)
                      setError("")
                    }}
                    />
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="email">Email</Label>
                    <Input
                    type="email"
                    id="email"
                    required
                    value={mail}
                    onChange={(e) => {
                      setMail(e.target.value)
                      setError("")
                    }}
                />
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="password">Password</Label>
                    <Input
                    id="password"
                    type="password"
                    required
                    value={pass}
                    onChange={(e) => {
                      setPass(e.target.value)
                      setError("")
                    }}
                    />
                </div>
                <div className="flex flex-col gap-3">
                    <Button type="submit" className="w-full">
                      Register
                    </Button>
                    <Button variant="outline" className="w-full">
                      Register with Google
                    </Button>
                </div>
                </div>
                <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                  <Link className="underline underline-offset-4" href="/login" >
                      Log in
                  </Link>
                </div>
            </form>
            {error && (
                <p className="text-red-500 text-sm mt-2">
                  {error}
                </p>
            )}
            </CardContent>
        </Card>
        </div>  
        </div></div>
  )
}
