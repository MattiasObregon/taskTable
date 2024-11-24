import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Método no permitido' })
  }

  try {
    const { id } = req.query
    const { title, content, tagOne, tagTwo } = req.body

    const taskExists = await prisma.task.findUnique({
      where: { id: String(id) },
    })

    if (!taskExists) {
      return res.status(404).json({ message: 'Tarea no encontrada' })
    }

    const updatedTask = await prisma.task.update({
      where: { id: String(id) },
      data: {
        title,
        content,
        tagOne,
        tagTwo,
      },
    })

    return res.status(200).json(updatedTask)
  } catch (error) {
    console.error('Error:', error)
    return res.status(500).json({ message: 'Error al intentar actualizar tarea' })
  }
} 