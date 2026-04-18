import { MapPin, ShieldAlert } from 'lucide-react'
import { SourceBadge } from '../../components/SourceBadge'
import { formatTime, formatDate } from '../../utils/time'
import type { AnonymousTip } from '../../types'

interface TipCardProps {
  record: AnonymousTip
  onPersonClick?: (name: string) => void
}

const CONFIDENCE_STYLE = {
  high:   'bg-red-500/15 text-red-400 border-red-500/25',
  medium: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
  low:    'bg-slate-500/15 text-slate-400 border-slate-500/20',
}

export function TipCard({ record, onPersonClick }: TipCardProps) {
  return (
    <div className="group rounded-2xl border border-[--color-border] bg-[--color-surface] p-4 transition-all duration-150 hover:border-orange-500/30 hover:bg-[--color-surface-raised]">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <SourceBadge source="tip" />
          <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-mono font-medium uppercase tracking-wider ${CONFIDENCE_STYLE[record.confidence]}`}>
            <ShieldAlert className="h-2.5 w-2.5" />
            {record.confidence}
          </span>
        </div>
        <span className="font-mono text-[11px] text-[--color-text-dim]">
          {formatDate(record.timestamp)} · {formatTime(record.timestamp)}
        </span>
      </div>

      <div className="mb-2">
        <span className="text-xs text-[--color-text-dim]">suspect: </span>
        <button
          onClick={() => onPersonClick?.(record.suspectName)}
          className="text-sm font-semibold text-orange-300 hover:text-orange-200 transition-colors"
        >
          {record.suspectName}
        </button>
      </div>

      <p className="text-xs text-[--color-text-dim] leading-relaxed line-clamp-2 mb-2">
        {record.tip}
      </p>

      <div className="flex items-center gap-1 text-xs text-[--color-muted]">
        <MapPin className="h-3 w-3 shrink-0" />
        <span>{record.location}</span>
      </div>
    </div>
  )
}
