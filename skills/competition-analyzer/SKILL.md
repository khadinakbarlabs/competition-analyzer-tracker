---
name: competition-analyzer
description: "Analyze competitors and build a competitive intelligence report with source-linked profiles, pricing and feature comparisons, SEO evidence, battlecards and saved watchlists. Use for competitor analysis, competitive research, market positioning or continuing a saved competition project. Live research uses Khadin Akbar's Apify Actors through the user's official Apify CLI; existing exports work offline."
---

# Competition Analyzer & Tracker

Turn a company, product, competitor list or existing export into a decision-ready competitive research pack. Target Claude Code with local filesystem access. Live collection requires an independently installed official Apify CLI and the user's own Apify authorization. This package declares only skills and supporting files.

## Start with a useful result

Read existing project context and supplied evidence first. For "continue", open the project's checkpoint and resume its recorded task. Do not repeat discovery, replace the baseline or restart a charged run just because a new session began.

Infer the product, audience and likely market from supplied material; record those as provisional when unclear. Ask only for missing facts that change the next step. A supplied export can be analyzed immediately without login or a spending questionnaire. If only a business URL is supplied, prepare a small collection plan and a provisional competitor shortlist; get the applicable spending envelope before launching paid Actors. Default to three direct rivals and a quick scan, and expand only when useful.

For each external collection operation, read [execution.md](references/execution.md) and the selected entry in [actors.json](references/actors.json). For comparisons, read [evidence-contract.md](references/evidence-contract.md). These references must be loaded before executing their operations.

## Choose the smallest route

| User's job | Skill to use |
| --- | --- |
| Find relevant rivals or alternatives | `competitor-discovery` |
| Compare offers, plans, variants or observed prices | `competitor-pricing` |
| Explain customer praise, pain points or switching reasons | `competitor-review-insights` |
| Compare search visibility, organic estimates or backlink samples | `competitor-seo-analysis` |
| Build sales battlecards or positioning/feature matrices | `competitive-battlecards` |
| Save a watchlist, refresh a baseline or explain what changed | `competitor-tracking` |

Use the main workflow for a complete pack: scope → relevant competitors → bounded collection or export import → cited profiles → like-for-like comparisons → three prioritized actions → saved baseline and checkpoint. Load only the specialist skills the requested deliverable needs.

## Deliver the pack

Use [report-templates.md](references/report-templates.md) for the executive brief, profiles, comparison matrices and battlecards. Every material fact needs a source URL, observation date and field/row or page locator. Distinguish measurements, estimates, advertised vendor claims and your hypotheses. Keep missing or inaccessible data unknown. Separate a successful Actor run from useful complete evidence.

Build a normalized snapshot according to [evidence-contract.md](references/evidence-contract.md), then use the contained helper with quoted absolute paths resolved from this installed skill:

```text
node "<installed-skill>/scripts/evidence.mjs" validate "<project>/snapshots/current.json"
node "<installed-skill>/scripts/evidence.mjs" report "<project>/snapshots/current.json" "<project>/reports/new-report.html"
```

Replace the path notation with verified actual locations before running. The helper validates and formats local evidence; it neither fetches data nor confirms the accuracy of assistant-created observations. Its HTML contains no external assets or scripts. It creates new output files and refuses to overwrite existing files.

Return the brief, profiles, evidence ledger, research limitations, actual report paths and next action. Save a minimal checkpoint containing accepted scope, sources, run identifiers, unresolved questions and refresh instructions in the user's project, outside the installed plugin. Keep credentials and raw personal review data out of reports. If sharing or outreach is requested, prepare the exact artifact and use only its separately authorized destination.

## Nearby requests

An investment valuation, private-account investigation, customer contact enrichment, automatic ad campaign or competitor website edit is outside this workflow. Provide the useful competitive research portion without inventing capabilities or expanding permissions.
