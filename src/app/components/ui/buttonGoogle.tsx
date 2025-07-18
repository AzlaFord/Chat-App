"use client";
import Script from "next/script";
import { useEffect } from "react";

type Props = {
  onSuccess: (id_token: string) => void;
};

export default function GoogleLoginButton({ onSuccess }: Props) {
  function handleGoogleLogin() {
    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      redirect_uri: "http://localhost:3000/api/auth/callback",
      response_type: "code",
      scope: "openid email profile",
      prompt: "select_account",
    });

  window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

  function handleCredentialResponse(response: any) {
    onSuccess(response.credential);
  }

  useEffect(() => {
    if (!(window as any).google) return;

    (window as any).google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
    });

    (window as any).google.accounts.id.renderButton(
      document.getElementById("googleSignInDiv"),
      { theme: "outline", size: "large" }
    );


    (window as any).google.accounts.id.prompt();
  }, []);

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        async
        defer
        onLoad={() => {
          console.log("✅ Google script loaded");
        }}
      />
      <button className="text-center h-10 rounded-md px-6 has-[>svg]:px-4 h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 h-9 px-4 py-2 has-[>svg]:px-3 h-10 rounded-md px-6 has-[>svg]:px-4 bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 " onClick={handleGoogleLogin}>Sign in with Google</button>
    </>
  );
}