import { useMemo } from 'react'
import { useCheckins } from './useCheckins'
import { useMessages } from './useMessages'
import { useSightings } from './useSightings'
import { usePersonalNotes } from './usePersonalNotes'
import { useAnonymousTips } from './useAnonymousTips'
import type { PersonRecord } from '../types'

const PODO = 'podo'

function normalize(name: string): string {
  return name.trim().toLowerCase()
}

function collectSuspects(
  sightingNames: string[],    // seenWith values
  messageNames: string[],     // senders + recipients
  noteAuthors: string[],      // note authors
  tipSuspects: string[],      // suspectName values
  mentionedPeople: string[][], // mentionedPeople arrays from notes
): Set<string> {
  const allNames = [
    ...sightingNames,
    ...messageNames,
    ...noteAuthors,
    ...tipSuspects,
    ...mentionedPeople.flat(),
  ]

  const seen = new Set<string>()
  const result = new Set<string>()

  for (const name of allNames) {
    if (!name || normalize(name) === PODO) continue // exclude Podo from suspect list
    const key = normalize(name)
    if (!seen.has(key)) {
      seen.add(key)
      result.add(name.trim())
    }
  }

  return result
}

function computeSuspicionScore(record: Omit<PersonRecord, 'suspicionScore'>): number {
  let score = 0
  score += record.sightings.length * 3
  score += record.tips.filter(t => t.confidence === 'high').length * 4
  score += record.tips.filter(t => t.confidence === 'medium').length * 2
  score += record.tips.filter(t => t.confidence === 'low').length * 1
  score += record.messagesSent.filter(m => m.urgency === 'high').length * 3
  score += record.messagesSent.filter(m => m.urgency === 'medium').length * 2
  score += record.messagesReceived.filter(m => m.urgency === 'high').length * 3
  score += record.checkins.length * 1
  score += record.notes.length * 1
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

    const names = collectSuspects(
      sightings.map(s => s.seenWith),
      [...messages.map(m => m.senderName), ...messages.map(m => m.recipientName)],
      notes.map(n => n.authorName),
      tips.map(t => t.suspectName),
      notes.map(n => n.mentionedPeople),
    )

    return Array.from(names).map(name => {
      const key = normalize(name)

      const personCheckins = checkins.filter(c => normalize(c.personName) === key)
      const messagesSent = messages.filter(m => normalize(m.senderName) === key)
      const messagesReceived = messages.filter(m => normalize(m.recipientName) === key)
      const personSightings = sightings.filter(s => normalize(s.seenWith) === key)
      const personNotes = notes.filter(
        n =>
          normalize(n.authorName) === key ||
          n.mentionedPeople.some(p => normalize(p) === key),
      )
      const personTips = tips.filter(t => normalize(t.suspectName) === key)

      // Latest timestamp across all records
      const timestamps = [
        ...personCheckins.map(c => c.timestamp),
        ...personSightings.map(s => s.timestamp),
      ].filter(Boolean).sort().reverse()

      const lastSighting = personSightings[0]
      const lastCheckin = personCheckins[0]
      const lastLocation = lastSighting?.location ?? lastCheckin?.location
      const lastCoordinates = lastSighting?.coordinates ?? lastCheckin?.coordinates

      const partial = {
        name,
        checkins: personCheckins,
        messagesSent,
        messagesReceived,
        sightings: personSightings,
        notes: personNotes,
        tips: personTips,
        lastSeen: timestamps[0],
        lastLocation,
        lastCoordinates,
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
