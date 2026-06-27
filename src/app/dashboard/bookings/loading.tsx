import { Skeleton } from '@/components/Skeleton'

export default function BookingsLoading() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-7 w-28" />

      {/* Filter tabs */}
      <div className="flex gap-2">
        {[72, 56, 72, 72].map((w, i) => (
          <Skeleton key={i} className={`h-8 w-${w === 72 ? '18' : '14'} rounded-lg`} style={{ width: w }} />
        ))}
      </div>

      {/* Booking rows */}
      <ul className="space-y-3">
        {[0, 1, 2, 3, 4].map(i => (
          <li key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-3 w-48" />
                <Skeleton className="h-3 w-40" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full shrink-0" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
