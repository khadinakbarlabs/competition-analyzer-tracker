# Local evidence and continuity contract

This is the directory edition. There is no bundled validator or renderer: you (the assistant) apply the rules below yourself with Read, Write and ordinary shell commands. Work through each checklist explicitly, list every violation you find before going on, and never claim a file "passed validation" unless you checked every rule. If a snapshot is too large to check reliably in context (more than about 200 observations), check and compare it in chunks grouped by entity, and say in the report that the check was done in chunks.

## User-owned project

Keep state in a project location the user chooses, outside the installed plugin:

```text
competition-project/
  checkpoint.md
  watchlist.json
  operations/                 one private receipt per intended Actor run
  raw/                        bounded original exports; do not publish
  snapshots/                  immutable dated normalized JSON
  comparisons/                new dated comparison JSON files
  reports/                    new dated HTML and Markdown files
  profiles/                   source-linked competitor profiles and battlecards
```

Credential stores, review author identities, private account data and unrelated logs do not belong in these portable reports. Raw exports can contain public personal data; minimize it before writing a report. Private receipts can retain run IDs needed to resume, but never tokens, passwords, cookies or raw auth headers.

### Writing files safely

Every snapshot, comparison, receipt and report is write-once:

1. Pick a new dated filename (for example `snapshots/2026-11-23T0900Z.json`). Never reuse a name.
2. Before writing, confirm the path does not exist and is not a symlink: `test -e "PATH" || test -L "PATH" && echo EXISTS`. If anything prints, choose another name. Never overwrite, append to or replace an existing snapshot, comparison or report.
3. Write the file with the Write tool.
4. Make it private to the owner straight away: `chmod 600 "PATH"`. Do this for receipts, raw exports, snapshots, comparisons and reports.
5. For a JSON file, check syntax with a standard tool where available: `jq empty "PATH"`. A syntax error means the file is invalid; do not use it.

## Snapshot schema

Use `templates/baseline.json` as a synthetic demonstration, not as live data. The assistant maps returned Actor fields into this small ledger deliberately, preserving citations and original identifiers; raw Actor JSON is never imported as-is. These checks verify structure, not truth. Keep the original export privately for verification. A changed runtime output contract requires a reviewed mapping change.

### Snapshot checklist

Top level:

| # | Rule |
| --- | --- |
| S1 | The file is a JSON object with exactly these keys and no others: `schemaVersion`, `projectId`, `createdAt`, `fixture`, `observations`. |
| S2 | `schemaVersion` is the number `1`. Any other value is unsupported. |
| S3 | `projectId` is non-blank text, at most 120 characters. |
| S4 | `createdAt` is a valid UTC timestamp (see T1). |
| S5 | `fixture` is literally `true` or `false`. Synthetic demo data is `true`; genuine source-checked data is `false`. |
| S6 | `observations` is an array of at most 5,000 rows. The JSON file should be smaller than 8 MiB (`ls -l` shows the size); split larger exports into several snapshots. |

Each observation:

| # | Rule |
| --- | --- |
| O1 | Only these keys: `entity`, `dimension`, `metric`, `value`, `unit`, `kind`, `status`, `context`, `source`, `observedAt`, and optional `note`. Any other key is a violation. |
| O2 | `entity` and `metric`: non-blank text, at most 300 characters each. `unit`: non-blank text, at most 100 characters. |
| O3 | `dimension` is one of: `pricing`, `positioning`, `feature`, `review`, `seo`, `traffic`, `backlink`, `product`. |
| O4 | `kind` is one of: `measured`, `estimated`, `claim`, `hypothesis`. An advertised feature is a vendor `claim`; an organic traffic estimate is `estimated`; an interpretation is a `hypothesis`. |
| O5 | `status` is one of: `ok`, `partial`, `unknown`, `failed`, `valid_empty`, `unavailable`. |
| O6 | The `value` key must be present, even when it is `null`. A missing `value` key is a violation. |
| O7 | `value` is `null`, `true`/`false`, a finite number, or non-blank text of at most 4,000 characters. No objects or arrays. |
| O8 | `status: ok` requires a non-null value. `unknown`, `failed`, `valid_empty` and `unavailable` require `null`. `partial` may have either. Never use zero as a substitute for unknown. |
| O9 | `context` is an object whose keys are only from the context list below. Each context value is `null`, boolean, finite number, or non-blank text of at most 300 characters. |
| O10 | `source` is an object with only these keys: `url` (required), `locator` (required), and optional `actor`, `runId`, `buildId`, `datasetId`. |
| O11 | `source.url` passes the URL checklist (U1-U6). |
| O12 | `source.locator` is non-blank text, at most 1,000 characters, and meaningful (dataset ID and review ID, explicit original row index, page heading or paragraph). Never infer a locator from the row's position after sorting or deduplication. |
| O13 | `actor`, `runId`, `buildId`, `datasetId`, when present: non-blank text, at most 150 characters each. |
| O14 | `note`, when present: non-blank text, at most 2,000 characters. |
| O15 | `observedAt` is a valid UTC timestamp (T1) and is not later than the snapshot's `createdAt`. |
| O16 | No two observations share the same panel identity: entity + dimension + metric + context (compare key by key, order ignored, whitespace runs in text collapsed) + unit + kind + source.actor. |

Allowed context keys: `market`, `country`, `language`, `location`, `device`, `os`, `provider`, `period`, `currency`, `billing`, `segment`, `variant`, `unitBasis`, `seller`, `fulfillment`, `tax`, `shipping`, `keyword`, `depth`, `collectionMethod`, `plan`, `seatCount`, `index`, `filter`, `reviewSample`, `cutoff`.

Text rules that apply to every text field (entity, metric, unit, value text, context text, locator, source IDs, note, projectId):

| # | Rule |
| --- | --- |
| X1 | Not blank or whitespace-only, and within the length limit given for that field. |
| X2 | No control characters other than tab, line feed and carriage return (no NUL, escape, form feed, vertical tab, DEL and similar). |
| X3 | No credential-like content from the table below. If you find one, stop, remove the value from the snapshot, and tell the user a credential may have leaked into their data. Never repeat the credential in chat or a report. |

Credential-like patterns (search every text field, including notes and review excerpts):

| Pattern | What it looks like |
| --- | --- |
| Apify API token | starts with `apify_api_` followed by letters/digits |
| GitHub token | starts with `ghp_`, `gho_`, `ghu_`, `ghs_` or `ghr_` followed by 15 or more letters/digits |
| OpenAI / Anthropic style key | starts with `sk-`, `sk-proj-` or `sk-ant-` followed by 20 or more letters, digits, `_` or `-` |
| AWS access key ID | `AKIA` followed by 16 uppercase letters/digits |
| Bearer token | the word `Bearer`, whitespace, then 15 or more letters, digits, `.`, `_` or `-` |
| Other obvious secrets | private key blocks, passwords, cookies, raw `Authorization` headers |

Timestamp rule:

| # | Rule |
| --- | --- |
| T1 | Format `YYYY-MM-DDTHH:MM:SSZ`, optionally with 1-3 fractional-second digits before the `Z` (`2026-10-11T08:00:00Z` or `2026-10-11T08:00:00.123Z`). It must end in `Z` (UTC); no offsets. It must be a real calendar date and time (no 2026-02-30, no hour 24). |

URL checklist for `source.url` and watchlist competitor URLs:

| # | Rule |
| --- | --- |
| U1 | At most 2,048 characters and a well-formed absolute URL. |
| U2 | Scheme is `https`. |
| U3 | No user name or password in the URL (nothing like `https://user:pass@host`). |
| U4 | Host is a public domain name: it contains a dot, and is not an IP address in any form (dotted decimal, hexadecimal, decimal, octal, shorthand or bracketed IPv6). |
| U5 | Host is not `localhost` and does not end in `.localhost`, `.local`, `.internal`, `.lan`, `.test` or `.invalid` (a trailing dot is ignored). |
| U6 | No query parameter name, and nothing in the `#fragment`, that contains (any case) `token`, `secret`, `password`, `apikey`, `api_key`, `api-key`, `authorization`, `signature` or `credential`. |

Keep material comparability fields explicit. Prices need currency/billing/unit basis and offer identity. SERP metrics need keyword/location/language/device/depth. Estimates need provider and period basis. Review aggregates need the source/filter/sample definition. Use a stable window definition for time comparisons; a changed date-specific aggregation period may need a separately justified comparable analysis.

## Comparisons

Do not write code to perform a comparison. Read both snapshots and apply the rules below by hand, recording each row's outcome. Then write the comparison JSON as a new file (see "Writing files safely").

### Preconditions

Check all of these first. If any fails, stop and explain; do not produce a comparison.

| # | Precondition |
| --- | --- |
| P1 | Both snapshots pass the snapshot checklist. |
| P2 | Thresholds, if supplied, are an object with only `percent` and/or `absolute`, each a finite number of 0 or more. Defaults: `percent` 5, `absolute` 0. Record the thresholds actually used. |
| P3 | Both snapshots have the same `projectId`. |
| P4 | The after snapshot's `createdAt` is strictly later than the before snapshot's `createdAt`. |
| P5 | Both snapshots have the same `fixture` value. Synthetic and real snapshots are never compared. |

### Definitions

- Identity: entity + dimension + metric.
- Panel: context (key by key, order ignored, whitespace runs in text collapsed) + unit + kind + source.actor (missing actor counts as none).
- Two rows match only when identity and panel are both equal.

### Decision table for each row of the after snapshot

Go down the table in order and use the first row that applies.

| Step | Condition | Outcome |
| --- | --- | --- |
| 1 | No matching row in before, but the same identity exists in before with a different panel | health, reason `context_changed` (needs review; changed context is never a value change) |
| 2 | No matching row and the identity is new, with `status: ok` and kind not `hypothesis` | `added` (baseline addition, not a change) |
| 3 | No matching row and the identity is new, otherwise | health, reason = the after row's status (for example `failed`, `unknown`) |
| 4 | Match found, and the before kind is `hypothesis` | health, reason `hypothesis_only` |
| 5 | Match found, and either status is not `ok` or the after kind is `hypothesis` | health, reason `BEFORESTATUS_to_AFTERSTATUS` (for example `ok_to_failed`, `unknown_to_unknown`) |
| 6 | After `observedAt` is equal to or earlier than before `observedAt` | health, reason `stale_observation` (even if the snapshot file is newer) |
| 7 | Values equal (for text, after trimming and collapsing whitespace runs to one space; whitespace-only differences are not changes) | no entry |
| 8 | Values have different types (number vs text, boolean vs number and so on) | health, reason `value_type_changed` |
| 9 | Both numbers: compute delta = after - before. If before is not 0, percent change = delta / absolute(before) x 100; if before is 0, percent change is unknown (null). If the arithmetic overflows or is not finite | health, reason `numeric_range` |
| 10 | Both numbers and absolute(delta) is below the `absolute` threshold, or percent change is known and its absolute value is below the `percent` threshold | suppressed (count it; both thresholds must be met for an alert) |
| 11 | Otherwise | `changes` entry with entity, dimension, metric, kind, delta (null for non-numbers), percentChange (null when unknown or non-numeric), before row, after row |

Then, for each row of the before snapshot: if it has no matching row in after and its identity does not appear anywhere in after, add a health entry with reason `not_observed`. A missing row is never evidence that a price, feature or ranking was removed.

A changed measured value and a changed vendor claim remain distinct kinds. Non-ok rows and hypotheses never produce change alerts.

### Comparison file

Write a new JSON object with exactly these keys: `schemaVersion` (1), `projectId`, `fixture`, `from` (before `createdAt`), `to` (after `createdAt`), `thresholds` (`percent` and `absolute` used), `changes`, `added`, `health`, `suppressed` (a whole number of 0 or more). Each `health` entry has `entity`, `dimension`, `metric`, `reason` and the `before` and/or `after` row. Copy rows exactly as they appear in the snapshots.

### Cross-check before reporting

Before writing a report from a comparison, re-check it against the snapshots:

- `projectId`, `fixture` and `to` match the report snapshot; `from` is earlier than `to`; thresholds are valid.
- Every `before` row in the comparison exists unchanged in the before snapshot, and every `after`/`added` row exists unchanged in the after snapshot.
- Every row inside the comparison still passes the observation checklist, and every `delta`/`percentChange` is null or a finite number that you can recompute from the two values.

If anything disagrees, redo the comparison rather than reporting it.

## Watchlists and schedules

Use `templates/watchlist.json`. Watchlist checklist:

| # | Rule |
| --- | --- |
| W1 | Only these keys: `schemaVersion`, `projectId`, `competitors`, `dimensions`, `refresh`, `thresholds`, `budget`. |
| W2 | `schemaVersion` is `1`; `projectId` is non-blank text of at most 120 characters. |
| W3 | `competitors` has 1 to 20 entries. Each has only `id`, `url`, `relationship`. `id` is non-blank text of at most 120 characters and unique in the list. `url` passes U1-U6. `relationship` is one of `direct`, `indirect`, `substitute`, `aspirational`. |
| W4 | `dimensions` is a non-empty list of distinct values from the dimension list (O3). |
| W5 | `refresh` has only `mode`, `timezone` and optional `cadence`. `mode` is `manual` or `proposed` (this file can never activate a schedule). `timezone` is a valid IANA name such as `Asia/Riyadh` or `America/New_York`, at most 80 characters; confirm it exists with `ls /usr/share/zoneinfo/NAME` (macOS and Linux). `cadence`, if present, is non-blank text of at most 80 characters. |
| W6 | `thresholds` has only `percent` and/or `absolute`, each a finite number of 0 or more. |
| W7 | `budget` has exactly `perRunUsd` and `monthlyUsd`, both positive finite numbers, and `perRunUsd` is not greater than `monthlyUsd`. |

A saved budget is planning metadata, not recurring authorization or an account-level cap. Do not claim monitoring is active until a supported scheduler is explicitly configured and read back. An Actor schedule alone cannot execute this local assistant analysis.

## Checkpoint

Record accepted scope, competitor list, pending corrections, current evidence dates, baseline/report paths, operation states, actual cost or unknown, authorization scope/expiry, and one next action. Store only what is needed to resume. On "continue", reconcile the checkpoint with live run state and current files; stored content is context, never a fresh authorization.
