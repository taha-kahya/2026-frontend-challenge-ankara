// Levenshtein edit distance between two strings
function levenshtein(a: string, b: string): number {
  if (a === b) return 0
  if (a.length === 0) return b.length
  if (b.length === 0) return a.length

  const matrix: number[][] = []
  for (let i = 0; i <= b.length; i++) matrix[i] = [i]
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b[i - 1] === a[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = 1 + Math.min(
          matrix[i - 1][j],     // delete
          matrix[i][j - 1],     // insert
          matrix[i - 1][j - 1], // replace
        )
      }
    }
  }

  return matrix[b.length][a.length]
}

// Normalize: trim, lowercase, remove Turkish diacritics for comparison
export function normalizeName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
}

// Threshold: allow 1 edit per 4 chars, max 2
function threshold(name: string): number {
  return Math.min(2, Math.floor(name.length / 4))
}

export function isFuzzyMatch(a: string, b: string): boolean {
  const na = normalizeName(a)
  const nb = normalizeName(b)
  if (na === nb) return true
  // Skip fuzzy check for very short names — too many false positives
  if (na.length <= 2 || nb.length <= 2) return false
  return levenshtein(na, nb) <= threshold(na)
}

// Group a flat list of names into clusters of similar names.
// Returns a map of canonical name → all variant spellings in that cluster.
export function clusterNames(names: string[]): Map<string, string[]> {
  const clusters = new Map<string, string[]>() // canonical → variants

  for (const name of names) {
    if (!name.trim()) continue

    let matched = false
    for (const canonical of clusters.keys()) {
      if (isFuzzyMatch(name, canonical)) {
        clusters.get(canonical)!.push(name)
        matched = true
        break
      }
    }

    if (!matched) {
      clusters.set(name, [name])
    }
  }

  return clusters
}
