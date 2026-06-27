import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import GuestBookingFlow from '@/components/GuestBookingFlow'
import type { Owner, Room } from '@/lib/types'

export default async function GuestBookingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: owner } = await supabase
    .from('owners')
    .select('*')
    .eq('slug', slug)
    .single() as { data: Owner | null }

  if (!owner) notFound()

  const { data: rooms } = await supabase
    .from('rooms')
    .select('*')
    .eq('owner_id', owner.id)
    .eq('is_active', true)
    .order('weekday_rate', { ascending: true }) as { data: Room[] | null }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-4 py-4">
        <div className="max-w-lg mx-auto">
          <h1 className="text-lg font-bold text-gray-900">{owner.property_name}</h1>
          {owner.contact && (
            <p className="text-sm text-gray-500">{owner.contact}</p>
          )}
        </div>
      </header>
      <div className="max-w-lg mx-auto px-4 py-6">
        <GuestBookingFlow owner={owner} rooms={rooms ?? []} />
      </div>
    </main>
  )
}
