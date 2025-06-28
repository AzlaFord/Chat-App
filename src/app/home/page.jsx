"use client";
import { useSearchParams } from 'next/navigation';

export default function HomePage() {
  const searchParams = useSearchParams();
  const user = searchParams.get('user') || 'necunoscut';

  return (
    <main>
      <h1 className="text-2xl font-bold">Salut, {user}!</h1>
    </main>
  );
}
