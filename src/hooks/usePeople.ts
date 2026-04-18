import { useMemo } from 'react'
import { useCheckins } from './useCheckins'
import { useMessages } from './useMessages'
import { useSightings } from './useSightings'
import { usePersonalNotes } from './usePersonalNotes'
import { useAnonymousTips } from './useAnonymousTips'
import { clusterNames, isFuzzyMatch } from '../utils/fuzzy'
import type { PersonRecord } from '../types'

function isPodo(name: string): boolean {
  return isFuzzyMatch(name, 'Podo')
}

function matchesVariants(name: string, variants: string[]): boolean {
  return variants.some(v => isFuzzyMatch(name, v))
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

    // Collect all candidate names, excluding Podo
    const allNames = [
      ...sightings.map(s => s.seenWith),
      ...messages.map(m => m.senderName),
      ...messages.map(m => m.recipientName),
      ...notes.map(n => n.authorName),
      ...tips.map(t => t.suspectName),
      ...notes.flatMap(n => n.mentionedPeople),
    ].filter(n => n && !isPodo(n))

    // Cluster similar names — handles typos and Turkish diacritic variants
    const clusters = clusterNames(allNames)

    return Array.from(clusters.entries()).map(([canonical, variants]) => {
      const personCheckins = checkins.filter(c =>
        !isPodo(c.personName) && matchesVariants(c.personName, variants),
      )
      const messagesSent = messages.filter(m => matchesVariants(m.senderName, variants))
      const messagesReceived = messages.filter(m => matchesVariants(m.recipientName, variants))
      const personSightings = sightings.filter(s => matchesVariants(s.seenWith, variants))
      const personNotes = notes.filter(
        n =>
          matchesVariants(n.authorName, variants) ||
          n.mentionedPeople.some(p => matchesVariants(p, variants)),
      )
      const personTips = tips.filter(t => matchesVariants(t.suspectName, variants))

      const timestamps = [
        ...personCheckins.map(c => c.timestamp),
        ...personSightings.map(s => s.timestamp),
      ].filter(Boolean).sort().reverse()

      const lastSighting = personSightings[0]
      const lastCheckin = personCheckins[0]

      const partial = {
        name: canonical,
        checkins: personCheckins,
        messagesSent,
        messagesReceived,
        sightings: personSightings,
        notes: personNotes,
        tips: personTips,
        lastSeen: timestamps[0],
        lastLocation: lastSighting?.location ?? lastCheckin?.location,
        lastCoordinates: lastSighting?.coordinates ?? lastCheckin?.coordinates,
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
