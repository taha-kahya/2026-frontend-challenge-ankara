import { X, MapPin, Eye, MessageSquare, FileText, AlertTriangle, MapPinned } from 'lucide-react'
import { usePeople } from '../hooks/usePeople'
import { SuspicionBar } from '../components/SuspicionBar'
import { RecordCard } from './record-cards/RecordCard'
import { formatDate, formatTime } from '../utils/time'
import type { PersonRecord, RecordItem } from '../types'

interface PersonDetailProps {
  personName: string
  onClose: () => void
  onPersonClick: (name: string) => void
}

export function PersonDetail({ personName, onClose, onPersonClick }: PersonDetailProps) {
  const { people } = usePeople()
  const person = people.find(p => p.name === personName)

  if (!person) return null

  const allRecords: RecordItem[] = [
    ...person.sightings.map(r => ({ type: 'sighting' as const, ...r })),
    ...person.messagesSent.map(r => ({ type: 'message' as const, ...r })),
    ...person.messagesReceived.map(r => ({ type: 'message' as const, ...r })),
    ...person.checkins.map(r => ({ type: 'checkin' as const, ...r })),
    ...person.notes.map(r => ({ type: 'note' as const, ...r })),
    ...person.tips.map(r => ({ type: 'tip' as const, ...r })),
  ]

  return (
    <aside className="flex flex-col h-full border-l border-[--color-border] bg-[--color-surface]">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[--color-border]">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-[--color-muted] mb-1">Suspect</p>
            <h2 className="text-lg font-bold text-[--color-text]">{person.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[--color-muted] hover:text-[--color-text] hover:bg-[--color-surface-raised] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[--color-muted]">Suspicion</span>
          </div>
          <SuspicionBar score={person.suspicionScore} max={30} />
        </div>
      </div>

      {/* Last seen */}
      {person.lastSeen && (
        <div className="px-5 py-3 border-b border-[--color-border] bg-[--color-surface-raised]/50">
          <div className="flex items-center gap-1.5 text-xs">
            <MapPinned className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-[--color-text-dim]">Last seen</span>
            <span className="text-[--color-text] font-medium">{person.lastLocation}</span>
            <span className="text-[--color-muted]">·</span>
            <span className="font-mono text-[--color-text-dim]">
              {formatDate(person.lastSeen)} {formatTime(person.lastSeen)}
            </span>
          </div>
        </div>
      )}

      {/* Source counts */}
      <div className="px-5 py-3 border-b border-[--color-border] grid grid-cols-3 gap-2">
        <SourceCount icon={<Eye className="h-3.5 w-3.5 text-amber-400" />} label="Sightings" count={person.sightings.length} />
        <SourceCount icon={<MessageSquare className="h-3.5 w-3.5 text-violet-400" />} label="Messages" count={person.messagesSent.length + person.messagesReceived.length} />
        <SourceCount icon={<MapPin className="h-3.5 w-3.5 text-blue-400" />} label="Checkins" count={person.checkins.length} />
        <SourceCount icon={<FileText className="h-3.5 w-3.5 text-emerald-400" />} label="Notes" count={person.notes.length} />
        <SourceCount icon={<AlertTriangle className="h-3.5 w-3.5 text-orange-400" />} label="Tips" count={person.tips.length} />
      </div>

      {/* All records */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <p className="font-mono text-[10px] uppercase tracking-wider text-[--color-muted]">
          All evidence · {allRecords.length}
        </p>
        {allRecords.map(record => (
          <RecordCard
            key={`${record.type}-${record.id}`}
            record={record}
            onPersonClick={name => name !== personName && onPersonClick(name)}
          />
        ))}
      </div>
    </aside>
  )
}

function SourceCount({ icon, label, count }: { icon: React.ReactNode; label: string; count: number }) {
  return (
    <div className="flex flex-col items-center gap-0.5 rounded-lg bg-[--color-surface-raised] py-2">
      {icon}
      <span className="font-mono text-sm font-bold text-[--color-text]">{count}</span>
      <span className="text-[10px] text-[--color-muted]">{label}</span>
    </div>
  )
}
