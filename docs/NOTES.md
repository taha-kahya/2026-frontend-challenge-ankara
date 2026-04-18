# Trade-offs & Decisions Log

## 2026-04-18

### Field mapping strategy
JotForm stores form answers keyed by question number (e.g. `"1"`, `"2"`). These
numbers are specific to each form and not known until we see real form IDs.
Decision: use `getAnswerByName()` which matches by the field's `name` attribute
instead of its numeric key. This is slightly slower but survives form edits that
renumber fields. The `debugAnswerKeys()` helper dumps all field names + values from
a real submission so transformers can be updated in minutes.

### Suspicion score weighting
Sightings (person was literally seen with Podo) weighted 3×, high-reliability tips
4×. These weights are opinionated — plan to tune after seeing real data distribution.

### Person matching is exact (normalized)
Matching is `trim().toLowerCase()` equality, not fuzzy. JotForm free-text fields
will have inconsistent casing and spacing. Fuzzy matching (Levenshtein / phonetic)
is a bonus feature — flagged in CLAUDE.md but not implemented in the first pass.
If names collide or split badly, this is the first thing to revisit.

### API key stored in .env.local
API key and form IDs are read via Vite's `import.meta.env` from `.env.local`.
This file matches the `*.local` glob in `.gitignore` so it is never committed.
`.env.example` is committed as a safe template. `constants.ts` contains no
hardcoded secrets.

### No mock data
Chose not to mock data. The debug view + `debugAnswerKeys()` is the diagnostic path.
Avoids the risk of building UI against mock shapes that don't match real API.

## TODO (once form IDs + API key are available)
- [ ] Open debug view, check field map output per source
- [ ] Update field mappings in `src/data/transformers.ts`
- [ ] Confirm `usePeople()` produces sensible person records
- [ ] Start building UI
