# If Quests

A hackathon prototype for daily activity and practical risk-prevention sidequests.

## Development

Install dependencies with `bun install`, start locally with `bun run dev`, and run regression checks with `bun run test`.

TanStack Start, React, TypeScript and Tailwind CSS power the application. Read `AGENTS.md` before changing its architecture.

## Demo boundaries

- The If start menu is `/`; the Quests shortcut opens daily activity at `/activity`.
- Activity, policies, crew confirmations, sensor alerts and rewards are simulated. No live customer services or partner bookings are connected.
- Progress and uploaded evidence persist in this browser. They are not shared between devices or crew members.
- Offer prices and accelerated demo redemption costs are separately labelled. Real launch requires agreed reward terms and live-service integrations.
- Keep tests, configuration, generated routing and error-reporting infrastructure when cleaning up files.
