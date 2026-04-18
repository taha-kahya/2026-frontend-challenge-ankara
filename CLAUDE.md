# Missing Podo: The Ankara Case

## Overview
A 3-hour frontend challenge hosted by Jotform. The goal is to build a small but impactful **investigation dashboard** that showcases both technical skills and product thinking.

## Mission Brief
After an event in Ankara, **Podo** is seen with different people in different locations — then disappears. Data arrives as records collected from different forms. The app must bring these records together in an interface that makes **the chain of Podo's last sightings** visible and helps the user understand **who looks more suspicious**.

## Required Features
- **Data Fetching** — Load data from provided API endpoints
- **Record Linking** — Relate records that may belong to the same person across different data sources
- **Investigation UI** — Users can browse people and records and follow the flow of events involving Podo
- **Search / Filter** — Basic search and filtering by person, location, or content
- **Detail View** — When a person or record is selected, all related linked information should be displayable
- **State Handling** — Loading, empty, and error states must be handled

## Data Sources
| Source | Description |
|---|---|
| Checkins | Check-in / appearance records for people at different locations |
| Messages | Messages exchanged between people |
| Sighting | Someone being seen with someone else at a specific place |
| Personal Notes | Personal notes / comments |
| Anonymous Tips | Tips with varying reliability |

## Evaluation Criteria
- **Functional success** — Data is fetched correctly and presented meaningfully
- **Developer experience** — Code quality, component structure, state management, naming, error handling, README quality
- **Product / UX thinking** — How information is structured and how clear the investigation experience is

## Bonus Features
- Map view (markers / pins)
- Time-based route flow for Podo (timeline)
- Summary panels such as "last seen with" / "most suspicious"
- Smarter person matching / fuzzy matching
- Responsive design or extra polish
- Map + list synchronization

## Timeline & Submission
- Challenge duration: **3 hours**
- Judging based on commits made before the official end time
- A `README.md` explaining how to run the project is required

## GitHub
Fork the starter repository shared by the Jotform team and build on top of it.

---

> **Tip from Podo:** Ship the core experience first, then move on to strong bonuses like a map or timeline if you want. The point is not only to show data — it is to weave scattered clues into a coherent product experience.

## Tech Stack
- React + TypeScript + Vite + Tailwind CSS v4
- No component libraries — pure Tailwind for all UI

## Code Style
- Functional components only, no class components
- Always use TypeScript — no `any` types, ever
- Prefer named exports over default exports
- Keep components small and single-responsibility
- Co-locate types with the files that use them unless shared

## Project Structure
src/
  components/      # Reusable UI components
  features/        # Feature-specific components and logic
  hooks/           # Custom hooks (useFetch, useSearch, useFilter etc.)
  types/           # Shared TypeScript interfaces and types
  utils/           # Pure helper functions
  data/            # Data fetching and transformation logic

## Component Rules
- Every component gets its own file
- Extract reusable UI pieces immediately (don't wait)
- Props must always be typed with an interface
- Loading, empty, and error states are required for every data-dependent component

## Data Fetching
- All fetch logic goes in custom hooks or the data/ folder, never inline in components
- Always handle loading, error, and empty states explicitly
- Derive and memoize relationships between records rather than nesting fetches
-You are going to receive JotForm form ids and you must fetch the data from these ids first. See https://api.jotform.com/docs/ for api details.
-You must relate and connect the relevant data, and provide easy navigation among related data.
-Put a placeholder for the places where form ids and the api key are needed to fetch the data from JotForm.

## Search & Filtering
- Keep filter state at the feature level, not inside individual components
- Filtering logic goes in utils/ as pure functions so it's testable and reusable

## Styling Rules
- Use Tailwind utility classes only — no inline styles, no CSS modules
- Consistent spacing: use 4, 8, 12, 16, 24, 32px scale
- Make sure the design is responsive for different screen sizes
-Make sure the UI design is not generic and has a product taste and looks pleasing.

## Icons 
- Use lucide-react for all icons

## Commits
- Use conventional commits: feat:, fix:, chore:, docs:, refactor:
- Commit after every meaningful unit of work — don't batch everything at the end
- Keep commit messages descriptive: `feat: add search filtering by status and date`

## Documentation
- Keep a running doc under docs/NOTES.md with trade-offs and decisions made
- Update docs/ARCHITECTURE.md if structure changes significantly
-Create a README.md file that explains how to run and test the app.

## Priorities Under Time Pressure
1. Data fetching and relationships working correctly
2. Core UI readable and usable
3. Search and filtering functional
4. Polish and edge cases last