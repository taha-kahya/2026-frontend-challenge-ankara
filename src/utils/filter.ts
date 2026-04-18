import type { RecordItem, SourceType } from '../types'

function recordMatchesQuery(record: RecordItem, query: string): boolean {
  const q = query.toLowerCase()
  switch (record.type) {
    case 'checkin':
      return (
        record.personName.toLowerCase().includes(q) ||
        record.location.toLowerCase().includes(q) ||
        (record.note?.toLowerCase().includes(q) ?? false)
      )
    case 'message':
      return (
        record.senderName.toLowerCase().includes(q) ||
        record.recipientName.toLowerCase().includes(q) ||
        record.text.toLowerCase().includes(q) ||
        record.location.toLowerCase().includes(q)
      )
    case 'sighting':
      return (
        record.personName.toLowerCase().includes(q) ||
        record.seenWith.toLowerCase().includes(q) ||
        record.location.toLowerCase().includes(q) ||
        (record.note?.toLowerCase().includes(q) ?? false)
      )
    case 'note':
      return (
        record.authorName.toLowerCase().includes(q) ||
        record.note.toLowerCase().includes(q) ||
        record.location.toLowerCase().includes(q) ||
        record.mentionedPeople.some(p => p.toLowerCase().includes(q))
      )
    case 'tip':
      return (
        record.suspectName.toLowerCase().includes(q) ||
        record.tip.toLowerCase().includes(q) ||
        record.location.toLowerCase().includes(q)
      )
  }
}

function recordMatchesPerson(record: RecordItem, person: string): boolean {
  const p = person.toLowerCase()
  switch (record.type) {
    case 'checkin':
      return record.personName.toLowerCase() === p
    case 'message':
      return (
        record.senderName.toLowerCase() === p ||
        record.recipientName.toLowerCase() === p
      )
    case 'sighting':
      return (
        record.personName.toLowerCase() === p ||
        record.seenWith.toLowerCase() === p
      )
    case 'note':
      return (
        record.authorName.toLowerCase() === p ||
        record.mentionedPeople.some(mp => mp.toLowerCase() === p)
      )
    case 'tip':
      return record.suspectName.toLowerCase() === p
  }
}

export function filterRecords(
  records: RecordItem[],
  query: string,
  source: SourceType | 'all',
  person: string | null,
): RecordItem[] {
  return records.filter(record => {
    if (source !== 'all' && record.type !== singularToType(source)) return false
    if (person && !recordMatchesPerson(record, person)) return false
    if (query && !recordMatchesQuery(record, query)) return false
    return true
  })
}

function singularToType(source: SourceType): RecordItem['type'] {
  const map: Record<SourceType, RecordItem['type']> = {
    checkins: 'checkin',
    messages: 'message',
    sightings: 'sighting',
    notes: 'note',
    tips: 'tip',
  }
  return map[source]
}
