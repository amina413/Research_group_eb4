# Backend

Owner: Rusho. Supabase (Postgres + Auth + RLS + Edge Functions).

## First-time set-up

From inside `backend/`:

```bash
npx supabase init          # creates supabase/config.toml (keeps existing folders)
npx supabase start         # local stack (needs Docker)
cp .env.example .env
```

## Layout

```
backend/supabase/
├── migrations/            # One SQL file per change: supabase migration new <name>
├── functions/
│   ├── delete-account/    # Edge Function (GDPR account deletion)
│   └── send-email/        # Edge Function (Resend)
├── tests/                 # RLS + function tests (pgTAP: supabase test db)
└── seed.sql               # Local test data — use the same IDs as frontend/src/mocks
```

## Suggested migration order

1. `enums` — all types from contract section 1
2. `profiles` + trigger to create a profile on sign-up
3. `studies`, `recruitment_sources`
4. `tasks`, `task_questions`
5. `enrolments`, `task_responses`
6. `rewards`, `reward_claims`, `notifications`
7. RLS policies (R-X1 to R-X5)
8. RPCs from contract section 4
9. `evaluate_streaks` + pg_cron schedule

After each: `supabase db reset` then regenerate types into `../contract/`.
