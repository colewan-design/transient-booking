import Link from 'next/link'

export default function SiteNav({ active }: { active?: 'locations' | 'rooms' | 'experiences' | 'contact' }) {
  const links = [
    { href: '/', label: 'Locations', key: 'locations' },
    { href: '/rooms', label: 'Rooms', key: 'rooms' },
    { href: '/experiences', label: 'Experiences', key: 'experiences' },
    { href: '/contact', label: 'Contact', key: 'contact' },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/">
          <img src="/logo.png" alt="TransientBook" className="h-7 w-auto" />
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm text-gray-500">
          {links.map(({ href, label, key }) => (
            <Link
              key={key}
              href={href}
              className={`flex items-center gap-1.5 transition-colors ${active === key ? 'text-gray-900 font-medium' : 'hover:text-gray-900'}`}
            >
              {active === key && <span className="w-1.5 h-1.5 rounded-full bg-[#c8a84b]" />}
              {label}
            </Link>
          ))}
        </div>

        <Link
          href="/login"
          className="px-5 py-2 rounded-full bg-[#f0e68a] text-gray-900 font-semibold text-sm hover:bg-[#e8de7a] transition-colors"
        >
          Book Now
        </Link>
      </div>
    </nav>
  )
}
