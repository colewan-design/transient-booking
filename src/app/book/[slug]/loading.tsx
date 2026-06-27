import { Skeleton } from '@/components/Skeleton'

export default function GuestBookingLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-slate-900 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="space-y-1">
            <Skeleton className="h-4 w-36 bg-white/10" />
            <Skeleton className="h-3 w-24 bg-white/10" />
          </div>
          <Skeleton className="h-7 w-28 bg-white/10" />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8 space-y-6">
        {/* Date pickers */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <Skeleton className="h-5 w-32" />
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-1.5">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>

        {/* Room cards */}
        {[0, 1, 2].map(i => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1.5">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-8 w-20 rounded-full" />
            </div>
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        ))}
      </main>
    </div>
  )
}
