'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { addDays, format, parseISO, differenceInDays } from 'date-fns'
import { Check, CalendarX, BedDouble, PartyPopper, ChevronLeft, ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { calculateTotalPrice, formatPeso } from '@/lib/utils'
import type { Owner, Room } from '@/lib/types'

type Step = 'dates' | 'rooms' | 'form' | 'done'

function RoomPhotoCarousel({ photos }: { photos: string[] }) {
  const [index, setIndex] = useState(0)
  if (!photos.length) {
    return (
      <div className="h-48 bg-linear-to-br from-rose-100 via-orange-50 to-amber-100 flex items-center justify-center">
        <BedDouble className="w-10 h-10 text-rose-300" />
      </div>
    )
  }
  return (
    <div className="relative h-48 bg-gray-100 overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={photos[index]} alt="" className="w-full h-full object-cover" />
      {photos.length > 1 && (
        <>
          <button
            type="button"
            onClick={e => { e.stopPropagation(); setIndex(i => (i - 1 + photos.length) % photos.length) }}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/40 text-white rounded-full flex items-center justify-center hover:bg-black/60 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={e => { e.stopPropagation(); setIndex(i => (i + 1) % photos.length) }}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/40 text-white rounded-full flex items-center justify-center hover:bg-black/60 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {photos.map((_, i) => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full transition-colors ${i === index ? 'bg-white' : 'bg-white/50'}`} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

interface AvailableRoom {
  room: Room
  totalPrice: number
  nights: number
}

const STEP_LABELS: Record<Step, string> = {
  dates: 'Dates',
  rooms: 'Choose room',
  form: 'Your details',
  done: 'Confirmed',
}
const STEP_ORDER: Step[] = ['dates', 'rooms', 'form', 'done']

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
      setError('Check-out must be after check-in.')
      return
    }
    if (nights > 30) {
      setError('Maximum of 30 nights per booking.')
      return
    }

    setError(null)
    setChecking(true)

    const roomIds = rooms.map(r => r.id)

    const { data: conflicts } = await supabase
      .from('bookings')
      .select('room_id')
      .in('room_id', roomIds)
      .in('status', ['pending', 'confirmed'])
      .lt('check_in', checkOut)
      .gt('check_out', checkIn)

    const conflictRoomIds = new Set((conflicts ?? []).map(c => c.room_id))

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

    const { data: conflicts } = await supabase
      .from('bookings')
      .select('id')
      .eq('room_id', selectedRoom.room.id)
      .in('status', ['pending', 'confirmed'])
      .lt('check_in', checkOut)
      .gt('check_out', checkIn)

    if (conflicts && conflicts.length > 0) {
      setError('Sorry, this room was just booked. Please go back and choose another room.')
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
      setError('Something went wrong. Please try again.')
      setSubmitting(false)
      return
    }

    setBookingId(data.id)
    setStep('done')
    setSubmitting(false)
  }

  // ── STEP INDICATOR ────────────────────────────────────────────────────
  const currentIndex = STEP_ORDER.indexOf(step)

  const StepBar = () => (
    <div className="flex items-center gap-2 mb-8">
      {STEP_ORDER.map((s, i) => (
        <div key={s} className="flex items-center gap-2 flex-1 last:flex-none">
          <div className={`flex items-center gap-1.5 ${i <= currentIndex ? 'text-rose-500' : 'text-gray-300'}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
              i < currentIndex ? 'bg-rose-500 border-rose-500 text-white' :
              i === currentIndex ? 'border-rose-500 text-rose-500' :
              'border-gray-200 text-gray-300'
            }`}>
              {i < currentIndex ? <Check className="w-3 h-3" /> : i + 1}
            </div>
            <span className={`text-xs font-medium hidden sm:block ${i === currentIndex ? 'text-gray-900' : i < currentIndex ? 'text-gray-400' : 'text-gray-300'}`}>
              {STEP_LABELS[s]}
            </span>
          </div>
          {i < STEP_ORDER.length - 1 && (
            <div className={`flex-1 h-px ${i < currentIndex ? 'bg-rose-200' : 'bg-gray-100'}`} />
          )}
        </div>
      ))}
    </div>
  )

  // ── STEP: DATES ──────────────────────────────────────────────────────
  if (step === 'dates') {
    const today = format(new Date(), 'yyyy-MM-dd')
    const minCheckOut = checkIn ? format(addDays(parseISO(checkIn), 1), 'yyyy-MM-dd') : today
    const maxPax = Math.max(...rooms.map(r => r.capacity), 1)

    return (
      <div>
        <StepBar />
        <div className="space-y-5">
          <div>
            <h2 className="text-xl font-bold text-gray-900">When are you staying?</h2>
            <p className="text-sm text-gray-400 mt-1">Select your check-in, check-out, and number of guests.</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3">{error}</div>
          )}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Check-in</label>
                <input
                  type="date"
                  required
                  min={today}
                  value={checkIn}
                  onChange={e => { setCheckIn(e.target.value); if (checkOut && e.target.value >= checkOut) setCheckOut('') }}
                  className={inputCls}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Check-out</label>
                <input
                  type="date"
                  required
                  min={minCheckOut}
                  value={checkOut}
                  onChange={e => setCheckOut(e.target.value)}
                  className={inputCls}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Guests</label>
              <select value={pax} onChange={e => setPax(e.target.value)} className={inputCls}>
                {Array.from({ length: maxPax }, (_, i) => i + 1).map(n => (
                  <option key={n} value={n}>{n} {n === 1 ? 'guest' : 'guests'}</option>
                ))}
              </select>
            </div>

            <button
              onClick={checkAvailability}
              disabled={!checkIn || !checkOut || checking}
              className="w-full bg-rose-500 text-white rounded-xl py-3 text-sm font-semibold hover:bg-rose-600 disabled:opacity-50 transition-colors"
            >
              {checking ? 'Checking availability...' : 'Search available rooms'}
            </button>
          </div>

          {rooms.length === 0 && (
            <p className="text-sm text-center text-gray-400">No rooms available at the moment.</p>
          )}
        </div>
      </div>
    )
  }

  // ── STEP: ROOMS ───────────────────────────────────────────────────────
  if (step === 'rooms') {
    const nights = differenceInDays(parseISO(checkOut), parseISO(checkIn))
    return (
      <div>
        <StepBar />
        <div className="space-y-5">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Available rooms</h2>
              <p className="text-sm text-gray-400 mt-1">
                {format(parseISO(checkIn), 'MMM d')} &ndash; {format(parseISO(checkOut), 'MMM d, yyyy')}
                &nbsp;&middot;&nbsp;{nights} {nights === 1 ? 'night' : 'nights'}
                &nbsp;&middot;&nbsp;{pax} {parseInt(pax) === 1 ? 'guest' : 'guests'}
              </p>
            </div>
            <button
              onClick={() => setStep('dates')}
              className="text-sm text-rose-500 hover:text-rose-600 font-medium"
            >
              Edit
            </button>
          </div>

          {availableRooms.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center space-y-3">
              <CalendarX className="w-10 h-10 text-gray-300 mx-auto" />
              <p className="font-semibold text-gray-800">No rooms available for those dates.</p>
              <p className="text-sm text-gray-400">Try different dates or fewer guests.</p>
              <button
                onClick={() => setStep('dates')}
                className="text-sm text-rose-500 hover:text-rose-600 font-medium"
              >
                Change dates
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {availableRooms.map(({ room, totalPrice, nights }) => (
                <button
                  key={room.id}
                  onClick={() => { setSelectedRoom({ room, totalPrice, nights }); setStep('form') }}
                  className="w-full text-left bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-rose-200 transition-all overflow-hidden group"
                >
                  <RoomPhotoCarousel photos={room.photos ?? []} />
                  <div className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-gray-900">{room.name}</p>
                        <p className="text-sm text-gray-400 mt-0.5">Up to {room.capacity} {room.capacity === 1 ? 'guest' : 'guests'}</p>
                        {room.description && (
                          <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">{room.description}</p>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-gray-900 text-lg">{formatPeso(totalPrice)}</p>
                        <p className="text-xs text-gray-400">{nights} {nights === 1 ? 'night' : 'nights'}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                      <p className="text-xs text-gray-400">
                        {formatPeso(room.weekday_rate)}/night
                        {room.weekend_rate && room.weekend_rate !== room.weekday_rate &&
                          ` · ${formatPeso(room.weekend_rate)}/night (weekends)`}
                      </p>
                      <span className="text-sm text-rose-500 font-semibold group-hover:translate-x-0.5 transition-transform">
                        Select &rarr;
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  // ── STEP: GUEST FORM ──────────────────────────────────────────────────
  if (step === 'form' && selectedRoom) {
    const nights = differenceInDays(parseISO(checkOut), parseISO(checkIn))
    return (
      <div>
        <StepBar />
        <div className="space-y-5">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Your details</h2>
              <p className="text-sm text-gray-400 mt-1">
                {selectedRoom.room.name} &middot; {format(parseISO(checkIn), 'MMM d')} &ndash; {format(parseISO(checkOut), 'MMM d')}
                &nbsp;&middot;&nbsp;{nights} {nights === 1 ? 'night' : 'nights'}
              </p>
            </div>
            <button
              onClick={() => setStep('rooms')}
              className="text-sm text-rose-500 hover:text-rose-600 font-medium"
            >
              Back
            </button>
          </div>

          {/* Price summary */}
          <div className="bg-rose-50 rounded-2xl border border-rose-100 px-5 py-4 flex justify-between items-center">
            <span className="text-sm font-medium text-rose-700">Total amount</span>
            <span className="font-bold text-rose-900 text-xl">{formatPeso(selectedRoom.totalPrice)}</span>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3">{error}</div>
          )}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Full name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={guestName}
                onChange={e => setGuestName(e.target.value)}
                placeholder="Juan dela Cruz"
                className={inputCls}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Contact number <span className="text-red-400">*</span>
              </label>
              <input
                type="tel"
                required
                value={guestContact}
                onChange={e => setGuestContact(e.target.value)}
                placeholder="+63 912 345 6789"
                className={inputCls}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Notes <span className="text-gray-300 font-normal normal-case">(optional)</span>
              </label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={2}
                placeholder="Any special requests?"
                className={inputCls}
              />
            </div>

            <button
              onClick={submitBooking}
              disabled={submitting || !guestName.trim() || !guestContact.trim()}
              className="w-full bg-rose-500 text-white rounded-xl py-3 text-sm font-semibold hover:bg-rose-600 disabled:opacity-50 transition-colors"
            >
              {submitting ? 'Reserving...' : 'Reserve now'}
            </button>

            <p className="text-xs text-center text-gray-400">
              A deposit is required to confirm your booking.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // ── STEP: DONE ────────────────────────────────────────────────────────
  if (step === 'done' && selectedRoom) {
    const nights = differenceInDays(parseISO(checkOut), parseISO(checkIn))
    return (
      <div>
        <StepBar />
        <div className="space-y-5">
          <div className="text-center space-y-2 py-4">
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto">
              <PartyPopper className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Booking request received!</h2>
            <p className="text-sm text-gray-500 max-w-sm mx-auto">
              To confirm your booking, please send a deposit via GCash.
            </p>
          </div>

          {/* Summary card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
            <h3 className="text-sm font-semibold text-gray-700">Booking Summary</h3>
            <Row label="Room" value={selectedRoom.room.name} />
            <Row label="Check-in" value={format(parseISO(checkIn), 'MMMM d, yyyy')} />
            <Row label="Check-out" value={format(parseISO(checkOut), 'MMMM d, yyyy')} />
            <Row label="Nights" value={`${nights} ${nights === 1 ? 'night' : 'nights'}`} />
            <Row label="Guests" value={`${pax} ${parseInt(pax) === 1 ? 'guest' : 'guests'}`} />
            <div className="border-t border-gray-100 pt-3">
              <Row label="Total" value={formatPeso(selectedRoom.totalPrice)} bold />
            </div>
          </div>

          {/* GCash instructions */}
          {(owner.gcash_number || owner.gcash_name) && (
            <div className="bg-green-50 rounded-2xl border border-green-100 p-5 space-y-4">
              <h3 className="text-sm font-semibold text-green-800">Send deposit via GCash</h3>
              <div className="space-y-2">
                {owner.gcash_number && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">GCash Number</span>
                    <span className="font-bold text-green-900">{owner.gcash_number}</span>
                  </div>
                )}
                {owner.gcash_name && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Account Name</span>
                    <span className="font-bold text-green-900">{owner.gcash_name}</span>
                  </div>
                )}
              </div>
              <p className="text-xs text-green-600 leading-relaxed">
                After sending, submit your reference number below so the owner can confirm your booking.
              </p>
            </div>
          )}

          {bookingId && (
            <a
              href={`/book/${owner.slug}/confirm?id=${bookingId}`}
              className="block w-full text-center bg-rose-500 text-white rounded-xl py-3 text-sm font-semibold hover:bg-rose-600 transition-colors"
            >
              Submit GCash reference &rarr;
            </a>
          )}

          <p className="text-xs text-center text-gray-400">
            {owner.property_name} will reach out to you for confirmation.
          </p>
        </div>
      </div>
    )
  }

  return null
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-400">{label}</span>
      <span className={bold ? 'font-semibold text-gray-900' : 'text-gray-700'}>{value}</span>
    </div>
  )
}

const inputCls = 'w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-rose-400 focus:ring-1 focus:ring-rose-400 outline-none transition-colors'
