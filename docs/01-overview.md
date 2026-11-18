# 01 — Application Overview

## What it is

A web app that helps **affective computing researchers recruit a diverse set of
study participants and keep them engaged for the length of a long-term study.**

Client scenario: Benjamin, a researcher at Monash University, struggles to (1) reach
enough diverse participants and (2) stop them dropping out over weeks of data
collection. The app tackles both: trackable recruitment links/QR codes, and a
gamified participant experience (completion progress and a reward at every 10% milestone).

## Who uses it

| Role | What they do |
|---|---|
| **Participant** | Finds a study via QR/link, signs up, completes onboarding, waits for approval, then completes daily tasks and surveys, unlocking a reward at every 10% of the study completed (once past the payment threshold). |
| **Researcher** | Creates studies, generates QR codes per recruitment source, builds questionnaires/surveys/daily tasks, approves participants, sets the payment threshold and a reward per 10% milestone, watches recruitment and participation stats. |
| **Admin** | Oversees everything: all studies, all users, role changes, issue resolution. |

## The core journey

```
Researcher creates study ──► QR code / link generated per source
                                        │
Participant scans QR ──► Landing page ──► Register ──► Onboarding questionnaire
                                        │
                         Researcher/admin approves (or rejects)
                                        │
                     Participant dashboard: today's tasks, progress %,
                     earnings, next milestone
                                        │
     Recruitment closes automatically when the target number is approved
```

## Team

| Person | Role |
|---|---|
| Jordy | Project Manager |
| Mina | Secondary PM, **Frontend developer** |
| Rusho | **Backend developer** |
| Jack | Designer (assists backend if needed) |
| Hussain | Cyber security consultant |

## Tech stack (Agreed)

**Frontend (`/frontend`)**: Vite + React + TypeScript, Tailwind CSS + shadcn/ui,
React Router, TanStack Query, React Hook Form + Zod, qrcode.react, Recharts,
Papa Parse (CSV export), canvas-confetti, Framer Motion.

**Backend (`/backend`)**: Supabase — Postgres, Auth, Row Level Security,
Postgres functions + pg_cron, Edge Functions (account deletion, email), Resend for
email. Supabase CLI with generated TypeScript types.

**Delivery**: GitHub (+ GitHub Projects for the board), Vercel or Netlify for the
frontend, Figma for designs.

## Out of scope

- **Smartwatch / fitness tracker integration via APIs (was US4)** — dropped; not
  feasible in the time available (e.g. Apple Watch cannot be linked easily).
- Native mobile apps — the web app should be mobile-responsive instead.

## Glossary

| Term | Meaning |
|---|---|
| Study | A research project with a target number of participants |
| Recruitment source | One trackable link/QR code for a study (e.g. "Library poster") |
| Enrolment | A participant's application to / place in a study |
| Task | Anything a participant fills in: onboarding, questionnaire, survey, daily task |
| Completion % | Completed progress-counting tasks ÷ all progress-counting tasks scheduled for the participant (onboarding excluded); reaches 100% at study end |
| Milestone | Every 10% of completion (10, 20 … 100). A study can set one reward per milestone; the 100% reward is keeping the device |
| Payment threshold | Minimum completion % before any reward is earned (e.g. "Rewards start at 30%") |
| Falling behind | The participant missed at least one due task in the last 3 days; they get a warning |
| Contract | `docs/04-data-contract.md` + `/contract` — the agreed names FE and BE share |
