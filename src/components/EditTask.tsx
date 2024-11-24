import { useState } from 'react';
import Swal from 'sweetalert2';
import { useLanguage } from '../context/LanguageContext';
import translations from '../translations';

function EditTask({ taskId, initialTitle, initialContent, initialTagOne, initialTagTwo }: { taskId: string; initialTitle: string; initialContent: string; initialTagOne: string; initialTagTwo: string }) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [tagOne, setTagOne] = useState(initialTagOne);
  const [tagTwo, setTagTwo] = useState(initialTagTwo);
  const { language } = useLanguage();

  const handleEdit = async () => {
    Swal.fire({
      title: translations[language].editConfirmTitle,
      text: translations[language].editConfirmText,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: translations[language].editConfirmButton,
      cancelButtonText: translations[language].logoutCancelButton
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`/api/tasks/update?id=${taskId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, content, tagOne, tagTwo }),
          });

          if (response.ok) {
            Swal.fire(
              translations[language].editSuccessTitle,
              translations[language].editSuccessMessage,
              'success'
            ).then(() => {
              window.location.href = '/dashboard';
            });
          } else {
            const data = await response.json();
            Swal.fire('Error', data.message || translations[language].editErrorMessage, 'error');
          }
        } catch (error) {
          console.error('Error:', error);
          Swal.fire('Error', translations[language].editErrorMessage, 'error');
        }
      }
    });
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <div className="mb-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={translations[language].createTitle}
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
      </div>
      <div className="mb-4">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={translations[language].createContent}
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
      </div>
      <div className="mb-4">
        <input
          value={tagOne}
          onChange={(e) => setTagOne(e.target.value)}
          placeholder={translations[language].createTagOne}
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
      </div>
      <div className="mb-4">
        <input
          value={tagTwo}
          onChange={(e) => setTagTwo(e.target.value)}
          placeholder={translations[language].createTagTwo}
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
      </div>
      <button
        onClick={handleEdit}
        className="w-full p-2 bg-green-700 text-white rounded-lg hover:bg-green-800"
      >
        {translations[language].saveButton}
      </button>
    </div>
  );
}

export default EditTask;