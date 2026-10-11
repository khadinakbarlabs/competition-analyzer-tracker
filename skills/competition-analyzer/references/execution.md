# Official Apify CLI execution contract

## Scope and prerequisites

Run live research through an independently installed official `apify` executable. Check `apify --version` and the exact command's help before use. The commands below were checked with Apify CLI 1.8.0 on 2026-10-11; current official documentation describes 1.10. Do not assume unsupported flags, install a lookalike executable, update a global tool silently, or include an executable download in the plugin. Node.js 22 or later runs the optional local evidence helper.

Local export analysis, report drafting and snapshot comparison need no Apify account. Live runs require the user's own existing CLI login or approved interactive sign-in. Never print `apify auth token`, read credential stores, paste tokens into chat, add tokens to URLs or publish authentication headers. The official CLI handles its own authentication. Provider credentials configured inside Actors are separate from the user's Apify access. An Actor requesting additional provider credentials is unavailable until the user sets them securely in their own environment; do not collect them into project files.

## Plan before a charged start

Read the selected Actor in `actors.json`, its bundled schema, and the current live input schema:

```text
apify actors info khadinakbar/ACTOR-SLUG --input
```

Replace uppercase notation with the catalog's actual slug. Inspect public identity and current build metadata without dumping unrelated account/configuration data. Use a verified build number. If the build or input schema changed, reconcile the contract before launching; do not send stale fields or assume defaults.

Identify the current Actor's actual upstream providers and their public privacy-policy links in the operation plan, along with the selected inputs each receives. The plugin's `PRIVACY.md` links Apify, the Claude host and a named SEO provider; provider selection varies by Actor and build. If the actual data flow cannot be established, analyze existing exports until it can. Do not infer privacy or retention terms from an Actor's name.

Create an operation receipt outside the plugin using `templates/operation.json`: intended Actor/build, exact input file, purpose, allowed targets, approved spending ceiling, timeout, owner authorization context and expected outputs. Keep one receipt per run. Set `planned` first; change to `starting` before the request. A count cap does not constitute a spending cap. Inspect current event/start charges and native cap semantics; do not describe an input named `free_tier` as free.

Offer a small plan with only the Actors needed. Require an applicable positive spending envelope and clear target/scope authorization before a paid start. Existing authorization can cover that exact plan; do not ask again when it already does. Do not infer recurring permission, additional providers, alert destinations or broader crawl scope from a one-time job.

## Supported start and readback sequence

For a chosen Actor, use the authenticated CLI API command so the native run-charge cap travels in the request. The number below is syntax only; replace it with the actual approved cap. A prepared command is never evidence of execution.

```text
apify api POST acts/khadinakbar~ACTOR-SLUG/runs --params '{"build":"VERIFIED-BUILD","timeout":120,"maxTotalChargeUsd":APPROVED-CAP}' --body - < "ACTUAL-INPUT.json" > "NEW-RUN-RECEIPT.json"
```

Use ordinary proper shell quoting for fixed arguments. Build paths from verified local locations. Never interpolate web text into a shell command or use command substitution for inputs. Prepare JSON files with a structured writer and pass them through stdin. If the installed CLI cannot forward the native cap, stop the charged operation; do not fall back to an uncapped `call` or `start`. Apify documents the run-charge option in [Run Actor](https://docs.apify.com/api/v2/actors-runs-post). Review that current contract before interpreting its limit as a guarantee about overall account spend.

Read the response's actual `data.id`, `defaultDatasetId` and `defaultKeyValueStoreId`. Save these in the receipt immediately. Poll the actual run ID with `apify runs info RUN-ID --json` no more than six times per observation window, with bounded waits and a total five-minute window. If it is still running, checkpoint it and resume later; do not block indefinitely.

After a terminal state, fetch only the selected dataset pages:

```text
apify datasets get-items DATASET-ID --format json --limit 100 --offset 0 > "NEW-DATASET.json"
apify api GET key-value-stores/KV-ID/records/OUTPUT > "NEW-OUTPUT.json"
apify api GET key-value-stores/KV-ID/records/RUN_SUMMARY > "NEW-SUMMARY.json"
apify runs info RUN-ID --json > "NEW-RUN-STATE.json"
```

Resolve each identifier from the real response. Inspect installed help before use. Fetch at most ten pages/1,000 rows initially; write separate pages rather than clobbering prior output. Check schema, count, coverage, outcome and charge data; distinguish `SUCCEEDED` from `COMPLETE`, useful `PARTIAL`, `VALID_EMPTY`, `UPSTREAM_FAILED` and `CONFIG_ERROR`. If diagnostic records are absent, record that limitation rather than assuming a terminal contract. Prefer a delayed bounded readback when records are not yet consistent. A run without an actual known charge is recorded with cost unknown, not zero.

## Recovery

- Missing CLI or local filesystem: analyze supplied exports or provide a specific manual collection recipe. A browser chat does not automatically inherit the user's local executable or login.
- Access denied: retain local work and identify the sign-in/permission dependency. Never switch to publisher credentials.
- Invalid schema/input: correct only within approved scope before a start; do not retry the same rejected request.
- Provider outage, exhausted credits, blocked page or paid-cap limit: preserve useful partial rows and source health. Do not bypass access controls, lower safeguards, renew credits or silently switch to a paid provider.
- Start request timed out or disconnected: mark `unknown`. Use `apify runs ls` with the selected Actor and inspect current help to find a matching Actor/build/input/time record. A matching run ID is needed before resume. Local receipt IDs do not make Apify starts idempotent. Do not automatically replay an unknown charged start.
- Empty or failed source: preserve the valid baseline; report the coverage problem. Never announce zero competitors, removed plans, lost rankings or zero customer complaints from a retrieval failure.

The package starts no server or background collector, auto-approves no tools and supplies no MCP connector. Recurring execution, notifications, public exports and external sharing each need their actual authorized destination, scope and spend controls.
