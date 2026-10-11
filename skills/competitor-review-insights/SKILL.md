---
name: competitor-review-insights
description: "Analyze competitor customer reviews from G2, Capterra or Trustpilot to identify recurring praise, complaints, objections and switching themes. Use for voice-of-customer research and evidence-backed competitor weaknesses. Report sample size, dates and coverage; avoid treating selected reviews as representative market statistics."
---

# Competitor review insights

Analyze the smallest relevant review sample. Start with supplied exports; avoid a paid recollection for data already available. Live collection follows [execution.md](../competition-analyzer/references/execution.md), using the selected review Actor's exact current recipe in [actors.json](../competition-analyzer/references/actors.json).

Prefer known canonical product/company URLs. If identity is uncertain, use a bounded product search and confirm the match before collecting reviews. Start with one source and ten recent reviews per competitor. Use `recordType` to separate reviews from product summaries. Product-level total review count and aggregate rating are distinct from the collected sample.

Deduplicate by source review ID or canonical review URL; use a documented content/date fingerprint only when identifiers are absent. Exclude duplicates from theme counts. Preserve review URL, review date, rating, verification status when present, and product/plan context. Omit names, contact details, individual profiles and employer information from reports unless essential and explicitly requested. A public review is not outreach consent.

Code short claims into praise, complaint, outcome, objection and switching themes. A switching reason needs an actual reviewer statement about switching; a complaint alone does not establish it. For each theme show the number of distinct sampled reviews, the sample denominator, brief evidence excerpts, dates, contradictory cases and possible selection bias. Do not turn self-reported sentiment into an objective defect or prevalence across all customers.

Return a theme table and implications for product, positioning and sales discovery. Separate observed review statements from your hypotheses. Recommend tests rather than inventing testimonials, ROI or switching stories. Blocked sources, partial results and unavailable data stay visible in coverage. Read [report-templates.md](../competition-analyzer/references/report-templates.md) for the review section and battlecard evidence mapping.
