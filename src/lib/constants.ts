// ─── JotForm API Configuration ────────────────────────────────────────────────
// Replace these placeholders with real values before running.

export const JOTFORM_API_KEY = 'YOUR_JOTFORM_API_KEY'

export const FORM_IDS = {
  checkins: 'FORM_ID_CHECKINS',
  messages: 'FORM_ID_MESSAGES',
  sightings: 'FORM_ID_SIGHTINGS',
  personalNotes: 'FORM_ID_PERSONAL_NOTES',
  anonymousTips: 'FORM_ID_ANONYMOUS_TIPS',
} as const

export type FormKey = keyof typeof FORM_IDS

export const JOTFORM_BASE_URL = 'https://api.jotform.com'

// Maximum submissions to fetch per form (JotForm default limit is 20, max 1000)
export const FETCH_LIMIT = 1000
