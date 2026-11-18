# CLAUDE.md (backend)

You are working on the **backend only**. Owner: Rusho.
Also follow `../CLAUDE.md` and the docs in `../docs/`.

## Stack
Supabase: Postgres, Auth, Row Level Security, Postgres functions (RPC), pg_cron,
Edge Functions (Deno/TypeScript), Resend for email. Supabase CLI for local dev,
migrations and type generation.

## Boundaries
- Do **not** create, edit or delete anything outside `backend/` (never touch
  `../frontend/`). The only exception is regenerating `../contract/database.types.ts`
  with the Supabase CLI, which must be done in a `contract/...` PR.
- Every table, column, enum, function, bucket name must match
  `../docs/04-data-contract.md` exactly. If a name needs to change, propose a
  contract change — do not rename silently.

## Rules
- All schema changes go through migrations in `supabase/migrations/`
  (`supabase migration new <name>`). Never change the hosted DB by hand.
- RLS enabled on every table, with policies matching `../docs/03-business-rules.md`
  (R-X1 to R-X5). Write a test for each policy in `supabase/tests/`.
- Business rules that affect points, streaks, levels, rewards or recruitment
  limits are enforced here, not in the frontend.
- Hard-coded values (14-day window, 3 grace days, 100 points per level) live in
  one place (a `app_settings` SQL function or constants) so they're easy to change.
- Service role key and Resend key are secrets — use `supabase secrets set`, never commit.

## After schema changes
```bash
supabase db reset                     # apply migrations + seed locally
supabase gen types typescript --local > ../contract/database.types.ts
```
Then check the diff against the contract and open a `contract/...` PR if it changed.
