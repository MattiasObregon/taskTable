import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { CreateTaskButton } from "./CreateTaskButton"
import Swal from 'sweetalert2';
import { useLanguage } from '../context/LanguageContext';
import translations from '../translations';

type Language = 'es' | 'en';

export function Navbar() {
  const { language, setLanguage } = useLanguage();
  const router = useRouter();
  const [userName, setUserName] = useState('Usuario');

  useEffect(() => {
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    setUserName(user ? user.name : 'Usuario');
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: translations[language].logoutConfirmTitle,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: translations[language].logoutConfirmButton,
      cancelButtonText: translations[language].logoutCancelButton,
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('session');
        localStorage.removeItem('user');
        router.push('/');
        Swal.fire(
          translations[language].logoutSuccessTitle,
          translations[language].logoutSuccessMessage,
          'success'
        )
      }
    })
  };

  return (
    <nav className="bg-blue-800 p-4 text-white flex flex-col sm:flex-row justify-between items-center rounded-[12px] shadow-lg">
      <div className="flex items-center mb-4 sm:mb-0">
        <CreateTaskButton language={language} />
        <button 
          onClick={() => router.push('/task-list')}
          className="bg-green-500 px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300"
        >
          {translations[language].taskListTitle}
        </button>
        <button 
          onClick={() => router.push('/dashboard')}
          className="bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300 ml-2"
        >
          {translations[language].dashboardTitle}
        </button>
        <span className="ml-4 text-[18px] font-bold">{userName}</span>
      </div>
      <h1 className="text-xl sm:text-2xl font-bold">{translations[language].appName}</h1>
      <div className="flex items-center mt-4 sm:mt-0">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
          className="mr-4 rounded-lg border p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
        >
          <option value="es">{translations[language].btnEs}</option>
          <option value="en">{translations[language].btnEn}</option>
        </select>
        <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300">
          {translations[language].logoutButton}
        </button>
      </div>
    </nav>
  );
} 