'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function BookingActions({ bookingId }: { bookingId: string }) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState<'confirm' | 'cancel' | null>(null)

  async function updateStatus(status: 'confirmed' | 'cancelled') {
    setLoading(status === 'confirmed' ? 'confirm' : 'cancel')
    await supabase.from('bookings').update({ status }).eq('id', bookingId)
    router.refresh()
    setLoading(null)
  }

  return (
    <div className="flex gap-3">
      <button
        onClick={() => updateStatus('confirmed')}
        disabled={loading !== null}
        className="flex-1 py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
      >
        {loading === 'confirm' ? 'Processing...' : <><Check className="w-4 h-4 inline mr-1" />Confirm Booking</>}
      </button>
      <button
        onClick={() => updateStatus('cancelled')}
        disabled={loading !== null}
        className="flex-1 py-2.5 bg-red-50 text-red-700 text-sm font-medium rounded-lg hover:bg-red-100 disabled:opacity-50 transition-colors"
      >
        {loading === 'cancel' ? 'Processing...' : 'Cancel'}
      </button>
    </div>
  )
}
