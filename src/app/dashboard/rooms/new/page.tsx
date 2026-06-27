import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import RoomForm from '@/components/RoomForm'
import type { Owner } from '@/lib/types'

export default async function NewRoomPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: owner } = await supabase
    .from('owners')
    .select('id')
    .eq('user_id', user.id)
    .single() as { data: Owner | null }

  if (!owner) redirect('/dashboard/settings')

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-gray-900">New Room</h1>
      <RoomForm ownerId={owner.id} />
    </div>
  )
}
