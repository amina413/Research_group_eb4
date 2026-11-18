# 05 — Working Agreement (Agile, FE/BE split)

## Who owns what

| Folder | Owner | Others may… |
|---|---|---|
| `/frontend` | Mina | read only |
| `/backend` | Rusho | read only |
| `/contract` + `docs/04-data-contract.md` | **Both** — changes need both approvals | propose changes via PR |
| `/docs` (other files) | Jordy (PM) + whoever the change concerns | propose changes via PR |

`.github/CODEOWNERS` enforces this on GitHub once branch protection is on.

## How FE and BE work in parallel without blocking

1. **Agree the names first** in `docs/04-data-contract.md` (status → `Agreed`).
2. **Frontend** builds against `/contract/database.types.ts` using the **mock
   services** (`VITE_USE_MOCKS=true`). Every page works with fake data before the
   backend exists.
3. **Backend** writes migrations in `/backend/supabase/migrations` that create
   exactly those names, then regenerates types:
   `supabase gen types typescript --local > ../contract/database.types.ts`
4. If the generated file differs from the hand-written one, **that is a contract
   break** — fix the migration or open a contract PR. Never quietly rename.
5. When a backend feature is ready, the frontend flips that service from mock to
   Supabase. Only files in `frontend/src/services/supabase/` change.

## Branches

| Branch | Purpose |
|---|---|
| `main` | Always deployable. Protected. PRs only. |
| `fe/<ticket-id>-short-name` | Frontend work, e.g. `fe/C1-landing-page` |
| `be/<ticket-id>-short-name` | Backend work, e.g. `be/C5-approve-enrolment` |
| `contract/<short-name>` | Changes to `/contract` or the data contract doc |
| `docs/<short-name>` | Documentation only |

Ticket IDs = feature IDs from `02-features.md`.

## Commits

Conventional commits, scoped by side:
`feat(fe): study landing page`, `fix(be): approved_count trigger`,
`chore(contract): add notifications.link`, `docs: streak rules`.

## Contract change process

1. Open a `contract/...` branch.
2. Edit `docs/04-data-contract.md` (+ change log row) **and** `contract/` together.
3. PR needs approval from **both** FE and BE owners.
4. After merge, each side updates its own code in its own PR.

## Sprints

- Sprint length: 1 week (adjust with PM).
- Board: GitHub Projects — columns `Backlog → Ready → In progress → Review → Done`.
- A ticket is **Ready** only when its contract names are `Agreed`.
- **Definition of Done**: matches contract names, works on mobile width, no TS
  errors, no console errors, reviewed by one other person, ticket linked to user story.

## Using Claude Code

- Start Claude Code **inside the side you are working on** (`cd frontend` or
  `cd backend`) so it picks up that side's `CLAUDE.md` rules.
- Before asking it to build a feature, point it at the feature ID in
  `docs/02-features.md` and the relevant rules in `docs/03-business-rules.md`.
- Review every diff before committing. Claude Code must never edit `/contract`
  except on a `contract/...` branch you asked for.
