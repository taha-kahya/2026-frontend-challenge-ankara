import { useEffect, useState } from 'react'
import { Search, X } from 'lucide-react'
import { useAllRecords } from '../hooks/useAllRecords'
import { RecordCard } from './record-cards/RecordCard'
import { RecordSkeleton } from '../components/Skeleton'
import { EmptyState } from '../components/EmptyState'
import { ErrorState } from '../components/ErrorState'
import { filterRecords } from '../utils/filter'
import type { SourceType } from '../types'

const TABS: { label: string; value: SourceType | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Sightings', value: 'sightings' },
  { label: 'Messages', value: 'messages' },
  { label: 'Checkins', value: 'checkins' },
  { label: 'Notes', value: 'notes' },
  { label: 'Tips', value: 'tips' },
]

const TAB_ACTIVE: Record<string, string> = {
  all:       'border-[--color-amber] text-[--color-amber]',
  sightings: 'border-amber-400 text-amber-300',
  messages:  'border-violet-400 text-violet-300',
  checkins:  'border-blue-400 text-blue-300',
  notes:     'border-emerald-400 text-emerald-300',
  tips:      'border-orange-400 text-orange-300',
}

interface EvidenceFeedProps {
  selectedPerson: string | null
  onPersonClick: (name: string) => void
  alertsOnly: boolean
  onClearAlertsOnly: () => void
}

export function EvidenceFeed({ selectedPerson, onPersonClick, alertsOnly, onClearAlertsOnly }: EvidenceFeedProps) {
  const [query, setQuery] = useState('')
  const [activeSource, setActiveSource] = useState<SourceType | 'all'>('all')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [isSearchAnimating, setIsSearchAnimating] = useState(false)

  const { records, isLoading, isError } = useAllRecords()

  const filtered = filterRecords(records, query, activeSource, selectedPerson).filter(record => {
    if (!alertsOnly) return true
    return (
      (record.type === 'message' && record.urgency === 'high') ||
      (record.type === 'tip' && record.confidence === 'high')
    )
  })

  useEffect(() => {
    if (!query) {
      setIsSearchAnimating(false)
      return
    }

    setIsSearchAnimating(true)
    const timeoutId = window.setTimeout(() => setIsSearchAnimating(false), 180)
    return () => window.clearTimeout(timeoutId)
  }, [query])

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="px-4 pt-3 pb-0 border-b border-[--color-border] space-y-3">
        {/* Search */}
        <div
          className={`relative transition-all duration-200 ${
            isSearchFocused || query
              ? 'scale-[1.01]'
              : 'scale-100'
          }`}
        >
          <Search
            className={`absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 transition-all duration-200 ${
              isSearchFocused || query
                ? 'text-[--color-amber] -translate-x-0.5'
                : 'text-[--color-muted]'
            }`}
          />
          <input
            type="text"
            placeholder="Search records, names, locations…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className={`w-full rounded-xl border bg-[--color-surface] py-2 pl-9 pr-8 text-xs text-[--color-text] placeholder:text-[--color-muted] focus:outline-none transition-all duration-200 ${
              isSearchFocused || query
                ? 'border-[--color-amber]/50 shadow-[0_0_0_1px_rgba(251,191,36,0.18)]'
                : 'border-[--color-border]'
            }`}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[--color-muted] hover:text-[--color-text] transition-all duration-150 hover:scale-110"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto scrollbar-none">
          {TABS.map(tab => {
            const isActive = activeSource === tab.value
            return (
              <button
                key={tab.value}
                onClick={() => setActiveSource(tab.value)}
                className={`cursor-pointer shrink-0 border-b-2 px-3 pb-2.5 text-xs font-medium transition-all duration-150 ${
                  isActive
                    ? TAB_ACTIVE[tab.value]
                    : 'border-transparent text-[--color-text-dim] hover:text-[--color-text] hover:border-white/20'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Context strip */}
      {selectedPerson && (
        <div className="flex items-center justify-between px-4 py-2 bg-amber-500/8 border-b border-amber-500/20">
          <span className="text-xs text-amber-300">
            Filtering by <span className="font-semibold">{selectedPerson}</span>
            <span className="text-amber-400/60 ml-1">· {filtered.length} records</span>
          </span>
          <button
            onClick={() => onPersonClick('')}
            className="text-[10px] text-amber-400/70 hover:text-amber-300 font-mono transition-colors"
          >
            clear ×
          </button>
        </div>
      )}

      {alertsOnly && (
        <div className="flex items-center justify-between px-4 py-2 bg-orange-500/8 border-b border-orange-500/20">
          <span className="text-xs text-orange-300">
            Showing <span className="font-semibold">high alerts only</span>
            <span className="text-orange-400/60 ml-1">· {filtered.length} records</span>
          </span>
          <button
            onClick={onClearAlertsOnly}
            className="text-[10px] text-orange-400/70 hover:text-orange-300 font-mono transition-colors"
          >
            clear ×
          </button>
        </div>
      )}

      {/* Records */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {isLoading && (
          <>
            <RecordSkeleton />
            <RecordSkeleton />
            <RecordSkeleton />
            <RecordSkeleton />
          </>
        )}

        {isError && <ErrorState message="Failed to load evidence" />}

        {!isLoading && !isError && filtered.length === 0 && (
          <EmptyState
            message="No records match"
            hint={query ? `Try a different search term` : `No evidence for this filter`}
          />
        )}

        {!isLoading && !isError && filtered.map((record, index) => (
          <div
            key={`${record.type}-${record.id}`}
            className={`transition-all duration-200 ${
              isSearchAnimating ? 'translate-y-1 opacity-75' : 'translate-y-0 opacity-100'
            }`}
            style={{
              transitionDelay: isSearchAnimating ? `${Math.min(index * 24, 120)}ms` : '0ms',
            }}
          >
            <RecordCard
              record={record}
              onPersonClick={onPersonClick}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
