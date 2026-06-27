import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Play, ShieldCheck, Banknote, Zap, ArrowRight } from 'lucide-react'

const previewCards = [
  {
    label: 'Budget Stays',
    sub: '₱500 – ₱900 / night',
    img: '/card-1.png',
  },
  {
    label: 'Family Suites',
    sub: 'Up to 10 guests',
    img: '/card-2.png',
  },
  {
    label: 'Deluxe Rooms',
    sub: '₱1,200 – ₱2,000 / night',
    img: '/card-3.png',
  },
  {
    label: 'Weekend Getaways',
    sub: 'Beach & mountain stays',
    img: '/card-4.png',
  },
]

const steps = [
  {
    type: 'teal' as const,
    title: 'Create Your Page',
    desc: 'Set up your property profile and booking link in under 5 minutes.',
  },
  {
    type: 'dark' as const,
    title: 'Share the Link',
    desc: 'Paste it in Messenger, Viber, or any chat when guests inquire.',
  },
  {
    type: 'teal' as const,
    title: 'Guests Book Themselves',
    desc: 'They pick dates, choose a room, and send the GCash deposit.',
  },
  {
    type: 'dark' as const,
    title: 'You Keep Everything',
    desc: 'Zero OTA commission. Every peso goes directly to you.',
  },
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

      {/* ── NAV ──────────────────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <img src="/logo.png" alt="TransientBook" className="h-8 w-auto" />
          <Link
            href="/login"
            className="px-4 py-1.5 rounded-full border border-gray-300 text-sm font-medium text-gray-700 hover:shadow-md transition-shadow"
          >
            Sign in
          </Link>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-stone-900 to-slate-800 overflow-hidden pt-14">
        {/* Decorative texture overlay */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 25% 60%, #f43f5e 0%, transparent 50%), radial-gradient(circle at 75% 30%, #0d9488 0%, transparent 50%)' }}
        />

        {/* Left arrow */}
        <button className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-white/30 text-white/70 flex items-center justify-center hover:border-white hover:text-white transition-colors z-10">
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Center content */}
        <div className="relative text-center px-6 max-w-3xl mx-auto space-y-6">
          <h1 className="text-6xl sm:text-7xl font-black uppercase tracking-widest text-white leading-none">
            BOOK<br />
            <span className="text-rose-400">ANYWHERE</span>
          </h1>
          <p className="text-white/70 text-lg max-w-md mx-auto leading-relaxed">
            Give your transient house a booking page. Guests self-serve — no more Messenger grind.
          </p>
          {/* Play-style CTA circle */}
          <div className="flex items-center justify-center gap-5 pt-2">
            <Link
              href="/login"
              className="w-16 h-16 rounded-full border-2 border-white/60 text-white flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <Play className="w-6 h-6 fill-white ml-0.5" />
            </Link>
            <Link
              href="/login"
              className="text-sm text-white/70 hover:text-white transition-colors underline underline-offset-4"
            >
              See how it works
            </Link>
          </div>
        </div>

        {/* Right arrow */}
        <button className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-white/30 text-white/70 flex items-center justify-center hover:border-white hover:text-white transition-colors z-10">
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
          <div className="w-px h-8 bg-white/30" />
          <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
        </div>
      </section>

      {/* ── GRID + CTA ───────────────────────────────────────────── */}
      <section className="flex flex-col lg:flex-row">
        {/* Left: photo card grid */}
        <div className="flex-1 grid grid-cols-2">
          {previewCards.map((card, i) => (
            <div key={i} className="relative aspect-square overflow-hidden group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={card.img}
                alt={card.label}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              <div className="absolute bottom-0 inset-x-0 bg-linear-to-t from-black/70 to-transparent p-5">
                <p className="text-white font-bold text-lg leading-tight">{card.label}</p>
                <p className="text-white/70 text-sm mt-0.5">{card.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Right: CTA panel */}
        <div className="lg:w-80 bg-slate-900 text-white flex flex-col justify-center p-8 lg:p-10 space-y-6">
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest text-rose-400">For Property Owners</p>
            <h2 className="text-4xl font-black uppercase leading-tight">GET<br />STARTED</h2>
            <p className="text-white/60 text-sm leading-relaxed">
              Create your booking page and share it with guests. No coding, no monthly fees.
            </p>
          </div>

          <div className="space-y-3">
            <Link
              href="/login?signup=1"
              className="w-full flex items-center justify-between px-5 py-3 bg-rose-500 text-white font-semibold rounded-xl hover:bg-rose-600 transition-colors text-sm"
            >
              Create your page
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="w-full text-center px-5 py-3 border border-white/20 text-white/70 hover:text-white hover:border-white/40 rounded-xl transition-colors text-sm font-medium"
            >
              Sign in
            </Link>
          </div>

          <ul className="space-y-2">
            {[
              { Icon: ShieldCheck, text: 'No double-booking' },
              { Icon: Banknote, text: 'Zero commission' },
              { Icon: Zap, text: 'Instant setup' },
            ].map(({ Icon, text }) => (
              <li key={text} className="flex items-center gap-2.5 text-sm text-white/60">
                <Icon className="w-4 h-4 text-teal-400 shrink-0" />
                {text}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────── */}
      <section>
        <div className="bg-white px-6 py-14 text-center">
          <h2 className="text-2xl font-black uppercase tracking-widest text-gray-900">How It Works</h2>
          <p className="mt-2 text-gray-400 text-sm">Four steps from inquiry to confirmed booking.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            step.type === 'teal' ? (
              <div key={i} className="bg-teal-500 p-8 space-y-4">
                <div className="w-8 h-8 rounded-full border-2 border-white/60 text-white text-sm font-bold flex items-center justify-center">
                  {i + 1}
                </div>
                <h3 className="text-white font-black text-xl uppercase leading-tight">{step.title}</h3>
                <p className="text-white/80 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ) : (
              <div key={i} className={`bg-linear-to-br from-slate-800 to-slate-900 p-8 space-y-4`}>
                <div className="w-8 h-8 rounded-full border-2 border-white/30 text-white/60 text-sm font-bold flex items-center justify-center">
                  {i + 1}
                </div>
                <h3 className="text-white font-black text-xl uppercase leading-tight">{step.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{step.desc}</p>
              </div>
            )
          ))}
        </div>
      </section>

      {/* ── BOTTOM CTA ───────────────────────────────────────────── */}
      <section className="bg-rose-500 px-6 py-20 text-center">
        <h2 className="text-4xl font-black uppercase tracking-widest text-white">Make It Yours</h2>
        <p className="mt-3 text-white/80 max-w-sm mx-auto text-sm leading-relaxed">
          Create your booking page, tell your story — guests book themselves.
        </p>
        <Link
          href="/login"
          className="mt-8 inline-flex items-center gap-2 px-8 py-3.5 bg-white text-rose-600 font-bold rounded-full hover:bg-rose-50 transition-colors text-sm uppercase tracking-wide"
        >
          Get started free <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <footer className="bg-slate-900 px-6 py-8 text-center text-xs text-white/30">
        © {new Date().getFullYear()} TransientBook &middot; No double-booking. No missed inquiries. No OTA commission.
      </footer>
    </div>
  )
}
