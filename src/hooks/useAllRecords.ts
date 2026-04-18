import { useMemo } from 'react'
import { useCheckins } from './useCheckins'
import { useMessages } from './useMessages'
import { useSightings } from './useSightings'
import { usePersonalNotes } from './usePersonalNotes'
import { useAnonymousTips } from './useAnonymousTips'
import { sortByTimestamp } from '../utils/time'
import type { RecordItem } from '../types'

export function useAllRecords() {
  const { checkins, isLoading: l1, isError: e1 } = useCheckins()
  const { messages, isLoading: l2, isError: e2 } = useMessages()
  const { sightings, isLoading: l3, isError: e3 } = useSightings()
  const { notes, isLoading: l4, isError: e4 } = usePersonalNotes()
  const { tips, isLoading: l5, isError: e5 } = useAnonymousTips()

  const isLoading = l1 || l2 || l3 || l4 || l5
  const isError = e1 || e2 || e3 || e4 || e5

  const records = useMemo<RecordItem[]>(() => {
    if (isLoading || isError) return []

    const all: RecordItem[] = [
      ...checkins.map(c => ({ type: 'checkin' as const, ...c })),
      ...messages.map(m => ({ type: 'message' as const, ...m })),
      ...sightings.map(s => ({ type: 'sighting' as const, ...s })),
      ...notes.map(n => ({ type: 'note' as const, ...n })),
      ...tips.map(t => ({ type: 'tip' as const, ...t })),
    ]

    return all.sort((a, b) => {
      const getTimestamp = (r: RecordItem) => {
        if (r.type === 'checkin') return r.timestamp
        if (r.type === 'message') return r.timestamp
        if (r.type === 'sighting') return r.timestamp
        if (r.type === 'note') return r.timestamp
        if (r.type === 'tip') return r.timestamp
        return ''
      }
      return sortByTimestamp(getTimestamp(a), getTimestamp(b))
    })
  }, [checkins, messages, sightings, notes, tips, isLoading, isError])

  return {
    records,
    total: records.length,
    isLoading,
    isError,
    isEmpty: !isLoading && !isError && records.length === 0,
  }
}
