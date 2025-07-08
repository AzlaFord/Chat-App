'use client'
import { useState } from "react"

export default function CreateChat() {
    const [text, setText] = useState("")

    async function createChat(chatName) {
        
        const res = await fetch('/api/createchat', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ chatName })
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
            <button onClick={() => createChat(text)}>Trimite</button>
        </>
    )
}
// async function sendMessage(text) {
//     const res = await fetch('/api/messages', {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify({ text })
//     })
//     const data = await res.json()
//     console.log(data)
// }