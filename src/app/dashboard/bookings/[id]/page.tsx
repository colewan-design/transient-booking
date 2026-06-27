import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatPeso } from '@/lib/utils'
import BookingActions from '@/components/BookingActions'
import type { Booking, Owner } from '@/lib/types'

export default async function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: owner } = await supabase
    .from('owners')
    .select('id')
    .eq('user_id', user.id)
    .single() as { data: Owner | null }

  if (!owner) redirect('/dashboard/settings')

  const { data: booking } = await supabase
    .from('bookings')
    .select('*, room:rooms(*)')
    .eq('id', id)
    .eq('owner_id', owner.id)
    .single() as { data: Booking | null }

  if (!booking) notFound()

  const statusStyles: Record<string, string> = {
    pending: 'bg-orange-50 text-orange-700',
    confirmed: 'bg-green-50 text-green-700',
    cancelled: 'bg-gray-100 text-gray-500',
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/bookings" className="text-sm text-gray-500 hover:text-gray-700">
          ← Bookings
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm divide-y divide-gray-50">
        {/* Header */}
        <div className="px-5 py-4 flex items-start justify-between gap-3">
          <div>
            <h1 className="text-lg font-bold text-gray-900">{booking.guest_name}</h1>
            <p className="text-sm text-gray-500">{booking.guest_contact}</p>
          </div>
          <span className={`shrink-0 text-xs px-3 py-1.5 rounded-full font-medium ${statusStyles[booking.status]}`}>
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </span>
        </div>

        {/* Details */}
        <div className="px-5 py-4 space-y-3">
          <Row label="Room" value={booking.room?.name ?? '—'} />
          <Row label="Check-in" value={booking.check_in} />
          <Row label="Check-out" value={booking.check_out} />
          <Row label="Bilang ng Tao" value={String(booking.pax)} />
          {booking.total_amount && (
            <Row label="Kabuuang Halaga" value={formatPeso(booking.total_amount)} bold />
          )}
        </div>

        {/* Deposit */}
        <div className="px-5 py-4 space-y-3">
          <h2 className="text-sm font-semibold text-gray-700">Deposit</h2>
          {booking.deposit_ref ? (
            <Row label="Reference #" value={booking.deposit_ref} />
          ) : (
            <p className="text-sm text-gray-400">Wala pang deposit reference na na-submit.</p>
          )}
          {booking.deposit_proof_url && (
            <div className="space-y-1">
              <p className="text-xs text-gray-500 font-medium">Proof of payment:</p>
              <a
                href={booking.deposit_proof_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={booking.deposit_proof_url}
                  alt="Deposit proof"
                  className="w-full max-w-xs rounded-lg border border-gray-200 object-cover"
                />
              </a>
            </div>
          )}
        </div>

        {/* Notes */}
        {booking.notes && (
          <div className="px-5 py-4 space-y-1">
            <p className="text-xs text-gray-500 font-medium">Notes ng Guest:</p>
            <p className="text-sm text-gray-700">{booking.notes}</p>
          </div>
        )}

        {/* Actions */}
        {booking.status === 'pending' && (
          <div className="px-5 py-4">
            <BookingActions bookingId={booking.id} />
          </div>
        )}
      </div>
    </div>
  )
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className={bold ? 'font-semibold text-gray-900' : 'text-gray-800'}>{value}</span>
    </div>
  )
}
