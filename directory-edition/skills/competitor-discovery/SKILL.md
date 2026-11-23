---
name: competitor-discovery
description: "Find direct competitors, indirect alternatives and substitutes for a business or product using source-linked search and public company evidence. Use for competitor discovery, rival shortlists, product alternatives and competitor landscape research. Qualify audience and use-case fit before recommending a watchlist."
---

# Competitor discovery

Produce a short, defensible competitor list with reasons for inclusion. Read existing approved rivals and exclusions first. Use supplied exports immediately; live collection follows [the shared execution contract](../competition-analyzer/references/execution.md).

1. Identify the buyer, problem, geography, language, product category and important constraints from the user's context. Mark uncertain inputs as assumptions; do not mistake a search-ranking overlap for a direct commercial competitor.
2. Develop up to three distinct search queries: category plus audience, the target's alternatives, and the problem or substitute. Use the `scrape-google-serp` recipe in [actors.json](../competition-analyzer/references/actors.json), keeping query/page/result caps explicit. Inspect returned organic links and snippets with their query and date. Search ads are labelled separately.
3. For each candidate, verify public homepage and product evidence with `firecrawl-alternative`. An optional `similarweb-alternative` sample can suggest SEO rivals; those remain search competitors until buyer and use-case overlap is confirmed.
4. Classify each candidate as direct, indirect, substitute or aspirational. Retain brand aliases and canonical domain; do not collapse unrelated businesses with similar names. Store ambiguous entities as needing review.
5. Default to three relevant direct rivals, plus one useful substitute. Exclude directories, publishers, resellers and affiliates unless the user's actual buying journey makes them relevant.

Return a table of competitor, canonical URL, relationship, audience/use-case fit, inclusion evidence, source date and confidence. Add excluded candidates with a brief reason when they could otherwise confuse the shortlist. Confidence is an explicitly explained research judgment, not a generated probability or demand score. Save the accepted list for subsequent skills; a proposed watchlist is not active monitoring.

Do not launch additional Actors merely to fill every field. If search is unavailable or empty, produce a provisional shortlist from the user's supplied evidence and explain the gap. A blocked provider does not mean the business has no competitors.
