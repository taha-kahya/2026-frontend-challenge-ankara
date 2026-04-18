import { Eye, AlertTriangle, MapPin, User } from 'lucide-react'
import { useSummaryInsights } from '../hooks/useSummaryInsights'
import { formatTime, formatDate } from '../utils/time'

interface SummaryStripProps {
  onPersonClick: (name: string) => void
}

export function SummaryStrip({ onPersonClick }: SummaryStripProps) {
  const { lastSeenWith, lastSeenLocation, lastSeenTime, topSuspect, busiestLocation, alertCount } =
    useSummaryInsights()

  return (
    <div className="fade-in-down flex items-stretch gap-px border-b border-[--color-border] bg-[--color-border]">
      {/* Last seen with */}
      <SummaryCard
        icon={<Eye className="h-3.5 w-3.5 text-amber-400" />}
        label="Last seen with"
        accent="amber"
      >
        {lastSeenWith ? (
          <button
            onClick={() => onPersonClick(lastSeenWith)}
            className="font-semibold text-amber-300 hover:text-amber-200 transition-colors"
          >
            {lastSeenWith}
          </button>
        ) : (
          <span className="text-[--color-text-dim]">Unknown</span>
        )}
        {lastSeenLocation && (
          <span className="ml-1.5 text-[--color-muted]">@ {lastSeenLocation}</span>
        )}
        {lastSeenTime && (
          <span className="ml-1.5 font-mono text-[--color-muted]">
            {formatDate(lastSeenTime)} {formatTime(lastSeenTime)}
          </span>
        )}
      </SummaryCard>

      {/* Top suspect */}
      <SummaryCard
        icon={<User className="h-3.5 w-3.5 text-red-400" />}
        label="Most suspicious"
        accent="red"
      >
        {topSuspect ? (
          <>
            <button
              onClick={() => onPersonClick(topSuspect.name)}
              className="font-semibold text-red-300 hover:text-red-200 transition-colors"
            >
              {topSuspect.name}
            </button>
            <span className="ml-1.5 font-mono text-[--color-muted]">score {topSuspect.score}</span>
          </>
        ) : (
          <span className="text-[--color-text-dim]">Calculating…</span>
        )}
      </SummaryCard>

      {/* Busiest location */}
      <SummaryCard
        icon={<MapPin className="h-3.5 w-3.5 text-blue-400" />}
        label="Busiest location"
        accent="blue"
      >
        {busiestLocation ? (
          <>
            <span className="font-semibold text-[--color-text]">{busiestLocation.name}</span>
            <span className="ml-1.5 font-mono text-[--color-muted]">{busiestLocation.count} records</span>
          </>
        ) : (
          <span className="text-[--color-text-dim]">–</span>
        )}
      </SummaryCard>

      {/* Alerts */}
      <SummaryCard
        icon={<AlertTriangle className="h-3.5 w-3.5 text-orange-400" />}
        label="High alerts"
        accent="orange"
      >
        <span className={`font-semibold ${alertCount > 0 ? 'text-orange-300' : 'text-[--color-text-dim]'}`}>
          {alertCount}
        </span>
        <span className="ml-1.5 text-[--color-muted]">urgent msgs + high tips</span>
      </SummaryCard>
    </div>
  )
}

type Accent = 'amber' | 'red' | 'blue' | 'orange'

const ACCENT_BG: Record<Accent, string> = {
  amber:  'bg-amber-500/5',
  red:    'bg-red-500/5',
  blue:   'bg-blue-500/5',
  orange: 'bg-orange-500/5',
}

function SummaryCard({
  icon,
  label,
  accent,
  children,
}: {
  icon: React.ReactNode
  label: string
  accent: Accent
  children: React.ReactNode
}) {
  return (
    <div className={`flex-1 flex flex-col gap-1 px-4 py-2.5 ${ACCENT_BG[accent]} bg-[--color-surface]`}>
      <div className="flex items-center gap-1.5">
        {icon}
        <span className="font-mono text-[9px] uppercase tracking-widest text-[--color-muted]">{label}</span>
      </div>
      <div className="flex items-baseline gap-0 flex-wrap text-xs">
        {children}
      </div>
    </div>
  )
}
