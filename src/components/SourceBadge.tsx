import type { SourceType } from '../types'

interface SourceBadgeProps {
  source: SourceType | RecordType
  size?: 'sm' | 'md'
}

type RecordType = 'checkin' | 'message' | 'sighting' | 'note' | 'tip'

const CONFIG: Record<RecordType, { label: string; className: string }> = {
  checkin:  { label: 'Checkin',  className: 'bg-blue-500/15 text-blue-300 border-blue-500/20' },
  message:  { label: 'Message',  className: 'bg-violet-500/15 text-violet-300 border-violet-500/20' },
  sighting: { label: 'Sighting', className: 'bg-amber-500/15 text-amber-300 border-amber-500/20' },
  note:     { label: 'Note',     className: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20' },
  tip:      { label: 'Tip',      className: 'bg-orange-500/15 text-orange-300 border-orange-500/20' },
}

function normalise(source: SourceType | RecordType): RecordType {
  const map: Partial<Record<SourceType, RecordType>> = {
    checkins: 'checkin', messages: 'message', sightings: 'sighting',
    notes: 'note', tips: 'tip',
  }
  return (map[source as SourceType] ?? source) as RecordType
}

export function SourceBadge({ source, size = 'sm' }: SourceBadgeProps) {
  const key = normalise(source)
  const { label, className } = CONFIG[key]
  const sizeClass = size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1'

  return (
    <span className={`inline-flex items-center rounded-full border font-mono font-medium uppercase tracking-wider ${sizeClass} ${className}`}>
      {label}
    </span>
  )
}
