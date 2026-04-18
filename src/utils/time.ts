// Two timestamp formats in the API:
// Event time:   "18-04-2026 19:05"   (DD-MM-YYYY HH:MM)
// Submitted at: "2026-04-17 14:00:58" (YYYY-MM-DD HH:MM:SS)

export function parseTimestamp(raw: string): Date | null {
  if (!raw) return null

  // DD-MM-YYYY HH:MM
  const ddmmyyyy = raw.match(/^(\d{2})-(\d{2})-(\d{4})\s+(\d{2}):(\d{2})/)
  if (ddmmyyyy) {
    const [, dd, mm, yyyy, hh, min] = ddmmyyyy
    return new Date(`${yyyy}-${mm}-${dd}T${hh}:${min}:00`)
  }

  // YYYY-MM-DD HH:MM:SS
  const iso = raw.match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2})/)
  if (iso) {
    const [, yyyy, mm, dd, hh, min] = iso
    return new Date(`${yyyy}-${mm}-${dd}T${hh}:${min}:00`)
  }

  return null
}

export function formatTime(raw: string): string {
  const d = parseTimestamp(raw)
  if (!d) return raw
  return d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
}

export function formatDate(raw: string): string {
  const d = parseTimestamp(raw)
  if (!d) return raw
  return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })
}

export function formatFull(raw: string): string {
  const d = parseTimestamp(raw)
  if (!d) return raw
  return d.toLocaleString('tr-TR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function sortByTimestamp(a: string, b: string): number {
  const da = parseTimestamp(a)
  const db = parseTimestamp(b)
  if (!da || !db) return 0
  return db.getTime() - da.getTime() // newest first
}
