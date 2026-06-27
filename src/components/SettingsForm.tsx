'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { slugify } from '@/lib/utils'
import type { Owner } from '@/lib/types'

export default function SettingsForm({ userId, owner }: { userId: string; owner: Owner | null }) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [name, setName] = useState(owner?.name ?? '')
  const [propertyName, setPropertyName] = useState(owner?.property_name ?? '')
  const [slug, setSlug] = useState(owner?.slug ?? '')
  const [contact, setContact] = useState(owner?.contact ?? '')
  const [gcashNumber, setGcashNumber] = useState(owner?.gcash_number ?? '')
  const [gcashName, setGcashName] = useState(owner?.gcash_name ?? '')

  function handlePropertyNameChange(val: string) {
    setPropertyName(val)
    if (!owner) setSlug(slugify(val))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    const payload = {
      user_id: userId,
      name: name.trim(),
      property_name: propertyName.trim(),
      slug: slug.trim(),
      contact: contact.trim() || null,
      gcash_number: gcashNumber.trim() || null,
      gcash_name: gcashName.trim() || null,
    }

    let err
    if (owner) {
      ;({ error: err } = await supabase.from('owners').update(payload).eq('id', owner.id))
    } else {
      ;({ error: err } = await supabase.from('owners').insert(payload))
    }

    if (err) {
      if (err.message.includes('unique') || err.code === '23505') {
        setError('That URL slug is already taken. Please choose another.')
      } else {
        setError(err.message)
      }
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
    router.refresh()
  }

  const bookingUrl = slug ? `${process.env.NEXT_PUBLIC_APP_URL ?? window?.location?.origin}/book/${slug}` : ''

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
      {error && <div className="bg-red-50 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>}
      {success && <div className="bg-green-50 text-green-700 text-sm rounded-lg px-4 py-3">Settings saved!</div>}

      <h2 className="text-sm font-semibold text-gray-700">Property Info</h2>

      <Field label="Your Name" required>
        <input type="text" required value={name} onChange={e => setName(e.target.value)}
          placeholder="Juan dela Cruz" className={inputCls} />
      </Field>

      <Field label="Property Name" required>
        <input type="text" required value={propertyName}
          onChange={e => handlePropertyNameChange(e.target.value)}
          placeholder="Dela Cruz Transient House" className={inputCls} />
      </Field>

      <Field label="Booking Link Slug" required>
        <div className="flex items-center gap-0">
          <span className="px-3 py-2 bg-gray-50 border border-r-0 border-gray-300 rounded-l-lg text-sm text-gray-500">
            /book/
          </span>
          <input type="text" required value={slug}
            onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
            placeholder="dela-cruz-transient"
            className="flex-1 rounded-l-none rounded-r-lg border border-gray-300 px-3 py-2 text-sm focus:border-rose-400 focus:ring-1 focus:ring-rose-400 outline-none transition-colors" />
        </div>
        {bookingUrl && (
          <p className="text-xs text-gray-400 mt-1">Your link: <span className="text-rose-500">{bookingUrl}</span></p>
        )}
      </Field>

      <Field label="Contact (shown to guests)">
        <input type="text" value={contact} onChange={e => setContact(e.target.value)}
          placeholder="+63 912 345 6789" className={inputCls} />
      </Field>

      <div className="border-t border-gray-100 pt-4 space-y-4">
        <h2 className="text-sm font-semibold text-gray-700">GCash Details</h2>
        <p className="text-xs text-gray-500">
          Guests will see this for deposit payments.
        </p>

        <Field label="GCash Number">
          <input type="text" value={gcashNumber} onChange={e => setGcashNumber(e.target.value)}
            placeholder="0912 345 6789" className={inputCls} />
        </Field>

        <Field label="GCash Account Name">
          <input type="text" value={gcashName} onChange={e => setGcashName(e.target.value)}
            placeholder="JUAN D." className={inputCls} />
        </Field>
      </div>

      <button type="submit" disabled={loading}
        className="w-full bg-rose-500 text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-rose-600 disabled:opacity-50 transition-colors">
        {loading ? 'Saving...' : 'Save Settings'}
      </button>
    </form>
  )
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}

const inputCls = 'w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-rose-400 focus:ring-1 focus:ring-rose-400 outline-none transition-colors'
