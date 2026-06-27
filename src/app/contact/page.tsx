import Link from 'next/link'
import { MapPin, Phone, Mail, MessageCircle, Clock, ArrowRight } from 'lucide-react'
import SiteNav from '@/components/SiteNav'

const faqs = [
  {
    q: 'How do I confirm my booking?',
    a: 'After submitting your booking, send your GCash deposit to the number provided. Your booking is confirmed once the owner marks it as confirmed.',
  },
  {
    q: 'Can I book without GCash?',
    a: 'GCash is the primary payment method. Contact us directly if you need an alternative arrangement.',
  },
  {
    q: 'What is the cancellation policy?',
    a: 'Cancellations made 3+ days before check-in are eligible for a partial refund. Contact us as early as possible.',
  },
  {
    q: 'Can I visit before booking?',
    a: 'Yes! Message us and we\'ll schedule a walkthrough at your convenience.',
  },
]

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <SiteNav active="contact" />

      {/* ── HERO ── */}
      <section className="bg-gray-900 px-6 py-20 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-[#f0e68a] mb-3">We're Here</p>
        <h1 className="text-5xl sm:text-6xl font-bold text-white leading-tight">
          Let's <span className="text-[#f0e68a]">Talk</span>
        </h1>
        <p className="mt-4 text-white/60 max-w-md mx-auto text-base leading-relaxed">
          Have questions about a room, an experience, or your booking? We reply fast.
        </p>
      </section>

      {/* ── MAIN CONTENT ── */}
      <section className="max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-2 gap-16">

        {/* ── LEFT: Form ── */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Send us a message</h2>
          <p className="text-gray-500 text-sm mb-8">We'll get back to you within a few hours.</p>

          <form className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">First Name</label>
                <input
                  type="text"
                  placeholder="Juan"
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#f0e68a] focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">Last Name</label>
                <input
                  type="text"
                  placeholder="dela Cruz"
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#f0e68a] focus:border-transparent transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">Email</label>
              <input
                type="email"
                placeholder="juan@email.com"
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#f0e68a] focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">Phone / Messenger</label>
              <input
                type="tel"
                placeholder="+63 9XX XXX XXXX"
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#f0e68a] focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">Subject</label>
              <select className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#f0e68a] focus:border-transparent transition bg-white">
                <option>Booking Inquiry</option>
                <option>Room Information</option>
                <option>Experience Booking</option>
                <option>Cancellation / Refund</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">Message</label>
              <textarea
                rows={5}
                placeholder="Tell us how we can help..."
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#f0e68a] focus:border-transparent transition resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#f0e68a] text-gray-900 font-bold rounded-full hover:bg-[#e8de7a] transition-colors text-sm flex items-center justify-center gap-2"
            >
              Send Message <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* ── RIGHT: Info + FAQ ── */}
        <div className="space-y-10">

          {/* Contact cards */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in touch directly</h2>
            <div className="space-y-3">
              {[
                { Icon: MessageCircle, label: 'Messenger / Viber', value: 'Message us on Facebook', sub: 'Usually replies within 1 hour' },
                { Icon: Phone, label: 'Phone', value: '+63 912 345 6789', sub: 'Mon–Sun, 8am–8pm' },
                { Icon: Mail, label: 'Email', value: 'hello@transientbook.ph', sub: 'For formal inquiries' },
                { Icon: MapPin, label: 'Location', value: 'Somewhere beautiful, PH', sub: 'Exact address sent upon booking' },
              ].map(({ Icon, label, value, sub }) => (
                <div key={label} className="flex items-start gap-4 p-4 rounded-2xl bg-[#f9f9f7] border border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-[#f0e68a] flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-gray-900" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{label}</p>
                    <p className="font-semibold text-gray-900 text-sm mt-0.5">{value}</p>
                    <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" />{sub}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-5">Common questions</h2>
            <div className="space-y-4">
              {faqs.map(({ q, a }) => (
                <div key={q} className="border-b border-gray-100 pb-4">
                  <p className="font-semibold text-gray-900 text-sm">{q}</p>
                  <p className="mt-1.5 text-sm text-gray-500 leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── MAP PLACEHOLDER ── */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="rounded-3xl overflow-hidden bg-linear-to-br from-emerald-100 via-teal-200 to-green-200 h-56 flex items-center justify-center relative">
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, #6ee7b7 0, #6ee7b7 1px, transparent 0, transparent 40px), repeating-linear-gradient(90deg, #6ee7b7 0, #6ee7b7 1px, transparent 0, transparent 40px)',
            }}
          />
          <div className="relative z-10 flex flex-col items-center gap-2 text-teal-800">
            <MapPin className="w-8 h-8" />
            <p className="font-semibold text-sm">Exact location shared after booking confirmation</p>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-100 px-6 py-8 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} TransientBook &middot; No double-booking. No missed inquiries. No OTA commission.
      </footer>
    </div>
  )
}
