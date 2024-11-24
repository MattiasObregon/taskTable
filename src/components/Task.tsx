import { useState } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tag } from "./Tag"
import { Draggable } from "react-beautiful-dnd"
import EditTask from './EditTask';
import translations from '../translations';
import { useLanguage } from '../context/LanguageContext';

export interface cardProps{
    id: string
    title: string
    content: string,
    tagOne?: string
    tagTwo?: string
    onDelete: (id: string) => void
}

export function Task ({id, content, title, tagOne,tagTwo, onDelete, index }: cardProps & { index: number }) {
    const [isEditing, setIsEditing] = useState(false);
    const { language } = useLanguage();
    return(
        <Draggable draggableId={id} index={index}>
            {provided => (
            <Card className="w-full items-center  justify-center md:p-4 max-w-[300px] shadow-xl"    ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}>
                
                <CardHeader>
                    <CardTitle className="text-xl flex ">
                        {title}
                        <button onClick={() => {
                            //console.log('Eliminando tarea con id:', id);
                            onDelete(id);
                        }} className="ml-auto text-red-500 bg-red-100 rounded-lg px-2 py-1">
                            {translations[language].deleteButton}
                        </button>
                        <button onClick={() => setIsEditing(!isEditing)} className="ml-2 text-blue-500 bg-blue-100 rounded-lg px-2 py-1">
                            {translations[language].editButton}
                        </button>
                    </CardTitle>
                </CardHeader>
  
                <CardContent>
                    <p className=" text-gray-800  text-lg ">
                        {content}
                    </p>
                </CardContent>
                
                <CardFooter className="flex gap-4 flex-col  sm:flex-row  justify-around">
                    {tagOne ===undefined ?<></>:<Tag value={tagOne}/>}
                    {tagTwo ===undefined ?<></>:<Tag value={tagTwo}/>}     
                </CardFooter>   

                {isEditing && (
                    <EditTask
                        taskId={id}
                        initialTitle={title}
                        initialContent={content}
                        initialTagOne={tagOne || ''}
                        initialTagTwo={tagTwo || ''}
                    />
                )}
            </Card>
            )}
        </Draggable>
    )
}