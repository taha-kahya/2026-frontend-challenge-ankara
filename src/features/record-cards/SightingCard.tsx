import { Eye, MapPin } from 'lucide-react'
import { SourceBadge } from '../../components/SourceBadge'
import { formatTime, formatDate } from '../../utils/time'
import type { Sighting } from '../../types'

interface SightingCardProps {
  record: Sighting
  onPersonClick?: (name: string) => void
}

export function SightingCard({ record, onPersonClick }: SightingCardProps) {
  return (
    <div className="group rounded-2xl border border-amber-500/25 bg-[--color-surface] p-4 transition-all duration-150 hover:border-amber-500/50 hover:bg-[--color-surface-raised] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-500/10 shadow-sm shadow-amber-500/5">
      <div className="flex items-start justify-between gap-2 mb-3">
        <SourceBadge source="sighting" />
        <span className="font-mono text-[11px] text-[--color-text-dim]">
          {formatDate(record.timestamp)} · {formatTime(record.timestamp)}
        </span>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <Eye className="h-3.5 w-3.5 text-amber-400 shrink-0" />
        <span className="text-sm font-semibold text-[--color-text]">
          <button
            onClick={() => onPersonClick?.(record.personName)}
            className="text-amber-300 hover:text-amber-200 transition-colors"
          >
            {record.personName}
          </button>
          <span className="text-[--color-text-dim] font-normal mx-1">seen with</span>
          <button
            onClick={() => onPersonClick?.(record.seenWith)}
            className="text-amber-300 hover:text-amber-200 transition-colors"
          >
            {record.seenWith}
          </button>
        </span>
      </div>

      <div className="flex items-center gap-1 text-xs text-[--color-text-dim] mb-2">
        <MapPin className="h-3 w-3 shrink-0" />
        <span>{record.location}</span>
      </div>

      {record.note && (
        <p className="text-xs text-[--color-text-dim] leading-relaxed line-clamp-2 border-t border-[--color-border-subtle] pt-2 mt-2">
          {record.note}
        </p>
      )}
    </div>
  )
}
