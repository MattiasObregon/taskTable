import React from 'react'
import { Droppable } from 'react-beautiful-dnd'
import { Task } from './Task'
import { useLanguage } from '../context/LanguageContext'
import translations from '../translations'

type TranslationKeys = keyof typeof translations['en'];

interface ColumnProps {
    id: string
    list:taskProps[]
    tableName: TranslationKeys
    onDelete: (id: string) => void
}

interface taskProps{
  id:string
  title:string,
  content:string,
  tagOne?:string,
  tagTwo?:string
  }

export function Column ({id,list, tableName, onDelete}:ColumnProps) {
  const { language } = useLanguage()

  return (
    <Droppable droppableId={id}>
      {provided => (
          <div className=" select-none flex flex-col lg:m-4 md:m-4 sm:m-2  ">
          <h2 className="font-bold text-3xl mb-8">{translations[language][tableName]}</h2>
          <div className=" flex flex-col  gap-6"{...provided.droppableProps} ref={provided.innerRef}> 
            {list.map((text, index) => (
              <Task
                id={text.id}
                tagOne={text.tagOne}
                tagTwo={text.tagTwo}
                key={text.id}
                content={text.content}
                title={text.title}
                index={index}
                onDelete={onDelete}
              />
            ))}
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  )
}