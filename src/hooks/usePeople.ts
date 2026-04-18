import { useMemo } from 'react'
import { useCheckins } from './useCheckins'
import { useMessages } from './useMessages'
import { useSightings } from './useSightings'
import { usePersonalNotes } from './usePersonalNotes'
import { useAnonymousTips } from './useAnonymousTips'
import type { PersonRecord } from '../types'

function normalize(name: string): string {
  return name.trim().toLowerCase()
}

// Collect all unique person names across all sources
function collectNames(
  checkinNames: string[],
  messageNames: string[],
  sightingNames: string[],
  noteNames: string[],
): Set<string> {
  const all = [...checkinNames, ...messageNames, ...sightingNames, ...noteNames]
  const seen = new Set<string>()
  const result = new Set<string>()
  for (const name of all) {
    if (!name) continue
    const key = normalize(name)
    if (!seen.has(key)) {
      seen.add(key)
      result.add(name.trim()) // keep original casing of first encounter
    }
  }
  return result
}

function computeSuspicionScore(record: Omit<PersonRecord, 'suspicionScore'>): number {
  let score = 0
  score += record.sightings.length * 3   // seen with Podo = most suspicious
  score += record.checkins.length * 1
  score += record.tips.filter(t => t.reliability === 'high').length * 4
  score += record.tips.filter(t => t.reliability === 'medium').length * 2
  score += record.tips.filter(t => t.reliability === 'low').length * 1
  score += record.messages.length * 1
  return score
}

export function usePeople() {
  const { checkins, isLoading: l1, isError: e1 } = useCheckins()
  const { messages, isLoading: l2, isError: e2 } = useMessages()
  const { sightings, isLoading: l3, isError: e3 } = useSightings()
  const { notes, isLoading: l4, isError: e4 } = usePersonalNotes()
  const { tips, isLoading: l5, isError: e5 } = useAnonymousTips()

  const isLoading = l1 || l2 || l3 || l4 || l5
  const isError = e1 || e2 || e3 || e4 || e5

  const people = useMemo<PersonRecord[]>(() => {
    if (isLoading || isError) return []

    const names = collectNames(
      checkins.map(c => c.person),
      [...messages.map(m => m.from), ...messages.map(m => m.to)],
      [...sightings.map(s => s.reporter), ...sightings.map(s => s.seenWith)],
      [...notes.map(n => n.author), ...notes.map(n => n.subject)],
    )

    return Array.from(names).map(name => {
      const key = normalize(name)

      const personCheckins = checkins.filter(c => normalize(c.person) === key)
      const personMessages = messages.filter(
        m => normalize(m.from) === key || normalize(m.to) === key,
      )
      const personSightings = sightings.filter(
        s => normalize(s.reporter) === key || normalize(s.seenWith) === key,
      )
      const personNotes = notes.filter(
        n => normalize(n.author) === key || normalize(n.subject) === key,
      )
      // Tips: fuzzy match name in content
      const personTips = tips.filter(t => t.content.toLowerCase().includes(key))

      // Last seen: latest timestamp across checkins and sightings
      const timestamps = [
        ...personCheckins.map(c => c.submittedAt),
        ...personSightings.map(s => s.timestamp ?? s.submittedAt),
      ].filter(Boolean).sort().reverse()

      const lastLocation =
        personSightings[0]?.location ?? personCheckins[0]?.location

      const partial = {
        name,
        checkins: personCheckins,
        messages: personMessages,
        sightings: personSightings,
        notes: personNotes,
        tips: personTips,
        lastSeen: timestamps[0],
        lastLocation,
      }

      return { ...partial, suspicionScore: computeSuspicionScore(partial) }
    }).sort((a, b) => b.suspicionScore - a.suspicionScore)
  }, [checkins, messages, sightings, notes, tips, isLoading, isError])

  return {
    people,
    isLoading,
    isError,
    isEmpty: !isLoading && !isError && people.length === 0,
  }
}
