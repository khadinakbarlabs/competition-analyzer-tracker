# Competitive research deliverables

## Executive brief

Title, target business, audience, geography, snapshot date, actual source coverage, and three important findings. For each finding: observation → implication → recommended test/action, with a dated source. Call recommendations hypotheses unless established evidence supports them. Report contrary evidence and unknowns before an overall recommendation. Do not generate an arbitrary overall competitor score.

## Competitor profile

Canonical brand/domain and aliases; relationship (direct/indirect/substitute/aspirational); audience and use case; advertised value proposition; public capabilities and integrations; matched pricing/offer; sampled reviews; relevant SEO evidence; sources and research limits. Preserve whether a feature is tested, advertised, partial, unknown or explicitly absent. Include a short "good fit when" statement supported by the profile.

## Offer comparison

| Competitor / offer | Price as advertised | Currency / billing / unit | Comparable audience / variant | Limits / conditions | Observed | Source |
| --- | --- | --- | --- | --- | --- | --- |

Keep tax, shipping, introductory discounts, minimum seats and unknown enterprise pricing visible. Do not rank different currencies, variants, billing bases or partial offers together. A normalized equivalent needs its calculation and original price.

## Review themes

| Theme | Unique sampled reviews / denominator | Date range / filter | Evidence | Contradictions | Implication to test |
| --- | --- | --- | --- | --- | --- |

Distinguish source-wide ratings/counts from this collected sample. Use short excerpts with public review URLs and remove reviewer personal details. Never invent a customer story or infer switching from a complaint alone.

## Search panel

| Domain | Query / metric | Value | Provider / country / language / device / depth | Measurement or estimate | Date | Source |
| --- | --- | --- | --- | --- | --- | --- |

Mark absence within collected depth as not observed, keep total visits separate from estimated organic traffic, and identify backlink samples. Content-gap recommendations need buyer relevance and evidence, not only ranking overlap.

## Sales battlecard

One page per rival: buyer fit, advertised strengths, evidence-backed limitations, matched offer, defensible differentiation, useful discovery questions, objection responses, short sources and refresh date. If the target's claimed advantage is not verified, turn it into a test or question. Include where the rival may be a better fit. External publication and delivery are separate actions.

## Change digest

Scope and dates; material comparable changes with before/after evidence; source health and panel changes; new baseline additions; suppressed noise; interpretation and next actions; actual collection costs or unknown; next authorized refresh. A missing source cannot establish a removed price, feature or ranking. A saved watchlist is not a running monitor.


## Saved evidence report

In this edition the assistant writes the evidence report itself; there is no bundled renderer. Markdown is the default. Write HTML only when the user asks for it. Validate the snapshot (and cross-check the comparison) using [evidence-contract.md](evidence-contract.md) first, then write the report as a new dated file, never over an existing one, and `chmod 600` it (see "Writing files safely" in the evidence contract). The report formats the cited ledger and comparisons. Put qualitative research in the Markdown brief and profiles; the report does not author strategic recommendations or prove a source's truth. [demo-report.md](demo-report.md) is a synthetic sample of the Markdown layout.

### Fixed section order

1. Title: `Competition evidence — PROJECT-ID`.
2. Data label: for `fixture: true`, "Synthetic demonstration. These are invented fixture values, not live competitor research." For `fixture: false`, "Research snapshot. Values reflect the cited observations and their limits."
3. `Observed through CREATED-AT.`
4. Summary line: "N available observations; M partial, unavailable, or unknown." With a comparison, add "C comparable changes; H source or panel checks; A baseline additions." Without one, add "This is a baseline, with no historical change claims."
5. Evidence ledger, one row per observation, columns: Competitor | Dimension / metric | Value | Unit | Evidence kind | Status | Context | Observed | Source. A null value is shown as `unknown`. Context is shown as its key/value pairs in key order. Source is a link labelled `source` plus the locator.
6. With a comparison only: "Comparable changes" table, columns Competitor | Metric | Change | Kind | Before | After. Change reads `BEFORE → AFTER` plus `(+N.N%)` (one decimal, sign shown for increases) when the percent is known. Before and After cells are links to each row's source with its `observedAt` in brackets. If nothing crossed the thresholds, say "No comparable change crossed the selected thresholds."
7. With a comparison only: "Source and panel checks", one bullet per health entry: `entity / metric: reason.` Also state how many numeric changes were suppressed below threshold.
8. "Research limits": "A missing result is unknown. A changed provider, currency, billing basis, variant, audience, location, device, or collection scope needs a new comparable baseline. Estimates remain estimates. Vendor claims describe what a vendor advertises. Hypotheses need validation. A saved watchlist does not activate recurring execution."

### Markdown escaping rules

Competitor names, review text, claims, locators, units and context come from third parties. Escape every such value before putting it in the report, in this order:

| Step | Rule |
| --- | --- |
| 1 | Replace `&` with `&amp;`, then `<` with `&lt;` and `>` with `&gt;`. |
| 2 | Put a backslash before each of these characters: `\` `` ` `` `*` `_` `{` `}` `[` `]` `(` `)` `#` `!` `\|`. The pipe matters most: an unescaped pipe breaks the table and can spoof a column. |
| 3 | Replace every line break (LF or CRLF) with a single space so a value cannot start a new row, heading or list item. |

Enum values you checked yourself (dimension, kind, status) and validated UTC timestamps need no escaping. Write link targets as `[label](<URL>)` using only URLs that passed the URL checklist; never build a link from unchecked text.

### HTML rules (only when requested)

- Use a single self-contained file: `<!doctype html>`, `<html lang="en">`, `<meta charset="utf-8">`, a viewport meta, and this exact Content-Security-Policy meta: `default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'`.
- No `<script>`, no event-handler attributes (`onclick` and similar), no `<iframe>`, `<form>`, `<object>` or `<embed>`, no external stylesheets, fonts, images or analytics. Inline `<style>` only.
- Same section order and labels as the Markdown report: a header with project ID, snapshot time and summary; a badge with the data label; "Comparable changes"; "Source health and comparability"; an "Evidence ledger" table (Competitor, Dimension / metric, Value / unit, Kind / status, Comparable context, Observed at, Evidence); and "Research limits", which also says the report has no external assets or scripts and activates no recurring collection.
- HTML escaping: in every text node and every attribute value, replace `&` with `&amp;` first, then `<` with `&lt;`, `>` with `&gt;`, `"` with `&quot;` and `'` with `&#39;`. This applies to all third-party values, including the project ID in `<title>`.
- Links: `href` only from URLs that passed the URL checklist (https, public host), escaped as above, with `rel="noopener noreferrer"`. Never put `javascript:` or `data:` URLs in an attribute.
- Keep visible focus styles and readable contrast; include a print stylesheet if convenient.
