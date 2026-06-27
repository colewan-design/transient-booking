'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ImagePlus, X, Loader2 } from 'lucide-react'
import type { Room } from '@/lib/types'

interface Props {
  ownerId: string
  room?: Room
}

export default function RoomForm({ ownerId, room }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const [name, setName] = useState(room?.name ?? '')
  const [capacity, setCapacity] = useState(String(room?.capacity ?? ''))
  const [weekdayRate, setWeekdayRate] = useState(String(room?.weekday_rate ?? ''))
  const [weekendRate, setWeekendRate] = useState(String(room?.weekend_rate ?? ''))
  const [description, setDescription] = useState(room?.description ?? '')
  const [isActive, setIsActive] = useState(room?.is_active ?? true)
  const [photos, setPhotos] = useState<string[]>(room?.photos ?? [])
  const [uploading, setUploading] = useState(false)

  async function handlePhotoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    if (photos.length + files.length > 8) {
      setError('Maximum of 8 photos per room.')
      return
    }

    setUploading(true)
    setError(null)

    const uploadedUrls: string[] = []
    for (const file of files) {
      const ext = file.name.split('.').pop()
      const path = `${ownerId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error: uploadErr } = await supabase.storage
        .from('room-photos')
        .upload(path, file, { upsert: false })

      if (uploadErr) {
        setError(`Failed to upload ${file.name}. Please try again.`)
        setUploading(false)
        if (fileInputRef.current) fileInputRef.current.value = ''
        return
      }

      const { data: { publicUrl } } = supabase.storage.from('room-photos').getPublicUrl(path)
      uploadedUrls.push(publicUrl)
    }

    setPhotos(prev => [...prev, ...uploadedUrls])
    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function removePhoto(url: string) {
    const path = url.split('/room-photos/')[1]
    if (path) {
      await supabase.storage.from('room-photos').remove([path])
    }
    setPhotos(prev => prev.filter(p => p !== url))
  }

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
      photos,
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
    if (!room || !confirm(`Are you sure you want to delete "${room.name}"?`)) return
    setDeleting(true)
    await supabase.from('rooms').delete().eq('id', room.id)
    router.push('/dashboard/rooms')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-5">
      {error && (
        <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3">{error}</div>
      )}

      <Field label="Room Name" required>
        <input
          type="text"
          required
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. Deluxe Room 1, Family Suite"
          className={inputCls}
        />
      </Field>

      <Field label="Max Guests" required>
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
        <Field label="Weekday Rate (₱/night)" required>
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
        <Field label="Weekend Rate (₱/night)">
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
          placeholder="Air-conditioned, private bathroom, hot shower..."
          className={inputCls}
        />
      </Field>

      {/* Photo upload */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            Photos <span className="text-gray-400 font-normal">({photos.length}/8)</span>
          </label>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || photos.length >= 8}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-rose-600 bg-rose-50 rounded-lg hover:bg-rose-100 disabled:opacity-50 transition-colors"
          >
            {uploading ? (
              <><Loader2 className="w-4 h-4 animate-spin" />Uploading...</>
            ) : (
              <><ImagePlus className="w-4 h-4" />Add photos</>
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handlePhotoSelect}
          />
        </div>

        {photos.length > 0 ? (
          <div className="grid grid-cols-3 gap-2">
            {photos.map((url, i) => (
              <div key={url} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={`Room photo ${i + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removePhoto(url)}
                  className="absolute top-1 right-1 w-6 h-6 bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                {i === 0 && (
                  <span className="absolute bottom-1 left-1 text-xs bg-black/60 text-white px-1.5 py-0.5 rounded-md">
                    Cover
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full border-2 border-dashed border-gray-200 rounded-xl py-8 flex flex-col items-center gap-2 text-gray-400 hover:border-rose-200 hover:text-rose-400 transition-colors"
          >
            <ImagePlus className="w-6 h-6" />
            <span className="text-sm">Click to upload room photos</span>
            <span className="text-xs">JPG, PNG, WEBP · Max 8 photos</span>
          </button>
        )}
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={isActive}
          onChange={e => setIsActive(e.target.checked)}
          className="w-4 h-4 rounded border-gray-300 text-rose-500"
        />
        <span className="text-sm text-gray-700">Active (visible to guests)</span>
      </label>

      <div className="flex items-center gap-3 pt-1">
        <button
          type="submit"
          disabled={loading || uploading}
          className="flex-1 bg-rose-500 text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-rose-600 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Saving...' : room ? 'Update Room' : 'Save Room'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          Cancel
        </button>
      </div>

      {room && (
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="w-full text-sm text-red-400 hover:text-red-600 transition-colors pt-1"
        >
          {deleting ? 'Deleting...' : 'Delete this room'}
        </button>
      )}
    </form>
  )
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-gray-700">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}

const inputCls = 'w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-rose-400 focus:ring-1 focus:ring-rose-400 outline-none transition-colors'
