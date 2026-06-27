import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import RoomForm from '@/components/RoomForm'
import type { Owner, Room } from '@/lib/types'

export default async function EditRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: owner } = await supabase
    .from('owners')
    .select('id')
    .eq('user_id', user.id)
    .single() as { data: Owner | null }

  if (!owner) redirect('/dashboard/settings')

  const { data: room } = await supabase
    .from('rooms')
    .select('*')
    .eq('id', id)
    .eq('owner_id', owner.id)
    .single() as { data: Room | null }

  if (!room) notFound()

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-gray-900">Edit Room</h1>
      <RoomForm ownerId={owner.id} room={room} />
    </div>
  )
}
