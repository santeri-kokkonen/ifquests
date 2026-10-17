# Remove "Another insurer" from the home coverage check

In the moving sidequest's "Check your home coverage" task, question 1 ("Do you have a home insurance policy?") will offer only **With If** and **No policy**.

## Changes
- `src/components/QuestBoard.tsx`: delete the `["other", "Another insurer"]` option.
- `src/lib/move-rules.ts`: leave the guidance logic as is (it only branches on "none"); the "keep your existing provider" wording still makes sense for If customers.
- `src/test/move-rules.test.ts`: the existing test calls `coverageResult("other", ...)` directly and keeps passing; no change needed. Run the tests to confirm.
