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

  return (


    <>
    <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Script
          src="https://accounts.google.com/gsi/client"
          async
          defer
          onLoad={() => {
            console.log("✅ Google script loaded");

            if (!window.google) {
              console.error("❌ Google script not loaded properly");
              return;
            }

            const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
            
            if (!clientId || clientId === "your_google_client_id_here") {
              console.error("❌ Google Client ID not configured. Please set NEXT_PUBLIC_GOOGLE_CLIENT_ID in .env.local");
              const googleDiv = document.getElementById("googleSignInDiv");
              if (googleDiv) {
                googleDiv.innerHTML = `
                  <div class="text-center p-4 border border-red-200 rounded-lg bg-red-50">
                    <p class="text-red-600 text-sm">Google Sign-In not configured</p>
                    <p class="text-red-500 text-xs mt-1">Please set up Google Client ID in .env.local</p>
                  </div>
                `;
              }
              return;
            }

            try {
              window.google.accounts.id.initialize({
                client_id: clientId,
                callback: handleCredentialResponse,
              });

              window.google.accounts.id.renderButton(
                document.getElementById("googleSignInDiv"),
                { theme: "outline", size: "large" }
              );

              window.google.accounts.id.prompt();
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
                  <div id="googleSignInDiv" className="w-full flex justify-center">
                    Login with Google
                  </div>
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
