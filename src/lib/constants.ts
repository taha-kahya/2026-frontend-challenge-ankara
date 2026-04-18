// ─── JotForm API Configuration ────────────────────────────────────────────────
// Values are read from .env.local — never commit real keys.
// Copy .env.example → .env.local and fill in your values.

export const JOTFORM_API_KEY = import.meta.env.VITE_JOTFORM_API_KEY as string

export const FORM_IDS = {
  checkins: import.meta.env.VITE_FORM_ID_CHECKINS as string,
  messages: import.meta.env.VITE_FORM_ID_MESSAGES as string,
  sightings: import.meta.env.VITE_FORM_ID_SIGHTINGS as string,
  personalNotes: import.meta.env.VITE_FORM_ID_PERSONAL_NOTES as string,
  anonymousTips: import.meta.env.VITE_FORM_ID_ANONYMOUS_TIPS as string,
} as const

export type FormKey = keyof typeof FORM_IDS

export const JOTFORM_BASE_URL = 'https://api.jotform.com'

// Maximum submissions to fetch per form (JotForm default limit is 20, max 1000)
export const FETCH_LIMIT = 1000
