"use client"
import { useState } from 'react';

export default function Login() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();

    // TODO: fă fetch POST aici
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

