import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatPeso } from '@/lib/utils'
import type { Booking, Owner } from '@/lib/types'

const statusStyles: Record<string, string> = {
  pending: 'bg-orange-50 text-orange-700',
  confirmed: 'bg-green-50 text-green-700',
  cancelled: 'bg-gray-100 text-gray-500',
}

const statusLabel: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  cancelled: 'Cancelled',
}

export default async function BookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const { status } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: owner } = await supabase
    .from('owners')
    .select('id')
    .eq('user_id', user.id)
    .single() as { data: Owner | null }

  if (!owner) redirect('/dashboard/settings')

  let query = supabase
    .from('bookings')
    .select('*, room:rooms(name)')
    .eq('owner_id', owner.id)
    .order('created_at', { ascending: false })

  if (status && ['pending', 'confirmed', 'cancelled'].includes(status)) {
    query = query.eq('status', status)
  }

  const { data: bookings } = await query as { data: Booking[] | null }

  const tabs = [
    { label: 'Lahat', value: undefined },
    { label: 'Pending', value: 'pending' },
    { label: 'Confirmed', value: 'confirmed' },
    { label: 'Cancelled', value: 'cancelled' },
  ]

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-gray-900">Bookings</h1>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {tabs.map(tab => (
          <Link
            key={tab.label}
            href={tab.value ? `/dashboard/bookings?status=${tab.value}` : '/dashboard/bookings'}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              status === tab.value
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {(!bookings || bookings.length === 0) ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-sm">Wala pang bookings</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {bookings.map(booking => (
            <li key={booking.id} className="bg-white rounded-xl border border-gray-100 shadow-sm">
              <Link href={`/dashboard/bookings/${booking.id}`} className="block px-5 py-4 hover:bg-gray-50 transition-colors rounded-xl">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{booking.guest_name}</p>
                    <p className="text-sm text-gray-500">
                      {booking.room?.name} · {booking.pax} tao
                    </p>
                    <p className="text-sm text-gray-500">
                      {booking.check_in} → {booking.check_out}
                    </p>
                    {booking.total_amount && (
                      <p className="text-sm font-medium text-gray-700">
                        {formatPeso(booking.total_amount)}
                      </p>
                    )}
                  </div>
                  <span className={`shrink-0 text-xs px-2.5 py-1 rounded-full font-medium ${statusStyles[booking.status]}`}>
                    {statusLabel[booking.status]}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
