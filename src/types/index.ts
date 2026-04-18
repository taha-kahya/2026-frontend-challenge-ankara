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
  status: 'ACTIVE' | 'DELETED' | 'ARCHIVED'
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

export interface Checkin {
  id: string
  submittedAt: string
  person: string
  location: string
  notes?: string
  raw: JotFormSubmission
}

export interface Message {
  id: string
  submittedAt: string
  from: string
  to: string
  content: string
  timestamp?: string
  raw: JotFormSubmission
}

export interface Sighting {
  id: string
  submittedAt: string
  reporter: string
  seenWith: string // person seen with Podo
  location: string
  description?: string
  timestamp?: string
  raw: JotFormSubmission
}

export interface PersonalNote {
  id: string
  submittedAt: string
  author: string
  subject: string
  content: string
  raw: JotFormSubmission
}

export interface AnonymousTip {
  id: string
  submittedAt: string
  content: string
  reliability: 'low' | 'medium' | 'high' | string
  location?: string
  raw: JotFormSubmission
}

// ─── Aggregated Person Profile ────────────────────────────────────────────────

export interface PersonRecord {
  name: string
  checkins: Checkin[]
  messages: Message[]         // messages from or to this person
  sightings: Sighting[]       // sightings where this person appears
  notes: PersonalNote[]       // notes mentioning this person
  tips: AnonymousTip[]        // tips mentioning this person (fuzzy)
  suspicionScore: number      // derived metric
  lastSeen?: string
  lastLocation?: string
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
