# CLAUDE.md (frontend)

You are working on the **frontend only**. Owner: Mina.
Also follow `../CLAUDE.md` and the docs in `../docs/`.

## Stack
Vite + React + TypeScript, Tailwind + shadcn/ui, React Router, TanStack Query,
React Hook Form + Zod, qrcode.react, Recharts, Papa Parse, canvas-confetti,
Framer Motion.

## Boundaries
- Do **not** create, edit or delete anything outside `frontend/` (and never touch
  `../backend/`). Do not write SQL, migrations, RLS policies or Edge Functions.
- Import all data types from the contract: `import type { StudyRow } from '@contract/database.types'`.
  Never redefine a table type locally.
- Use `TABLES`, `RPC`, `EDGE_FUNCTIONS` and `ROUTES` constants from `@contract`
  instead of string literals.
- Dev-only routes under /dev, registered only when import.meta.env.DEV is true,
  are exempt from the contract and must never be linked from app pages.
- The `'*'` catch-all (not-found) route is allowed outside `ROUTES`.
- Never calculate streak status, participation rate, points or levels in the UI.
  Display what `get_participation_summary` returns (rule R-P5).

## Data access pattern
Components → hooks (TanStack Query) → `src/services/index.ts` → either
`services/mock/*` or `services/supabase/*`, chosen by `VITE_USE_MOCKS`.

- Components and hooks **never** import `supabase` directly — only through services.
- Every service has the same function signatures in `mock/` and `supabase/`.
- Mock data lives in `src/mocks/` and must use real contract field names and enum values.
- Until the backend says a feature is ready, implement only the mock version and
  leave the supabase version as a typed stub that throws `NotImplemented`.

## Folder guide
- `src/app/` — providers (QueryClient, Router, Auth), app shell
- `src/routes/` — route tree (guards live in `src/features/auth/guards.tsx`), paths from `@contract/routes`
- `src/pages/{public,participant,researcher,admin}/` — one file per route
- `src/pages/account/` — pages for any signed-in user, e.g. `/settings`
- `src/features/<domain>/` — components, hooks and Zod schemas for one domain
- `src/components/ui/` — shadcn/ui generated components (don't hand-edit heavily)
- `src/components/{layout,shared}/` — app-wide components
- `src/components/dev/` — dev-only tools, loaded only when `import.meta.env.DEV`
- `src/services/` — data access (mock + supabase)
- `src/lib/` — supabase client, utils, constants
- `src/hooks/` — generic hooks not tied to a domain

## Quality bar
Mobile-first responsive, accessible (labels, focus states, contrast), no `any`,
no TS or console errors. Streak in `grace` is shown greyed out (rule R-S4).
