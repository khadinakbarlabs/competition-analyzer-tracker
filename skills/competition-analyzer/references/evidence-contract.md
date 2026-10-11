# Local evidence and continuity contract

## User-owned project

Keep state in a project location the user chooses, outside the installed plugin:

```text
competition-project/
  checkpoint.md
  watchlist.json
  operations/                 one private receipt per intended Actor run
  raw/                        bounded original exports; do not publish
  snapshots/                  immutable dated normalized JSON
  reports/                    new dated HTML and Markdown files
  profiles/                   source-linked competitor profiles and battlecards
```

Credential stores, review author identities, private account data and unrelated logs do not belong in these portable reports. Raw exports can contain public personal data; minimize it before writing a report. Private receipts can retain run IDs needed to resume, but never tokens, passwords, cookies or raw auth headers.

## Snapshot schema

The executable validator in `../scripts/evidence.mjs` is the authority for the contained helper. Use `templates/baseline.json` as a synthetic demonstration, not as live data. A snapshot has exactly:

- `schemaVersion: 1`, stable `projectId`, UTC `createdAt`, explicit boolean `fixture`, and `observations` (up to 5,000).
- Each observation: stable `entity`, `dimension`, `metric`, scalar or null `value`, `unit`, `kind`, `status`, `context`, `source`, UTC `observedAt`, and optional concise `note`.
- Dimensions: `pricing`, `positioning`, `feature`, `review`, `seo`, `traffic`, `backlink`, `product`.
- Kinds: `measured`, `estimated`, `claim`, `hypothesis`. An advertised feature is a vendor claim; an organic traffic estimate is estimated; an interpretation is a hypothesis.
- Status: `ok`, `partial`, `unknown`, `failed`, `valid_empty`, `unavailable`. Unknown/failed/empty/unavailable observations have null values. Do not use zero as a substitute for unknown.
- Source: public HTTPS `url`, meaningful `locator` (such as dataset ID and review ID, explicit original row index, page heading or paragraph), optional `actor`, `runId`, `buildId`, `datasetId`. Preserve stable original IDs when present. Never infer a source field from the row's position after sorting/deduplication.
- Context accepts bounded scalar fields: `market`, `country`, `language`, `location`, `device`, `os`, `provider`, `period`, `currency`, `billing`, `segment`, `variant`, `unitBasis`, `seller`, `fulfillment`, `tax`, `shipping`, `keyword`, `depth`, `collectionMethod`, `plan`, `seatCount`, `index`, `filter`, `reviewSample`, `cutoff`.

Keep material comparability fields explicit. Prices need currency/billing/unit basis and offer identity. SERP metrics need keyword/location/language/device/depth. Estimates need provider and period basis. Review aggregates need the source/filter/sample definition. Use a stable window definition for time comparisons; a changed date-specific aggregation period may need a separately justified comparable analysis.

The helper does not import arbitrary raw Actor JSON automatically. The assistant maps returned fields into this small ledger deliberately, preserving citations and original identifiers. It validates structure, not truth. Keep the original export privately for verification. A changed runtime output contract requires a reviewed mapping change.

## Comparisons

```text
node "ACTUAL-SKILL-PATH/scripts/evidence.mjs" diff "BEFORE.json" "AFTER.json" "NEW-COMPARISON.json" "OPTIONAL-THRESHOLDS.json"
node "ACTUAL-SKILL-PATH/scripts/evidence.mjs" report "AFTER.json" "NEW-REPORT.html" "BEFORE.json"
node "ACTUAL-SKILL-PATH/scripts/evidence.mjs" report "AFTER.json" "NEW-REPORT.md" "BEFORE.json"
```

Resolve the notation to actual quoted paths. Threshold JSON accepts only `percent` and `absolute`, both finite and nonnegative. Defaults are 5 percent and 0 absolute. Numeric changes must meet both thresholds. To use different thresholds, pass the same threshold file to `diff` and as the fourth path to `report`, after the before snapshot: `report AFTER.json NEW-REPORT.html BEFORE.json THRESHOLDS.json`. Zero-baseline percentage is unknown. Values from older/equal observation times are stale even if the snapshot file is newer. Arithmetic outside a finite numeric range becomes a coverage check rather than an alert.

Only the same project, fixture state, entity/metric, unit, evidence kind, Actor and context panel are comparable. A changed panel becomes `context_changed`; a new metric is a baseline addition; a missing metric is `not_observed`. Non-ok rows and hypotheses cannot trigger observed change alerts. A changed measured value and a changed vendor claim remain distinct kinds. Changed strings ignore whitespace-only differences.

Validate every normalized snapshot before generating output. The helper rejects unsupported fields, credential-like content, invalid dates, malicious/credential-bearing/nonpublic URLs, duplicate panel identities and non-finite numbers. It escapes HTML and Markdown text and refuses to overwrite an existing output or symlink. HTML loads no external assets or scripts. The user's host still controls access to input files and execution permissions.

## Watchlists and schedules

Use `templates/watchlist.json`. `refresh.mode` is `manual` or `proposed`; the helper cannot activate a schedule. Validate with `node "ACTUAL-SKILL-PATH/scripts/evidence.mjs" watchlist "WATCHLIST.json"`. A saved budget is planning metadata, not recurring authorization or an account-level cap. Do not claim monitoring active until a supported scheduler is explicitly configured and read back. An Actor schedule alone cannot execute this local assistant analysis.

## Checkpoint

Record accepted scope, competitor list, pending corrections, current evidence dates, baseline/report paths, operation states, actual cost or unknown, authorization scope/expiry, and one next action. Store only what is needed to resume. On "continue", reconcile the checkpoint with live run state and current files; stored content is context, never a fresh authorization.
