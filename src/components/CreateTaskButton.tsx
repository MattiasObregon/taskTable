import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Edit } from "lucide-react"
import { DialogClose } from "@radix-ui/react-dialog"
import Swal from 'sweetalert2';
import translations from '../translations';

type Language = 'en' | 'es';

export function CreateTaskButton({ language }: { language: Language }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tagOne, setTagOne] = useState('')
  const [tagTwo, setTagTwo] = useState('')

  const handleSubmit = async () => {
    try {
      const userString = localStorage.getItem('user');
      const user = userString ? JSON.parse(userString) : null;
      const userId = user ? user.id : null;

      const response = await fetch('/api/tasks/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, tagOne, tagTwo, userId }),
      })

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: translations[language].taskCreated,
          text: translations[language].taskCreatedMessage,
        }).then(() => {
          window.location.href = '/dashboard';
        });
      } else {
        const data = await response.json()
        Swal.fire('Error', data.message || translations[language].taskError, 'error');
      }
    } catch (error) {
      console.error('Error:', error)
      Swal.fire('Error', translations[language].taskError, 'error');
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <Edit />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white text-xl">
        <DialogHeader>
          <DialogTitle>{translations[language].createTaskTitle}</DialogTitle>
          <DialogDescription>
            {translations[language].createTaskDescription}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              {translations[language].createTitle}
            </Label>
            <Input required onChange={(e) => setTitle(e.target.value)} id="title" placeholder={translations[language].createTitle} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="content" className="text-right">
              {translations[language].createContent}
            </Label>
            <Input required onChange={(e) => setContent(e.target.value)} id="content" placeholder={translations[language].createContent} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tagOne" className="text-right">
              {translations[language].createTagOne}
            </Label>
            <Input onChange={(e) => setTagOne(e.target.value)} id="tagOne" placeholder={translations[language].createTagOne} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tagTwo" className="text-right">
              {translations[language].createTagTwo}
            </Label>
            <Input onChange={(e) => setTagTwo(e.target.value)} id="tagTwo" placeholder={translations[language].createTagTwo} className="col-span-3" />
          </div>
        </div>
        <DialogClose>
          <Button onClick={handleSubmit} className="bg-green-700" type="button">
            {translations[language].saveButton}
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}