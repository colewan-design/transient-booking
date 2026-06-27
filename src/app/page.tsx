import { redirect } from 'next/navigation'
import Link from 'next/link'
import { MapPin, Calendar, Users, ChevronDown, Star, ShieldCheck, Banknote, Zap, ArrowRight } from 'lucide-react'
import SiteNav from '@/components/SiteNav'

const steps = [
  { title: 'Create Your Page', desc: 'Set up your property profile and booking link in under 5 minutes.' },
  { title: 'Share the Link', desc: 'Paste it in Messenger, Viber, or any chat when guests inquire.' },
  { title: 'Guests Book Themselves', desc: 'They pick dates, choose a room, and send the GCash deposit.' },
  { title: 'You Keep Everything', desc: 'Zero OTA commission. Every peso goes directly to you.' },
]

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string; next?: string }>
}) {
  const params = await searchParams
  if (params.code) {
    const qs = new URLSearchParams({ code: params.code, ...(params.next ? { next: params.next } : {}) })
    redirect(`/auth/callback?${qs}`)
  }

  return (
    <div className="min-h-screen bg-white font-sans">

      <SiteNav active="locations" />

      {/* ── HERO ────────────────────────────────────────────────── */}
      <main className="relative pb-28" style={{ minHeight: 'calc(100vh - 56px)' }}>
        <div className="relative w-full h-full" style={{ minHeight: 'calc(100vh - 56px)' }}>

          {/* Background image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/card-3.png"
            alt="Luxury cabin"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />

          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/60" />

          {/* ── Headline ── */}
          <div className="relative pt-14 text-center px-6 z-10">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1]">
              Find Your<br />
              Perfect{' '}
              <span className="text-[#f0e68a]">Space</span>
            </h1>
            <p className="mt-4 text-white/75 text-base sm:text-lg max-w-md mx-auto leading-relaxed">
              Discover Handpicked Luxury Rooms In Beautiful Locations. Unplug, Unwind, And Reconnect With What Matters Most.
            </p>
          </div>

          {/* ── Feature badges ── */}
          <div className="relative z-10 mt-10 flex flex-col items-center gap-3 px-6">
            {/* Top badge */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#1a1a1a]/70 backdrop-blur-sm text-white text-sm font-medium border border-white/10">
              <span className="w-2 h-2 rounded-full bg-[#f0e68a]" />
              Self Check-in
            </div>
            {/* Two flanking badges */}
            <div className="flex items-center gap-4 mt-1">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#1a1a1a]/60 backdrop-blur-sm text-white text-sm font-medium border border-white/10">
                <span className="w-2 h-2 rounded-full bg-[#f0e68a]" />
                Wi-Fi 100 Mbps
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#1a1a1a]/60 backdrop-blur-sm text-white text-sm font-medium border border-white/10">
                <span className="w-2 h-2 rounded-full bg-[#f0e68a]" />
                Pet Friendly
              </div>
            </div>
          </div>

          {/* ── Body copy ── */}
          <div className="relative z-10 mt-8 text-center px-6">
            <p className="text-white/80 text-sm sm:text-base font-medium leading-relaxed">
              Experience The Perfect Blend Of Comfort And<br className="hidden sm:block" />
              Nature, Crafted For Your Ultimate Escape.
            </p>
          </div>

          {/* ── Map thumbnail – bottom left ── */}
          <div className="absolute bottom-7 left-7 z-10">
            <div className="w-[90px] h-[90px] rounded-full overflow-hidden border-[3px] border-white/80 shadow-xl">
              <div className="w-full h-full bg-gradient-to-br from-emerald-100 via-teal-200 to-green-300 flex items-center justify-center relative">
                {/* simple map placeholder */}
                <div className="absolute inset-0 opacity-40"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, #6ee7b7 0, #6ee7b7 1px, transparent 0, transparent 50%), repeating-linear-gradient(90deg, #6ee7b7 0, #6ee7b7 1px, transparent 0, transparent 50%)',
                    backgroundSize: '14px 14px',
                  }}
                />
                <MapPin className="w-5 h-5 text-teal-800 relative z-10" />
              </div>
            </div>
          </div>

          {/* ── Rating – bottom right ── */}
          <div className="absolute bottom-7 right-7 z-10 text-right">
            <div className="flex items-center justify-end gap-1.5">
              <Star className="w-5 h-5 text-[#f0e68a] fill-[#f0e68a]" />
              <span className="text-4xl font-bold text-white leading-none">4.9</span>
            </div>
            <p className="text-white/60 text-xs mt-1">from 2,400+ stays</p>
          </div>

        </div>
      </main>

      {/* ── BOOKING BAR ─────────────────────────────────────────── */}
      <div className="fixed bottom-5 inset-x-0 z-50 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-full shadow-2xl border border-gray-100 flex items-stretch">

          {/* Room */}
          <div className="flex items-center gap-3 px-5 py-3.5 flex-1 min-w-0 cursor-pointer hover:bg-gray-50/80 rounded-l-full transition-colors">
            <div className="flex items-center justify-center text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest leading-none">Room</p>
              <p className="text-sm font-semibold text-gray-900 mt-0.5 truncate">Pine Log</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-300 shrink-0" />
          </div>

          <div className="w-px bg-gray-100 my-3" />

          {/* Check-in */}
          <div className="flex items-center gap-3 px-5 py-3.5 cursor-pointer hover:bg-gray-50/80 transition-colors shrink-0">
            <Calendar className="w-5 h-5 text-gray-400 shrink-0" />
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest leading-none">Check-in</p>
              <p className="text-sm font-semibold text-gray-900 mt-0.5 whitespace-nowrap">15 Mar 2025</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-300 shrink-0" />
          </div>

          <div className="w-px bg-gray-100 my-3" />

          {/* Check-out */}
          <div className="flex items-center gap-3 px-5 py-3.5 cursor-pointer hover:bg-gray-50/80 transition-colors shrink-0">
            <Calendar className="w-5 h-5 text-gray-400 shrink-0" />
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest leading-none">Check-out</p>
              <p className="text-sm font-semibold text-gray-900 mt-0.5 whitespace-nowrap">30 Mar 2025</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-300 shrink-0" />
          </div>

          <div className="w-px bg-gray-100 my-3" />

          {/* Guests */}
          <div className="flex items-center gap-3 px-5 py-3.5 cursor-pointer hover:bg-gray-50/80 transition-colors shrink-0">
            <Users className="w-5 h-5 text-gray-400 shrink-0" />
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest leading-none">Guests</p>
              <p className="text-sm font-semibold text-gray-900 mt-0.5 whitespace-nowrap">4 Adults</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-300 shrink-0" />
          </div>

          {/* CTA */}
          <div className="flex items-center p-1.5">
            <Link
              href="/login"
              className="px-6 py-3 bg-[#f0e68a] text-gray-900 font-bold text-sm rounded-full hover:bg-[#e8de7a] transition-colors whitespace-nowrap"
            >
              Book Your Stay
            </Link>
          </div>

        </div>
      </div>

      {/* ── HOW IT WORKS ─────────────────────────────────────────── */}
      <section className="max-w-[1200px] mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-[#c8a84b] mb-2">Simple Process</p>
          <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
          <p className="mt-2 text-gray-500 text-sm">Four steps from inquiry to confirmed booking.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((step, i) => (
            <div
              key={i}
              className={`rounded-2xl p-7 space-y-3 ${i % 2 === 0 ? 'bg-[#f0e68a]' : 'bg-gray-900 text-white'}`}
            >
              <div className={`w-8 h-8 rounded-full border-2 text-xs font-bold flex items-center justify-center ${i % 2 === 0 ? 'border-gray-900/30 text-gray-900' : 'border-white/30 text-white'}`}>
                {i + 1}
              </div>
              <h3 className={`font-bold text-lg leading-tight ${i % 2 === 0 ? 'text-gray-900' : 'text-white'}`}>{step.title}</h3>
              <p className={`text-sm leading-relaxed ${i % 2 === 0 ? 'text-gray-700' : 'text-white/60'}`}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── BOTTOM CTA ───────────────────────────────────────────── */}
      <section className="max-w-[1200px] mx-auto px-4 pb-20">
        <div className="rounded-[2rem] bg-gray-900 px-8 py-16 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-[#f0e68a] mb-3">For Property Owners</p>
          <h2 className="text-4xl font-bold text-white">Make It Yours</h2>
          <p className="mt-3 text-white/60 max-w-sm mx-auto text-sm leading-relaxed">
            Create your booking page, tell your story — guests book themselves. No coding, no monthly fees.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/login?signup=1"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#f0e68a] text-gray-900 font-bold rounded-full hover:bg-[#e8de7a] transition-colors text-sm"
            >
              Create your page <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-white/20 text-white/70 hover:text-white hover:border-white/40 rounded-full transition-colors text-sm font-medium"
            >
              Sign in
            </Link>
          </div>
          <ul className="mt-8 flex flex-wrap items-center justify-center gap-6">
            {[
              { Icon: ShieldCheck, text: 'No double-booking' },
              { Icon: Banknote, text: 'Zero commission' },
              { Icon: Zap, text: 'Instant setup' },
            ].map(({ Icon, text }) => (
              <li key={text} className="flex items-center gap-2 text-sm text-white/50">
                <Icon className="w-4 h-4 text-[#f0e68a] shrink-0" />
                {text}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <footer className="border-t border-gray-200 bg-[#e8e6df] px-6 py-8 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} TransientBook &middot; No double-booking. No missed inquiries. No OTA commission.
      </footer>

    </div>
  )
}
