# Validation — source release 0.1.4

Checked 2026-10-11. This records evidence, not an Anthropic approval claim.

| Check | Actual state |
| --- | --- |
| Offline helper behavior | 29 tests passed, including source failures, non-comparable panels, safe writes, HTML escaping, bounded arithmetic, custom thresholds, percent-encoded citations and normalized IP-address exclusions |
| Claude native manifests | Plugin and marketplace both pass `claude plugin validate --strict` in Claude Code 2.1.289 |
| Portable manifest | Passes the Agent Plugins 1.0 JSON Schema; title/subtitle each 30 characters |
| Actor contracts | Ten public identities, schemas, readmes and build identities retrieved; ten credential-free recipe/subset-schema pairs validate |
| Exact native archives | Both isolated bundles were unpacked and validated, with seven skills, supporting helper, references and input recipes present |
| Package containment | No runtime MCP, agents, commands, hooks, installer, mixed native manifests, symlinks or unsafe archive paths |
| Source review | Credential/path pattern scan plus focused review; no exposed credential or publisher authentication material found |
| Plugin Builder | Component budget passes; native bundle generation and Codex compatibility checker used; production graph and evidence ledger recorded |
| Private Plugin Creator release | Private personal preview at 0.1.4; root manifest, helper and affected documents read back against source, with private audience preserved |
| Native GitHub installation | Publisher marketplace added and 0.1.4 installed and enabled in an isolated Claude configuration; normal user settings were not changed |
| Claude task evaluations | Eight read-only cases authored. Attempt stopped at authentication before any task completed; no passing host-eval claim |
| Paid Actor acceptance | Not run; no paid data collection authorized or performed |
| Public GitHub publication | Approved and created at `khadinakbarlabs/competition-analyzer-tracker`; public repository and documentation/policy pages verified |
| Anthropic portal | Account draft saved for Claude Code only. Repository validation passed at `52def0a` with five informational listing-field warnings and one policy hold joining JSON-file reading with the helper's URL-validation hostname variable. Final security scan, submission, legal attestations, reviewer acceptance and availability are not established |
| Public directory availability | Not established |

## Reproduce local checks

```bash
npm test
claude plugin validate --strict .claude-plugin/plugin.json
claude plugin validate --strict .claude-plugin/marketplace.json
```

The source tests are development resources; runtime archives contain only native manifests, skills/supporting resources, assets and user-facing root documents. Plugin Builder's older compatibility checker reads `.codex-plugin/plugin.json`; the portable root manifest is checked separately against its current schema. Its self-specific multi-platform release checker is not used as evidence for this plugin.

The private import preserved the helper, listing title and subtitle; it generated a Codex compatibility overlay and normalized publisher metadata. Changes use the current release guard and retain private visibility.

## Pending host verification

The native eval attempt recognized the plugin as 0.1.0 but reported `auth_failed`: the Claude Code OAuth session had expired and could not be refreshed. Cost was reported as zero; this is an authentication result, not a plugin behavior score. The subsequent 0.1.1 citation fix passed its local regression test. Reauthenticate through Claude Code's normal flow, then run the existing suite against the current candidate. Keep reports local and disable real servers/scaffolds:

```bash
claude plugin eval . --runs 1 --ablation with-without --model haiku --max-cost-usd 2 --no-publish --no-scaffold --mocks record --trust-plugin --output-dir evals/results/review-0.1.4
```

Model-call cost ceilings are checked before launch and can overrun by the one in-flight run. A single passing trial would still be a bounded smoke check rather than evidence of production accuracy or guaranteed skill improvement. Inspect actual task replies, tool selection, sources and the no-plugin comparison before claiming a gain.

## Remaining release work

Owner approval covers the exact listing, package/policies and public destination. The public repository and policy/support/documentation URLs have been verified. Run the authenticated host checks after Claude Code signs in. Directory scans, reviewer decisions and live availability must be read back separately. The saved draft's execution attestation conflicts with the declared CLI/helper design; obtain clarification or written permission before the authorized human completes legal attestations and final submission. A paid Actor benchmark needs an applicable target and spending envelope; it cannot be reported as passed from contract checks or synthetic fixtures. See `docs/REVIEW.md` for the exact finding and prepared clarification.
