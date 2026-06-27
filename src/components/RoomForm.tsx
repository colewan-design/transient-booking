'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Room } from '@/lib/types'

interface Props {
  ownerId: string
  room?: Room
}

export default function RoomForm({ ownerId, room }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const [name, setName] = useState(room?.name ?? '')
  const [capacity, setCapacity] = useState(String(room?.capacity ?? ''))
  const [weekdayRate, setWeekdayRate] = useState(String(room?.weekday_rate ?? ''))
  const [weekendRate, setWeekendRate] = useState(String(room?.weekend_rate ?? ''))
  const [description, setDescription] = useState(room?.description ?? '')
  const [isActive, setIsActive] = useState(room?.is_active ?? true)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const payload = {
      owner_id: ownerId,
      name: name.trim(),
      capacity: parseInt(capacity),
      weekday_rate: parseFloat(weekdayRate),
      weekend_rate: weekendRate ? parseFloat(weekendRate) : null,
      description: description.trim() || null,
      is_active: isActive,
    }

    let err
    if (room) {
      ;({ error: err } = await supabase.from('rooms').update(payload).eq('id', room.id))
    } else {
      ;({ error: err } = await supabase.from('rooms').insert(payload))
    }

    if (err) {
      setError(err.message)
      setLoading(false)
      return
    }

    router.push('/dashboard/rooms')
    router.refresh()
  }

  async function handleDelete() {
    if (!room || !confirm(`Sigurado ka bang i-delete ang "${room.name}"?`)) return
    setDeleting(true)
    await supabase.from('rooms').delete().eq('id', room.id)
    router.push('/dashboard/rooms')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
      {error && (
        <div className="bg-red-50 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>
      )}

      <Field label="Pangalan ng Room" required>
        <input
          type="text"
          required
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. Deluxe Room 1, Family Suite"
          className={inputCls}
        />
      </Field>

      <Field label="Max na Tao" required>
        <input
          type="number"
          required
          min={1}
          value={capacity}
          onChange={e => setCapacity(e.target.value)}
          placeholder="4"
          className={inputCls}
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Weekday Rate (₱/gabi)" required>
          <input
            type="number"
            required
            min={0}
            step="0.01"
            value={weekdayRate}
            onChange={e => setWeekdayRate(e.target.value)}
            placeholder="1500"
            className={inputCls}
          />
        </Field>
        <Field label="Weekend Rate (₱/gabi)">
          <input
            type="number"
            min={0}
            step="0.01"
            value={weekendRate}
            onChange={e => setWeekendRate(e.target.value)}
            placeholder="2000 (optional)"
            className={inputCls}
          />
        </Field>
      </div>

      <Field label="Description (optional)">
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={2}
          placeholder="May CR, aircon, hot shower..."
          className={inputCls}
        />
      </Field>

      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={isActive}
          onChange={e => setIsActive(e.target.checked)}
          className="w-4 h-4 rounded border-gray-300 text-blue-600"
        />
        <span className="text-sm text-gray-700">Active (nakita ng guests)</span>
      </label>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Sine-save...' : room ? 'I-update' : 'I-save ang Room'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2.5 text-sm text-gray-600 hover:text-gray-800 transition-colors"
        >
          Cancel
        </button>
      </div>

      {room && (
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="w-full text-sm text-red-500 hover:text-red-700 transition-colors pt-1"
        >
          {deleting ? 'Dini-delete...' : 'I-delete ang room na ito'}
        </button>
      )}
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

const inputCls = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none'
