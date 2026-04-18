import { CheckinCard } from './CheckinCard'
import { MessageCard } from './MessageCard'
import { SightingCard } from './SightingCard'
import { NoteCard } from './NoteCard'
import { TipCard } from './TipCard'
import type { RecordItem } from '../../types'

interface RecordCardProps {
  record: RecordItem
  onPersonClick?: (name: string) => void
}

export function RecordCard({ record, onPersonClick }: RecordCardProps) {
  switch (record.type) {
    case 'checkin':
      return <CheckinCard record={record} onPersonClick={onPersonClick} />
    case 'message':
      return <MessageCard record={record} onPersonClick={onPersonClick} />
    case 'sighting':
      return <SightingCard record={record} onPersonClick={onPersonClick} />
    case 'note':
      return <NoteCard record={record} onPersonClick={onPersonClick} />
    case 'tip':
      return <TipCard record={record} onPersonClick={onPersonClick} />
  }
}
