// ─── Raw JotForm → Domain Types ───────────────────────────────────────────────
// Field mappings are placeholders — update after inspecting real API responses.
// Use debugAnswerKeys() in lib/jotform.ts to inspect a submission's fields.

import { getAnswer, getAnswerByName } from '../lib/jotform'
import type {
  JotFormSubmission,
  Checkin,
  Message,
  Sighting,
  PersonalNote,
  AnonymousTip,
} from '../types'

// ── Checkin ──────────────────────────────────────────────────────────────────
// TODO: Update field keys after inspecting real form structure
export function transformCheckin(submission: JotFormSubmission): Checkin {
  const answers = submission.answers
  return {
    id: submission.id,
    submittedAt: submission.created_at,
    person: getAnswerByName(answers, 'person') || getAnswer(answers, '1'),
    location: getAnswerByName(answers, 'location') || getAnswer(answers, '2'),
    notes: getAnswerByName(answers, 'notes') || getAnswer(answers, '3') || undefined,
    raw: submission,
  }
}

// ── Message ───────────────────────────────────────────────────────────────────
export function transformMessage(submission: JotFormSubmission): Message {
  const answers = submission.answers
  return {
    id: submission.id,
    submittedAt: submission.created_at,
    from: getAnswerByName(answers, 'from') || getAnswer(answers, '1'),
    to: getAnswerByName(answers, 'to') || getAnswer(answers, '2'),
    content: getAnswerByName(answers, 'message') || getAnswerByName(answers, 'content') || getAnswer(answers, '3'),
    timestamp: getAnswerByName(answers, 'timestamp') || getAnswerByName(answers, 'date') || undefined,
    raw: submission,
  }
}

// ── Sighting ──────────────────────────────────────────────────────────────────
export function transformSighting(submission: JotFormSubmission): Sighting {
  const answers = submission.answers
  return {
    id: submission.id,
    submittedAt: submission.created_at,
    reporter: getAnswerByName(answers, 'reporter') || getAnswerByName(answers, 'name') || getAnswer(answers, '1'),
    seenWith: getAnswerByName(answers, 'seen_with') || getAnswerByName(answers, 'person') || getAnswer(answers, '2'),
    location: getAnswerByName(answers, 'location') || getAnswer(answers, '3'),
    description: getAnswerByName(answers, 'description') || getAnswerByName(answers, 'details') || undefined,
    timestamp: getAnswerByName(answers, 'timestamp') || getAnswerByName(answers, 'date') || undefined,
    raw: submission,
  }
}

// ── PersonalNote ──────────────────────────────────────────────────────────────
export function transformPersonalNote(submission: JotFormSubmission): PersonalNote {
  const answers = submission.answers
  return {
    id: submission.id,
    submittedAt: submission.created_at,
    author: getAnswerByName(answers, 'author') || getAnswerByName(answers, 'name') || getAnswer(answers, '1'),
    subject: getAnswerByName(answers, 'subject') || getAnswerByName(answers, 'about') || getAnswer(answers, '2'),
    content: getAnswerByName(answers, 'note') || getAnswerByName(answers, 'content') || getAnswer(answers, '3'),
    raw: submission,
  }
}

// ── AnonymousTip ──────────────────────────────────────────────────────────────
export function transformAnonymousTip(submission: JotFormSubmission): AnonymousTip {
  const answers = submission.answers
  const reliabilityRaw =
    getAnswerByName(answers, 'reliability') ||
    getAnswerByName(answers, 'confidence') ||
    getAnswer(answers, '2')

  return {
    id: submission.id,
    submittedAt: submission.created_at,
    content: getAnswerByName(answers, 'tip') || getAnswerByName(answers, 'content') || getAnswer(answers, '1'),
    reliability: normalizeReliability(reliabilityRaw),
    location: getAnswerByName(answers, 'location') || undefined,
    raw: submission,
  }
}

function normalizeReliability(raw: string): AnonymousTip['reliability'] {
  const lower = raw.toLowerCase()
  if (lower.includes('high') || lower === '3' || lower === 'güvenilir') return 'high'
  if (lower.includes('med') || lower === '2' || lower === 'orta') return 'medium'
  return 'low'
}
