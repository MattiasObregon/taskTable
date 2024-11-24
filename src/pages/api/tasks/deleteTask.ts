import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { id } = req.body;

  try {
    const { error } = await supabase
      .from('Task')
      .delete()
      .eq('id', id);

    if (error) {
      //console.error('Error al eliminar tarea:', error);
      return res.status(500).json({ message: 'Error al eliminar tarea' });
    }

    return res.status(200).json({ message: 'Tarea eliminada exitosamente' });
  } catch (error) {
    //onsole.error('Error:', error);
    return res.status(500).json({ message: 'Error al eliminar tarea' });
  }
} 