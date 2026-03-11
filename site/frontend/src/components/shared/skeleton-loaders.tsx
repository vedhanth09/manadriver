import { Skeleton } from "@/components/ui/skeleton"

function JobCardSkeleton() {
  return (
    <div className="rounded-card bg-white p-5 shadow-card">
      {/* Header row: badge + rating */}
      <div className="mb-3 flex items-center justify-between">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-4 w-16" />
      </div>
      {/* Detail rows */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
      </div>
      {/* Button */}
      <Skeleton className="mt-4 h-8 w-full" />
    </div>
  )
}

function JobCardSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, i) => (
        <JobCardSkeleton key={i} />
      ))}
    </div>
  )
}

function ApplicantCardSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-card bg-white p-4 shadow-card">
      {/* Avatar */}
      <Skeleton className="size-14 shrink-0 rounded-full" />
      {/* Details */}
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-4 w-24" />
        <div className="flex gap-1">
          <Skeleton className="h-5 w-16 rounded-badge" />
          <Skeleton className="h-5 w-16 rounded-badge" />
        </div>
      </div>
      {/* Button */}
      <Skeleton className="h-8 w-16 shrink-0" />
    </div>
  )
}

function ApplicantCardSkeletonList({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }, (_, i) => (
        <ApplicantCardSkeleton key={i} />
      ))}
    </div>
  )
}

export {
  JobCardSkeleton,
  JobCardSkeletonGrid,
  ApplicantCardSkeleton,
  ApplicantCardSkeletonList,
}
