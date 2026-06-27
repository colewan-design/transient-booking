export type BookingStatus = 'pending' | 'confirmed' | 'cancelled'

export interface Owner {
  id: string
  user_id: string
  name: string
  contact: string | null
  gcash_number: string | null
  gcash_name: string | null
  property_name: string
  slug: string
  created_at: string
}

export interface Room {
  id: string
  owner_id: string
  name: string
  capacity: number
  weekday_rate: number
  weekend_rate: number | null
  description: string | null
  is_active: boolean
  created_at: string
}

export interface BlockedDate {
  id: string
  room_id: string
  date: string
  created_at: string
}

export interface Booking {
  id: string
  room_id: string
  owner_id: string
  guest_name: string
  guest_contact: string
  check_in: string
  check_out: string
  pax: number
  status: BookingStatus
  deposit_ref: string | null
  deposit_proof_url: string | null
  total_amount: number | null
  notes: string | null
  created_at: string
  room?: Room
}

export interface RoomAvailability {
  room: Room
  is_available: boolean
  total_price: number
}
