'use client'

import { useState } from 'react'
import { format, parseISO } from 'date-fns'
import { CheckCircle2, XCircle, Inbox } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatPeso } from '@/lib/utils'
import type { Booking, Owner } from '@/lib/types'

export default function DepositForm({ booking, owner }: { booking: Booking; owner: Owner }) {
  const supabase = createClient()
  const [ref, setRef] = useState(booking.deposit_ref ?? '')
  const [file, setFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (booking.status === 'confirmed') {
    return (
      <div className="text-center space-y-4 py-10">
        <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8 text-green-500" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">Your booking is confirmed!</h2>
        <p className="text-sm text-gray-500">
          {owner.property_name} will see you on your check-in date.
        </p>
        <BookingSummary booking={booking} />
      </div>
    )
  }

  if (booking.status === 'cancelled') {
    return (
      <div className="text-center space-y-3 py-10">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto">
          <XCircle className="w-8 h-8 text-red-400" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">This booking has been cancelled.</h2>
        <p className="text-sm text-gray-500">Contact the property for any questions.</p>
      </div>
    )
  }

  if (done) {
    return (
      <div className="text-center space-y-4 py-10">
        <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto">
          <Inbox className="w-8 h-8 text-blue-400" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">Deposit info received!</h2>
        <p className="text-sm text-gray-500">
          {owner.property_name} will review it and send you a confirmation shortly.
        </p>
        <BookingSummary booking={booking} />
      </div>
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!ref.trim() && !file) {
      setError('Please enter a reference number or upload a payment screenshot.')
      return
    }

    setSubmitting(true)
    setError(null)

    let proofUrl: string | null = null

    if (file) {
      const ext = file.name.split('.').pop()
      const path = `${booking.id}/${Date.now()}.${ext}`
      const { error: uploadErr } = await supabase.storage
        .from('deposits')
        .upload(path, file, { upsert: true })

      if (uploadErr) {
        setError('Could not upload file. Please try again.')
        setSubmitting(false)
        return
      }

      const { data: { publicUrl } } = supabase.storage.from('deposits').getPublicUrl(path)
      proofUrl = publicUrl
    }

    const { error: updateErr } = await supabase
      .from('bookings')
      .update({
        deposit_ref: ref.trim() || null,
        deposit_proof_url: proofUrl,
      })
      .eq('id', booking.id)

    if (updateErr) {
      setError('Something went wrong. Please try again.')
      setSubmitting(false)
      return
    }

    setDone(true)
    setSubmitting(false)
  }

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-base font-semibold text-gray-900">Submit Deposit</h2>
        <p className="text-sm text-gray-500">
          After sending via GCash, enter your reference number or upload a screenshot.
        </p>
      </div>

      <BookingSummary booking={booking} />

      {(owner.gcash_number || owner.gcash_name) && (
        <div className="bg-green-50 rounded-xl border border-green-100 p-4 space-y-2">
          <p className="text-sm font-semibold text-green-800">GCash Details:</p>
          {owner.gcash_number && (
            <p className="text-sm text-green-900">
              <span className="text-green-700">Number: </span>
              <strong>{owner.gcash_number}</strong>
            </p>
          )}
          {owner.gcash_name && (
            <p className="text-sm text-green-900">
              <span className="text-green-700">Name: </span>
              <strong>{owner.gcash_name}</strong>
            </p>
          )}
          {booking.total_amount && (
            <p className="text-sm text-green-900">
              <span className="text-green-700">Amount: </span>
              <strong>{formatPeso(booking.total_amount)}</strong>
            </p>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
        {error && <div className="bg-red-50 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>}

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">GCash Reference Number</label>
          <input
            type="text"
            value={ref}
            onChange={e => setRef(e.target.value)}
            placeholder="e.g. 1234567890"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Payment Screenshot (optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={e => setFile(e.target.files?.[0] ?? null)}
            className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 text-white rounded-lg py-3 text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {submitting ? 'Submitting...' : 'Submit Deposit'}
        </button>
      </form>
    </div>
  )
}

function BookingSummary({ booking }: { booking: Booking }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-2">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Your Booking</p>
      <p className="text-sm font-medium text-gray-900">{booking.room?.name}</p>
      <p className="text-sm text-gray-500">
        {format(parseISO(booking.check_in), 'MMM d')} – {format(parseISO(booking.check_out), 'MMM d, yyyy')}
      </p>
      {booking.total_amount && (
        <p className="text-sm font-semibold text-gray-800">{formatPeso(booking.total_amount)}</p>
      )}
    </div>
  )
}
