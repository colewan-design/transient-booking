import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatPeso } from '@/lib/utils'
import { BedDouble } from 'lucide-react'
import type { Owner, Room } from '@/lib/types'

export default async function RoomsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: owner } = await supabase
    .from('owners')
    .select('id')
    .eq('user_id', user.id)
    .single() as { data: Owner | null }

  if (!owner) redirect('/dashboard/settings')

  const { data: rooms } = await supabase
    .from('rooms')
    .select('*')
    .eq('owner_id', owner.id)
    .order('created_at', { ascending: true }) as { data: Room[] | null }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Rooms</h1>
        <Link
          href="/dashboard/rooms/new"
          className="px-4 py-2 bg-rose-500 text-white text-sm font-semibold rounded-full hover:bg-rose-600 transition-colors"
        >
          + Add Room
        </Link>
      </div>

      {(!rooms || rooms.length === 0) ? (
        <div className="text-center py-16 text-gray-400 space-y-2">
          <BedDouble className="w-10 h-10 text-gray-300 mx-auto" />
          <p className="text-sm">No rooms yet. Add your first room to activate your booking link.</p>
          <Link
            href="/dashboard/rooms/new"
            className="inline-block mt-2 text-sm text-rose-500 hover:text-rose-600 font-medium"
          >
            Add a room
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {rooms.map(room => (
            <li key={room.id} className="bg-white rounded-xl border border-gray-100 shadow-sm">
              <Link href={`/dashboard/rooms/${room.id}`} className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors rounded-xl">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900">{room.name}</p>
                    {!room.is_active && (
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Inactive</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    Up to {room.capacity} guests · {formatPeso(room.weekday_rate)}/night
                    {room.weekend_rate && room.weekend_rate !== room.weekday_rate &&
                      ` (${formatPeso(room.weekend_rate)} weekend)`
                    }
                  </p>
                  {room.description && (
                    <p className="text-xs text-gray-400 line-clamp-1">{room.description}</p>
                  )}
                </div>
                <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
