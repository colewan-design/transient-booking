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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 h-16 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-gray-900">{owner.property_name}</h1>
            {owner.contact && (
              <p className="text-xs text-gray-400">{owner.contact}</p>
            )}
          </div>
          <span className="text-rose-500 font-bold text-sm tracking-tight">TransientBook</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8">
        <GuestBookingFlow owner={owner} rooms={rooms ?? []} />
      </main>
    </div>
  )
}
