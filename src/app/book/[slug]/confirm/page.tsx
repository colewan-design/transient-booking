import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DepositForm from '@/components/DepositForm'
import type { Booking, Owner } from '@/lib/types'

export default async function ConfirmPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ id?: string }>
}) {
  const { slug } = await params
  const { id } = await searchParams
  const supabase = await createClient()

  if (!id) notFound()

  const { data: owner } = await supabase
    .from('owners')
    .select('*')
    .eq('slug', slug)
    .single() as { data: Owner | null }

  if (!owner) notFound()

  const { data: booking } = await supabase
    .from('bookings')
    .select('*, room:rooms(name)')
    .eq('id', id)
    .eq('owner_id', owner.id)
    .single() as { data: Booking | null }

  if (!booking) notFound()

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-slate-900 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-6 h-14 flex items-center justify-between">
          <h1 className="font-black text-white uppercase tracking-wide text-sm">{owner.property_name}</h1>
          <img src="/logo.png" alt="TransientBook" className="h-7 w-auto" />
        </div>
      </header>
      <div className="max-w-lg mx-auto px-4 py-6">
        <DepositForm booking={booking} owner={owner} />
      </div>
    </main>
  )
}
