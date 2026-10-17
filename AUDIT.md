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
- Full automated suite: 57 tests, including new batching, StrictMode duplicate-effect, upload lifecycle, numeric-input and missing-context regressions.
- Static lint with formatting checks disabled: zero errors; eight existing development hot-reload export warnings.
- Preview compilation: automatic build reports checked; successful.
- Live browser walkthrough: start menu, daily activity opt-in (+50 exactly once), navigation to Rewards and rental van purchase, sidequest hub, helper join, moving coverage questionnaire, simulated leak response, report generation/download and image evidence saving. No browser page exceptions recorded. Report download completed successfully.
- Existing route heads checked for app-specific title, description, Open Graph fields and Twitter card.

## Remaining limitations / observations
- **Known price inconsistency preserved:** rental van displays 6,000 but spends 150 ActiveCredits; cleaning displays 10,000 but spends 400. These were explicitly changed as display-only text previously. This audit did not change chosen prices or redemption rules; they should be aligned before a real launch.
- Steps, daily/yearly periods, balances, crew, sensors, partners and reward fulfillment remain an in-memory prototype. There is no live step feed or calendar rollover, and reloading resets the demo. This is not production persistence or verified crew authorization.
- Developer-only provider hooks intentionally throw clear errors when misused. Actual content routes are wrapped in their provider and have the existing error/404 fallback. This is not a guarantee against every possible browser/extension mutation or future malformed data.
- Existing page-render tests emit document-shell nesting and empty stylesheet URL warnings in the test environment. They pass, and the live browser walkthrough produced no page exceptions. The test harness warnings were not suppressed.
- Eight hot-reload warnings concern helpers exported alongside UI components; they are not missing imports or production runtime failures. Pre-existing formatting issues elsewhere were not bulk-rewritten.
- The earlier `removeChild` error did not reproduce in the exercised flow. External browser translation/DOM modification cannot be ruled out; no global DOM workaround was added.
- Production deployment, real integrations and every possible browser/device combination were not exercised.