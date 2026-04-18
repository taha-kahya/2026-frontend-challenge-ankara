# Missing Podo: The Ankara Case

**Jotform Frontend Challenge 2026 — Ahmet Taha Kahya**

An investigation dashboard for tracing Podo's last sightings across five data sources: check-ins, messages, sightings, personal notes, and anonymous tips.

## Getting Started

```bash
npm install
npm run dev
```

App runs at `http://localhost:5173`.

## Configuration

Before fetching real data, fill in the placeholders in `src/lib/constants.ts`:

```ts
export const JOTFORM_API_KEY = 'YOUR_JOTFORM_API_KEY'

export const FORM_IDS = {
  checkins:      'FORM_ID_CHECKINS',
  messages:      'FORM_ID_MESSAGES',
  sightings:     'FORM_ID_SIGHTINGS',
  personalNotes: 'FORM_ID_PERSONAL_NOTES',
  anonymousTips: 'FORM_ID_ANONYMOUS_TIPS',
}
```

Once set, the debug view at `/` will show field maps per source — use these to verify transformer mappings in `src/data/transformers.ts`.

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- React Query v5
- React Router v7
- lucide-react

## Docs

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — data flow, folder structure, key decisions
- [`docs/NOTES.md`](docs/NOTES.md) — trade-offs log
