'use client'
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function CreateChat() {
    const [text, setText] = useState("")
    const router = useRouter()

    async function createChat(chatName) {
        
        const res = await fetch('/api/createchat', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ chatName })
        })
        const data = await res.json()
        if (data?.data?._id) {
            router.push(`/home/chat/${data.data._id}`)
        } else {
            console.log("Eroare:", data)
        }
    }
    return (
        <>
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            <button onClick={() => createChat(text)}>Trimite</button>
        </>
    )
}
