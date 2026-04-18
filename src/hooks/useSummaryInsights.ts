import { useMemo } from 'react'
import { useAllRecords } from './useAllRecords'
import { usePeople } from './usePeople'
import { useSightings } from './useSightings'
import { useMessages } from './useMessages'
import { useAnonymousTips } from './useAnonymousTips'
import { sortByTimestamp } from '../utils/time'
import type { RecordItem } from '../types'

function getLocation(record: RecordItem): string {
  if ('location' in record) return record.location as string
  return ''
}

function getTimestamp(record: RecordItem): string {
  if (record.type === 'checkin') return record.timestamp
  if (record.type === 'message') return record.timestamp
  if (record.type === 'sighting') return record.timestamp
  if (record.type === 'note') return record.timestamp
  if (record.type === 'tip') return record.timestamp
  return ''
}

export interface SummaryInsights {
  lastSeenWith: string | null
  lastSeenLocation: string | null
  lastSeenTime: string | null
  topSuspect: { name: string; score: number } | null
  busiestLocation: { name: string; count: number } | null
  alertCount: number   // urgent messages + high-confidence tips
  sightingCount: number
}

export function useSummaryInsights(): SummaryInsights {
  const { records } = useAllRecords()
  const { people } = usePeople()
  const { sightings } = useSightings()
  const { messages } = useMessages()
  const { tips } = useAnonymousTips()

  return useMemo(() => {
    // Last sighting of Podo
    const lastSighting = [...sightings]
      .sort((a, b) => sortByTimestamp(a.timestamp, b.timestamp))[0]

    // Top suspect
    const topSuspect = people[0]
      ? { name: people[0].name, score: people[0].suspicionScore }
      : null

    // Busiest location across all records
    const locationCounts = new Map<string, number>()
    for (const r of records) {
      const loc = getLocation(r)
      if (loc) locationCounts.set(loc, (locationCounts.get(loc) ?? 0) + 1)
    }
    const busiestEntry = [...locationCounts.entries()].sort((a, b) => b[1] - a[1])[0]
    const busiestLocation = busiestEntry
      ? { name: busiestEntry[0], count: busiestEntry[1] }
      : null

    // Alert count: urgent messages + high-confidence tips
    const urgentMessages = messages.filter(m => m.urgency === 'high').length
    const highTips = tips.filter(t => t.confidence === 'high').length
    const alertCount = urgentMessages + highTips

    return {
      lastSeenWith: lastSighting?.seenWith ?? null,
      lastSeenLocation: lastSighting?.location ?? null,
      lastSeenTime: lastSighting?.timestamp ?? null,
      topSuspect,
      busiestLocation,
      alertCount,
      sightingCount: sightings.length,
    }
  }, [records, people, sightings, messages, tips])
}
