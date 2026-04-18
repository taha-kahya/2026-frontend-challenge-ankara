import { AlertTriangle } from 'lucide-react'

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
}

export function ErrorState({
  message = 'Failed to load data',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="rounded-full bg-red-500/10 p-4">
        <AlertTriangle className="h-6 w-6 text-red-400" />
      </div>
      <p className="text-sm font-medium text-[--color-text-dim]">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-lg bg-[--color-surface-raised] px-4 py-1.5 text-xs text-[--color-text-dim] transition hover:text-[--color-text] hover:bg-[--color-border]"
        >
          Try again
        </button>
      )}
    </div>
  )
}
