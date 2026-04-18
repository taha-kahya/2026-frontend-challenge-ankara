import { JOTFORM_API_KEY, JOTFORM_BASE_URL, FETCH_LIMIT } from './constants'
import type { JotFormResponse, JotFormSubmission } from '../types'

export class JotFormError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
  ) {
    super(message)
    this.name = 'JotFormError'
  }
}

export async function fetchSubmissions(formId: string): Promise<JotFormSubmission[]> {
  const url = new URL(`${JOTFORM_BASE_URL}/form/${formId}/submissions`)
  url.searchParams.set('apiKey', JOTFORM_API_KEY)
  url.searchParams.set('limit', String(FETCH_LIMIT))
  url.searchParams.set('orderby', 'created_at')

  const res = await fetch(url.toString())

  if (!res.ok) {
    throw new JotFormError(`HTTP error fetching form ${formId}`, res.status)
  }

  const json: JotFormResponse<JotFormSubmission[]> = await res.json()

  if (json.responseCode !== 200) {
    throw new JotFormError(json.message ?? 'JotForm API error', json.responseCode)
  }

  return json.content ?? []
}

// Extract the string value from a JotForm answer safely
export function getAnswer(
  answers: JotFormSubmission['answers'],
  key: string,
): string {
  const answer = answers[key]
  if (!answer) return ''
  if (typeof answer.answer === 'string') return answer.answer
  if (Array.isArray(answer.answer)) return answer.answer.join(', ')
  if (answer.prettyFormat) return answer.prettyFormat
  return ''
}

// Find an answer by its field name (not key number) — useful when IDs are unknown
export function getAnswerByName(
  answers: JotFormSubmission['answers'],
  fieldName: string,
): string {
  for (const answer of Object.values(answers)) {
    if (answer.name?.toLowerCase() === fieldName.toLowerCase()) {
      if (typeof answer.answer === 'string') return answer.answer
      if (Array.isArray(answer.answer)) return answer.answer.join(', ')
      if (answer.prettyFormat) return answer.prettyFormat
    }
  }
  return ''
}

// Dump all field names from a submission — useful for debugging field mapping
export function debugAnswerKeys(submission: JotFormSubmission): Record<string, string> {
  const result: Record<string, string> = {}
  for (const [key, answer] of Object.entries(submission.answers)) {
    const val = typeof answer.answer === 'string'
      ? answer.answer
      : answer.prettyFormat ?? JSON.stringify(answer.answer)
    result[`${key}:${answer.name ?? answer.text}`] = val ?? ''
  }
  return result
}
