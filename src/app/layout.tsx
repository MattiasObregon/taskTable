import './globals.css'
import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Kanban App',
  description: 'Aplicación de Kanban'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
