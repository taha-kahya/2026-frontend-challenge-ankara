import { MapPin } from 'lucide-react'
import { SourceBadge } from '../../components/SourceBadge'
import { formatTime, formatDate } from '../../utils/time'
import type { Checkin } from '../../types'

interface CheckinCardProps {
  record: Checkin
  onPersonClick?: (name: string) => void
}

export function CheckinCard({ record, onPersonClick }: CheckinCardProps) {
  return (
    <div className="group cursor-pointer rounded-2xl border border-white/8 bg-[--color-surface] p-4 transition-all duration-150 hover:border-white/18 hover:bg-[--color-surface-raised] hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/30">
      <div className="flex items-start justify-between gap-2 mb-3">
        <SourceBadge source="checkin" />
        <span className="font-mono text-[11px] text-[--color-text-dim]">
          {formatDate(record.timestamp)} · {formatTime(record.timestamp)}
        </span>
      </div>

      <button
        onClick={() => onPersonClick?.(record.personName)}
        className="text-sm font-semibold text-blue-300 hover:text-blue-200 transition-colors mb-1"
      >
        {record.personName}
      </button>

      <div className="flex items-center gap-1 text-xs text-[--color-text-dim] mb-2">
        <MapPin className="h-3 w-3 shrink-0" />
        <span>{record.location}</span>
      </div>

      {record.note && (
        <p className="text-xs text-[--color-text-dim] leading-relaxed line-clamp-2 border-t border-white/8 pt-2 mt-2">
          {record.note}
        </p>
      )}
    </div>
  )
}
