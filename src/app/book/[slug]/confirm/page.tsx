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
      <header className="bg-white border-b border-gray-100 px-4 py-4">
        <div className="max-w-lg mx-auto">
          <h1 className="text-lg font-bold text-gray-900">{owner.property_name}</h1>
        </div>
      </header>
      <div className="max-w-lg mx-auto px-4 py-6">
        <DepositForm booking={booking} owner={owner} />
      </div>
    </main>
  )
}
