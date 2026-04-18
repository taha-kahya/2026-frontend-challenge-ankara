import { SearchX } from 'lucide-react'

interface EmptyStateProps {
  message?: string
  hint?: string
}

export function EmptyState({
  message = 'No records found',
  hint,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="rounded-full bg-[--color-surface-raised] p-4">
        <SearchX className="h-6 w-6 text-[--color-muted]" />
      </div>
      <p className="text-sm font-medium text-[--color-text-dim]">{message}</p>
      {hint && <p className="text-xs text-[--color-muted]">{hint}</p>}
    </div>
  )
}
