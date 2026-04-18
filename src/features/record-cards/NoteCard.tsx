import { MapPin } from 'lucide-react'
import { SourceBadge } from '../../components/SourceBadge'
import { formatTime, formatDate } from '../../utils/time'
import type { PersonalNote } from '../../types'

interface NoteCardProps {
  record: PersonalNote
  onPersonClick?: (name: string) => void
}

export function NoteCard({ record, onPersonClick }: NoteCardProps) {
  return (
    <div className="group rounded-2xl border border-[--color-border] bg-[--color-surface] p-4 transition-all duration-150 hover:border-emerald-500/30 hover:bg-[--color-surface-raised] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20">
      <div className="flex items-start justify-between gap-2 mb-3">
        <SourceBadge source="note" />
        <span className="font-mono text-[11px] text-[--color-text-dim]">
          {formatDate(record.timestamp)} · {formatTime(record.timestamp)}
        </span>
      </div>

      <button
        onClick={() => onPersonClick?.(record.authorName)}
        className="text-sm font-semibold text-emerald-300 hover:text-emerald-200 transition-colors mb-2 block"
      >
        {record.authorName}
      </button>

      <p className="text-xs text-[--color-text-dim] leading-relaxed line-clamp-3 mb-2">
        {record.note}
      </p>

      <div className="flex items-center gap-1 text-xs text-[--color-muted] mb-2">
        <MapPin className="h-3 w-3 shrink-0" />
        <span>{record.location}</span>
      </div>

      {record.mentionedPeople.length > 0 && (
        <div className="flex flex-wrap gap-1 pt-2 border-t border-[--color-border-subtle]">
          {record.mentionedPeople.map(p => (
            <button
              key={p}
              onClick={() => onPersonClick?.(p)}
              className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] text-emerald-400 hover:bg-emerald-500/20 transition-colors"
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
