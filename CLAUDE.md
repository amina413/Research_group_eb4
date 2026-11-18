# CLAUDE.md (repo root)

This is a monorepo with a **strict frontend/backend split**. Two different people
own the two sides and may be working at the same time.

## Read first
1. `docs/01-overview.md` — what the app is
2. `docs/02-features.md` — features by ID (use these IDs in branches and commits)
3. `docs/03-business-rules.md` — rules the app must enforce
4. `docs/04-data-contract.md` — **every** table, column, enum, function, route name
5. `docs/05-workflow.md` — branches, ownership, contract change process

## Hard rules
- Work only inside the folder for the current task: `frontend/` **or** `backend/`.
  If you were started at the repo root, ask which side before editing anything.
- **Never invent a name.** Tables, columns, enum values, RPCs, Edge Functions,
  buckets and routes must exist in `docs/04-data-contract.md`. If something is
  missing, stop and propose a contract change instead of making one up.
- Do not edit `contract/` or `docs/04-data-contract.md` unless the user has
  explicitly asked for a contract change on a `contract/...` branch. When you do,
  update both together and add a change-log row.
- British spelling for domain names: `enrolment`, not `enrollment`.
- Never put secrets in code or commit `.env` files.
