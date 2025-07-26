"use client"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Script from "next/script"
export function LoginForm({
  className,
  userName,
  password,
  onUserNameChange,
  onPasswordChange,
  onSubmit,
  ...props
}) {
  const router = useRouter()
  const [token, setToken] = useState(null)

  const [error, setError] = useState(null);

  function handleCredentialResponse(response) {
    console.log("🔐 Google Sign-In response received");
    
    if (!response || !response.credential) {
      setError("Invalid Google Sign-In response");
      return;
    }

    const id_token = response.credential;
    
    fetch("/api/loginGoogle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_token }),
    })
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
      if (data.token) {
        document.cookie = `token=${data.token}; path=/;`;
        setToken(data.token);
        setError(null);
      } else {
        setError(data.message || "Login failed");
      }
    })
    .catch((error) => {
      console.error("❌ Google login error:", error);
      setError("Login failed. Please try again.");
    });
  }

  // în useEffect
  useEffect(() => {
    if (token) {
      router.push("/home")
    }
  }, [token])

  // Google script loader
  useEffect(() => {
    if (typeof window === "undefined") return;
    (window as any).handleCredentialResponse = handleCredentialResponse;
  }, []);

  return (
    <>
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Script
          src="https://accounts.google.com/gsi/client"
          async
          defer
          onLoad={() => {
            console.log("✅ Google script loaded");

            if (!(window as any).google) {
              console.error("❌ Google script not loaded properly");
              return;
            }

            const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
            
            if (!clientId || clientId === "your_google_client_id_here") {
              console.error("❌ Google Client ID not configured. Please set NEXT_PUBLIC_GOOGLE_CLIENT_ID in .env.local");
              return;
            }

            try {
              (window as any).google.accounts.id.initialize({
                client_id: clientId,
                callback: handleCredentialResponse,
              });
            } catch (error) {
              console.error("❌ Error initializing Google Sign-In:", error);
            }
          }}
        />
        <Card>
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-3">
                  <Label >Username</Label>
                  <Input
                    id="email"
                    required
                    value={userName}
                    onChange={(e) => onUserNameChange(e.target.value)}
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => onPasswordChange(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <Button type="submit" className="w-full">
                    Login
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      if ((window as any).google && (window as any).google.accounts) {
                        (window as any).google.accounts.id.prompt();
                      }
                    }}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Login with Google
                  </Button>
                  {error && (
                    <div className="text-center p-3 border border-red-200 rounded-lg bg-red-50">
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                  <Link className="underline underline-offset-4" href="/register" >
                      Sigh in
                  </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
