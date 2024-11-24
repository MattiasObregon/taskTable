import { useEffect, useState } from 'react';
import {Column} from '@/components/Column'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import { resetServerContext } from 'react-beautiful-dnd';
import { Navbar } from './Navbar';
import Swal from 'sweetalert2';
import translations from '../translations';
import { useLanguage } from '../context/LanguageContext';

type ColumnKey = 'task' | 'doing' | 'done';

interface Task {
  id: string;
  title: string;
  content: string;
  tagOne?: string;
  tagTwo?: string;
  column: string;
}

export function Board() {
  const { language } = useLanguage();

  type ColumnType = {
    id: string;
    list: Task[];
  };

  const initialColumns: Record<ColumnKey, ColumnType> = {
    task: {
      id: 'task',
      list: []
    },
    doing: {
      id: 'doing',
      list: []
    },
    done: {
      id: 'done',
      list: []
    }
  };
  const [columns, setColumns] = useState<Record<ColumnKey, ColumnType>>(initialColumns);
  
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const user = localStorage.getItem('user');
        if (!user) throw new Error('Usuario no encontrado en el almacenamiento local');
        const userId = JSON.parse(user).id;
        const response = await fetch(`/api/tasks/getTasks?userId=${userId}`, {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache',
          },
        });
        const tasks = await response.json();

        const columnsData: Record<ColumnKey, ColumnType> = {
          task: { id: 'task', list: [] as Task[] },
          doing: { id: 'doing', list: [] as Task[] },
          done: { id: 'done', list: [] as Task[] },
        };

        tasks.forEach((task: Task) => {
          const columnKey = task.column as ColumnKey;
          if (columnsData[columnKey]) {
            columnsData[columnKey].list.push(task);
          }
        });

        setColumns(columnsData);
      } catch (error) {
        console.error('Error al obtener tareas:', error);
      }
    };

    fetchTasks();
  }, []);
  
  const handleDelete = async (id: string) => {
    Swal.fire({
      title: translations[language].deleteConfirmTitle,
      text: translations[language].deleteConfirmText,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: translations[language].deleteConfirmButton,
      cancelButtonText: translations[language].logoutCancelButton,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch('/api/tasks/deleteTask', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
          });

          if (response.ok) {
            setColumns((prevColumns) => ({
              ...prevColumns,
              task: {
                ...prevColumns.task,
                list: prevColumns.task.list.filter((task) => task.id !== id)
              }
            }));
            Swal.fire(
              translations[language].deleteSuccessTitle,
              translations[language].deleteSuccessMessage,
              'success'
            ).then(() => {
              window.location.href = '/dashboard';
            });
          } else {
            console.error(translations[language].deleteErrorMessage);
          }
        } catch (error) {
          console.error(translations[language].deleteErrorMessage, error);
        }
      }
    });
  };
  
  const handleDragEnd = async (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    const sourceColumn = columns[source.droppableId as ColumnKey];
    const destColumn = columns[destination.droppableId as ColumnKey];
    let movedItem;

    if (source.droppableId === destination.droppableId) {
      const reorderedItems = Array.from(sourceColumn.list);
      [movedItem] = reorderedItems.splice(source.index, 1);
      reorderedItems.splice(destination.index, 0, movedItem);

      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          list: reorderedItems,
        },
      });
    } else {
      const sourceItems = Array.from(sourceColumn.list);
      const destItems = Array.from(destColumn.list);
      [movedItem] = sourceItems.splice(source.index, 1);

      destItems.splice(destination.index, 0, movedItem);

      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          list: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          list: destItems,
        },
      });
    }

    try {
      await fetch('/api/tasks/updatePosition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId: movedItem.id,
          newColumnId: destination.droppableId,
          newIndex: destination.index,
        }),
      });
    } catch (error) {
      console.error('Error al actualizar la posición de la tarea:', error);
    }
  };
  
  resetServerContext();

  return (
    <div>
      <Navbar />
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className='grid mt-16 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16 bg-transparent'>
          {Object.values(columns).map(col => (
            <Column 
              id={col.id} 
              list={col.list} 
              tableName={col.id as ColumnKey} 
              key={col.id} 
              onDelete={handleDelete} 
            />
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}