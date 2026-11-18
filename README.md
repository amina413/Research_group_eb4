# Participant Recruitment & Retention App

Web app for affective computing researchers to recruit diverse study participants
(trackable QR codes/links) and keep them engaged over long studies (80% participation
streak, levels, milestone rewards).

## Repo layout

```
recruitment-app/
├── CLAUDE.md              # Rules for Claude Code (whole repo)
├── README.md
├── .github/CODEOWNERS     # Who must approve changes to which folder
├── docs/                  # What the app is and how we build it
│   ├── 01-overview.md         # Purpose, roles, journey, stack, glossary
│   ├── 02-features.md         # Features by epic, ID, priority
│   ├── 03-business-rules.md   # Rules + where each is enforced
│   ├── 04-data-contract.md    # ★ Exact table/column/enum/RPC/route names
│   └── 05-workflow.md         # Agile process, branches, contract changes
├── contract/              # ★ Shared TS types + name constants (FE & BE agree)
│   ├── database.types.ts
│   └── routes.ts
├── frontend/              # Owner: Mina — Vite + React + TS
│   ├── CLAUDE.md
│   └── src/ ...
└── backend/               # Owner: Rusho — Supabase
    ├── CLAUDE.md
    └── supabase/ ...
```

## Getting started

- **Frontend**: see `frontend/README.md` (runs fully on mock data — no backend needed).
- **Backend**: see `backend/README.md`.
- **Before any feature**: check its names are `Agreed` in `docs/04-data-contract.md`.

## Current phase

Sprint focus is **frontend with mocks**. The data contract is `Proposed` and
needs backend sign-off before backend work begins.
