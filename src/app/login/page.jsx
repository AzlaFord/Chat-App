"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation'

export default function Login() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter()

  async function handleSubmit(e) {
    e.preventDefault();

    const res = await fetch("/api/login", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({ userName, password })
    });

    const data = await res.json();

    if(res.ok){
        router.push(`/home?user=${userName}`);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="login"
        value={userName}
        onChange={e => setUserName(e.target.value)}
        placeholder="Login"
      />
      <input
        type="password"
        name="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  );
}

