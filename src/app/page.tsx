import { redirect } from 'next/navigation'
import Link from 'next/link'

const steps = [
  { title: 'Guest asks if available', desc: 'They message you on Messenger as usual.' },
  { title: 'You share your link', desc: 'Paste your unique booking link in the chat.' },
  { title: 'Guest picks dates & room', desc: 'They see real-time availability and pricing.' },
  { title: 'They pay the deposit', desc: 'GCash deposit sent — booking confirmed.' },
]

const features = [
  { icon: '🚫', title: 'No double-booking', desc: 'Rooms are locked the moment a booking is placed.' },
  { icon: '💸', title: 'Zero commission', desc: 'You keep 100% of every booking. No OTA fees.' },
  { icon: '⚡', title: 'Instant confirmation', desc: 'Guests get a summary and payment instructions right away.' },
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
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-rose-500 font-bold text-xl tracking-tight">TransientBook</span>
          <Link
            href="/login"
            className="px-4 py-2 rounded-full border border-gray-300 text-sm font-medium text-gray-700 hover:shadow-md transition-shadow"
          >
            Sign in
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-16">
        <div className="bg-linear-to-b from-rose-50 via-rose-50/40 to-white px-6 py-28 text-center">
          <h1 className="text-5xl font-bold text-gray-900 tracking-tight leading-tight">
            Book your stay,<br />skip the back-and-forth.
          </h1>
          <p className="mt-5 text-lg text-gray-500 max-w-md mx-auto leading-relaxed">
            A booking page for your transient house. Share a link — guests book themselves.
          </p>
          <Link
            href="/login"
            className="mt-8 inline-block px-8 py-3.5 bg-rose-500 text-white rounded-full font-semibold hover:bg-rose-600 transition-colors shadow-sm"
          >
            Get started free
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">How it works</h2>
        <p className="text-center text-gray-500 mb-12">Four steps from inquiry to confirmed booking.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((step, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-3 hover:shadow-md transition-shadow">
              <div className="w-9 h-9 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center font-bold text-sm">
                {i + 1}
              </div>
              <p className="font-semibold text-gray-900 text-sm">{step.title}</p>
              <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 px-6 py-24">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-10">
          {features.map((f, i) => (
            <div key={i} className="text-center space-y-3">
              <div className="text-4xl">{f.icon}</div>
              <p className="font-semibold text-gray-900">{f.title}</p>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-6 py-24 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Ready to accept online bookings?</h2>
        <p className="mt-2 text-gray-500">Create your property profile in minutes.</p>
        <Link
          href="/login"
          className="mt-7 inline-block px-8 py-3.5 bg-rose-500 text-white rounded-full font-semibold hover:bg-rose-600 transition-colors shadow-sm"
        >
          Create your booking page
        </Link>
      </section>

      <footer className="border-t border-gray-100 px-6 py-8 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} TransientBook &middot; No double-booking. No missed inquiries. No OTA commission.
      </footer>
    </div>
  )
}
