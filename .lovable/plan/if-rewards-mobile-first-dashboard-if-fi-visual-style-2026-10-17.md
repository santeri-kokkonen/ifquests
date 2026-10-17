# If Rewards — mobile-first dashboard (if.fi visual style)

## Visual style (matched to if.fi)
- Warm off-white page (#FAF9F7) with soft beige sections/cards (#F1ECE8) instead of stark white; white header bar.
- Dark warm-brown text (#331E11) rather than black; muted brown for secondary text.
- If Blue #0054F0 for the progress ring, active nav item and solid buttons (white bold text, small arrow icon, rounded-lg).
- Pale blue (#D9E3F5) for the round "badge"-style accents and the success banner.
- Headings large and light-weight, body text regular with generous line height. Font: a clean humanist sans close to If's own (e.g. Inter or Figtree via Google Fonts).
- Round blue "if..." style logo mark in the header, thin-stroke Lucide icons, no heavy shadows.

## What you'll see
- Header: blue round logo + "If Rewards", and "IfCredits: 450" with a minimalist coin icon.
- Large circular progress ring (Recharts) in If Blue on a beige track, animating on load to 10,500 steps vs. a 10,000 target (ring full, center shows "10,500 / 10,000 steps", 105%).
- Pale blue banner: "Daily Goal Crushed! +50 IfCredits earned."
- Fixed bottom navigation with thin-stroke icons: Home (active), Quests, Insurance.
- Centered at phone width on larger screens.

## Technical details
- Install `recharts`; RadialBarChart with background track; count-up of the center number.
- Add brand tokens (blue, pale blue, beige, warm brown) as oklch in src/styles.css; load font via `<link>` in __root.
- Rewrite src/routes/index.tsx with its own head() metadata; update root title/description.
- Quests/Insurance tabs switch local state with a simple placeholder panel.
