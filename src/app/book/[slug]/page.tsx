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
      <header className="bg-slate-900 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 h-14 flex items-center justify-between">
          <div>
            <h1 className="font-black text-white uppercase tracking-wide text-sm">{owner.property_name}</h1>
            {owner.contact && (
              <p className="text-xs text-white/40">{owner.contact}</p>
            )}
          </div>
          <img src="/logo.png" alt="TransientBook" className="h-7 w-auto" />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8">
        <GuestBookingFlow owner={owner} rooms={rooms ?? []} />
      </main>
    </div>
  )
}
