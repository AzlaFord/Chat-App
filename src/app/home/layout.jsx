import { redirect } from 'next/navigation'

export default async function HomeLayout({ children }) {
  const res = await fetch("http://localhost:3000/api/protected", {
    cache: 'no-store'
  })

  const data = await res.json()
  console.log(data)

  if (!data.user) { 
    redirect('/login')
  }

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
