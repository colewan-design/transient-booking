'use client'

import { useState } from 'react'
import { format, parseISO } from 'date-fns'
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
        <div className="text-4xl">✅</div>
        <h2 className="text-lg font-bold text-gray-900">Confirmed na ang iyong booking!</h2>
        <p className="text-sm text-gray-500">
          Makikita ka ng {owner.property_name} sa iyong check-in date.
        </p>
        <BookingSummary booking={booking} />
      </div>
    )
  }

  if (booking.status === 'cancelled') {
    return (
      <div className="text-center space-y-3 py-10">
        <div className="text-4xl">❌</div>
        <h2 className="text-lg font-bold text-gray-900">Na-cancel ang booking na ito.</h2>
        <p className="text-sm text-gray-500">Makipag-ugnayan sa property para sa katanungan.</p>
      </div>
    )
  }

  if (done) {
    return (
      <div className="text-center space-y-4 py-10">
        <div className="text-4xl">📩</div>
        <h2 className="text-lg font-bold text-gray-900">Na-receive ang iyong deposit info!</h2>
        <p className="text-sm text-gray-500">
          Ire-review ng {owner.property_name} at bibigyan ka ng confirmation.
          Pasensya na habang hinihintay mo.
        </p>
        <BookingSummary booking={booking} />
      </div>
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!ref.trim() && !file) {
      setError('Mag-enter ng reference number o mag-upload ng screenshot ng payment.')
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
        setError('Hindi ma-upload ang file. Subukan ulit.')
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
      setError('May error. Subukan ulit.')
      setSubmitting(false)
      return
    }

    setDone(true)
    setSubmitting(false)
  }

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-base font-semibold text-gray-900">I-submit ang Deposit</h2>
        <p className="text-sm text-gray-500">
          Pagkatapos mag-GCash, i-enter ang reference number o mag-upload ng screenshot.
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
              <span className="text-green-700">Halaga: </span>
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
            Screenshot ng Payment (optional)
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
          {submitting ? 'Nagsu-submit...' : 'I-submit ang Deposit'}
        </button>
      </form>
    </div>
  )
}

function BookingSummary({ booking }: { booking: Booking }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-2">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Iyong Booking</p>
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
