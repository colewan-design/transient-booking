'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Owner } from '@/lib/types'

export default function DashboardNav({ owner }: { owner: Owner | null }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const links = [
    { href: '/dashboard', label: 'Overview' },
    { href: '/dashboard/rooms', label: 'Rooms' },
    { href: '/dashboard/bookings', label: 'Bookings' },
    { href: '/dashboard/settings', label: 'Settings' },
  ]

  return (
    <header className="bg-white/90 backdrop-blur border-b border-gray-100 sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          <span className="text-rose-500 font-black text-lg tracking-tight uppercase">
            {owner?.property_name ?? 'TransientBook'}
          </span>

          <nav className="flex items-center gap-1">
            {links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'bg-rose-50 text-rose-600'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <button
            onClick={signOut}
            className="text-sm text-gray-400 hover:text-gray-700 transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  )
}
