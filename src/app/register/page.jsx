"use client"

import { useState } from "react"

export default function register(){

    const [user,setUser] = useState("")
    const [pass,setPass] = useState("")

    async function submithething(e){
        e.preventDefault()

        const res = await fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userName: user, password: pass }),
        });
    }

    return (
    <>
        <form onSubmit={submithething}>
            <input onChange={(e) =>setUser(e.target.value)} type="text" name="userName" />
            <input onChange={(e) => setPass(e.target.value)} type="password" name="password" />
            <button
             type="submit"
            >Inregistreazate</button>
        </form>

    
    </>
    )
}