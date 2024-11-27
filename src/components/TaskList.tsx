import { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import translations from '../translations';

interface Task {
  id: string;
  title: string;
  content: string;
  tagOne?: string;
  tagTwo?: string;
  column: string;
  createdAt: string;
}

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { language } = useLanguage();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const user = localStorage.getItem('user');
        if (!user) throw new Error('Usuario no encontrado en el almacenamiento local');
        const userId = JSON.parse(user).id;
        const response = await fetch(`/api/tasks/getTasks?userId=${userId}`);
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error('Error al obtener tareas:', error);
      }
    };

    fetchTasks();
  }, []);

  return (
    <table className="min-w-full bg-white text-lg mt-16">
      <thead>
        <tr>
          <th className="py-2">{translations[language].task}</th>
          <th className="py-2">{translations[language].createContent}</th>
          <th className="py-2">{translations[language].createTagOne}</th>
          <th className="py-2">{translations[language].createTagTwo}</th>
          <th className="py-2">{translations[language].state}</th>
          <th className="py-2">{translations[language].fechaCreate}</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task) => (
          <tr key={task.id}>
            <td className="border px-4 py-2 text-center">{task.title}</td>
            <td className="border px-4 py-2 text-center">{task.content}</td>
            <td className={`border px-4 py-2 text-center ${task.tagOne ? 'bg-blue-100 text-blue-800' : ''}`}>{task.tagOne}</td>
            <td className={`border px-4 py-2 text-center ${task.tagTwo ? 'bg-green-100 text-green-800' : ''}`}>{task.tagTwo}</td>
            <td className={`border px-4 py-2 text-center ${
              task.column === 'done' ? 'text-green-600' :
              task.column === 'doing' ? 'text-yellow-600' :
              task.column === 'task' ? 'text-red-600' : 'text-red-600'
            }`}>
              {task.column === 'task' ? translations[language].pending :
               task.column === 'doing' ? translations[language].doing :
               task.column === 'done' ? translations[language].done : task.column}
            </td>
            <td className="border px-4 py-2 text-center">{new Date(task.createdAt).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
} 