import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { Booking, Owner } from '@/lib/types'
import CopyButton from '@/components/CopyButton'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: owner } = await supabase
    .from('owners')
    .select('*')
    .eq('user_id', user.id)
    .single() as { data: Owner | null }

  // If no owner profile yet, prompt setup
  if (!owner) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-bold text-gray-900">Welcome sa TransientBook!</h1>
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 space-y-3">
          <p className="text-sm text-blue-800">
            I-setup muna ang iyong property para makuha ang iyong booking link.
          </p>
          <Link
            href="/dashboard/settings"
            className="inline-block px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            I-setup ang property
          </Link>
        </div>
      </div>
    )
  }

  const { data: pendingBookings } = await supabase
    .from('bookings')
    .select('*, room:rooms(name)')
    .eq('owner_id', owner.id)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
    .limit(5) as { data: Booking[] | null }

  const { data: rooms } = await supabase
    .from('rooms')
    .select('id')
    .eq('owner_id', owner.id)
    .eq('is_active', true)

  const bookingUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? ''}/book/${owner.slug}`

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">{owner.property_name}</h1>
        <p className="text-sm text-gray-500">Owner dashboard</p>
      </div>

      {/* Booking link */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-3">
        <h2 className="text-sm font-semibold text-gray-700">Iyong booking link</h2>
        <div className="flex items-center gap-2">
          <code className="flex-1 text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 truncate text-gray-800">
            {bookingUrl}
          </code>
          <CopyButton text={bookingUrl} />
        </div>
        <p className="text-xs text-gray-500">
          I-paste ito sa Messenger kapag nag-message ang guest. Gagawin nila ang lahat ng steps doon.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <p className="text-2xl font-bold text-gray-900">{rooms?.length ?? 0}</p>
          <p className="text-sm text-gray-500">Active rooms</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <p className="text-2xl font-bold text-orange-600">{pendingBookings?.length ?? 0}</p>
          <p className="text-sm text-gray-500">Pending bookings</p>
        </div>
      </div>

      {/* Pending bookings */}
      {(pendingBookings?.length ?? 0) > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-gray-50">
            <h2 className="text-sm font-semibold text-gray-700">Pending na Bookings</h2>
            <Link href="/dashboard/bookings" className="text-xs text-blue-600 hover:underline">
              Tingnan lahat
            </Link>
          </div>
          <ul className="divide-y divide-gray-50">
            {pendingBookings!.map(booking => (
              <li key={booking.id}>
                <Link
                  href={`/dashboard/bookings/${booking.id}`}
                  className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{booking.guest_name}</p>
                    <p className="text-xs text-gray-500">
                      {booking.room?.name} · {booking.check_in} → {booking.check_out}
                    </p>
                  </div>
                  <span className="text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded-full font-medium">
                    Pending
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {(rooms?.length ?? 0) === 0 && (
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
          <p className="text-sm text-amber-800">
            Wala pang rooms.{' '}
            <Link href="/dashboard/rooms/new" className="underline font-medium">
              Mag-dagdag ng room
            </Link>{' '}
            para maging live ang iyong booking link.
          </p>
        </div>
      )}
    </div>
  )
}

