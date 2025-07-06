'use client'

import { useRouter } from 'next/navigation'


export default function logout(){
    const router = useRouter()

    async function handleLogout(){
       await fetch("http://localhost:3000/api/logout",{
            method:'POST',
        })
        router.push('/login')
    }
    return(<>
        <button onClick={handleLogout}>
            logout
        </button></>)
    
    
}