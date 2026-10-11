---
name: competitor-pricing
description: "Compare competitor pricing, subscription plans, features, usage limits and matched product offers. Use for SaaS pricing research, plan comparisons, ecommerce competitor prices and price-change analysis. Preserve currency, billing period, variants and source dates so unlike offers are not ranked together."
---

# Competitor pricing

Create an offer comparison that a person can verify. Read the user's product, accepted competitor list and existing exports before collecting data. All live runs follow [execution.md](../competition-analyzer/references/execution.md).

For public subscription or service pricing, select known pricing URLs using `firecrawl-alternative` from [actors.json](../competition-analyzer/references/actors.json). Quote only the short relevant price or offer fragment; retain the public URL and collection date. Capture plan, currency, advertised amount, monthly or annual billing, per-seat/usage basis, minimum seats, included limits, overage, trial, tax and conditions when stated. An annual price advertised as a monthly equivalent is not a month-to-month offer. Enterprise "contact sales" stays unknown; do not estimate it.

For Amazon offers, use `amazon-competitor-price-tracker` with user-approved ASINs, explicit marketplace and at most three competitors initially. Omit `alertWebhookUrl`; sending alerts needs a separately approved destination. Verify matching product, variant, pack size, condition, seller and fulfillment. The Actor's `isUndercut` indicates a numeric comparison within that run; it does not establish product equivalence or a recommendation to change prices.

Build separate matrices for comparable segments or variants. Show advertised price and normalized equivalent only when conversion is transparent and mathematically valid. Do not mix currencies or silently apply exchange rates. Separate trial/promotional/list prices from the current recurring offer. Currency, billing, tax, shipping or variant gaps require a qualified comparison or a new baseline.

Use [evidence-contract.md](../competition-analyzer/references/evidence-contract.md) to save observations. Repeated measurements of the same offer can be compared by the local helper; failed fetches, empty datasets and missing prices do not prove an offer was removed. Preserve both dated citations for material changes.

Deliver the pricing/feature matrix, material caveats, justified opportunities and questions worth testing. Pricing proposals are hypotheses; implementing a price change, purchase or seller action is outside this skill.
