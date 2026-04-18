import { useAllRecords } from '../hooks/useAllRecords'
import { SourceBadge } from '../components/SourceBadge'
import { RecordSkeleton } from '../components/Skeleton'
import { parseTimestamp, formatTime, formatDate } from '../utils/time'
import type { RecordItem } from '../types'

interface TimelineViewProps {
  selectedPerson: string | null
  onPersonClick: (name: string) => void
}

interface TimelineGroup {
  dateLabel: string
  items: RecordItem[]
}

function groupByDate(records: RecordItem[]): TimelineGroup[] {
  const map = new Map<string, RecordItem[]>()

  for (const record of records) {
    const ts = getTimestamp(record)
    const date = parseTimestamp(ts)
    const label = date
      ? date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
      : 'Unknown date'

    const group = map.get(label) ?? []
    group.push(record)
    map.set(label, group)
  }

  return Array.from(map.entries()).map(([dateLabel, items]) => ({ dateLabel, items }))
}

function getTimestamp(record: RecordItem): string {
  return record.type === 'checkin' ? record.timestamp
    : record.type === 'message' ? record.timestamp
    : record.type === 'sighting' ? record.timestamp
    : record.type === 'note' ? record.timestamp
    : record.timestamp
}

function getHeadline(record: RecordItem): string {
  if (record.type === 'checkin') return `${record.personName} checked in at ${record.location}`
  if (record.type === 'message') return `${record.senderName} → ${record.recipientName}`
  if (record.type === 'sighting') return `${record.personName} seen with ${record.seenWith} at ${record.location}`
  if (record.type === 'note') return `${record.authorName} wrote a note`
  if (record.type === 'tip') return `Anonymous tip about ${record.suspectName}`
  return ''
}

function getSubline(record: RecordItem): string {
  if (record.type === 'checkin') return record.note ?? ''
  if (record.type === 'message') return record.text
  if (record.type === 'sighting') return record.note ?? ''
  if (record.type === 'note') return record.note
  if (record.type === 'tip') return record.tip
  return ''
}

function getNames(record: RecordItem): string[] {
  if (record.type === 'checkin') return [record.personName]
  if (record.type === 'message') return [record.senderName, record.recipientName]
  if (record.type === 'sighting') return [record.seenWith]
  if (record.type === 'note') return [record.authorName, ...record.mentionedPeople]
  if (record.type === 'tip') return [record.suspectName]
  return []
}

const DOT_COLOR: Record<RecordItem['type'], string> = {
  checkin:  'bg-blue-400',
  message:  'bg-violet-400',
  sighting: 'bg-amber-400',
  note:     'bg-emerald-400',
  tip:      'bg-orange-400',
}

export function TimelineView({ selectedPerson, onPersonClick }: TimelineViewProps) {
  const { records, isLoading, isError } = useAllRecords()

  const filtered = selectedPerson
    ? records.filter(r => getNames(r).some(n => n.toLowerCase() === selectedPerson.toLowerCase()))
    : records

  const groups = groupByDate(filtered)

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <RecordSkeleton /><RecordSkeleton /><RecordSkeleton />
      </div>
    )
  }

  if (isError) {
    return <p className="p-6 text-sm text-red-400">Failed to load timeline</p>
  }

  return (
    <div className="h-full overflow-y-auto px-6 py-5">
      {selectedPerson && (
        <div className="mb-5 flex items-center justify-between">
          <p className="text-xs text-amber-300">
            Timeline for <span className="font-semibold">{selectedPerson}</span>
            <span className="text-amber-400/60 ml-1">· {filtered.length} events</span>
          </p>
          <button
            onClick={() => onPersonClick('')}
            className="text-[10px] text-amber-400/70 hover:text-amber-300 font-mono transition-colors"
          >
            clear ×
          </button>
        </div>
      )}

      <div className="space-y-8">
        {groups.map(group => (
          <div key={group.dateLabel}>
            {/* Date divider */}
            <div className="flex items-center gap-3 mb-4">
              <span className="font-mono text-xs font-semibold text-[--color-text-dim]">{group.dateLabel}</span>
              <div className="flex-1 h-px bg-[--color-border]" />
              <span className="font-mono text-[10px] text-[--color-muted]">{group.items.length} events</span>
            </div>

            {/* Events */}
            <div className="relative pl-6 space-y-0">
              {/* Vertical line */}
              <div className="absolute left-[7px] top-2 bottom-2 w-px bg-[--color-border]" />

              {group.items.map((record, i) => {
                const ts = getTimestamp(record)
                const headline = getHeadline(record)
                const subline = getSubline(record)
                const names = getNames(record)
                const isLast = i === group.items.length - 1

                return (
                  <div key={`${record.type}-${record.id}`} className={`relative flex gap-4 ${!isLast ? 'pb-5' : ''}`}>
                    {/* Dot */}
                    <div className={`absolute -left-[5px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-[--color-base] ${DOT_COLOR[record.type]}`} />

                    {/* Content */}
                    <div className="flex-1 group cursor-pointer rounded-xl border border-white/12 bg-[--color-surface] p-3 transition-all duration-150 hover:border-white/25 hover:bg-[--color-surface-raised] hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/30">
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <SourceBadge source={record.type} size="sm" />
                        <span className="font-mono text-[10px] text-[--color-muted] shrink-0">
                          {formatDate(ts)} · {formatTime(ts)}
                        </span>
                      </div>

                      <p className="text-xs font-medium text-[--color-text] mb-1">{headline}</p>

                      {subline && (
                        <p className="text-[11px] text-[--color-text-dim] leading-relaxed line-clamp-2">{subline}</p>
                      )}

                      {names.filter(Boolean).length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {names.filter(Boolean).map(name => (
                            <button
                              key={name}
                              onClick={() => onPersonClick(name)}
                              className="rounded-full bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] text-[--color-text-dim] hover:text-[--color-text] hover:bg-white/10 transition-colors"
                            >
                              {name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
