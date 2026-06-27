import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 bg-linear-to-b from-blue-50 to-white">
      <div className="max-w-lg w-full text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">TransientBook</h1>
          <p className="text-lg text-gray-600">
            Para sa mga transient house na tired na sa Messenger grind.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-left space-y-4">
          <h2 className="font-semibold text-gray-800">Paano gumagana?</h2>
          <ol className="space-y-3 text-sm text-gray-600">
            <li className="flex gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">1</span>
              <span>Guest messages &ldquo;available po?&rdquo; sa Messenger</span>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">2</span>
              <span>Owner pinaste ang booking link</span>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">3</span>
              <span>Guest pumili ng dates, nakita agad ang available rooms at presyo</span>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">4</span>
              <span>Nag-reserve, nagpadala ng GCash deposit — tapos na!</span>
            </li>
          </ol>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/login"
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            Owner? Sign in dito
          </Link>
        </div>

        <p className="text-xs text-gray-400">
          No double-booking. No missed inquiries. No OTA commission.
        </p>
      </div>
    </main>
  )
}
