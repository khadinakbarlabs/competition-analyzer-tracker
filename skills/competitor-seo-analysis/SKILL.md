---
name: competitor-seo-analysis
description: "Compare competitors' sampled Google rankings, estimated organic traffic, backlink samples and public page metadata. Use for competitor SEO research, search visibility comparisons and content gaps. Preserve provider, geography, language, device and query scope; label estimates and unavailable metrics explicitly."
---

# Competitor SEO analysis

Turn search evidence into a prioritized set of hypotheses. Reuse supplied exports and accepted competitor identities. Follow [execution.md](../competition-analyzer/references/execution.md) for live runs and [actors.json](../competition-analyzer/references/actors.json) for the relevant contracts.

- Use `scrape-google-serp` for a bounded same-query search panel and discovery evidence. Count organic rankings consistently; paid placements are separate. An absent domain within collected depth is "not observed in this sample", not "unranked everywhere".
- Use `similarweb-alternative` for up to three domains initially. `organicEtv` is estimated Google organic traffic from the provider's index, not measured website sessions or total visits. `visits` is available only when the upstream Similarweb feed exists; do not fill it with `organicEtv`. `mode: free_tier` is an Actor input label and does not make the run free.
- Use `keyword-rank-tracker` only when its managed provider access is actually available. Set location, language, device, OS, keywords and depth explicitly. Never request or expose provider passwords in shared files; if managed access is unavailable, retain the sample SERP evidence and report the narrower coverage.
- Use `website-backlink-checker` for a bounded sample or labelled summary. A sample of five referring pages is not the site's total backlinks. Index scores are provider-specific and not interchangeable with another service's authority score.
- Use `website-seo-spider` for page-only or tightly bounded raw-HTML metadata. Its titles, H1s and issue flags support on-page observations; they do not measure conversion, browser-rendered behavior or revenue.

Save context fields with every observation: provider, country/location, language, device, OS, keywords, result depth, period basis and collection method where relevant. Compare history only within the same panel. Provider or scope changes need a new baseline, and sparse coverage cannot justify an overall winner.

Deliver the evidence table, a short content/keyword gap list, contrary evidence and three prioritized research or content actions with a rationale. Search performance estimates and suggested work do not promise future rankings or traffic gains. Save the panel for a later manual refresh using [evidence-contract.md](../competition-analyzer/references/evidence-contract.md).
