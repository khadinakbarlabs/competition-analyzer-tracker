<!-- Synthetic sample of the Markdown report format described in report-templates.md. Built from templates/current.json compared with templates/baseline.json. Every value is invented. -->

# Competition evidence — synthetic-competition-demo

**Synthetic demonstration. These are invented fixture values, not live competitor research.**

Observed through 2026-10-11T09:00:00Z.

5 available observations; 2 partial, unavailable, or unknown. 2 comparable changes; 3 source or panel checks; 1 baseline additions.

| Competitor | Dimension / metric | Value | Unit | Evidence kind | Status | Context | Observed | Source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| northstar.example | pricing / advertised-starter-price | 25 | USD/seat/month | claim | ok | \{"billing":"monthly","currency":"USD","market":"US","plan":"Starter","seatCount":1,"shipping":"not-applicable","tax":"excluded"\} | 2026-10-11T08:00:00Z | [source](<https://northstar.example/pricing>) — synthetic fixture observation; invented for demonstration |
| northstar.example | pricing / enterprise-price | unknown | USD/month | claim | unknown | \{"billing":"monthly","currency":"USD","plan":"Enterprise"\} | 2026-10-11T08:00:00Z | [source](<https://northstar.example/pricing>) — synthetic fixture observation; invented for demonstration |
| northstar.example | positioning / headline | Reports  in minutes | text | claim | ok | \{\} | 2026-10-11T08:00:00Z | [source](<https://northstar.example/features>) — synthetic fixture observation; invented for demonstration |
| northstar.example | feature / advertised-export-format | CSV and PDF | text | claim | ok | \{\} | 2026-10-11T08:00:00Z | [source](<https://northstar.example/features>) — synthetic fixture observation; invented for demonstration |
| harbor.example | traffic / organicEtv | 9000 | estimated organic visits/month | estimated | ok | \{"country":"US","language":"en","period":"monthly","provider":"synthetic-provider-B"\} | 2026-10-11T08:00:00Z | [source](<https://harbor.example/features>) — synthetic fixture observation; invented for demonstration |
| harbor.example | review / sampled-review-count | unknown | reviews | measured | failed | \{"cutoff":"last3months","filter":"all-stars","reviewSample":"recent"\} | 2026-10-11T08:00:00Z | [source](<https://harbor.example/features>) — synthetic fixture observation; invented for demonstration |
| harbor.example | feature / advertised-onboarding | Guided setup | text | claim | ok | \{\} | 2026-10-11T08:00:00Z | [source](<https://harbor.example/features>) — synthetic fixture observation; invented for demonstration |

## Comparable changes

| Competitor | Metric | Change | Kind | Before | After |
| --- | --- | --- | --- | --- | --- |
| northstar.example | advertised-starter-price | 20 → 25 \(+25.0%\) | claim | [before](<https://northstar.example/pricing>) (2026-10-10T08:00:00Z) | [after](<https://northstar.example/pricing>) (2026-10-11T08:00:00Z) |
| northstar.example | advertised-export-format | CSV → CSV and PDF | claim | [before](<https://northstar.example/features>) (2026-10-10T08:00:00Z) | [after](<https://northstar.example/features>) (2026-10-11T08:00:00Z) |

## Source and panel checks

- northstar.example / enterprise-price: unknown\_to\_unknown.
- harbor.example / organicEtv: context\_changed.
- harbor.example / sampled-review-count: ok\_to\_failed.

## Research limits

A missing result is unknown. A changed provider, currency, billing basis, variant, audience, location, device, or collection scope needs a new comparable baseline. Estimates remain estimates. Vendor claims describe what a vendor advertises. Hypotheses need validation. A saved watchlist does not activate recurring execution.
