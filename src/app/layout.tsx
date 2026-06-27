import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TransientBook — Online booking for transient houses',
  description: 'Book your room in seconds. No back-and-forth. No double-booking.',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-white text-gray-900 antialiased">
        {children}
      </body>
    </html>
  )
}
