import Link from 'next/link'
import { Star, Users, ArrowRight, Wifi, Wind, Tv, Coffee } from 'lucide-react'
import SiteNav from '@/components/SiteNav'

const rooms = [
  {
    name: 'Pine Log Suite',
    img: '/card-1.png',
    capacity: 2,
    weekday: 500,
    weekend: 700,
    badge: 'Best Value',
    badgeColor: 'bg-[#f0e68a] text-gray-900',
    rating: 4.8,
    desc: 'Cozy and affordable. Perfect for solo travelers or couples looking for a quiet escape.',
    amenities: ['Wi-Fi', 'Air Con', 'Smart TV', 'Coffee'],
  },
  {
    name: 'Family Retreat',
    img: '/card-2.png',
    capacity: 10,
    weekday: 1200,
    weekend: 1500,
    badge: 'Most Popular',
    badgeColor: 'bg-gray-900 text-white',
    rating: 4.9,
    desc: 'Spacious suite designed for large groups and families. Every comfort you need under one roof.',
    amenities: ['Wi-Fi', 'Air Con', 'Smart TV', 'Coffee'],
  },
  {
    name: 'Deluxe Room',
    img: '/card-3.png',
    capacity: 4,
    weekday: 1200,
    weekend: 2000,
    badge: 'Premium',
    badgeColor: 'bg-[#f0e68a] text-gray-900',
    rating: 4.9,
    desc: 'Elevated interiors, premium bedding, and sweeping views. The finest stay in the property.',
    amenities: ['Wi-Fi', 'Air Con', 'Smart TV', 'Coffee'],
  },
  {
    name: 'Weekend Getaway',
    img: '/card-4.png',
    capacity: 6,
    weekday: 900,
    weekend: 1300,
    badge: 'Great Weekends',
    badgeColor: 'bg-gray-900 text-white',
    rating: 4.7,
    desc: 'Tailored for weekend warriors. Book Friday to Sunday for the best rates and the best vibes.',
    amenities: ['Wi-Fi', 'Air Con', 'Smart TV', 'Coffee'],
  },
]

const amenityIcons: Record<string, React.ReactNode> = {
  'Wi-Fi': <Wifi className="w-3.5 h-3.5" />,
  'Air Con': <Wind className="w-3.5 h-3.5" />,
  'Smart TV': <Tv className="w-3.5 h-3.5" />,
  'Coffee': <Coffee className="w-3.5 h-3.5" />,
}

export default function RoomsPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <SiteNav active="rooms" />

      {/* ── HERO ── */}
      <section className="bg-gray-900 px-6 py-20 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-[#f0e68a] mb-3">Our Spaces</p>
        <h1 className="text-5xl sm:text-6xl font-bold text-white leading-tight">
          Find Your<br />
          Perfect <span className="text-[#f0e68a]">Room</span>
        </h1>
        <p className="mt-4 text-white/60 max-w-md mx-auto text-base leading-relaxed">
          From budget-friendly stays to premium suites — every room is handpicked for comfort and style.
        </p>
      </section>

      {/* ── FILTER BAR ── */}
      <div className="border-b border-gray-100 sticky top-14 z-40 bg-white">
        <div className="max-w-7xl mx-auto px-6 h-12 flex items-center gap-6 text-sm">
          {['All Rooms', 'Budget', 'Family', 'Deluxe', 'Weekend'].map((f, i) => (
            <button
              key={f}
              className={`whitespace-nowrap pb-0.5 transition-colors ${i === 0 ? 'font-semibold text-gray-900 border-b-2 border-gray-900' : 'text-gray-400 hover:text-gray-700'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* ── ROOM GRID ── */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {rooms.map((room) => (
            <div key={room.name} className="group rounded-3xl overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300 bg-white">

              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={room.img}
                  alt={room.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />
                <span className={`absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-full ${room.badgeColor}`}>
                  {room.badge}
                </span>
                <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1">
                  <Star className="w-3.5 h-3.5 text-[#c8a84b] fill-[#c8a84b]" />
                  <span className="text-xs font-bold text-gray-900">{room.rating}</span>
                </div>
              </div>

              {/* Info */}
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{room.name}</h2>
                    <div className="flex items-center gap-1 mt-1 text-gray-400 text-sm">
                      <Users className="w-3.5 h-3.5" />
                      <span>Up to {room.capacity} guests</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-2xl font-bold text-gray-900">₱{room.weekday.toLocaleString()}</p>
                    <p className="text-xs text-gray-400">per night</p>
                  </div>
                </div>

                <p className="mt-3 text-sm text-gray-500 leading-relaxed">{room.desc}</p>

                {/* Amenities */}
                <div className="mt-4 flex items-center gap-3 flex-wrap">
                  {room.amenities.map((a) => (
                    <span key={a} className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full">
                      {amenityIcons[a]}
                      {a}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <div className="mt-5 flex items-center gap-3">
                  <Link
                    href="/login"
                    className="flex-1 text-center py-2.5 bg-[#f0e68a] text-gray-900 font-semibold text-sm rounded-full hover:bg-[#e8de7a] transition-colors"
                  >
                    Book This Room
                  </Link>
                  {room.weekend && (
                    <p className="text-xs text-gray-400 shrink-0">
                      ₱{room.weekend.toLocaleString()} / weekend
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="bg-[#f9f9f7] border-t border-gray-100 px-6 py-16 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-[#c8a84b] mb-3">Can't decide?</p>
        <h2 className="text-3xl font-bold text-gray-900">Talk to us directly</h2>
        <p className="mt-2 text-gray-500 text-sm max-w-sm mx-auto">We'll help you pick the right room for your group, dates, and budget.</p>
        <Link
          href="/contact"
          className="mt-6 inline-flex items-center gap-2 px-7 py-3 bg-gray-900 text-white font-semibold rounded-full hover:bg-gray-800 transition-colors text-sm"
        >
          Contact us <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      <footer className="border-t border-gray-100 px-6 py-8 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} TransientBook &middot; No double-booking. No missed inquiries. No OTA commission.
      </footer>
    </div>
  )
}
