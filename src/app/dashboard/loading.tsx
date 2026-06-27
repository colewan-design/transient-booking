import { Skeleton } from '@/components/Skeleton'

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="space-y-1.5">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-28" />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4">
        {[0, 1].map(i => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
            <Skeleton className="w-10 h-10 rounded-full shrink-0" />
            <div className="space-y-1.5 flex-1">
              <Skeleton className="h-8 w-10" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        ))}
      </div>

      {/* Booking link card */}
      <div className="bg-slate-900 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-28 bg-white/10" />
          <Skeleton className="h-3 w-8 bg-white/10" />
        </div>
        <Skeleton className="h-10 w-full bg-white/10" />
        <Skeleton className="h-3 w-48 bg-white/10" />
      </div>

      {/* Pending bookings list */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-12" />
        </div>
        <ul className="divide-y divide-gray-50">
          {[0, 1, 2].map(i => (
            <li key={i} className="flex items-center justify-between px-5 py-3.5">
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
              <Skeleton className="h-6 w-16 rounded-full" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
