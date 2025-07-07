'use client'
import { useState } from "react"

export default function Chat() {
    const [text, setText] = useState("")

    async function sendMessage(text) {
        console.log("text trimis:", text)

        const res = await fetch('/api/messages', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ text })
        })
        const data = await res.json()
        console.log(data)
    }

    return (
        <>
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            <button onClick={() => sendMessage(text)}>Trimite</button>
        </>
    )
}
