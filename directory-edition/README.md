# Competition Analyzer & Tracker

Competitive intelligence for Claude Code: discover rivals, compare pricing and features, analyze customer reviews and SEO evidence, create source-linked sales battlecards, and track meaningful changes with saved watchlists.

Seven focused skills use your Apify account and Khadin Akbar's Actors through the independently installed official Apify CLI. Existing exports work offline. This package contains skills, reference contracts and synthetic examples only. It starts no MCP server, background process or installer and includes no publisher credentials.

## Directory edition

This folder is the text-only build of the plugin for the Claude directory. It contains only Markdown, JSON, YAML and an icon; there is no executable helper. The full edition, which adds a dependency-free Node.js evidence helper and its tests, is installable from the [GitHub repository](https://github.com/khadinakbarlabs/competition-analyzer-tracker).

What works the same:

- All seven skills, with the same names and triggers.
- The Apify CLI collection procedure, Actor catalog, bounded input examples and schemas, including the spending rules: a bounded plan and the user's spending envelope before any paid start, a native per-run charge cap on every start (no uncapped fallback), no automatic replay of an uncertain charged start, and readback before resume.
- Discovery, pricing, review, SEO and battlecard reasoning, report templates and the checkpoint/continue workflow.
- Snapshot, comparison and watchlist rules. They are written out in full in `skills/competition-analyzer/references/evidence-contract.md` as checklists and a decision table.

What is less exact than the full edition:

- Snapshot and watchlist validation is done by the assistant reading the JSON against a checklist, not by a program. On small snapshots the result is close to identical; on hundreds or thousands of rows the assistant can miss a duplicate panel identity, a bad timestamp, an enum typo, a control character or a field over its length limit.
- The credential scan (Apify, GitHub, OpenAI/Anthropic-style, AWS and Bearer token patterns) is best effort. A token buried in a long note can be missed.
- Source URL safety checks (IP literals, `.local`/`.internal` hosts, credentials in the URL or query) are the assistant's judgement, not a parser.
- Snapshot comparison is the biggest loss. Threshold arithmetic, percent change, the zero-baseline rule, stale-observation detection, whitespace-normalized text comparison and the `context_changed`, `not_observed`, `hypothesis_only`, status-transition and `numeric_range` outcomes are applied by hand. It is slower, uses more tokens (both snapshots must be read), and on large watchlists a row can be misclassified or a percentage miscalculated. Snapshots over about 200 observations are compared in chunks.
- The report-time re-check of a comparison against its snapshots is a written cross-check, not an automatic one.
- Reports are written by the assistant from a template, so output varies more between runs. HTML and Markdown escaping of third-party text (competitor names, review text, claims) follows written rules but is not guaranteed. Markdown is the default; HTML is written only on request, with no scripts and a strict Content-Security-Policy.
- Write-once and owner-only outputs are procedural (`test -e` before writing, new dated filenames, `chmod 600` afterwards) instead of an exclusive, mode-0600 file open.
- The 5,000-row and 8 MiB input limits are guidance, not enforced; large exports should be split.
- The edition still runs the official `apify` CLI through Bash for live collection and declares no MCP server. Whether that fits the directory's "no code execution outside declared MCP servers" attestation is a question for the publisher and reviewer to settle; removing the helper does not answer it.

## What you get

| Workflow | Result |
| --- | --- |
| Competition analysis | Cited profiles, comparison matrices, priorities and a saved evidence ledger |
| Competitor discovery | Qualified direct rivals, alternatives and substitutes with inclusion evidence |
| Pricing research | Comparable subscription plans and matched ecommerce offers |
| Review insights | Sample-aware praise, objections, complaints and switching themes |
| Competitor SEO | Sampled Google rankings, organic traffic estimates and backlink evidence |
| Sales battlecards | Balanced positioning and objection responses grounded in dated sources |
| Competitor tracking | Saved watchlists, comparable snapshot changes and source-health checks |

## Use it

Try natural requests:

- "Analyze these competitor exports and prepare a pricing and positioning brief."
- "Find three direct competitors for my product and explain why each belongs."
- "Create a battlecard from these G2 reviews and public product pages."
- "Compare my saved competitor snapshots and explain meaningful changes."

Explicit entry: `/competition-analyzer-tracker:competition-analyzer`. Other entries use the skill names in the table of [contained skills](skills/competition-analyzer/SKILL.md).

## Live data and spending

The official `apify` executable must be installed separately from Apify's official package or documentation, and signed in to your own account. Login is unnecessary for local exports. Inspect installed command help and current Actor schemas before live use.

Live Actor runs are billable. The assistant prepares a bounded target/input/build plan, reuses your applicable authorization and applies supported native per-run charge caps before a start. It does not buy credits, embed API tokens or use publisher access. Collection plans and saved budgets do not activate a recurring task. An input label named `free_tier` does not mean free collection. See [execution and recovery](skills/competition-analyzer/references/execution.md).

The backend catalog includes public Actors for SERPs, public HTML-to-Markdown, page metadata, organic estimates, sampled ranks, backlinks, G2, Capterra, Trustpilot and Amazon offers. Their schemas and build identities were retrieved on 2026-10-11. Current availability, provider access, prices and exact run behavior must be checked for the intended operation.

## Saved tracking and reports

Save state outside the installed plugin. Compare like-for-like observations; currency, billing basis, product variant, audience, geography, provider, device and collection scope are part of the evidence. Failed sources and missing rows become coverage checks, not invented price removals or ranking losses. Traffic estimates stay labelled as estimates.

The assistant validates snapshots, compares them and writes Markdown (default) or self-contained HTML reports by following [the evidence contract](skills/competition-analyzer/references/evidence-contract.md) and [report templates](skills/competition-analyzer/references/report-templates.md). These checks cover structure and arithmetic; they do not prove that normalized facts are accurate. A synthetic sample of the report format is in [demo-report.md](skills/competition-analyzer/references/demo-report.md); its values are invented.

Recurring collection needs an existing supported scheduler, explicit frequency/targets/spend/expiry authorization and verified activation. An Apify collection schedule alone cannot run this local analysis. Manual refreshes and history are available without automation.

## Data handling

For live research, selected target URLs, domains, queries, identifiers, locale and collection limits are sent to Apify under your account. The selected Actors may use upstream data providers and requested public sites. Public review exports can include personal information; the workflow removes unrelated reviewer identity/contact details from reports. Reports and checkpoints stay where you save them unless you explicitly share them. This skills package adds no publisher-hosted service or telemetry. [Privacy](PRIVACY.md) · [Terms](TERMS.md) · [Support](SUPPORT.md) · [Security](SECURITY.md).

## Research and originality

[Research and attribution](skills/competition-analyzer/references/research-and-attribution.md) records the open-source repositories whose mechanisms informed the design. The skill text is original; third-party plugin code and prompts are not bundled.

MIT licensed. Created by Khadin Akbar.
