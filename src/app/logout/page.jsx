'use client'
import { redirect } from 'next/navigation'
import { useEffect } from 'react'

export default function logout(){

    useEffect(() => {
        if (typeof document !== 'undefined') {
            const hasToken = document.cookie.split(';').some(cookie => cookie.trim().startsWith('token='));
            if (!hasToken) {
                redirect('/login');
            }
        }
    }, []);

    function  handleLogout(){
        redirect("/api/logout")
    }

    return(<>
        <button onClick={handleLogout}>
            logout
        </button>
    </>)
    
    
}