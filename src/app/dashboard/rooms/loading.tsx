import { Skeleton } from '@/components/Skeleton'

export default function RoomsLoading() {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-7 w-20" />
        <Skeleton className="h-9 w-28 rounded-full" />
      </div>

      {/* Room rows */}
      <ul className="space-y-3">
        {[0, 1, 2, 3].map(i => (
          <li key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 flex items-center justify-between">
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-52" />
              <Skeleton className="h-3 w-40" />
            </div>
            <Skeleton className="w-4 h-4 rounded" />
          </li>
        ))}
      </ul>
    </div>
  )
}
