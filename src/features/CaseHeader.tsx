import { MapPin, Eye, Users, FileText } from 'lucide-react'
import { useSightings } from '../hooks/useSightings'
import { usePeople } from '../hooks/usePeople'
import { useAllRecords } from '../hooks/useAllRecords'
import { formatDate, formatTime, sortByTimestamp } from '../utils/time'

export function CaseHeader() {
  const { sightings } = useSightings()
  const { people } = usePeople()
  const { total } = useAllRecords()

  const lastSighting = [...sightings].sort((a, b) =>
    sortByTimestamp(a.timestamp, b.timestamp),
  )[0]

  const topSuspect = people[0]

  return (
    <header className="border-b border-[--color-border] bg-[--color-surface] px-4 lg:px-6 py-3 lg:py-4">
      <div className="flex items-center justify-between gap-4">

        {/* Title */}
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-mono text-base font-bold tracking-widest text-[--color-text] uppercase">
                Missing Podo
              </h1>
              <span className="flex items-center gap-1.5 rounded-full bg-red-500/15 border border-red-500/25 px-2.5 py-0.5 text-[10px] font-mono font-semibold text-red-400 uppercase tracking-widest">
                <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />
                Case Active
              </span>
            </div>
            {lastSighting && (
              <div className="hidden sm:flex items-center gap-1.5 mt-0.5 text-xs text-[--color-text-dim]">
                <MapPin className="h-3 w-3 text-amber-400" />
                <span>Last seen at</span>
                <span className="text-[--color-text] font-medium">{lastSighting.location}</span>
                <span className="text-[--color-muted]">·</span>
                <span className="font-mono">{formatDate(lastSighting.timestamp)}, {formatTime(lastSighting.timestamp)}</span>
                {lastSighting.seenWith && (
                  <>
                    <span className="text-[--color-muted]">·</span>
                    <span>with</span>
                    <span className="text-amber-300 font-medium">{lastSighting.seenWith}</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 lg:gap-6">
          <Stat icon={<Eye className="h-3.5 w-3.5" />} value={sightings.length} label="sightings" />
          <Stat icon={<Users className="h-3.5 w-3.5" />} value={people.length} label="suspects" />
          <Stat icon={<FileText className="h-3.5 w-3.5" />} value={total} label="records" className="hidden sm:flex" />
          {topSuspect && (
            <div className="hidden md:block border-l border-[--color-border] pl-6">
              <p className="text-[10px] font-mono uppercase tracking-wider text-[--color-muted] mb-0.5">Top suspect</p>
              <p className="text-sm font-semibold text-red-300">{topSuspect.name}</p>
            </div>
          )}
        </div>

      </div>
    </header>
  )
}

function Stat({ icon, value, label, className = '' }: { icon: React.ReactNode; value: number; label: string; className?: string }) {
  return (
    <div className={`flex flex-col items-center gap-0.5 ${className}`}>
      <div className="flex items-center gap-1 text-[--color-text-dim]">{icon}</div>
      <span className="font-mono text-base font-bold text-[--color-text]">{value}</span>
      <span className="text-[10px] font-mono uppercase tracking-wider text-[--color-muted]">{label}</span>
    </div>
  )
}
