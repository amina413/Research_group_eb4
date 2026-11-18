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

## Participation streak

The streak is **not** a normal "miss one day and it resets" streak. It reflects
participation **at least 80% of the time**.

| ID | Rule | Enforced in | Status |
|---|---|---|---|
| R-S1 | Participation rate = completed streak-counting tasks ÷ expected streak-counting tasks over a rolling window. | BE (`get_participation_summary`) | Agreed (80% threshold) |
| R-S2 | Rolling window length: **14 days** (or since approval, if shorter). | BE | Proposed |
| R-S3 | Rate ≥ 80% → `streak_status = active`. | BE | Agreed |
| R-S4 | Rate drops below 80% → `grace`: the streak is **greyed out** (not lost) and notifications are sent. | BE (nightly `evaluate_streaks`) + FE (grey style) | Agreed |
| R-S5 | Grace period length: **3 days**. Back to ≥ 80% within grace → `active` again. | BE | Proposed |
| R-S6 | Still below 80% when grace ends → `broken`. Points and level are kept; only rewards with `requires_active_streak = true` are paused until the streak is `active` again. | BE | Proposed |
| R-S7 | Notifications: one on entering grace, one reminder on the last grace day, one on `broken`. | BE (`notifications` + `send-email`) | Proposed |
| R-S8 | Onboarding does not count towards the streak (`counts_towards_streak = false`). | BE | Proposed |

## Points, levels and rewards

| ID | Rule | Enforced in | Status |
|---|---|---|---|
| R-P1 | Completing a task awards that task's `points` once per period (unique `task_id + enrolment_id + due_date`). | BE | Proposed |
| R-P2 | Level = `floor(total_points / 100) + 1`. | BE (returned by `get_participation_summary`) | Proposed |
| R-P3 | Rewards unlock at `level_required`; milestone rewards are things like vouchers, and the top reward is keeping the device. | BE (`evaluate_streaks`) | Agreed (reward types) |
| R-P4 | Unlocking ≠ issuing: a researcher/admin marks a reward as `issued` when it is actually handed over. | BE | Proposed |
| R-P5 | Frontend never calculates points, levels or streak status itself — it displays what the backend returns. | FE | Proposed |

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
| R-G1 | Hard-coding some values (e.g. window length, grace days, level size) is acceptable given the time available — but keep them in one constants file per side so they are easy to change. |
| R-G2 | Prefer existing infrastructure and libraries (Supabase, shadcn/ui, etc.) over building from scratch. |
