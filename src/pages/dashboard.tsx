import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Board } from "@/components/Board"
export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('session');
    if (!token) {
      router.push('/');
    }
  }, [router]);

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-blue-500 to-indigo-400">
      <main className='min-h-screen ml-2 md:ml-8 pt-16 items-center px-[5vw] shadow-black shadow-sm mt-6 rounded-[3rem] bg-white w-[186rem]'>
        <Board />
      </main>
    </div>
  )
}