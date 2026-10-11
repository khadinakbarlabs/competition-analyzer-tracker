# Competition Analyzer & Tracker

Competitive intelligence for Claude Code: discover rivals, compare pricing and features, analyze customer reviews and SEO evidence, create source-linked sales battlecards, and track meaningful changes with saved watchlists.

Seven focused skills use your Apify account and Khadin Akbar's Actors through the independently installed official Apify CLI. Existing exports work offline. The package contains skills, reference contracts, synthetic examples and a local report helper. It starts no MCP server, background process or installer and includes no publisher credentials.

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

Load this directory with the supported local Claude Code plugin option:

```bash
claude --plugin-dir ./competition-analyzer-tracker
```

When already inside this directory, use `claude --plugin-dir .`. After directory approval, the public listing will supply its own install action. A source file or local validation does not establish directory approval.

Try natural requests:

- "Analyze these competitor exports and prepare a pricing and positioning brief."
- "Find three direct competitors for my product and explain why each belongs."
- "Create a battlecard from these G2 reviews and public product pages."
- "Compare my saved competitor snapshots and explain meaningful changes."

Explicit entry: `/competition-analyzer-tracker:competition-analyzer`. Other entries use the skill names in the table of [contained skills](skills/competition-analyzer/SKILL.md).

## Live data and spending

The official `apify` executable must be installed separately from Apify's official package or documentation, and signed in to your own account. Node.js 22 or later runs the optional contained evidence helper. Login is unnecessary for local exports. Inspect installed command help and current Actor schemas before live use.

Live Actor runs are billable. The assistant prepares a bounded target/input/build plan, reuses your applicable authorization and applies supported native per-run charge caps before a start. It does not buy credits, embed API tokens or use publisher access. Collection plans and saved budgets do not activate a recurring task. An input label named `free_tier` does not mean free collection. See [execution and recovery](skills/competition-analyzer/references/execution.md).

The backend catalog includes public Actors for SERPs, public HTML-to-Markdown, page metadata, organic estimates, sampled ranks, backlinks, G2, Capterra, Trustpilot and Amazon offers. Their schemas and build identities were retrieved on 2026-10-11. Current availability, provider access, prices and exact run behavior must be checked for the intended operation. Public contracts are not proof of a successful paid cloud run.

## Saved tracking and reports

Save state outside the installed plugin. Compare like-for-like observations; currency, billing basis, product variant, audience, geography, provider, device and collection scope are part of the evidence. Failed sources and missing rows become coverage checks, not invented price removals or ranking losses. Traffic estimates stay labelled as estimates.

The dependency-free helper validates local JSON, compares snapshots and renders accessible HTML/Markdown without external assets, scripts or telemetry. It makes no network requests and refuses to overwrite existing outputs. It verifies structure and arithmetic; it does not prove that assistant-normalized facts are accurate. See [the evidence contract](skills/competition-analyzer/references/evidence-contract.md).

To preview the synthetic example from this directory:

```bash
node skills/competition-analyzer/scripts/evidence.mjs validate skills/competition-analyzer/references/templates/current.json
node skills/competition-analyzer/scripts/evidence.mjs report skills/competition-analyzer/references/templates/current.json new-demo-report.html skills/competition-analyzer/references/templates/baseline.json
```

The fixture values are invented and clearly labelled. [View the bundled synthetic report](skills/competition-analyzer/references/demo-report.html).

Recurring collection needs an existing supported scheduler, explicit frequency/targets/spend/expiry authorization and verified activation. An Apify collection schedule alone cannot run this local analysis. Manual refreshes and history are available without automation.

## Data handling

For live research, selected target URLs, domains, queries, identifiers, locale and collection limits are sent to Apify under your account. The selected Actors may use upstream data providers and requested public sites. Public review exports can include personal information; the workflow removes unrelated reviewer identity/contact details from reports. Reports and checkpoints stay where you save them unless you explicitly share them. The host assistant and CLI/services have their own processing and retention terms. This skills package adds no publisher-hosted service or telemetry. [Privacy](PRIVACY.md) · [Terms](TERMS.md) · [Support](SUPPORT.md) · [Security](SECURITY.md).

## Research and originality

The design draws on specific mechanisms in leading relevant open-source repositories: Anthropic's competitive-brief/battlecard workflows, Marketing Skills' structured profiles, and changedetection.io's focus on meaningful monitored changes. [Research and attribution](skills/competition-analyzer/references/research-and-attribution.md) records the dated stars, licenses, relevant paths, adaptations and limits. The implementation and skill text are original; third-party plugin code and prompts are not bundled.

## Validation

Run `npm test` for behavioral tests and `claude plugin validate --strict .` for Claude's native validator. Local checks, actual host evaluations, paid Actor acceptance, directory scans, reviewer approval and public availability are recorded separately in the release notes. No checker guarantees Anthropic approval.

MIT licensed. Created by Khadin Akbar.
