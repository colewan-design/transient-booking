import { Skeleton } from '@/components/Skeleton'

export default function RoomDetailLoading() {
  return (
    <div className="space-y-5">
      {/* Back + title */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-7 w-36" />
      </div>

      {/* Form fields */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        {[['Room name', '40%'], ['Capacity', '25%'], ['Weekday rate', '35%'], ['Weekend rate', '35%'], ['Description', '100%']].map(([label, w]) => (
          <div key={label} className="space-y-1.5">
            <Skeleton className="h-3 w-24" />
            <Skeleton className={`h-10`} style={{ width: w as string }} />
          </div>
        ))}

        {/* Photo upload area */}
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>

        {/* Toggle */}
        <div className="flex items-center gap-3">
          <Skeleton className="h-6 w-10 rounded-full" />
          <Skeleton className="h-4 w-28" />
        </div>

        {/* Save button */}
        <Skeleton className="h-10 w-28 rounded-full" />
      </div>
    </div>
  )
}
