# If Rewards — mobile-first dashboard

## What you'll see
- Pure white, Nordic minimalist screen, Inter font, generous spacing, soft rounded-xl corners, no heavy shadows.
- Header: "If Rewards" wordmark on the left, "IfCredits: 450" with a minimalist coin icon on the right.
- Large circular progress ring (Recharts) in If Blue #0054F0, animating on load from 0 to 10,500 steps against a 10,000 target (ring caps at full, center shows "10,500 / 10,000 steps", 105%).
- Light blue banner below: "Daily Goal Crushed! +50 IfCredits earned."
- Fixed bottom navigation with thin-stroke Lucide icons: Home (active), Quests, Insurance.
- Layout centered at phone width on larger screens.

## Technical details
- Install `recharts`; RadialBarChart with background track, animated count-up of center number.
- Add `--brand` token (#0054F0 as oklch) and light-blue tint tokens in src/styles.css; set Inter via `<link>` in __root and `--font-sans`.
- Rewrite src/routes/index.tsx with its own head() metadata; update root title/description.
- Quests/Insurance tabs switch local state with a simple placeholder panel (no new pages).
