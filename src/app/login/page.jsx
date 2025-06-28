"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation'

export default function Login() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter()

  async function handleSubmit(e) {
    e.preventDefault();

    const res = await fetch("/api/login", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({ login, password })
    });

    const data = await res.json();
    if(res.ok){
        router.push(`/home?user=${login}`);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="login"
        value={login}
        onChange={e => setLogin(e.target.value)}
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

