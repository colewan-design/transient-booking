import Link from 'next/link'

export default function SiteNav() {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/">
          <img src="/logo.png" alt="TransientBook" className="h-7 w-auto" />
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm text-gray-500">
          <a href="#how-it-works" className="hover:text-gray-900 transition-colors">How it works</a>
          <a href="#why" className="hover:text-gray-900 transition-colors">Why TransientBook</a>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium">
            Sign in
          </Link>
          <Link
            href="/login?signup=1"
            className="px-5 py-2 rounded-full bg-[#f0e68a] text-gray-900 font-semibold text-sm hover:bg-[#e8de7a] transition-colors"
          >
            Get started free
          </Link>
        </div>
      </div>
    </nav>
  )
}
