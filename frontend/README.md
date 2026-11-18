# Frontend

Owner: Mina. Vite + React + TypeScript. Runs entirely on mock data until backend
features are ready.

## First-time set-up (do once)

From inside `frontend/`:

```bash
# 1. Scaffold Vite into this folder (keep the existing src/ folders when asked)
npm create vite@latest . -- --template react-ts
npm install

# 2. Core libraries
npm install react-router-dom @tanstack/react-query @supabase/supabase-js \
  react-hook-form zod @hookform/resolvers qrcode.react recharts papaparse \
  canvas-confetti framer-motion
npm install -D @types/papaparse @types/canvas-confetti

# 3. Tailwind + shadcn/ui — follow the current Vite guide at https://ui.shadcn.com/docs/installation/vite
npx shadcn@latest init

# 4. Env
cp .env.example .env.local
```

## Let the frontend import `/contract`

`vite.config.ts`:
```ts
import path from 'node:path';
// inside defineConfig({...})
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
    '@contract': path.resolve(__dirname, '../contract'),
  },
},
server: { fs: { allow: ['..'] } },
```

`tsconfig.app.json` → `compilerOptions`:
```json
"baseUrl": ".",
"paths": { "@/*": ["./src/*"], "@contract/*": ["../contract/*"] }
```
and add `"../contract"` to `include`.

## Mock vs real data

`VITE_USE_MOCKS=true` → `src/services/mock/*`
`VITE_USE_MOCKS=false` → `src/services/supabase/*`

Switching a feature to the real backend = implement its file in
`services/supabase/`. Pages, hooks and components don't change.

## Suggested build order (sprint 1)

1. App shell, router, role guards (`A3`) with a mock signed-in user you can switch role on
2. Study landing page `/join/:code` (`C1`, `C2`)
3. Register + onboarding questionnaire (`A1`, `C3`, `C4`)
4. Participant dashboard (`D1`, `D3`, `D4`)
5. Researcher: create study + QR codes (`B1`–`B4`)

## Contract gaps

Things the designs or pages need that the contract doesn't cover yet — raise
each as a contract change. Unless the notes say otherwise, they were left out of
the pages. The first four come from the
study landing page (Figma 69-1190, 69-1452), which only gets data through
`get_study_by_source_code`.

| Gap | Priority | Notes |
|---|---|---|
| Data-use consent | **Must-have** | The design has an "I agree to my data being used" checkbox. Consent must be stored, and nothing in the contract holds it. |
| Researcher display name | — | "Run by [researcher name]". The RPC deliberately returns no researcher data. |
| Maximum reward | — | "Earn up to [max reward]". No such field on `studies` or in the RPC. |
| Recruitment closed date | — | "Recruitment closed on [date]". The RPC returns no date. |
| Password reset (route + flow) | — | The log-in design (69-1309) has "Forgot password?", but the contract has no reset route or flow. Left out of `/login`. |
| `?code=` on `/login` | — | Keeps source tracking for existing users. Already used by the frontend; needs adding to contract §7, which only lists `?code=` on `/register`. |
