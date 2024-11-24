import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'
import bcrypt from 'bcryptjs'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' })
  }

  try {
    const { email, password } = req.body
    console.log('Intentando login con:', email)

    const { data: user, error: dbError } = await supabase
      .from('User')
      .select('*')
      .eq('email', email)
      .single()

    if (dbError || !user) {
      console.log('Error al buscar usuario:', dbError)
      return res.status(401).json({ message: 'Credenciales inválidas' })
    }

    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      console.log('Contraseña inválida')
      return res.status(401).json({ message: 'Credenciales inválidas' })
    }

    const session = {
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    }

    res.status(200).json({ 
      message: 'Login exitoso',
      session,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    })
  } catch (error) {
    console.error('Error general:', error)
    res.status(500).json({ message: 'Error del servidor' })
  }
}
