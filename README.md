# Missing Podo: The Ankara Case

**Jotform Frontend Challenge 2026 — Ahmet Taha Kahya**

An investigation dashboard for tracing Podo's last sightings across five data sources: check-ins, messages, sightings, personal notes, and anonymous tips.

## Core Features

- Multi-source evidence feed (check-ins, messages, sightings, notes, tips)
- Cross-record person linking with suspicion scoring
- Investigation views: evidence feed, map, and timeline
- Interactive summary strip that jumps to relevant context
- High alerts quick filter (urgent messages + high-confidence tips)
- Person detail panel with related evidence navigation
- Evidence card modal preview for quick inspection
- Loading, empty, and error states for all data-dependent sections

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in your values:

```
VITE_JOTFORM_API_KEY=your_api_key_here
VITE_FORM_ID_CHECKINS=your_form_id
VITE_FORM_ID_MESSAGES=your_form_id
VITE_FORM_ID_SIGHTINGS=your_form_id
VITE_FORM_ID_PERSONAL_NOTES=your_form_id
VITE_FORM_ID_ANONYMOUS_TIPS=your_form_id
```

- **API key:** [jotform.com/myaccount/api](https://www.jotform.com/myaccount/api)
- **Form IDs:** the number in the JotForm URL — `jotform.com/form/`**`250123456789`**

> `.env.local` is gitignored via `*.local` — your keys will never be committed.

### 3. Run

```bash
npm run dev
```

App runs at `http://localhost:5173`.

On first load, a debug view shows fetch status and raw field names per source. Use these to verify the field mappings in `src/data/transformers.ts`.

## Build & Preview

```bash
npm run build
npm run preview
```

`build` validates TypeScript and creates a production bundle.  
`preview` serves the production output locally.

## Troubleshooting

- If no data appears, verify `VITE_JOTFORM_API_KEY` and all form IDs in `.env.local`.
- If records fetch but fields are empty/misaligned, inspect debug output and update mappings in `src/data/transformers.ts`.
- If a source fails while others work, check that form ID specifically in JotForm.

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- React Query v5
- React Router v7
- lucide-react

## Docs

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — data flow, folder structure, key decisions
- [`docs/NOTES.md`](docs/NOTES.md) — trade-offs log

## Notes

- No automated test suite is configured in this challenge submission.
- `.env.local` is local-only and not committed.
