# Missing Podo: The Ankara Case

**Jotform Frontend Challenge 2026 — Ahmet Taha Kahya**

An investigation dashboard for tracing Podo's last sightings across five data sources: check-ins, messages, sightings, personal notes, and anonymous tips.

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

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- React Query v5
- React Router v7
- lucide-react

## Docs

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — data flow, folder structure, key decisions
- [`docs/NOTES.md`](docs/NOTES.md) — trade-offs log
