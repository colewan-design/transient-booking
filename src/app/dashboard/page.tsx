import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { Booking, Owner } from '@/lib/types'
import CopyButton from '@/components/CopyButton'
import { BedDouble, CalendarCheck, ArrowRight } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: owner } = await supabase
    .from('owners')
    .select('*')
    .eq('user_id', user.id)
    .single() as { data: Owner | null }

  if (!owner) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-wide text-gray-900">Welcome</h1>
          <p className="text-sm text-gray-400 mt-0.5">Set up your property to get started.</p>
        </div>
        <div className="bg-slate-900 rounded-2xl p-6 space-y-4">
          <p className="text-sm text-white/70">
            Create your property profile to get a personal booking link you can share with guests.
          </p>
          <Link
            href="/dashboard/settings"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-500 text-white text-sm font-semibold rounded-full hover:bg-rose-600 transition-colors"
          >
            Set up property <ArrowRight className="w-4 h-4" />
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
        <h1 className="text-2xl font-black uppercase tracking-wide text-gray-900">{owner.property_name}</h1>
        <p className="text-sm text-gray-400 mt-0.5">Owner dashboard</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
            <BedDouble className="w-5 h-5 text-slate-500" />
          </div>
          <div>
            <p className="text-3xl font-black text-gray-900">{rooms?.length ?? 0}</p>
            <p className="text-xs text-gray-400 mt-0.5 uppercase tracking-wide">Active rooms</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center shrink-0">
            <CalendarCheck className="w-5 h-5 text-rose-500" />
          </div>
          <div>
            <p className="text-3xl font-black text-rose-500">{pendingBookings?.length ?? 0}</p>
            <p className="text-xs text-gray-400 mt-0.5 uppercase tracking-wide">Pending</p>
          </div>
        </div>
      </div>

      {/* Booking link — dark card */}
      <div className="bg-slate-900 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-widest text-white/50">Your booking link</h2>
          <span className="text-xs text-teal-400 font-medium">Live</span>
        </div>
        <div className="flex items-center gap-2">
          <code className="flex-1 text-sm bg-white/10 rounded-xl px-3 py-2.5 truncate text-white/80">
            {bookingUrl}
          </code>
          <CopyButton text={bookingUrl} />
        </div>
        <p className="text-xs text-white/30">
          Share this link with guests. They complete the entire booking themselves.
        </p>
      </div>

      {/* Pending bookings */}
      {(pendingBookings?.length ?? 0) > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h2 className="text-sm font-semibold text-gray-700">Pending Bookings</h2>
            <Link href="/dashboard/bookings" className="text-xs text-rose-500 hover:text-rose-600 font-medium">
              View all
            </Link>
          </div>
          <ul className="divide-y divide-gray-50">
            {pendingBookings!.map(booking => (
              <li key={booking.id}>
                <Link
                  href={`/dashboard/bookings/${booking.id}`}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{booking.guest_name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {booking.room?.name} &middot; {booking.check_in} &rarr; {booking.check_out}
                    </p>
                  </div>
                  <span className="text-xs bg-amber-50 text-amber-600 px-2.5 py-1 rounded-full font-medium">
                    Pending
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {(rooms?.length ?? 0) === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-sm text-gray-500">
            No rooms yet.{' '}
            <Link href="/dashboard/rooms/new" className="text-rose-500 hover:text-rose-600 font-semibold underline underline-offset-2">
              Add a room
            </Link>{' '}
            to activate your booking link.
          </p>
        </div>
      )}
    </div>
  )
}
