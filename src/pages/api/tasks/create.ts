import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' })
  }

  try {
    const { title, content, tagOne, tagTwo, userId } = req.body

    if (!userId) {
      return res.status(400).json({ message: 'El userId es requerido' })
    }

    const newTask = await prisma.task.create({
      data: {
        title,
        content,
        tagOne,
        tagTwo,
        column: 'task',
        userId,
      },
    })

    return res.status(200).json(newTask)
  } catch (error) {
    console.error('Error:', error)
    return res.status(500).json({ message: 'Error al intentar crear tarea' })
  }
} 