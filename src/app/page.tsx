import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, ShieldCheck, Banknote, Zap, MessageCircleOff, Clock, CheckCircle2 } from 'lucide-react'
import SiteNav from '@/components/SiteNav'

const steps = [
  {
    n: '01',
    title: 'Create your page',
    desc: 'Add your rooms, set your rates, and paste your GCash number. Done in under 5 minutes.',
  },
  {
    n: '02',
    title: 'Share the link',
    desc: 'Next time a guest messages "available po?", paste your booking link. That\'s it.',
  },
  {
    n: '03',
    title: 'Guests book themselves',
    desc: 'They pick dates, see which rooms fit, get the price, and send the GCash deposit.',
  },
  {
    n: '04',
    title: 'You keep everything',
    desc: 'No OTA commission. No monthly fees while you\'re validating. Every peso goes to you.',
  },
]

const pains = [
  { Icon: MessageCircleOff, text: '"Available po?" — answered automatically' },
  { Icon: Clock, text: 'No more slow replies that lose bookings' },
  { Icon: ShieldCheck, text: 'Double-booking locked out by the system' },
  { Icon: Banknote, text: '0% commission — unlike OTAs charging 15–20%' },
  { Icon: Zap, text: '5-minute setup, no tech skills needed' },
  { Icon: CheckCircle2, text: 'Works on any phone, any browser' },
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

      <SiteNav />

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ minHeight: 'calc(100vh - 56px)' }}>

        {/* Background image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/card-3.png"
          alt="Transient room"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-24 h-full" style={{ minHeight: 'calc(100vh - 56px)' }}>

          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f0e68a]/20 border border-[#f0e68a]/40 text-[#f0e68a] text-xs font-semibold uppercase tracking-widest mb-6">
            For Baguio Transient Owners
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] max-w-4xl">
            Stop answering<br />
            <span className="text-[#f0e68a]">"available po?"</span>
          </h1>

          <p className="mt-6 text-white/70 text-lg sm:text-xl max-w-xl leading-relaxed">
            Give guests a booking link. They pick dates, see prices, and send the GCash deposit — without a single Messenger back-and-forth.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="/login?signup=1"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#f0e68a] text-gray-900 font-bold rounded-full hover:bg-[#e8de7a] transition-colors text-sm"
            >
              Create your booking page free <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#how-it-works"
              className="text-sm text-white/60 hover:text-white transition-colors underline underline-offset-4"
            >
              See how it works
            </a>
          </div>

          {/* Trust line */}
          <p className="mt-8 text-white/40 text-xs">
            No OTA commission · No double-booking · Works on any phone
          </p>
        </div>

      </section>

      {/* ── THE PROBLEM ──────────────────────────────────────────── */}
      <section className="bg-gray-950 px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#f0e68a] mb-4">Sound familiar?</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
                Every peak season is the same grind
              </h2>
              <p className="mt-4 text-white/50 leading-relaxed">
                Guests message at midnight. You wake up to 20 "available po?" threads. You reply to all of them, quote the price, ask for dates — and half ghost you anyway. Then someone books a room that was already taken.
              </p>
              <p className="mt-4 text-white/50 leading-relaxed">
                You refuse OTAs because 15–20% commission is too steep for a family-run property. But right now the alternative is your personal Messenger inbox, 7 days a week.
              </p>
            </div>

            {/* Fake Messenger thread */}
            <div className="bg-gray-900 rounded-2xl p-5 space-y-3 border border-white/5">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">Your inbox, every weekend</p>
              {[
                { from: 'guest', msg: 'Available po Dec 20–22? 4 persons' },
                { from: 'you', msg: 'Hi! Available pa po. Magkano ba ang budget ninyo?' },
                { from: 'guest', msg: 'Mga 1500 per night po sana' },
                { from: 'you', msg: 'Meron po kaming Family Room, ₱1,200/night. GCash deposit required po.' },
                { from: 'guest', msg: 'Sige po. Pwede pa bang bawiin?' },
                { from: 'you', msg: '...' },
              ].map((line, i) => (
                <div key={i} className={`flex ${line.from === 'you' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] px-3.5 py-2 rounded-2xl text-sm leading-snug ${line.from === 'you' ? 'bg-[#0b82ff] text-white rounded-br-sm' : 'bg-gray-800 text-gray-200 rounded-bl-sm'}`}>
                    {line.msg}
                  </div>
                </div>
              ))}
              <p className="text-center text-xs text-red-400/70 pt-2">× Meanwhile, 3 other guests are waiting for a reply</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────── */}
      <section id="how-it-works" className="bg-white px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-[#c8a84b] mb-3">Simple setup</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Up and running in 5 minutes</h2>
            <p className="mt-3 text-gray-500 text-base max-w-sm mx-auto">No coding. No app to install. Works on your phone right now.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((step, i) => (
              <div
                key={i}
                className={`rounded-2xl p-7 space-y-4 ${i % 2 === 0 ? 'bg-[#f0e68a]' : 'bg-gray-900'}`}
              >
                <span className={`text-3xl font-black ${i % 2 === 0 ? 'text-gray-900/20' : 'text-white/20'}`}>{step.n}</span>
                <h3 className={`font-bold text-lg leading-tight ${i % 2 === 0 ? 'text-gray-900' : 'text-white'}`}>{step.title}</h3>
                <p className={`text-sm leading-relaxed ${i % 2 === 0 ? 'text-gray-700' : 'text-white/60'}`}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY TRANSIENTBOOK ─────────────────────────────────────── */}
      <section id="why" className="bg-[#f9f9f7] border-t border-gray-100 px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-[#c8a84b] mb-3">Built for you</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">What you get</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pains.map(({ Icon, text }) => (
              <div key={text} className="flex items-start gap-4 bg-white rounded-2xl p-5 border border-gray-100">
                <div className="w-9 h-9 rounded-full bg-[#f0e68a] flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-gray-900" />
                </div>
                <p className="text-sm font-medium text-gray-800 leading-snug pt-1.5">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ───────────────────────────────────────────── */}
      <section className="bg-gray-900 px-6 py-20 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-[#f0e68a] mb-4">Ready to stop the grind?</p>
        <h2 className="text-4xl sm:text-5xl font-bold text-white">
          Your booking page is<br />
          <span className="text-[#f0e68a]">5 minutes away</span>
        </h2>
        <p className="mt-4 text-white/50 max-w-sm mx-auto text-sm leading-relaxed">
          Free to create. No OTA commission. No double-booking. Guests send the GCash deposit directly to you.
        </p>
        <Link
          href="/login?signup=1"
          className="mt-8 inline-flex items-center gap-2 px-8 py-3.5 bg-[#f0e68a] text-gray-900 font-bold rounded-full hover:bg-[#e8de7a] transition-colors text-sm"
        >
          Create your booking page free <ArrowRight className="w-4 h-4" />
        </Link>
        <p className="mt-4 text-white/30 text-xs">Already have an account? <Link href="/login" className="underline hover:text-white/60 transition-colors">Sign in</Link></p>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <footer className="border-t border-gray-800 bg-gray-950 px-6 py-8 text-center text-xs text-white/20">
        © {new Date().getFullYear()} TransientBook &middot; Built for Baguio transient owners who refuse OTA commission.
      </footer>

    </div>
  )
}
