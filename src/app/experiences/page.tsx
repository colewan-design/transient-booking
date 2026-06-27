import Link from 'next/link'
import { MapPin, Clock, Users, ArrowRight, Star } from 'lucide-react'
import SiteNav from '@/components/SiteNav'

const experiences = [
  {
    title: 'Mountain Trek at Sunrise',
    category: 'Adventure',
    duration: '4–6 hrs',
    groupSize: 'Up to 8',
    rating: 4.9,
    img: '/card-4.png',
    desc: 'Start your morning with a guided sunrise hike through pine forests and misty ridges. No experience needed.',
    highlight: true,
  },
  {
    title: 'Local Cuisine Food Tour',
    category: 'Culture',
    duration: '3 hrs',
    groupSize: 'Up to 12',
    rating: 4.8,
    img: '/card-1.png',
    desc: 'Explore the town\'s best local eateries with a knowledgeable guide. Taste regional delicacies you won\'t find anywhere else.',
    highlight: false,
  },
  {
    title: 'Lakeside Kayaking',
    category: 'Water Sports',
    duration: '2 hrs',
    groupSize: 'Up to 6',
    rating: 4.7,
    img: '/card-2.png',
    desc: 'Paddle across crystal-clear waters surrounded by mountain views. Equipment and brief included.',
    highlight: false,
  },
  {
    title: 'Sunset Bonfire Night',
    category: 'Leisure',
    duration: 'Evening',
    groupSize: 'Up to 20',
    rating: 4.9,
    img: '/card-3.png',
    desc: 'Wind down with a curated bonfire setup, acoustic music, and s\'mores under the stars. Perfect for groups.',
    highlight: true,
  },
  {
    title: 'Farm-to-Table Cooking Class',
    category: 'Culture',
    duration: '3 hrs',
    groupSize: 'Up to 8',
    rating: 4.8,
    img: '/card-1.png',
    desc: 'Pick ingredients straight from the garden and cook a full Filipino meal alongside a local chef.',
    highlight: false,
  },
  {
    title: 'Waterfall Day Trip',
    category: 'Adventure',
    duration: 'Full day',
    groupSize: 'Up to 10',
    rating: 5.0,
    img: '/card-4.png',
    desc: 'A full-day guided excursion to a hidden waterfall deep in the mountains. Swim, explore, and reconnect.',
    highlight: false,
  },
]

const categoryColors: Record<string, string> = {
  Adventure: 'bg-gray-900 text-white',
  Culture: 'bg-[#f0e68a] text-gray-900',
  'Water Sports': 'bg-teal-100 text-teal-800',
  Leisure: 'bg-rose-100 text-rose-800',
}

export default function ExperiencesPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <SiteNav active="experiences" />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gray-900 px-6 py-20 text-center">
        <div
          className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #f0e68a 0%, transparent 55%), radial-gradient(circle at 70% 30%, #0d9488 0%, transparent 50%)' }}
        />
        <div className="relative z-10">
          <p className="text-xs font-bold uppercase tracking-widest text-[#f0e68a] mb-3">Beyond the Room</p>
          <h1 className="text-5xl sm:text-6xl font-bold text-white leading-tight">
            Live the <span className="text-[#f0e68a]">Experience</span>
          </h1>
          <p className="mt-4 text-white/60 max-w-md mx-auto text-base leading-relaxed">
            Curated activities and local adventures — handpicked to make your stay unforgettable.
          </p>
        </div>
      </section>

      {/* ── CATEGORY CHIPS ── */}
      <div className="border-b border-gray-100 sticky top-14 z-40 bg-white">
        <div className="max-w-7xl mx-auto px-6 h-12 flex items-center gap-3 text-sm overflow-x-auto">
          {['All', 'Adventure', 'Culture', 'Water Sports', 'Leisure'].map((cat, i) => (
            <button
              key={cat}
              className={`whitespace-nowrap px-4 py-1 rounded-full transition-colors text-xs font-semibold ${i === 0 ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── FEATURED (first item) ── */}
      <section className="max-w-7xl mx-auto px-6 pt-14 pb-6">
        <p className="text-xs font-bold uppercase tracking-widest text-[#c8a84b] mb-6">Featured Experience</p>
        <div className="relative rounded-3xl overflow-hidden group cursor-pointer" style={{ height: '380px' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={experiences[0].img}
            alt={experiences[0].title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/30 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-10">
            <span className={`self-start text-xs font-bold px-3 py-1 rounded-full mb-3 ${categoryColors[experiences[0].category]}`}>
              {experiences[0].category}
            </span>
            <h2 className="text-3xl font-bold text-white">{experiences[0].title}</h2>
            <p className="mt-2 text-white/70 max-w-md text-sm leading-relaxed">{experiences[0].desc}</p>
            <div className="mt-4 flex items-center gap-5 text-white/60 text-sm">
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{experiences[0].duration}</span>
              <span className="flex items-center gap-1.5"><Users className="w-4 h-4" />{experiences[0].groupSize}</span>
              <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-[#f0e68a] fill-[#f0e68a]" />{experiences[0].rating}</span>
            </div>
            <Link
              href="/login"
              className="mt-5 self-start inline-flex items-center gap-2 px-6 py-2.5 bg-[#f0e68a] text-gray-900 font-semibold text-sm rounded-full hover:bg-[#e8de7a] transition-colors"
            >
              Book Experience <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── GRID ── */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <p className="text-xs font-bold uppercase tracking-widest text-[#c8a84b] mb-6">All Experiences</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {experiences.slice(1).map((exp) => (
            <div key={exp.title} className="group rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300 bg-white">
              <div className="relative h-48 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={exp.img}
                  alt={exp.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />
                <span className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-0.5 rounded-full ${categoryColors[exp.category]}`}>
                  {exp.category}
                </span>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-gray-900 leading-tight">{exp.title}</h3>
                  <span className="flex items-center gap-1 text-xs font-bold text-gray-500 shrink-0">
                    <Star className="w-3 h-3 text-[#c8a84b] fill-[#c8a84b]" />{exp.rating}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed line-clamp-2">{exp.desc}</p>
                <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{exp.duration}</span>
                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{exp.groupSize}</span>
                </div>
                <Link
                  href="/login"
                  className="mt-4 block text-center py-2 bg-gray-900 text-white font-semibold text-xs rounded-full hover:bg-gray-800 transition-colors"
                >
                  Book Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="bg-[#f0e68a] px-6 py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-900">Want a custom experience?</h2>
        <p className="mt-2 text-gray-700 text-sm max-w-sm mx-auto">We'll put together a tailored itinerary just for your group. Tell us what you love.</p>
        <Link
          href="/contact"
          className="mt-6 inline-flex items-center gap-2 px-7 py-3 bg-gray-900 text-white font-semibold rounded-full hover:bg-gray-800 transition-colors text-sm"
        >
          Get in touch <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      <footer className="border-t border-gray-100 px-6 py-8 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} TransientBook &middot; No double-booking. No missed inquiries. No OTA commission.
      </footer>
    </div>
  )
}
