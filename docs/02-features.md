# 02 — Features

Features are grouped by epic and role. The **User story** column is for mapping
each feature to the PM's numbered user stories — fill it in from the story map so
every ticket on the board traces back to a story. US4 (wearable integration) is
dropped; see `01-overview.md`.

Priority uses MoSCoW: **M**ust, **S**hould, **C**ould, **W**on't (this time).

## Epic A — Accounts & access

| ID | Feature | Role | Priority | User story | Contract refs |
|---|---|---|---|---|---|
| A1 | Register with email + password | all | M | | `profiles`, `/register` |
| A2 | Sign in / sign out | all | M | | `/login` |
| A3 | Role-based routing (participant / researcher / admin go to their own area) | all | M | | `profiles.role` |
| A4 | Edit profile | all | S | | `profiles`, `/settings` |
| A5 | Delete my account and data | all | M | | `delete-account` |
| A6 | Admin changes a user's role | admin | S | | `profiles.role`, `/admin/users` |

## Epic B — Study set-up (researcher)

| ID | Feature | Role | Priority | User story | Contract refs |
|---|---|---|---|---|---|
| B1 | Create / edit a study (title, description, eligibility, target, dates) | researcher | M | | `studies`, `/researcher/studies/new` |
| B2 | Publish study (draft → recruiting) | researcher | M | | `studies.status` |
| B3 | Generate a QR code + link per recruitment source | researcher | M | | `recruitment_sources`, `/join/:code` |
| B4 | Download / print QR code | researcher | S | | qrcode.react |
| B5 | Build the onboarding questionnaire | researcher | M | | `tasks` (`onboarding`), `task_questions` |
| B6 | Build questionnaires, surveys and daily tasks | researcher | M | | `tasks`, `task_questions` |
| B7 | Define milestone rewards per level | researcher | M | | `rewards` |

## Epic C — Recruitment (participant + researcher)

| ID | Feature | Role | Priority | User story | Contract refs |
|---|---|---|---|---|---|
| C1 | Study landing page from QR/link | public | M | | `get_study_by_source_code` |
| C2 | Show "study full" when target reached | public | M | | `studies.status = full` |
| C3 | Onboarding questionnaire on sign-up | participant | M | | `apply_to_study` |
| C4 | "Waiting for approval" screen | participant | M | | `/participant/pending` |
| C5 | Approve / reject applicants (with reason) | researcher, admin | M | | `approve_enrolment`, `reject_enrolment` |
| C6 | Recruitment dashboard: applied / approved / target, sign-ups by source | researcher | M | | `get_study_stats` |
| C7 | Auto-close recruitment at target | system | M | | `approve_enrolment` |
| C8 | Export participants / responses as CSV | researcher | S | | Papa Parse |

## Epic D — Participation & retention (participant)

| ID | Feature | Role | Priority | User story | Contract refs |
|---|---|---|---|---|---|
| D1 | Dashboard: today's tasks, streak, level, points, next reward | participant | M | | `get_participation_summary`, `/participant` |
| D2 | Complete a task / survey | participant | M | | `task_responses` |
| D3 | 80% participation streak with grace period (see rules R-S*) | participant | M | | `streak_status` |
| D4 | Levels from points | participant | M | | `current_level` |
| D5 | Milestone rewards (vouchers → top reward: keep the device) | participant | M | | `rewards`, `reward_claims` |
| D6 | Celebration on level-up / reward unlock | participant | C | | canvas-confetti |
| D7 | In-app notifications | participant | S | | `notifications` |
| D8 | Email reminders (task due, grace period) | participant | S | | `send-email` |

## Epic E — Administration

| ID | Feature | Role | Priority | User story | Contract refs |
|---|---|---|---|---|---|
| E1 | See all studies and their status | admin | M | | `studies`, `/admin` |
| E2 | See / manage all users | admin | M | | `profiles`, `/admin/users` |
| E3 | Approve participants on any study | admin | S | | `approve_enrolment` |
| E4 | Mark rewards as issued | researcher, admin | S | | `reward_claims.issued_at` |

## Won't (this time)

| Feature | Why |
|---|---|
| Connect smartwatch / tracker via APIs (US4) | Not feasible in time |
| Native iOS / Android apps | Responsive web instead |
