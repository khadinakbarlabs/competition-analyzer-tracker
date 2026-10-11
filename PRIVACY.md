# Privacy — Competition Analyzer & Tracker

Prepared 2026-10-11 for version 0.1.4. Publisher: Khadin Akbar. This document describes the packaged workflow and supporting helper.

The skills and offline Node.js helper add no publisher-operated data collection endpoint, telemetry, analytics, credential store or hosted database. The helper reads the local JSON files you select and writes the new report/comparison file you select. The assistant can save project context, exports and receipts to your chosen filesystem location when that work is authorized.

Live research uses your independently installed official Apify CLI and your own Apify account. It sends the selected public URLs, domains, queries, product/company identifiers, locale, limits and run configuration to Apify. Depending on the chosen Actor, Apify and its upstream providers process those inputs and public source data. Their services control their own run history, datasets, diagnostics, billing and retention. The plugin does not represent that external processing as local-only.

Read [Apify's privacy policy](https://docs.apify.com/legal/privacy-policy) and the applicable [data processing addendum](https://docs.apify.com/legal/data-processing-addendum). Some selected SEO Actor contracts identify DataForSEO; its [privacy policy](https://dataforseo.com/privacy-policy) applies when that provider is used. Before live collection, identify every actual upstream provider from the current Actor contract, include its applicable privacy-policy link in the operation plan, and explain which selected inputs it receives. If that data flow cannot be established, use existing exports. These links do not mean every Actor uses the same provider.

Public review data can contain reviewer names, employers, profile links and other personal information. The workflow directs the assistant to omit unnecessary identities and contact details from reports, use short relevant evidence excerpts, and retain the original export only where needed in your own project. Do not supply private customer records, passwords, cookies, API tokens or unrelated confidential material. Public-source availability does not itself authorize every use of that data.

The assistant host processes prompts, evidence and files according to your host/account settings and its own terms. The official CLI manages authentication according to its own design; this package never asks the helper to inspect or print credential stores. Reports and project state are not sent to the publisher by the packaged helper. External delivery or publication occurs only when separately authorized through your chosen tools.

For the Claude Code target, review [Anthropic's privacy policy](https://www.anthropic.com/legal/privacy). Other hosts used with the portable skills package have their own account terms and privacy settings.

Local files remain until you delete or replace them. You control the project folder and can remove its checkpoints, exports and reports. Manage external run/dataset retention and deletion through your own Apify account, and host conversation/file retention through your assistant provider. This package cannot delete another provider's records on your behalf merely because local files were removed.

For plugin support, use the contact method in SUPPORT.md and share only a redacted reproduction. A support message follows the service/channel you choose; never include tokens, private datasets or customer information.
