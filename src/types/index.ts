// ─── JotForm Raw API ─────────────────────────────────────────────────────────

export interface JotFormAnswer {
  name: string
  text: string
  type: string
  answer?: string | string[] | Record<string, string>
  prettyFormat?: string
}

export interface JotFormSubmission {
  id: string
  form_id: string
  ip: string
  created_at: string
  status: string
  answers: Record<string, JotFormAnswer>
}

export interface JotFormResponse<T> {
  responseCode: number
  message: string
  content: T
  resultSet?: {
    offset: number
    limit: number
    count: number
  }
}

// ─── Domain Types ─────────────────────────────────────────────────────────────

export interface Coordinates {
  lat: number
  lng: number
}

export interface Checkin {
  id: string
  submittedAt: string
  personName: string
  timestamp: string
  location: string
  coordinates?: Coordinates
  note?: string
  raw: JotFormSubmission
}

export interface Message {
  id: string
  submittedAt: string
  senderName: string
  recipientName: string
  timestamp: string
  location: string
  coordinates?: Coordinates
  text: string
  urgency: 'low' | 'medium' | 'high'
  raw: JotFormSubmission
}

export interface Sighting {
  id: string
  submittedAt: string
  personName: string   // who was spotted
  seenWith: string     // who they were seen with
  timestamp: string
  location: string
  coordinates?: Coordinates
  note?: string
  raw: JotFormSubmission
}

export interface PersonalNote {
  id: string
  submittedAt: string
  authorName: string
  timestamp: string
  location: string
  coordinates?: Coordinates
  note: string
  mentionedPeople: string[]
  raw: JotFormSubmission
}

export interface AnonymousTip {
  id: string
  submittedAt: string
  submissionDate: string
  timestamp: string
  location: string
  coordinates?: Coordinates
  suspectName: string
  tip: string
  confidence: 'low' | 'medium' | 'high'
  raw: JotFormSubmission
}

// ─── Aggregated Person Profile ────────────────────────────────────────────────

export interface PersonRecord {
  name: string
  checkins: Checkin[]
  messagesSent: Message[]
  messagesReceived: Message[]
  sightings: Sighting[]          // sightings where this person appears as seenWith
  notes: PersonalNote[]          // notes mentioning this person
  tips: AnonymousTip[]           // tips where suspectName matches
  suspicionScore: number
  lastSeen?: string
  lastLocation?: string
  lastCoordinates?: Coordinates
}

// ─── UI State ─────────────────────────────────────────────────────────────────

export type SourceType = 'checkins' | 'messages' | 'sightings' | 'notes' | 'tips'

export interface FilterState {
  query: string
  source: SourceType | 'all'
  person: string | null
}

export type RecordItem =
  | ({ type: 'checkin' } & Checkin)
  | ({ type: 'message' } & Message)
  | ({ type: 'sighting' } & Sighting)
  | ({ type: 'note' } & PersonalNote)
  | ({ type: 'tip' } & AnonymousTip)
