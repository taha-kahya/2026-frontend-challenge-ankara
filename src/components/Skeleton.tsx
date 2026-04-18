interface SkeletonProps {
  className?: string
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`animate-pulse rounded-lg bg-white/5 ${className}`} />
  )
}

export function RecordSkeleton() {
  return (
    <div className="rounded-2xl border border-[--color-border] bg-[--color-surface] p-4 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-3 w-24" />
      </div>
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  )
}

export function SuspectSkeleton() {
  return (
    <div className="rounded-xl border border-[--color-border] bg-[--color-surface] p-3 space-y-2">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-1.5 w-full rounded-full" />
      <div className="flex gap-1">
        <Skeleton className="h-3 w-10" />
        <Skeleton className="h-3 w-10" />
      </div>
    </div>
  )
}
