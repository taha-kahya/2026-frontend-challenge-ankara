import { MapPin, ArrowRight, Flame } from 'lucide-react'
import { SourceBadge } from '../../components/SourceBadge'
import { formatTime, formatDate } from '../../utils/time'
import type { Message } from '../../types'

interface MessageCardProps {
  record: Message
  onPersonClick?: (name: string) => void
}

export function MessageCard({ record, onPersonClick }: MessageCardProps) {
  const isUrgent = record.urgency === 'high'
  const isMedium = record.urgency === 'medium'

  return (
    <div className={`group cursor-pointer rounded-2xl border p-4 transition-all duration-150 hover:border-white/25 hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/30 ${
      isUrgent
        ? 'border-red-500/20 bg-red-500/8 hover:bg-red-500/12'
        : isMedium
        ? 'border-white/12 bg-amber-500/6 hover:bg-amber-500/10'
        : 'border-white/12 bg-[--color-surface] hover:bg-[--color-surface-raised]'
    }`}>
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <SourceBadge source="message" />
          {isUrgent && (
            <span className="flex items-center gap-1 rounded-full bg-red-500/15 border border-red-500/25 px-2 py-0.5 text-[10px] font-mono font-medium text-red-400 uppercase tracking-wider">
              <Flame className="h-2.5 w-2.5" />
              urgent
            </span>
          )}
        </div>
        <span className="font-mono text-[11px] text-[--color-text-dim]">
          {formatDate(record.timestamp)} · {formatTime(record.timestamp)}
        </span>
      </div>

      <div className="flex items-center gap-1.5 mb-2">
        <button
          onClick={() => onPersonClick?.(record.senderName)}
          className="text-sm font-semibold text-violet-300 hover:text-violet-200 transition-colors"
        >
          {record.senderName}
        </button>
        <ArrowRight className="h-3 w-3 text-[--color-muted]" />
        <button
          onClick={() => onPersonClick?.(record.recipientName)}
          className="text-sm font-semibold text-violet-300 hover:text-violet-200 transition-colors"
        >
          {record.recipientName}
        </button>
      </div>

      <p className="text-xs text-[--color-text-dim] leading-relaxed line-clamp-2 mb-2">
        {record.text}
      </p>

      <div className="flex items-center gap-1 text-xs text-[--color-muted]">
        <MapPin className="h-3 w-3 shrink-0" />
        <span>{record.location}</span>
      </div>
    </div>
  )
}
