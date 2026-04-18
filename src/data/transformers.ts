import { getAnswer } from '../lib/jotform'
import type {
  JotFormSubmission,
  Checkin,
  Message,
  Sighting,
  PersonalNote,
  AnonymousTip,
  Coordinates,
} from '../types'

function parseCoordinates(raw: string): Coordinates | undefined {
  const parts = raw.split(',').map(s => parseFloat(s.trim()))
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return { lat: parts[0], lng: parts[1] }
  }
  return undefined
}

function parseUrgency(raw: string): Message['urgency'] {
  if (raw === 'high') return 'high'
  if (raw === 'medium') return 'medium'
  return 'low'
}

function parseConfidence(raw: string): AnonymousTip['confidence'] {
  if (raw === 'high') return 'high'
  if (raw === 'medium') return 'medium'
  return 'low'
}

// ── Checkin ───────────────────────────────────────────────────────────────────
// Fields: 2=personName, 3=timestamp, 4=location, 5=coordinates, 6=note
export function transformCheckin(submission: JotFormSubmission): Checkin {
  const a = submission.answers
  return {
    id: submission.id,
    submittedAt: submission.created_at,
    personName: getAnswer(a, '2'),
    timestamp: getAnswer(a, '3'),
    location: getAnswer(a, '4'),
    coordinates: parseCoordinates(getAnswer(a, '5')),
    note: getAnswer(a, '6') || undefined,
    raw: submission,
  }
}

// ── Message ───────────────────────────────────────────────────────────────────
// Fields: 2=senderName, 3=recipientName, 4=timestamp, 5=location, 6=coordinates, 7=text, 8=urgency
export function transformMessage(submission: JotFormSubmission): Message {
  const a = submission.answers
  return {
    id: submission.id,
    submittedAt: submission.created_at,
    senderName: getAnswer(a, '2'),
    recipientName: getAnswer(a, '3'),
    timestamp: getAnswer(a, '4'),
    location: getAnswer(a, '5'),
    coordinates: parseCoordinates(getAnswer(a, '6')),
    text: getAnswer(a, '7'),
    urgency: parseUrgency(getAnswer(a, '8')),
    raw: submission,
  }
}

// ── Sighting ──────────────────────────────────────────────────────────────────
// Fields: 2=personName, 3=seenWith, 4=timestamp, 5=location, 6=coordinates, 7=note
export function transformSighting(submission: JotFormSubmission): Sighting {
  const a = submission.answers
  return {
    id: submission.id,
    submittedAt: submission.created_at,
    personName: getAnswer(a, '2'),
    seenWith: getAnswer(a, '3'),
    timestamp: getAnswer(a, '4'),
    location: getAnswer(a, '5'),
    coordinates: parseCoordinates(getAnswer(a, '6')),
    note: getAnswer(a, '7') || undefined,
    raw: submission,
  }
}

// ── PersonalNote ──────────────────────────────────────────────────────────────
// Fields: 2=authorName, 3=timestamp, 4=location, 5=coordinates, 6=note, 7=mentionedPeople
export function transformPersonalNote(submission: JotFormSubmission): PersonalNote {
  const a = submission.answers
  const mentionedRaw = getAnswer(a, '7')
  return {
    id: submission.id,
    submittedAt: submission.created_at,
    authorName: getAnswer(a, '2'),
    timestamp: getAnswer(a, '3'),
    location: getAnswer(a, '4'),
    coordinates: parseCoordinates(getAnswer(a, '5')),
    note: getAnswer(a, '6'),
    mentionedPeople: mentionedRaw
      ? mentionedRaw.split(',').map(s => s.trim()).filter(Boolean)
      : [],
    raw: submission,
  }
}

// ── AnonymousTip ──────────────────────────────────────────────────────────────
// Fields: 1=submissionDate, 2=timestamp, 3=location, 4=coordinates, 5=suspectName, 6=tip, 7=confidence
export function transformAnonymousTip(submission: JotFormSubmission): AnonymousTip {
  const a = submission.answers
  return {
    id: submission.id,
    submittedAt: submission.created_at,
    submissionDate: getAnswer(a, '1'),
    timestamp: getAnswer(a, '2'),
    location: getAnswer(a, '3'),
    coordinates: parseCoordinates(getAnswer(a, '4')),
    suspectName: getAnswer(a, '5'),
    tip: getAnswer(a, '6'),
    confidence: parseConfidence(getAnswer(a, '7')),
    raw: submission,
  }
}
