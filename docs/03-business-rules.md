# 03 — Business Rules

Rules the app must enforce. Each rule says **where it is enforced**. If a rule is
enforced in the backend, the frontend may *also* check it for a nicer UX, but the
backend is the real guard — never trust the frontend alone.

Rules marked **(Agreed)** came from team decisions. Rules marked **(Proposed)**
fill in details (numbers, edge cases) that still need team sign-off.

## Recruitment

| ID | Rule | Enforced in | Status |
|---|---|---|---|
| R-R1 | Every study gets its own QR code/link; each recruitment source has a unique `code` so sign-ups can be traced to where they came from. | BE (unique constraint) | Agreed |
| R-R2 | Recruitment stops automatically when `approved_count` reaches `target_participants`; study status becomes `full` and the landing page shows "study full". | BE (`approve_enrolment`) | Agreed |
| R-R3 | Participants can only apply while the study is `recruiting`. | BE (`apply_to_study`) | Proposed |
| R-R4 | A participant can only have one enrolment per study. | BE (unique constraint) | Proposed |
| R-R5 | Every new enrolment starts as `pending`; a researcher (for their own study) or an admin must approve before the participant sees the dashboard. | BE + FE routing | Agreed |
| R-R6 | Onboarding questionnaire must be completed as part of applying. | BE (`apply_to_study`) | Agreed |
| R-R7 | Pending applications are not counted toward the target — only approved ones. | BE | Proposed |

## Progress and milestones

Participants earn a reward at every 10% of the study they complete, once they
pass the study's payment threshold (Figma: "Set up a study", participant study
dashboard).

| ID | Rule | Enforced in | Status |
|---|---|---|---|
| R-M1 | `completion_percent` = `completed_count` ÷ `total_count` of progress-counting task occurrences, rounded down to a whole percent (0–100). Only tasks with `counts_towards_progress = true` count; onboarding is always `false`. | BE (`get_participation_summary`) | Proposed |
| R-M2 | `total_count` = occurrences of progress-counting tasks scheduled from the **later of** the participant's approval (`enrolments.reviewed_at`) and `studies.start_date`, up to `studies.end_date` (`once` = 1, `daily` = 1 per day, `weekly` = 1 per week, within the task's `opens_at`/`closes_at`). `completed_count` counts at most one response per task per period (unique `task_id + enrolment_id + due_date`). A participant who completes everything reaches 100% at study end. | BE | Proposed |
| R-M3 | A study needs both `start_date` and `end_date` before it can be published (`draft` → `recruiting`). | BE + FE (form validation) | Proposed |
| R-M4 | Milestones are every 10% (10, 20 … 100). A researcher sets at most one reward per milestone per study (`title`, `reward_type`, `amount_pence`). `amount_pence` is the payment **for that step**, not a running total; the UI shows running totals. | BE (unique `study_id + completion_percent`, check constraint) | Proposed |
| R-M5 | The 100% milestone reward is `reward_type = device` (keep the wearable), optionally with an `amount_pence` final payment. `device` is only allowed at 100%. | BE (check constraint) | Proposed |
| R-M6 | Payment threshold: rewards can only be set at milestones ≥ `studies.payment_threshold_percent`. Below the threshold the participant has earned nothing yet ("£0 earned so far", "Rewards start at 30%"). | BE | Proposed |
| R-M7 | The payment threshold and a study's rewards are locked once the study is published (no longer `draft`). | BE + FE (read-only form) | Proposed |
| R-M8 | When `completion_percent` reaches a milestone that has a reward, its `reward_claims` row becomes `unlocked` (once) and a `reward_unlocked` notification is sent. Unlocked claims never re-lock. | BE (nightly `evaluate_progress`) | Proposed |
| R-M9 | Falling behind: `is_behind_schedule = true` when the participant missed at least one progress-counting task due in the **last 3 days**. A `falling_behind` notification is sent each time the flag turns on (false → true), not every day it stays on. | BE (`evaluate_progress`, `notifications` + `send-email`) | Proposed |

## Rewards

| ID | Rule | Enforced in | Status |
|---|---|---|---|
| R-P3 | Milestone rewards are things like vouchers; the top reward (100%) is keeping the device. | BE | Agreed (reward types) |
| R-P4 | Unlocking ≠ issuing: a researcher/admin marks a reward as `issued` when it is actually handed over. | BE | Proposed |
| R-P5 | Frontend never calculates completion %, earnings, unlocked milestones or behind-schedule status itself — it displays what `get_participation_summary` returns. | FE | Proposed |

## Security & privacy (review with Hussain)

| ID | Rule | Enforced in | Status |
|---|---|---|---|
| R-X1 | Row Level Security is ON for every table. No table is readable without a policy. | BE | Proposed |
| R-X2 | Participants can read/write only their own profile, enrolments, responses, claims and notifications. | BE (RLS) | Proposed |
| R-X3 | Researchers can read only studies they own and the enrolments/responses for those studies. | BE (RLS) | Proposed |
| R-X4 | Admins can read everything. Only admins can change `profiles.role`. | BE (RLS) | Proposed |
| R-X5 | The public landing page only gets data through `get_study_by_source_code` (no direct table access for anon). | BE | Proposed |
| R-X6 | The service role key never appears in the frontend or in git. | Both | Agreed |
| R-X7 | Users can delete their account and data (`delete-account` Edge Function). | BE | Agreed |
| R-X8 | Collect the minimum personal data needed; researcher CSV exports use enrolment IDs, not names/emails, unless explicitly needed. | Both | Proposed |

## Project rules

| ID | Rule |
|---|---|
| R-G1 | Hard-coding some values (e.g. the 3-day falling-behind window, the 10% milestone step) is acceptable given the time available — but keep them in one constants file per side so they are easy to change. |
| R-G2 | Prefer existing infrastructure and libraries (Supabase, shadcn/ui, etc.) over building from scratch. |
