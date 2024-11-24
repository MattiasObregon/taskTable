import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método no permitido' })
  }

  try {
    const { data: tasks, error } = await supabase
      .from('Task')
      .select('*')
      .eq('userId', req.query.userId)

    if (error) {
      console.error('Error al obtener tareas:', error)
      return res.status(500).json({ message: 'Error al obtener tareas' })
    }

    return res.status(200).json(tasks)
  } catch (error) {
    console.error('Error:', error)
    return res.status(500).json({ message: 'Error al obtener tareas' })
  }
} 