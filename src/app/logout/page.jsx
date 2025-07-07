'use client'
import { redirect } from 'next/navigation'

export default function logout(){

    function  handleLogout(){
        redirect("/api/logout")
    }

    return(<>
        <button onClick={handleLogout}>
            logout
        </button>
    </>)
    
    
}