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
    const { email, password, name } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) {
      return res.status(400).json({ message: authError.message })
    }

    const { error: dbError } = await supabase
      .from('User')
      .insert([
        {
          id: authData.user?.id,
          email,
          password: hashedPassword,
          name,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ])

    if (dbError) {
      console.error('DB Error:', dbError)
      return res.status(400).json({ message: dbError.message })
    }

    res.status(200).json({ 
      message: 'Usuario creado exitosamente',
      user: authData.user 
    })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ message: 'Error del servidor' })
  }
} 