'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { addDays, format, parseISO, differenceInDays } from 'date-fns'
import { createClient } from '@/lib/supabase/client'
import { calculateTotalPrice, formatPeso } from '@/lib/utils'
import type { Owner, Room } from '@/lib/types'

type Step = 'dates' | 'rooms' | 'form' | 'done'

interface AvailableRoom {
  room: Room
  totalPrice: number
  nights: number
}

export default function GuestBookingFlow({ owner, rooms }: { owner: Owner; rooms: Room[] }) {
  const router = useRouter()
  const supabase = createClient()

  const [step, setStep] = useState<Step>('dates')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [pax, setPax] = useState('1')
  const [availableRooms, setAvailableRooms] = useState<AvailableRoom[]>([])
  const [selectedRoom, setSelectedRoom] = useState<AvailableRoom | null>(null)
  const [checking, setChecking] = useState(false)

  // Booking form fields
  const [guestName, setGuestName] = useState('')
  const [guestContact, setGuestContact] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [bookingId, setBookingId] = useState<string | null>(null)

  async function checkAvailability() {
    if (!checkIn || !checkOut) return
    const nights = differenceInDays(parseISO(checkOut), parseISO(checkIn))
    if (nights <= 0) {
      setError('Check-out ay dapat pagkatapos ng check-in.')
      return
    }
    if (nights > 30) {
      setError('Maximum ay 30 gabi lang per booking.')
      return
    }

    setError(null)
    setChecking(true)

    // Get all confirmed/pending bookings for these rooms in the date range
    const roomIds = rooms.map(r => r.id)

    const { data: conflicts } = await supabase
      .from('bookings')
      .select('room_id')
      .in('room_id', roomIds)
      .in('status', ['pending', 'confirmed'])
      .lt('check_in', checkOut)
      .gt('check_out', checkIn)

    const conflictRoomIds = new Set((conflicts ?? []).map(c => c.room_id))

    // Also get blocked dates
    const { data: blockedDates } = await supabase
      .from('blocked_dates')
      .select('room_id, date')
      .in('room_id', roomIds)
      .gte('date', checkIn)
      .lt('date', checkOut)

    const blockedRoomIds = new Set((blockedDates ?? []).map(b => b.room_id))

    const paxNum = parseInt(pax)
    const available = rooms
      .filter(room =>
        !conflictRoomIds.has(room.id) &&
        !blockedRoomIds.has(room.id) &&
        room.capacity >= paxNum
      )
      .map(room => ({
        room,
        totalPrice: calculateTotalPrice(checkIn, checkOut, room.weekday_rate, room.weekend_rate),
        nights,
      }))

    setAvailableRooms(available)
    setChecking(false)
    setStep('rooms')
  }

  async function submitBooking() {
    if (!selectedRoom) return
    setSubmitting(true)
    setError(null)

    // Double-booking lock: re-check before inserting
    const { data: conflicts } = await supabase
      .from('bookings')
      .select('id')
      .eq('room_id', selectedRoom.room.id)
      .in('status', ['pending', 'confirmed'])
      .lt('check_in', checkOut)
      .gt('check_out', checkIn)

    if (conflicts && conflicts.length > 0) {
      setError('Sorry, na-book na pala ang room na ito. Bumalik at pumili ng ibang room.')
      setSubmitting(false)
      setStep('rooms')
      return
    }

    const { data, error: err } = await supabase
      .from('bookings')
      .insert({
        room_id: selectedRoom.room.id,
        owner_id: owner.id,
        guest_name: guestName.trim(),
        guest_contact: guestContact.trim(),
        check_in: checkIn,
        check_out: checkOut,
        pax: parseInt(pax),
        total_amount: selectedRoom.totalPrice,
        notes: notes.trim() || null,
        status: 'pending',
      })
      .select('id')
      .single()

    if (err || !data) {
      setError('May error. Subukan ulit.')
      setSubmitting(false)
      return
    }

    setBookingId(data.id)
    setStep('done')
    setSubmitting(false)
  }

  // ── STEP: DATES ──────────────────────────────────────────────────────
  if (step === 'dates') {
    const today = format(new Date(), 'yyyy-MM-dd')
    const minCheckOut = checkIn ? format(addDays(parseISO(checkIn), 1), 'yyyy-MM-dd') : today
    const maxPax = Math.max(...rooms.map(r => r.capacity), 1)

    return (
      <div className="space-y-5">
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-gray-900">Mag-check ng availability</h2>
          <p className="text-sm text-gray-500">Pumili ng petsa at bilang ng tao.</p>
        </div>

        {error && <div className="bg-red-50 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>}

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Check-in</label>
              <input type="date" required min={today} value={checkIn}
                onChange={e => { setCheckIn(e.target.value); if (checkOut && e.target.value >= checkOut) setCheckOut('') }}
                className={inputCls} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Check-out</label>
              <input type="date" required min={minCheckOut} value={checkOut}
                onChange={e => setCheckOut(e.target.value)}
                className={inputCls} />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Ilang tao?</label>
            <select value={pax} onChange={e => setPax(e.target.value)} className={inputCls}>
              {Array.from({ length: maxPax }, (_, i) => i + 1).map(n => (
                <option key={n} value={n}>{n} tao</option>
              ))}
            </select>
          </div>

          <button
            onClick={checkAvailability}
            disabled={!checkIn || !checkOut || checking}
            className="w-full bg-blue-600 text-white rounded-lg py-3 text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {checking ? 'Chine-check...' : 'Tingnan ang Available Rooms'}
          </button>
        </div>

        {rooms.length === 0 && (
          <p className="text-sm text-center text-gray-400">Walang available rooms sa ngayon.</p>
        )}
      </div>
    )
  }

  // ── STEP: ROOMS ───────────────────────────────────────────────────────
  if (step === 'rooms') {
    const nights = differenceInDays(parseISO(checkOut), parseISO(checkIn))
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <button onClick={() => setStep('dates')} className="text-sm text-gray-500 hover:text-gray-700">
            ← Baguhin
          </button>
          <div>
            <p className="text-sm font-semibold text-gray-900">
              {format(parseISO(checkIn), 'MMM d')} – {format(parseISO(checkOut), 'MMM d, yyyy')}
            </p>
            <p className="text-xs text-gray-500">{nights} {nights === 1 ? 'gabi' : 'gabi'} · {pax} tao</p>
          </div>
        </div>

        {availableRooms.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 text-center space-y-3">
            <p className="text-4xl">😕</p>
            <p className="font-medium text-gray-800">Walang available sa mga petsang iyan.</p>
            <p className="text-sm text-gray-500">Subukan ng ibang petsa.</p>
            <button onClick={() => setStep('dates')}
              className="text-sm text-blue-600 hover:underline">
              Bumalik
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">{availableRooms.length} available na room{availableRooms.length > 1 ? 's' : ''}:</p>
            {availableRooms.map(({ room, totalPrice, nights }) => (
              <button
                key={room.id}
                onClick={() => { setSelectedRoom({ room, totalPrice, nights }); setStep('form') }}
                className="w-full text-left bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:border-blue-400 hover:shadow-md transition-all space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-gray-900">{room.name}</p>
                    <p className="text-sm text-gray-500">Hanggang {room.capacity} tao</p>
                    {room.description && (
                      <p className="text-sm text-gray-400 mt-1">{room.description}</p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-gray-900">{formatPeso(totalPrice)}</p>
                    <p className="text-xs text-gray-400">para sa {nights} gabi</p>
                  </div>
                </div>
                <div className="text-xs text-gray-400">
                  {formatPeso(room.weekday_rate)}/gabi
                  {room.weekend_rate && room.weekend_rate !== room.weekday_rate &&
                    ` · ${formatPeso(room.weekend_rate)}/gabi (weekend)`}
                </div>
                <div className="text-sm text-blue-600 font-medium">Piliin ito →</div>
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  // ── STEP: GUEST FORM ──────────────────────────────────────────────────
  if (step === 'form' && selectedRoom) {
    const nights = differenceInDays(parseISO(checkOut), parseISO(checkIn))
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <button onClick={() => setStep('rooms')} className="text-sm text-gray-500 hover:text-gray-700">
            ← Bumalik
          </button>
          <div>
            <p className="text-sm font-semibold text-gray-900">{selectedRoom.room.name}</p>
            <p className="text-xs text-gray-500">
              {format(parseISO(checkIn), 'MMM d')} – {format(parseISO(checkOut), 'MMM d')} · {nights} gabi · {pax} tao
            </p>
          </div>
        </div>

        {error && <div className="bg-red-50 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>}

        <div className="bg-blue-50 rounded-xl border border-blue-100 px-5 py-3 flex justify-between items-center">
          <span className="text-sm text-blue-800">Kabuuang Halaga</span>
          <span className="font-bold text-blue-900 text-lg">{formatPeso(selectedRoom.totalPrice)}</span>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
          <h2 className="text-sm font-semibold text-gray-700">Iyong Impormasyon</h2>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Buong Pangalan <span className="text-red-500">*</span></label>
            <input type="text" required value={guestName} onChange={e => setGuestName(e.target.value)}
              placeholder="Juan dela Cruz" className={inputCls} />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Contact Number <span className="text-red-500">*</span></label>
            <input type="tel" required value={guestContact} onChange={e => setGuestContact(e.target.value)}
              placeholder="+63 912 345 6789" className={inputCls} />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Notes (optional)</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2}
              placeholder="Meron ba kayong dagdag na request?" className={inputCls} />
          </div>

          <button
            onClick={submitBooking}
            disabled={submitting || !guestName.trim() || !guestContact.trim()}
            className="w-full bg-blue-600 text-white rounded-lg py-3 text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {submitting ? 'Nagre-reserve...' : 'Reserve ngayon'}
          </button>

          <p className="text-xs text-center text-gray-400">
            Kailangan pa ng deposit para ma-confirm ang booking.
          </p>
        </div>
      </div>
    )
  }

  // ── STEP: DONE — show GCash instructions ──────────────────────────────
  if (step === 'done' && selectedRoom) {
    const nights = differenceInDays(parseISO(checkOut), parseISO(checkIn))
    return (
      <div className="space-y-5">
        <div className="text-center space-y-2">
          <div className="text-4xl">🎉</div>
          <h2 className="text-lg font-bold text-gray-900">Na-receive ang iyong booking request!</h2>
          <p className="text-sm text-gray-500">
            Para ma-confirm, kailangan munang magpadala ng deposit sa GCash.
          </p>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-3">
          <h3 className="text-sm font-semibold text-gray-700">Booking Summary</h3>
          <Row label="Room" value={selectedRoom.room.name} />
          <Row label="Check-in" value={format(parseISO(checkIn), 'MMMM d, yyyy')} />
          <Row label="Check-out" value={format(parseISO(checkOut), 'MMMM d, yyyy')} />
          <Row label="Gabi" value={`${nights} gabi`} />
          <Row label="Tao" value={`${pax} tao`} />
          <div className="border-t border-gray-100 pt-3">
            <Row label="Kabuuan" value={formatPeso(selectedRoom.totalPrice)} bold />
          </div>
        </div>

        {/* GCash instructions */}
        {(owner.gcash_number || owner.gcash_name) && (
          <div className="bg-green-50 rounded-xl border border-green-100 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-green-800">💚 Magpadala ng Deposit sa GCash</h3>
            <div className="space-y-2">
              {owner.gcash_number && (
                <div className="flex justify-between text-sm">
                  <span className="text-green-700">GCash Number:</span>
                  <span className="font-bold text-green-900">{owner.gcash_number}</span>
                </div>
              )}
              {owner.gcash_name && (
                <div className="flex justify-between text-sm">
                  <span className="text-green-700">Account Name:</span>
                  <span className="font-bold text-green-900">{owner.gcash_name}</span>
                </div>
              )}
            </div>
            <p className="text-xs text-green-700">
              Pagkatapos mag-send, i-submit ang reference number mo sa link sa ibaba para ma-confirm ng owner ang iyong booking.
            </p>
          </div>
        )}

        {/* Link to deposit submission */}
        {bookingId && (
          <a
            href={`/book/${owner.slug}/confirm?id=${bookingId}`}
            className="block w-full text-center bg-blue-600 text-white rounded-lg py-3 text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            I-submit ang GCash Reference →
          </a>
        )}

        <p className="text-xs text-center text-gray-400">
          Makikipag-ugnayan sa iyo ang {owner.property_name} para sa confirmation.
        </p>
      </div>
    )
  }

  return null
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className={bold ? 'font-semibold text-gray-900' : 'text-gray-800'}>{value}</span>
    </div>
  )
}

const inputCls = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none'
