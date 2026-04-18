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
    <header className="border-b border-[--color-border] bg-[--color-surface] px-4 lg:px-6 py-3">
      <div className="flex items-center justify-between gap-4">

        {/* Left: badge + title + last seen */}
        <div className="flex flex-col gap-1 min-w-0">
          {/* Row 1: badge leftmost, then title */}
          <div className="flex items-center gap-2.5">
            <span className="flex items-center gap-1.5 rounded-full bg-red-500/15 border border-red-500/25 px-2.5 py-0.5 text-[10px] font-mono font-semibold text-red-400 uppercase tracking-widest shrink-0">
              <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />
              Case Active
            </span>
            <h1 className="font-mono text-base font-bold tracking-widest text-[--color-text] uppercase">
              Missing Podo
            </h1>
          </div>

          {/* Row 2: last seen — more gap above via gap-1 on parent */}
          {lastSighting && (
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-[--color-text-dim]">
              <MapPin className="h-3 w-3 text-amber-400 shrink-0" />
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

        {/* Right: inline stats */}
        <div className="flex items-center gap-3 lg:gap-5 shrink-0">
          <Stat icon={<Eye className="h-3 w-3" />} value={sightings.length} label="sightings" />
          <Stat icon={<Users className="h-3 w-3" />} value={people.length} label="suspects" />
          <Stat icon={<FileText className="h-3 w-3" />} value={total} label="records" className="hidden sm:flex" />
          {topSuspect && (
            <div className="hidden md:flex flex-col border-l border-[--color-border] pl-4 lg:pl-5">
              <span className="text-[9px] font-mono uppercase tracking-wider text-[--color-muted]">Top suspect</span>
              <span className="text-sm font-semibold text-red-300 leading-tight">{topSuspect.name}</span>
            </div>
          )}
        </div>

      </div>
    </header>
  )
}

function Stat({ icon, value, label, className = '' }: {
  icon: React.ReactNode
  value: number
  label: string
  className?: string
}) {
  return (
    <div className={`flex flex-col gap-0 items-center ${className}`}>
      <div className="flex items-center gap-1 text-[--color-text-dim]">
        {icon}
        <span className="font-mono text-sm font-bold text-[--color-text]">{value}</span>
      </div>
      <span className="text-[9px] font-mono uppercase tracking-wider text-[--color-muted]">{label}</span>
    </div>
  )
}
