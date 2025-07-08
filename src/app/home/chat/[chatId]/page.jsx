"use client"

import { useState } from "react"
import { useParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Chat(){
    const [mesaj,setMesaj] = useState(" ")
    const { chatId } = useParams()

    async function sendMessage(text) {
        const res = await fetch('/api/messages', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ text,chatId })
        })
        const data = await res.json()
        setMesaj("")
    }
    return (<>            
        <Input
            type="text"
            value={mesaj}
            onChange={(e) => setMesaj(e.target.value)}
        />
        <Button onClick={() => sendMessage(mesaj)}>Trimite</Button>
        </>)
}
