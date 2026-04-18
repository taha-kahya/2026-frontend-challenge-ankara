import { Eye, MessageSquare, MapPin, FileText, AlertTriangle } from 'lucide-react'
import { usePeople } from '../hooks/usePeople'
import { SuspicionBar } from '../components/SuspicionBar'
import { SuspectSkeleton } from '../components/Skeleton'
import { formatDate, formatTime } from '../utils/time'
import type { PersonRecord } from '../types'

interface SuspectListProps {
  selectedPerson: string | null
  onSelect: (name: string | null) => void
}

export function SuspectList({ selectedPerson, onSelect }: SuspectListProps) {
  const { people, isLoading, isError } = usePeople()

  return (
    <aside className="flex flex-col h-full border-r border-[--color-border]">
      <div className="px-4 py-3 border-b border-[--color-border]">
        <p className="font-mono text-[10px] uppercase tracking-widest text-[--color-muted]">
          Suspects · {people.length}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {isLoading && (
          <>
            <SuspectSkeleton />
            <SuspectSkeleton />
            <SuspectSkeleton />
          </>
        )}

        {isError && (
          <p className="text-xs text-red-400 text-center py-4">Failed to load suspects</p>
        )}

        {!isLoading && !isError && people.map((person, i) => (
          <SuspectCard
            key={person.name}
            person={person}
            rank={i + 1}
            isSelected={selectedPerson === person.name}
            onSelect={onSelect}
          />
        ))}
      </div>
    </aside>
  )
}

interface SuspectCardProps {
  person: PersonRecord
  rank: number
  isSelected: boolean
  onSelect: (name: string | null) => void
}

function SuspectCard({ person, rank, isSelected, onSelect }: SuspectCardProps) {
  const maxScore = 30

  return (
    <button
      onClick={() => onSelect(isSelected ? null : person.name)}
      className={`w-full text-left rounded-xl border p-3 transition-all duration-150 ${
        isSelected
          ? 'border-amber-500/50 bg-amber-500/8 shadow-sm shadow-amber-500/10'
          : 'border-[--color-border] bg-[--color-surface] hover:border-[--color-border] hover:bg-[--color-surface-raised]'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-[--color-muted] w-4">{rank}.</span>
          <span className="text-sm font-semibold text-[--color-text] truncate">{person.name}</span>
        </div>
        {rank === 1 && (
          <span className="shrink-0 text-[10px] font-mono text-red-400">●</span>
        )}
      </div>

      <div className="mb-2">
        <SuspicionBar score={person.suspicionScore} max={maxScore} />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {person.sightings.length > 0 && (
          <SourceCount icon={<Eye className="h-2.5 w-2.5" />} count={person.sightings.length} color="text-amber-400" />
        )}
        {(person.messagesSent.length + person.messagesReceived.length) > 0 && (
          <SourceCount icon={<MessageSquare className="h-2.5 w-2.5" />} count={person.messagesSent.length + person.messagesReceived.length} color="text-violet-400" />
        )}
        {person.checkins.length > 0 && (
          <SourceCount icon={<MapPin className="h-2.5 w-2.5" />} count={person.checkins.length} color="text-blue-400" />
        )}
        {person.notes.length > 0 && (
          <SourceCount icon={<FileText className="h-2.5 w-2.5" />} count={person.notes.length} color="text-emerald-400" />
        )}
        {person.tips.length > 0 && (
          <SourceCount icon={<AlertTriangle className="h-2.5 w-2.5" />} count={person.tips.length} color="text-orange-400" />
        )}
      </div>

      {person.lastSeen && (
        <p className="mt-2 font-mono text-[10px] text-[--color-muted] truncate">
          {formatDate(person.lastSeen)} {formatTime(person.lastSeen)}
          {person.lastLocation && <> · {person.lastLocation}</>}
        </p>
      )}
    </button>
  )
}

function SourceCount({ icon, count, color }: { icon: React.ReactNode; count: number; color: string }) {
  return (
    <span className={`flex items-center gap-0.5 font-mono text-[10px] ${color}`}>
      {icon}{count}
    </span>
  )
}
