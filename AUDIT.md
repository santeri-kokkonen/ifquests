# Project code audit — 17 October 2026

## Scope
Reviewed all application routes, feature components, shared UI controls, hooks, domain rules, error-handling modules and configuration. Checked local/package import resolution, unused variables, event handlers, nullable contexts, effects and credit state transitions. Intentional mock services remain mock services.

## Confirmed issues fixed
- **Batched credit updates:** repeated calls could award twice, exceed daily limits, charge twice or spend an already-used balance. Eligibility and related state changes now happen together against the latest state. Actions are stable across renders.
- **Same-batch task completion:** completion previously read stale photo/witness state. It now sees preceding queued changes and still enforces prerequisites.
- **Photo allocations:** repeated uploads left old browser object URLs allocated. The shared provider now owns uploads, releases replaced URLs and cleans up on session teardown. Leak evidence survives navigation. Invalid uploads and allocation failures show an error without crashing the page.
- **Report downloads:** the temporary URL was released immediately, risking failed downloads. Downloads now use an attached link, delayed cleanup, and a visible failure message.
- **Copy link failures:** denied or unavailable clipboard access failed silently. A manual-copy message is now shown, and focusing the link selects its contents.
- **Error-page retry:** the navigation refresh promise was not awaited or caught. Retry now handles rejection and keeps the fallback page available.
- **Missing OTP context:** a standalone slot could dereference a missing context. It now renders an empty slot safely.
- **Missing form provider:** form helpers destructured missing context before validation. They now emit an explicit provider-contract error, handled by the existing route boundary rather than an opaque null dereference.
- **Invalid numeric earning data:** NaN, infinite or negative inputs now fail closed rather than contaminating balances.
- **Unused-variable checking:** enabled the previously disabled lint rule. Static checking reports no unused variables or unresolved imports. Preserved the requested Pizza nonbreaking space using an escaped display string to eliminate its lint error.

## Verification
- Full automated suite: 63 tests, including batching, StrictMode duplicate-effect, upload lifecycle, numeric-input, missing-context and browser-storage regressions.
- Static lint with formatting checks disabled: zero errors; nine development-only React hook/hot-reload warnings.
- Preview compilation: automatic build reports checked; successful.
- Live browser walkthrough: start menu, daily activity opt-in (+50 exactly once), navigation to Rewards and rental van purchase, sidequest hub, helper join, moving coverage questionnaire, simulated leak response, report generation/download and image evidence saving. No browser page exceptions recorded. Report download completed successfully.
- Existing route heads checked for app-specific title, description, Open Graph fields and Twitter card.

## Remaining limitations / observations
- **Known price inconsistency preserved:** rental van displays 6,000 but spends 150 ActiveCredits; cleaning displays 10,000 but spends 400. These were explicitly changed as display-only text previously. This audit did not change chosen prices or redemption rules; they should be aligned before a real launch.
- Steps, daily/yearly periods, crew verification, sensors, partners and reward fulfillment remain simulated. Demo progress now survives refreshes in this browser through localStorage; there is no live step feed, calendar rollover, cross-device sync or verified crew authorization.
- Developer-only provider hooks intentionally throw clear errors when misused. Actual content routes are wrapped in their provider and have the existing error/404 fallback. This is not a guarantee against every possible browser/extension mutation or future malformed data.
- Existing page-render tests emit document-shell nesting and empty stylesheet URL warnings in the test environment. They pass, and the live browser walkthrough produced no page exceptions. The test harness warnings were not suppressed.
- Eight hot-reload warnings concern helpers exported alongside UI components; one hook-dependency warning concerns the StrictMode regression test. These are not missing imports or production runtime failures. Pre-existing formatting issues elsewhere were not bulk-rewritten.
- The earlier `removeChild` error did not reproduce in the exercised flow. External browser translation/DOM modification cannot be ruled out; no global DOM workaround was added.
- Production deployment, real integrations and every possible browser/device combination were not exercised.

## Interactive flow audit — 17 October 2026

### Fixed
- Saved credits, opt-in, purchases, crew, task completion, witness confirmations, milestone claims, sensor delivery, leak response and fault-report fields in validated, versioned browser storage. Restores only after hydration, before automatic step awards run. Corrupt data falls back safely; blocked/full storage shows a warning.
- Uploaded evidence converts to durable image data; transient blob URLs are never restored. Photos above 2 MB are rejected with a visible message. Replaced/unmounted object URLs remain cleaned up.
- Start-menu tiles, Menu and Buy new insurance now open dismissible sheets instead of looking clickable without responding. Non-Quests destinations honestly show that no live customer records or purchases are connected; Menu links open the actual Quests pages.
- Duplicate crew joins now show feedback; whitespace-only names cannot submit.
- Fault-report fields and simulated alert remain visible after refresh. Report preparation uses form submission. Download failure feedback appears beside the download action regardless of saved valve evidence; successful initiation also shows feedback.
- Moving tasks explain unmet completion prerequisites. Confirmed witness checkboxes no longer appear toggleable when their action is irreversible. Changing coverage answers clears stale guidance. Sidequests remains highlighted while inside the moving page.

### Live browser verification
- All seven content routes load; all existing route titles and social metadata are populated. Unknown URL shows 404 and Go home returns to the start menu.
- Start-menu tiles and insurance placeholder sheet respond. Menu navigation closes the sheet and opens Home.
- Every moving room sheet and the Menu sheet close using the close button, backdrop click and Escape. After dismissal, the dialog is removed and background scroll locking is released. Navigating from a sheet to Crew also releases it.
- Activity opt-in awards exactly 50 once; repeated refreshes preserve the balance without duplicate awards.
- Rental van and cleaning purchases update balances, disable repeat actions and survive refreshes; insufficient-balance actions stay disabled.
- Clipboard copy succeeds; simulated denied access exposes manual-copy feedback. Empty crew join is disabled, duplicate join reports existing membership, and witness confirmation survives refresh.
- Completed all nine moving tasks with real image-file input, sample valve evidence, crew attestation and coverage questionnaire. Invalid image input shows an alert. Both milestone claims and simulated sensor delivery succeed. All 1,000 MoveCredits and uploaded photos read back after refresh.
- LeakGuard: simulated alert, water check, report form, actual text-file download and photo evidence complete all three response steps. Address, draft, alert and photo read back after refresh. Simulated download failure shows a visible error. No page exceptions in either browser walkthrough.
- Corrupted saved data recovers to a usable default state. Six persistence regression tests cover restoration, durable evidence, malformed data, blocked storage, transient URL exclusion and the 2 MB limit. Automatic preview build is clean.

### Boundaries
- Partner examples and future sidequests remain informational, as intended. Start-menu insurance destinations are mock previews, not new insurance functionality.
- The old unmounted LifeEventQuest component is not an accessible app flow; no extra route was added for it.
- Existing reward display/charge discrepancies remain documented above; this audit does not silently change previously chosen business rules.
- Storage is local to this browser and can be cleared by the browser/user; quota failures are reported rather than guaranteed away. Active dialogs, selected room and transient feedback are intentionally not reopened after refresh.
- Root error retry was not fault-injected during this browser pass; arbitrary rendering failures, all devices and production services are not exhaustively verified.

## Responsive readability review — 17 October 2026
- Checked all seven screens at 375×812, 768×1024 and 1280×1800. Document width equals viewport width on every screen; translated progress fills are intentionally clipped within their tracks and do not overflow the page.
- Header and text/action rows now use shrink-safe layouts. Mobile reward totals stack beneath headings, the helper form stacks, and partner offers use two columns on tablets before expanding to three on desktop.
- Shared buttons and icon actions have 44px minimum touch targets; small controls retain readable 14px labels. Form fields are 44px tall with 16px text, visible focus rings and stable widths. Buttons can wrap instead of clipping.
- Sheets share consistent 20px mobile/24px larger-screen horizontal spacing, safe-area bottom space, scroll containment, reserved title space and a 44px close target. Long crew names wrap without squeezing actions.
- Removed low-opacity text from the blue active-sidequest shortcut and upcoming sidequests. Browser-computed contrast checks found no below-WCAG-AA ratios in enabled text on the inspected pages and task/coverage dialogs (4.5:1 normal text, 3:1 large text); disabled controls are exempt and were separately made less faint. This is a targeted check, not a formal complete accessibility certification.
- Verified dialog bottom actions can scroll into view, coverage answers remain usable, keyboard navigation opens Rewards, navigation targets meet 44px height, and Escape restores background scrolling at all three sizes. Screenshots inspected for mobile dialogs, mobile rewards and tablet reward grids.
- All 63 regression tests pass, the automatic preview build is clean, and the responsive browser runs produced no page exceptions. No business rules or storage behavior changed.