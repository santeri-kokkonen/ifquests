# If Quests — Practical Help First, Insurance Second

If Quests is an insurance-app prototype that keeps customers engaged every day through ActiveCredits, earned by hitting a daily step goal and completing safety habits, and rewards practical prevention during a life change through MoveCredits, earned by verifying rental safety checks in the Moving sidequest. The two currencies stay separate on purpose: everyday wellness progress can never be spent on moving help, and moving progress can never drain an active routine.

## Key features

- **If start menu (`/`)** — the My If dashboard the prototype plugs into, with a direct shortcut into Quests.
- **Main Quest (`/activity`)** — daily step ring, automatic ActiveCredits when the goal is met (50/day cap, 10,000/year), and safety reminders such as smoke-alarm and sensor battery checks.
- **Sidequests (`/quests`)** — the Moving sidequest is live; Buying a car, Having a baby and Buying your own home are shown as coming soon.
- **Moving sidequest (`/quests/moving`)** — 9 room-by-room checks (water shut-off valve, dishwasher leak tray, floor drain, smoke alarm, move-in condition photos, safe lifting, winter grip, coverage check) worth 1,000 MoveCredits.
- **Photo evidence** — upload a photo or use the built-in demo valve photo; evidence is stored as image data and survives a refresh.
- **Crew (`/crew`)** — optional helper links and witness confirmations; every check can also be completed solo.
- **LeakGuard (`/leakguard`)** — guided water-leak reporting with photo verification, sensor status and a downloadable report draft.
- **Rewards (`/rewards`)** — ActiveCredits offers (rental van 6,000, cleaning services 10,000) plus example partner offers; MoveCredits rewards (crew pizza 300, leak sensor 600) live inside the Moving sidequest.
- **Persistence and reset** — progress and evidence persist in versioned, validated browser storage; a Reset demo control returns everything to the walkthrough state.

## Tech stack

- TanStack Start v1 (React 19, file-based routing, SSR)
- TypeScript
- Tailwind CSS v4 with shadcn/ui primitives (Radix UI)
- TanStack Query for data state
- Zod for storage validation, Vitest + Testing Library for tests
- Vite build, ESLint and Prettier

## Run locally

```bash
npm install
npm run dev
```

Open the printed local URL. Other scripts: `npm run build`, `npm run preview`, `npm run test`, `npm run lint`.

## Notes

Partner offers, crew confirmations, sensor alerts and policy checks are simulated — no live customer or partner services are connected. `AGENTS.md` records the architecture rules; `AUDIT.md` records the audit trail.
