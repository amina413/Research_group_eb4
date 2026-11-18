# 06 — Design (Figma)

> **Note:** the Figma board is **greyscale wireframes**. The colours in the app
> are **placeholders** until the designer delivers the final palette and visual
> design. Use the colour tokens in `frontend/src/index.css`, never the hex values below.

Source board: [Computing Group Project design board (Copy)](https://www.figma.com/design/mWsqFDfyAPnlwj1GMBjtd2/Computing-Group-Project-design-board--Copy-?node-id=0-1), page **Page 1** (`0:1`).

Read from Figma via the Figma MCP on 2026-11-18.

## How the board is built (read this first)

- **There are no Figma frames, groups, components, styles or variables in the file.**
  Page 1 holds 2,807 loose layers (text, rectangles, lines, ellipses, vectors).
  Each "screen" is a 516 px-wide rectangle with a 26 px nav bar on top and a
  24 px label above it. The **frame link** below points at that background
  rectangle, which is the closest thing to a frame.
- The page has three iterations side by side: *Log task 1* (16 Oct),
  *Log task 2* (30 Oct) and *Log task 3*. **Only Log task 3 is mapped here**,
  because it is the latest and supersedes the other two.
- Within Log task 3, the screens are colour-grouped: pink = authentication,
  green = new study (join flow), cyan = view active study (participant),
  orange = researcher views.
- Some screens are stacked duplicates (two copies at the same x/y). The link
  uses the copy on top.

---

## 1. Screen map

Link base: `https://www.figma.com/design/mWsqFDfyAPnlwj1GMBjtd2/Computing-Group-Project-design-board--Copy-?node-id=`

### Authentication + public

| Figma frame name | Frame link | Route (04 §7) | Feature IDs (02) |
|---|---|---|---|
| Landing page | [69-1146](https://www.figma.com/design/mWsqFDfyAPnlwj1GMBjtd2/Computing-Group-Project-design-board--Copy-?node-id=69-1146) | `/` | — (home / about) |
| Sign up page | [69-1429](https://www.figma.com/design/mWsqFDfyAPnlwj1GMBjtd2/Computing-Group-Project-design-board--Copy-?node-id=69-1429) | `/register` | A1 |
| Log in page | [69-1309](https://www.figma.com/design/mWsqFDfyAPnlwj1GMBjtd2/Computing-Group-Project-design-board--Copy-?node-id=69-1309) | `/login` | A2, A3 |
| Blocked: wrong role | [69-1271](https://www.figma.com/design/mWsqFDfyAPnlwj1GMBjtd2/Computing-Group-Project-design-board--Copy-?node-id=69-1271) | — (see Gaps) | A3 |

### Participant: home and join flow

| Figma frame name | Frame link | Route (04 §7) | Feature IDs (02) |
|---|---|---|---|
| Participant home: empty state | [69-1280](https://www.figma.com/design/mWsqFDfyAPnlwj1GMBjtd2/Computing-Group-Project-design-board--Copy-?node-id=69-1280) | `/participant` | D1, C1 |
| Participant home: empty state - errror | [69-1490](https://www.figma.com/design/mWsqFDfyAPnlwj1GMBjtd2/Computing-Group-Project-design-board--Copy-?node-id=69-1490) | `/participant` | D1, C1 |
| Participant home: populated | [69-1156](https://www.figma.com/design/mWsqFDfyAPnlwj1GMBjtd2/Computing-Group-Project-design-board--Copy-?node-id=69-1156) | `/participant` | D1 |
| Study landing page | [69-1190](https://www.figma.com/design/mWsqFDfyAPnlwj1GMBjtd2/Computing-Group-Project-design-board--Copy-?node-id=69-1190) | `/join/:code` | C1 |
| Study landing page: closed | [69-1452](https://www.figma.com/design/mWsqFDfyAPnlwj1GMBjtd2/Computing-Group-Project-design-board--Copy-?node-id=69-1452) | `/join/:code` | C2 |
| Eligibility questionnaire page | [69-1229](https://www.figma.com/design/mWsqFDfyAPnlwj1GMBjtd2/Computing-Group-Project-design-board--Copy-?node-id=69-1229) | `/onboarding/:studyId` | C3 |
| Eligibility results: pending | [69-1524](https://www.figma.com/design/mWsqFDfyAPnlwj1GMBjtd2/Computing-Group-Project-design-board--Copy-?node-id=69-1524) | `/participant/pending` | C4 |
| Eligibility results: eligible | [69-1463](https://www.figma.com/design/mWsqFDfyAPnlwj1GMBjtd2/Computing-Group-Project-design-board--Copy-?node-id=69-1463) | — (see Gaps) | C3, C5 |
| Eligibility results: group full | [69-1556](https://www.figma.com/design/mWsqFDfyAPnlwj1GMBjtd2/Computing-Group-Project-design-board--Copy-?node-id=69-1556) | — (see Gaps) | C2, C7 |

### Participant: active study

| Figma frame name | Frame link | Route (04 §7) | Feature IDs (02) |
|---|---|---|---|
| Participant study dashboard | [69-1814](https://www.figma.com/design/mWsqFDfyAPnlwj1GMBjtd2/Computing-Group-Project-design-board--Copy-?node-id=69-1814) | `/participant` (closest; see Gaps) | D1, D5 |
| Dashboard: below payment threshold | [69-1300](https://www.figma.com/design/mWsqFDfyAPnlwj1GMBjtd2/Computing-Group-Project-design-board--Copy-?node-id=69-1300) | `/participant` (closest; see Gaps) | D1, D5 |
| Daily check-in screen | [69-1246](https://www.figma.com/design/mWsqFDfyAPnlwj1GMBjtd2/Computing-Group-Project-design-board--Copy-?node-id=69-1246) | `/participant/tasks/:taskId` | D2 |
| Check in successful | [69-1323](https://www.figma.com/design/mWsqFDfyAPnlwj1GMBjtd2/Computing-Group-Project-design-board--Copy-?node-id=69-1323) | `/participant/tasks/:taskId` (success state) | D2 |
| Check in: already submitted | [69-1581](https://www.figma.com/design/mWsqFDfyAPnlwj1GMBjtd2/Computing-Group-Project-design-board--Copy-?node-id=69-1581) | `/participant/tasks/:taskId` (state) | D2 |
| Check in: value error | [69-1992](https://www.figma.com/design/mWsqFDfyAPnlwj1GMBjtd2/Computing-Group-Project-design-board--Copy-?node-id=69-1992) | `/participant/tasks/:taskId` (state) | D2 |

### Researcher

| Figma frame name | Frame link | Route (04 §7) | Feature IDs (02) |
|---|---|---|---|
| Researcher home | [69-1206](https://www.figma.com/design/mWsqFDfyAPnlwj1GMBjtd2/Computing-Group-Project-design-board--Copy-?node-id=69-1206) | `/researcher` | B1, B3 |
| Active studies screen (list placeholder) | [69-1375](https://www.figma.com/design/mWsqFDfyAPnlwj1GMBjtd2/Computing-Group-Project-design-board--Copy-?node-id=69-1375) | `/researcher` | B1 |
| Active studies screen (empty state) | [69-1396](https://www.figma.com/design/mWsqFDfyAPnlwj1GMBjtd2/Computing-Group-Project-design-board--Copy-?node-id=69-1396) | `/researcher` | B1 |
| Set up a study | [69-2234](https://www.figma.com/design/mWsqFDfyAPnlwj1GMBjtd2/Computing-Group-Project-design-board--Copy-?node-id=69-2234) | `/researcher/studies/new` | B1, B7 |
| Researcher set up a study: errors | [69-1352](https://www.figma.com/design/mWsqFDfyAPnlwj1GMBjtd2/Computing-Group-Project-design-board--Copy-?node-id=69-1352) | `/researcher/studies/new` | B1 |
| Publish: confirmation | [69-1666](https://www.figma.com/design/mWsqFDfyAPnlwj1GMBjtd2/Computing-Group-Project-design-board--Copy-?node-id=69-1666) | `/researcher/studies/new` (confirm step) | B2 |
| Publish: success and share page | [69-1707](https://www.figma.com/design/mWsqFDfyAPnlwj1GMBjtd2/Computing-Group-Project-design-board--Copy-?node-id=69-1707) | `/researcher/studies/:studyId` (closest; see Gaps) | B2, B3, B4 |
| Study dashboard | [69-1366](https://www.figma.com/design/mWsqFDfyAPnlwj1GMBjtd2/Computing-Group-Project-design-board--Copy-?node-id=69-1366) | `/researcher/studies/:studyId` | C6, B3 |

### Gaps

**Frames with no matching route**

| Frame | Note |
|---|---|
| Blocked: wrong role (`69-1271`) | No route; this is a guard state shown when a participant opens a `/researcher/*` page. It could render inside any protected route. |
| Eligibility results: eligible (`69-1463`) | No route. It's the result state after `apply_to_study`, most likely shown on `/onboarding/:studyId`. |
| Eligibility results: group full (`69-1556`) | No route. Same as above, shown when the study is `full` at the moment of applying. |
| Participant study dashboard (`69-1814`), Dashboard: below payment threshold (`69-1300`) | These are per-study dashboards, but §7 has only one `/participant` dashboard, which "Participant home" also uses. There's no `/participant/studies/:studyId`-style route. |
| Publish: confirmation (`69-1666`) | A confirmation step with no route of its own. A dialog on `/researcher/studies/new` would fit. |
| Publish: success and share page (`69-1707`) | No dedicated route. The study link, join code and QR live in §7 under `/researcher/studies/:studyId` ("overview + stats + QR codes"), but this design shows them as a separate post-publish page. |

**Routes with no frame**

| Route | Note |
|---|---|
| `/participant/rewards` | No rewards page. Reward progress appears only inside the participant study dashboard (reward steps + next milestone). |
| `/researcher/studies/:studyId/tasks` | No task / survey builder (B5, B6). |
| `/researcher/studies/:studyId/participants` | No approve / reject screen and no CSV export (C5, C8). The study dashboard has a participant table but no actions. |
| `/researcher/studies/:studyId/rewards` | No separate page. Reward rules sit inside "Set up a study" (max reward, payment threshold, earnings table). |
| `/admin` | No admin screens (E1, E3). |
| `/admin/users` | No admin screens (E2, A6). |
| `/settings` | Every nav bar has an "Account" button, but there's no settings / profile / delete-account screen (A4, A5). |

**Features with no screen at all:** A4, A5, A6, B5, B6, C5, C8, D3, D4, D6, D7, D8, E1–E4.

**Design vs contract differences (for the team to resolve, not changed here)**

- The design rewards **% completion with £ steps every 10%** above a payment
  threshold. The contract and features use **points, levels and an 80% streak**
  (D3, D4, `streak_status`, `current_level`). No screen shows a streak, level or points.
- The daily check-in collects device, sleep hours, average heart rate and steps.
  `task_questions` can model this (`single_choice`, `number`, `yes_no`), but there's no fixed check-in shape.
- The eligibility form asks for age band, gender and location, and the study
  dashboard shows **quota progress** by those fields. There are no quota columns in `studies`.
- "Set up a study" has fields that aren't in `studies`: closing date for new
  participants, minimum participants, maximum reward (£) and payment threshold.
  It also has a **Save as draft** button.
- Participant home has a **join-by-code** input (e.g. `ABCDEF-12`). The contract
  only has `/join/:code` (8-char code) and `get_study_by_source_code`.
- The study landing page has a data-consent checkbox. No consent column exists.

---

## 2. Design tokens (from Figma)

The file defines **no** paint styles, text styles, effect styles or variables.
The values below are the raw values used on the layers. The colour names are
proposed here, because Figma has none.

> **Scale note:** the screens are drawn at **516 px wide** with **10 px** body
> text. That looks like a half-scale desktop wireframe. If you build at about
> 1032 px desktop width, double the sizes and spacing below. This is an
> inference, not something the file states.

### Colours: UI

| Proposed name | Hex | Where it's used |
|---|---|---|
| `surface` | `#FFFAFA` | Screen background, outline-button fill, inputs |
| `white` | `#FFFFFF` | Progress-bar track, some screen backgrounds, text on dark |
| `grey-200` | `#E0E0E0` | QR code placeholder |
| `grey-300` | `#D9D9D9` | Panels / stat cards, nav tabs, logo circle, filled inputs (sign-up) |
| `grey-600` | `#757575` | Nav bar, dark info cards, progress fill, secondary text |
| `grey-700` | `#505050` | Secondary text, landing "step" cards |
| `ink` | `#1E1E1E` | Primary button fill, main text |
| `black` | `#000000` | Text, input/button outlines, table row dividers |
| `error` | `#B3261E` | Invalid input text (join code error) |
| `success` | `#35BC33` | "Success" eligibility banner |

### Colours: board only (not UI)

These colour the iteration areas on the board and shouldn't be used in the app:
`#FB9898` (auth, pink), `#4BDE1A` (new study, green), `#14D5EB` (view study, cyan), `#D07124` (researcher, orange), `#CCE8E3`, `#C7C8FF`.

### Typography

| Token | Value |
|---|---|
| Font family | **Inter** (only family in the file) |
| Weights | Bold (≈81% of text runs), Regular |
| Line height | Auto everywhere (no fixed line heights) |

| Size (px) | Weight | Used for |
|---|---|---|
| 9 | Bold | Small helper text |
| 10 | Bold / Regular | Body, labels, buttons, nav, tables (by far the most common) |
| 14 | Bold | Hero heading on landing page |
| 16 | Bold | Large numbers |
| 20 | Bold | Progress ring percentage |
| 24 | Bold | "Success" banner heading |

Sizes 24 / 40 / 48 / 96 also appear as board annotations (screen labels and
section titles). Those aren't UI type.

### Spacing (measured, no tokens defined)

| Measure | Value |
|---|---|
| Screen side inset | 8–10 px (most common left offsets: 8, 9, 10) |
| Nav bar height | 26 px |
| Input height | 24 px |
| Button height | 18–21 px |
| Small square marks | 15–16 px (icons, reward step cells 30–32 × 16) |

The vertical rhythm isn't consistent enough to name a scale. A 4 px base
(4 / 8 / 12 / 16 / 24) would cover what's drawn.

### Border radius

| Token | Value | Used on |
|---|---|---|
| `radius-none` | 0 | Nav bar, panels, cards, stat tiles |
| `radius-sm` | 4 | Buttons, inputs, selects, reward step cells |
| `radius-md` | 5 | Progress bars |
| `radius-lg` | 10 | Confirmation dialog, notice pill inside it |

### Borders

1 px black (`#000000`) on inputs, outline buttons and table row dividers.
2 px is used for a few lines.

### Shadows

**None.** No layer has a drop or inner shadow.

### Breakpoints

**None defined.** Every screen is a single desktop-width mock-up (516 px wide).
There are no mobile or tablet variants, although the features doc says
"responsive web instead" of native apps.

---

## 3. Reusable components seen

None of these are Figma components. They're repeated groups of shapes, and the
"Seen on" column gives example screens.

| Component | Description | Seen on |
|---|---|---|
| **Top nav bar** | 26 px `grey-600` bar: round "logo" at left, a "Home" tab, an "Account" button at right. Public variant: "About", "Log in", "Sign up". | Every screen |
| **Primary button** | `ink` fill, white Bold 10 text, radius 4, ~20 px tall (widths 41–109) | Daily check-in, Publish study, Join this study, New study |
| **Secondary (outline) button** | `surface` fill, 1 px black border, radius 4 | Back, Open, Share, Copy, Download QR, Save as draft, Back to home |
| **Text input** | Label (Bold 10) above an outlined box, 24 px tall, radius 4 | Set up a study, Daily check-in |
| **Filled input (older style)** | Borderless `grey-300` box. Inconsistent with the outlined input. | Sign up page |
| **Select / dropdown** | Outlined input with a chevron at right | Eligibility questionnaire, Daily check-in (Device) |
| **Yes / No toggle** | Two side-by-side buttons; selected = `ink` fill | Daily check-in |
| **Checkbox** | Square with a consent label | Study landing page |
| **Field error** | "!" in a 15 px circle + message under the field | Set up a study: errors, Participant home: error |
| **Error summary banner** | "[number] things to fix before submission" panel | Set up a study: errors |
| **Status banner / message card** | `grey-600` card with a title and a supporting line (pending, group full, already checked in, check-in done with tick). Green `success` variant. | Eligibility results, Check-in states |
| **Panel / card** | `grey-300` (light) or `grey-600` (dark) block, radius 0 | Dashboards, landing page |
| **Stat tile** | Card with a label and one big value ("54 / 80", "34", "£2,100") | Study dashboard |
| **Progress bar** | `grey-600` fill on a white track, radius 5 | Check-in sidebar, quota progress, sign-ups by source |
| **Progress ring** | 90 px donut with % and "Complete" in the middle, "£X earned so far" under it | Participant study dashboard |
| **Reward steps (milestone tracker)** | 10 cells, one per 10%: grey = no reward yet, black = earned/current, white = future. "Here" marker, "Next milestone: 60% = £60". | Participant study dashboard |
| **Data table** | Bold header row, rows split by 1 px black lines, right-aligned status/value column | Researcher home, study dashboard, recent activity, earnings table |
| **Filter tabs** | Text tabs (All / Active / Draft / Closed); active one underlined | Researcher home |
| **Copy field** | Outlined field with an inline "Copy" button | Publish: success and share |
| **QR code placeholder** | `grey-200` square, radius 4 | Publish: success and share |
| **Confirmation dialog** | `grey-600` box, radius 10, notice pill, summary list, Go back / Publish buttons | Publish: confirmation |
| **Empty state** | Card with a message ("You haven't created any studies yet.") and actions | Active studies (empty), Participant home: empty |
| **Hero + step cards** | Heading, two role buttons, three "Step N" cards | Landing page |
| **Streak badge** | **Not in the design.** There are no streak, level or points elements (see the differences above). | — |

Designer annotations (numbered 20 px circles and arrows) are notes, not UI.
