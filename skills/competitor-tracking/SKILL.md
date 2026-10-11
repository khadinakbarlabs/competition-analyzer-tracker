---
name: competitor-tracking
description: "Save competitor watchlists, refresh the same research panel, compare dated snapshots and report meaningful changes in pricing, positioning, reviews and search evidence. Use for competitor tracking, watchlists, change reports and weekly competitive reviews. Separate source failures and new baselines from verified changes."
---

# Competitor tracking

Maintain useful competitive history in the user's project. This skill creates saved watchlists and rerunnable refresh plans; it does not install a scheduler or start monitoring in the background.

1. Read the saved checkpoint, watchlist, last valid snapshot and receipts. Preserve stable competitor identities, dimensions, accepted exclusions, collection panel, timezone and thresholds. Read [evidence-contract.md](../competition-analyzer/references/evidence-contract.md).
2. Validate the watchlist with the contained helper. A `manual` or `proposed` refresh mode is a planning state, never proof of activation. Missing targets or budgets require a specific correction before a paid refresh, while existing snapshots can be compared immediately.
3. Reuse unconsumed completed runs before launching another. Reconcile any receipt marked unknown against the account's run list and input/build/start time. Never replay a possible charged start automatically. Live work follows [execution.md](../competition-analyzer/references/execution.md), with explicit per-run caps and the existing authorization's remaining scope.
4. Save a new timestamped snapshot from useful returned rows. Record provider failures, truncation and missing data separately. Do not overwrite the last valid baseline with an empty or failed retrieval. Keep normalized observations and both dated source records.
5. Compare with the offline helper. Use the same currency, billing basis, variant, geography, provider, device, audience and collection scope. Record new observations as baseline additions; missing rows as not observed; changed context as requiring review. Numeric thresholds suppress small movements, and whitespace-only differences do not generate a change.
6. Produce a compact digest: meaningful comparable changes, why they may matter, both dated citations, source health, new baseline additions, suppressed noise, actual collection cost when available and suggested follow-up. Estimates remain labelled as estimates. Qualitative recommendations need judgment beyond the helper's arithmetic.

For an actual recurring request, inspect an existing supported host scheduler or Apify scheduling capability before proposing activation. Obtain the specific frequency, timezone, targets, budget, expiry and notification destination where missing. Do not infer recurring spend from a one-time run or a saved monthly budget. Schedule only within explicit authorization, enforce available native caps, verify readback, and provide pause/cancel instructions. If the host cannot reliably retrieve, normalize, compare and store snapshots, deliver a manual refresh recipe and explain that automated analysis is unavailable. An Apify collection schedule alone does not run this local analysis helper.

Notifications or report delivery use only an explicitly authorized channel. Stay quiet on unchanged data; report meaningful changes, failures or required action. Save the next refresh instruction and unresolved state so "continue tracking" resumes without rebuilding the project.
