import { Skeleton } from '@/components/Skeleton'

export default function BookingDetailLoading() {
  return (
    <div className="space-y-5">
      {/* Back + title */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-7 w-40" />
      </div>

      {/* Status badge + actions */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-7 w-20 rounded-full" />
        <Skeleton className="h-7 w-24 rounded-full" />
        <Skeleton className="h-7 w-24 rounded-full" />
      </div>

      {/* Detail card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
        {['Guest', 'Contact', 'Room', 'Dates', 'Guests', 'Amount', 'Notes'].map(label => (
          <div key={label} className="flex items-center justify-between px-5 py-3.5">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-32" />
          </div>
        ))}
      </div>

      {/* Deposit proof */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    </div>
  )
}
