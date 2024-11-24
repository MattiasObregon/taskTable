import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  try {
    const { taskId, newColumnId } = req.body;

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        column: newColumnId,
      },
    });

    return res.status(200).json(updatedTask);
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Error al actualizar la posición de la tarea' });
  }
} 