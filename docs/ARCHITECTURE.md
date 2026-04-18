# Architecture

## Stack
- React 19 + TypeScript + Vite + Tailwind CSS v4
- React Query v5 (server state)
- React Router v7 (routing)
- lucide-react (icons)

## Folder Structure

```
src/
├── types/index.ts        All shared TypeScript interfaces
├── lib/
│   ├── constants.ts      API key + form ID placeholders
│   └── jotform.ts        Base fetcher + field extraction helpers
├── data/
│   ├── transformers.ts   JotForm submission → typed domain record
│   └── index.ts          Exported fetch functions (one per source)
├── hooks/
│   ├── useCheckins.ts
│   ├── useMessages.ts
│   ├── useSightings.ts
│   ├── usePersonalNotes.ts
│   ├── useAnonymousTips.ts
│   └── usePeople.ts      Cross-source aggregation + suspicion score
├── components/           Reusable UI primitives (cards, badges, skeletons)
├── features/             Feature-level stateful components
├── pages/                Route-level thin wrappers
└── utils/                Pure helper functions (filtering, sorting)
```

## Data Flow

```
JotForm API
  └─ fetchSubmissions(formId)        ← lib/jotform.ts
      └─ transform*(submission)      ← data/transformers.ts
          └─ useXxx() hook           ← hooks/
              └─ usePeople()         ← aggregates all sources by name
                  └─ UI components
```

## UI Interaction Flow

- `SummaryStrip` provides investigation shortcuts:
  - last seen with -> opens timeline + selects person
  - most suspicious -> opens evidence feed + selects person
  - busiest location -> opens map
  - high alerts -> opens evidence feed in alerts-only mode
- `InvestigationPage` holds shared UI state:
  - selected person
  - center view (`feed | map | timeline`)
  - alerts-only evidence mode
- `EvidenceFeed` supports:
  - search + source filters
  - alerts-only filtering (urgent messages + high-confidence tips)
  - record modal preview opened by card click
- Right-side `PersonDetail` panel animates on both open and close for smoother transitions.

## Person Matching

Names are normalized (trimmed, lowercased) and matched across:
- Checkins: `person`
- Messages: `from`, `to`
- Sightings: `reporter`, `seenWith`
- Notes: `author`, `subject`
- Tips: fuzzy substring match in `content`

## Suspicion Score

```
sighting ×3 | high-reliability tip ×4 | medium tip ×2 | low tip ×1
checkin  ×1 | message ×1
```

People are sorted by score descending on the people list.

## Key Decisions

| Decision | Reasoning |
|---|---|
| Field mapping via `getAnswerByName` | JotForm field numbers are unstable; name matching is more robust |
| `debugAnswerKeys()` helper | Makes it fast to remap fields when real form IDs arrive |
| `usePeople` aggregates at hook level | Components receive fully-resolved records, no joining in JSX |
| React Query staleTime 5 min | Submissions don't change during a 3-hour session |
| Evidence modal preview | Enables quick record inspection without losing investigation context |
