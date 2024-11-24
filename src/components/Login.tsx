import { useState } from 'react'
import { useRouter } from 'next/router'
import Swal from 'sweetalert2'
import translations from '../translations'

type Language = 'en' | 'es';

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [language, setLanguage] = useState<Language>('es') 
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('session', JSON.stringify(data.session))
        localStorage.setItem('user', JSON.stringify(data.user))
        router.push('/dashboard')
        Swal.fire({
          icon: 'success',
          title: translations[language].successMessage,
          text: translations[language].welcomeMessage,
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.message || translations[language].errorMessage,
        })
      }
    } catch (error) {
      console.error('Error:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: translations[language].errorMessage,
      })
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-800">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <div className="mb-4 text-right">
          <label className="mr-2 text-lg font-bold text-gray-700">
            {translations[language].language}:
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="rounded-lg border p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="es">{translations[language].btnEs}</option>
            <option value="en">{translations[language].btnEn}</option>
          </select>
        </div>
        <h2 className="mb-6 text-4xl font-bold text-gray-900">{translations[language].loginTitle}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="mb-2 block text-lg font-bold text-gray-700">
              {translations[language].email}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>
          <div className="mb-6">
            <label className="mb-2 block text-lg font-bold text-gray-700">
              {translations[language].password}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-700 py-3 px-4 text-[1.5rem] text-white hover:bg-blue-800 transition duration-300"
          >
            {translations[language].loginButton}
          </button>
        </form>
        <p className="mt-4 text-center text-lg">
          {translations[language].noAccount} <a href="/register" className="text-blue-700 hover:underline">{translations[language].register}</a>
        </p>
      </div>
    </div>
  )
}