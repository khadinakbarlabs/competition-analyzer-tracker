import { open } from 'node:fs/promises';
import { isIP } from 'node:net';
import { pathToFileURL } from 'node:url';

const DIMENSIONS = new Set(['pricing', 'positioning', 'feature', 'review', 'seo', 'traffic', 'backlink', 'product']);
const STATUSES = new Set(['ok', 'partial', 'unknown', 'failed', 'valid_empty', 'unavailable']);
const KINDS = new Set(['measured', 'estimated', 'claim', 'hypothesis']);
const CONTEXT_FIELDS = new Set(['market', 'country', 'language', 'location', 'device', 'os', 'provider', 'period', 'currency', 'billing', 'segment', 'variant', 'unitBasis', 'seller', 'fulfillment', 'tax', 'shipping', 'keyword', 'depth', 'collectionMethod', 'plan', 'seatCount', 'index', 'filter', 'reviewSample', 'cutoff']);
const SECRET_PATTERN = /(?:apify_api_[a-zA-Z0-9]+|gh[pousr]_[a-zA-Z0-9]{15,}|sk-(?:proj-|ant-)?[a-zA-Z0-9_-]{20,}|AKIA[A-Z0-9]{16}|Bearer\s+[a-zA-Z0-9._-]{15,})/;
const MAX_BYTES = 8 * 1024 * 1024;

function record(value, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`${label} must be an object`);
}
function fields(value, allowed, label) {
  record(value, label);
  if (Object.keys(value).some(key => !allowed.includes(key))) throw new Error(`${label} contains an unsupported field`);
}
function text(value, label, max = 1000) {
  if (typeof value !== 'string' || !value.trim() || value.length > max || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value)) throw new Error(`${label} must be bounded nonblank text`);
  if (SECRET_PATTERN.test(value)) throw new Error(`${label} may contain a credential`);
}
function timestamp(value, label) {
  text(value, label, 40);
  if (!/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d{1,3})?Z$/.test(value) || !Number.isFinite(Date.parse(value)) || new Date(value).toISOString().slice(0, 19) !== value.slice(0, 19)) throw new Error(`${label} must be a valid UTC timestamp`);
  return Date.parse(value);
}
function publicUrl(value) {
  text(value, 'source URL', 2048);
  let url;
  try { url = new URL(value); } catch { throw new Error('Source URL must be a public HTTPS URL'); }
  const host = url.hostname.toLowerCase().replace(/\.$/, '');
  if (url.protocol !== 'https:' || url.username || url.password || isIP(host) || host.startsWith('[') || !host.includes('.') || /(?:^|\.)(?:localhost|local|internal|lan|test|invalid)$/.test(host)) throw new Error('Source URL must be a public HTTPS URL without credentials');
  if ([...url.searchParams.keys()].some(key => /token|secret|password|api.?key|authorization|signature|credential/i.test(key)) || /token|secret|password|api.?key|authorization|signature|credential/i.test(url.hash)) throw new Error('Source URL contains a credential parameter');
  return url;
}
function scalar(value, label) {
  if (value === null || typeof value === 'boolean') return;
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) throw new Error(`${label} must be finite`);
    return;
  }
  text(value, label, 4000);
}
function stable(value) {
  if (value && typeof value === 'object') return JSON.stringify(Object.fromEntries(Object.keys(value).sort().map(key => [key, value[key]])));
  return JSON.stringify(typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : value);
}
function identity(row) { return JSON.stringify([row.entity, row.dimension, row.metric]); }
function panel(row) { return JSON.stringify([stable(row.context), row.unit, row.kind, row.source.actor ?? null]); }
function fullKey(row) { return identity(row) + panel(row); }

export function validateSnapshot(input) {
  fields(input, ['schemaVersion', 'projectId', 'createdAt', 'fixture', 'observations'], 'snapshot');
  if (input.schemaVersion !== 1) throw new Error('Unsupported snapshot schemaVersion');
  text(input.projectId, 'projectId', 120);
  const createdAt = timestamp(input.createdAt, 'createdAt');
  if (typeof input.fixture !== 'boolean') throw new Error('fixture must explicitly be true or false');
  if (!Array.isArray(input.observations) || input.observations.length > 5000) throw new Error('observations must be an array of at most 5000 rows');
  const keys = new Set();
  for (const row of input.observations) {
    fields(row, ['entity', 'dimension', 'metric', 'value', 'unit', 'kind', 'status', 'context', 'source', 'observedAt', 'note'], 'observation');
    text(row.entity, 'entity', 300); text(row.metric, 'metric', 300); text(row.unit, 'unit', 100);
    if (!DIMENSIONS.has(row.dimension) || !STATUSES.has(row.status) || !KINDS.has(row.kind)) throw new Error('Invalid observation dimension, status, or kind');
    if (!Object.hasOwn(row, 'value')) throw new Error('value must be explicit, using null for unknown data');
    scalar(row.value, 'value');
    if (row.status === 'ok' && row.value === null) throw new Error('ok observations require a value');
    if (!['ok', 'partial'].includes(row.status) && row.value !== null) throw new Error('Unknown, empty, unavailable, or failed values must be null');
    fields(row.context, [...CONTEXT_FIELDS], 'context');
    for (const [key, value] of Object.entries(row.context)) {
      scalar(value, `context ${key}`);
      if (typeof value === 'string' && value.length > 300) throw new Error('context text is too long');
    }
    fields(row.source, ['url', 'actor', 'runId', 'buildId', 'datasetId', 'locator'], 'source');
    publicUrl(row.source.url);
    text(row.source.locator, 'source locator', 1000);
    for (const key of ['actor', 'runId', 'buildId', 'datasetId']) if (row.source[key] !== undefined) text(row.source[key], `source ${key}`, 150);
    if (row.note !== undefined) text(row.note, 'note', 2000);
    if (timestamp(row.observedAt, 'observedAt') > createdAt) throw new Error('Observation timestamp is after the snapshot');
    const key = fullKey(row);
    if (keys.has(key)) throw new Error('Duplicate observation identity in the same panel');
    keys.add(key);
  }
  return input;
}

function validateThresholds(options) {
  fields(options, ['percent', 'absolute'], 'thresholds');
  const { percent = 5, absolute = 0 } = options;
  if (![percent, absolute].every(value => typeof value === 'number' && Number.isFinite(value) && value >= 0)) throw new Error('Numeric thresholds must be finite nonnegative numbers');
  return { percent, absolute };
}
export function compareSnapshots(before, after, options = {}) {
  const { percent, absolute } = validateThresholds(options);
  validateSnapshot(before); validateSnapshot(after);
  if (before.projectId !== after.projectId) throw new Error('Snapshot project identities differ');
  if (Date.parse(after.createdAt) <= Date.parse(before.createdAt)) throw new Error('Snapshots must be in chronological order');
  if (before.fixture !== after.fixture) throw new Error('Synthetic and real snapshots cannot be compared');
  const result = { schemaVersion: 1, projectId: before.projectId, fixture: before.fixture, from: before.createdAt, to: after.createdAt, thresholds: { percent, absolute }, changes: [], added: [], health: [], suppressed: 0 };
  const prior = new Map(before.observations.map(row => [fullKey(row), row]));
  const current = new Map(after.observations.map(row => [fullKey(row), row]));
  const beforeIdentities = new Set(before.observations.map(identity));
  const afterIdentities = new Set(after.observations.map(identity));
  for (const next of after.observations) {
    const previous = prior.get(fullKey(next));
    if (!previous) {
      if (beforeIdentities.has(identity(next))) result.health.push({ entity: next.entity, dimension: next.dimension, metric: next.metric, reason: 'context_changed', after: next });
      else if (next.status === 'ok' && next.kind !== 'hypothesis') result.added.push(next);
      else result.health.push({ entity: next.entity, dimension: next.dimension, metric: next.metric, reason: next.status, after: next });
      continue;
    }
    if (previous.status !== 'ok' || next.status !== 'ok' || previous.kind === 'hypothesis' || next.kind === 'hypothesis') {
      result.health.push({ entity: next.entity, dimension: next.dimension, metric: next.metric, reason: previous.kind === 'hypothesis' ? 'hypothesis_only' : `${previous.status}_to_${next.status}`, before: previous, after: next });
      continue;
    }
    if (Date.parse(next.observedAt) <= Date.parse(previous.observedAt)) {
      result.health.push({ entity: next.entity, dimension: next.dimension, metric: next.metric, reason: 'stale_observation', before: previous, after: next });
      continue;
    }
    if (stable(previous.value) === stable(next.value)) continue;
    if (typeof previous.value !== typeof next.value) {
      result.health.push({ entity: next.entity, dimension: next.dimension, metric: next.metric, reason: 'value_type_changed', before: previous, after: next });
      continue;
    }
    let percentChange = null;
    let delta = null;
    if (typeof next.value === 'number') {
      delta = next.value - previous.value;
      if (previous.value !== 0) percentChange = delta / Math.abs(previous.value) * 100;
      if (!Number.isFinite(delta) || (percentChange !== null && !Number.isFinite(percentChange))) {
        result.health.push({ entity: next.entity, dimension: next.dimension, metric: next.metric, reason: 'numeric_range', before: previous, after: next });
        continue;
      }
      if (Math.abs(delta) < absolute || (percentChange !== null && Math.abs(percentChange) < percent)) { result.suppressed++; continue; }
    }
    result.changes.push({ entity: next.entity, dimension: next.dimension, metric: next.metric, kind: next.kind, delta, percentChange, before: previous, after: next });
  }
  for (const previous of before.observations) {
    if (!current.has(fullKey(previous)) && !afterIdentities.has(identity(previous))) result.health.push({ entity: previous.entity, dimension: previous.dimension, metric: previous.metric, reason: 'not_observed', before: previous });
  }
  return result;
}

export function validateWatchlist(input) {
  fields(input, ['schemaVersion', 'projectId', 'competitors', 'dimensions', 'refresh', 'thresholds', 'budget'], 'watchlist');
  if (input.schemaVersion !== 1) throw new Error('Unsupported watchlist schemaVersion');
  text(input.projectId, 'projectId', 120);
  if (!Array.isArray(input.competitors) || !input.competitors.length || input.competitors.length > 20) throw new Error('Watchlist needs 1 to 20 competitors');
  const ids = new Set();
  for (const competitor of input.competitors) {
    fields(competitor, ['id', 'url', 'relationship'], 'competitor');
    text(competitor.id, 'competitor id', 120); publicUrl(competitor.url);
    if (!['direct', 'indirect', 'substitute', 'aspirational'].includes(competitor.relationship)) throw new Error('Invalid competitor relationship');
    if (ids.has(competitor.id)) throw new Error('Duplicate competitor id');
    ids.add(competitor.id);
  }
  if (!Array.isArray(input.dimensions) || !input.dimensions.length || input.dimensions.some(value => !DIMENSIONS.has(value)) || new Set(input.dimensions).size !== input.dimensions.length) throw new Error('Invalid watchlist dimensions');
  fields(input.refresh, ['mode', 'timezone', 'cadence'], 'refresh');
  if (!['manual', 'proposed'].includes(input.refresh.mode)) throw new Error('Refresh mode must be manual or proposed; this file cannot activate a schedule');
  text(input.refresh.timezone, 'timezone', 80);
  try { new Intl.DateTimeFormat('en', { timeZone: input.refresh.timezone }); } catch { throw new Error('Invalid timezone'); }
  if (input.refresh.cadence !== undefined) text(input.refresh.cadence, 'cadence', 80);
  fields(input.thresholds, ['percent', 'absolute'], 'thresholds');
  for (const value of Object.values(input.thresholds)) if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) throw new Error('Invalid numeric threshold');
  fields(input.budget, ['perRunUsd', 'monthlyUsd'], 'budget');
  for (const key of ['perRunUsd', 'monthlyUsd']) if (typeof input.budget[key] !== 'number' || !Number.isFinite(input.budget[key]) || input.budget[key] <= 0) throw new Error('Budget values must be positive finite amounts');
  if (input.budget.perRunUsd > input.budget.monthlyUsd) throw new Error('Per-run budget exceeds monthly budget');
  return input;
}

function htmlEscape(value) { return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char])); }
function mdEscape(value) { return String(value).replace(/[&<>]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[char])).replace(/[\\`*_{}[\]()#!|]/g, '\\$&').replace(/\r?\n/g, ' '); }
function display(row) { return row.value === null ? 'unknown' : String(row.value); }
function changeText(change) { return `${display(change.before)} → ${display(change.after)}${change.percentChange === null ? '' : ` (${change.percentChange > 0 ? '+' : ''}${change.percentChange.toFixed(1)}%)`}`; }
function summary(snapshot, comparison) {
  const ok = snapshot.observations.filter(row => row.status === 'ok').length;
  return `${ok} available observations; ${snapshot.observations.length - ok} partial, unavailable, or unknown.${comparison ? ` ${comparison.changes.length} comparable changes; ${comparison.health.length} source or panel checks; ${comparison.added.length} baseline additions.` : ' This is a baseline, with no historical change claims.'}`;
}
function validateReportComparison(snapshot, comparison) {
  if (comparison === null) return;
  fields(comparison, ['schemaVersion', 'projectId', 'fixture', 'from', 'to', 'thresholds', 'changes', 'added', 'health', 'suppressed'], 'comparison');
  if (comparison.schemaVersion !== 1 || comparison.projectId !== snapshot.projectId || comparison.fixture !== snapshot.fixture || comparison.to !== snapshot.createdAt) throw new Error('Comparison does not match report snapshot');
  if (timestamp(comparison.from, 'comparison from') >= timestamp(comparison.to, 'comparison to')) throw new Error('Invalid comparison chronology');
  validateThresholds(comparison.thresholds);
  for (const key of ['changes', 'added', 'health']) if (!Array.isArray(comparison[key]) || comparison[key].length > 5000) throw new Error('Invalid comparison rows');
  if (!Number.isSafeInteger(comparison.suppressed) || comparison.suppressed < 0) throw new Error('Invalid suppressed count');
  const before = [], after = [...comparison.added];
  for (const item of comparison.changes) {
    fields(item, ['entity', 'dimension', 'metric', 'kind', 'delta', 'percentChange', 'before', 'after'], 'change');
    for (const key of ['entity', 'metric']) text(item[key], `change ${key}`, 300);
    if (!DIMENSIONS.has(item.dimension) || !KINDS.has(item.kind)) throw new Error('Invalid change kind or dimension');
    for (const key of ['delta', 'percentChange']) if (item[key] !== null && (typeof item[key] !== 'number' || !Number.isFinite(item[key]))) throw new Error('Invalid numeric change');
    before.push(item.before); after.push(item.after);
  }
  for (const item of comparison.health) {
    fields(item, ['entity', 'dimension', 'metric', 'reason', 'before', 'after'], 'health');
    text(item.entity, 'health entity', 300); text(item.metric, 'health metric', 300); text(item.reason, 'health reason', 300);
    if (!DIMENSIONS.has(item.dimension) || (!item.before && !item.after)) throw new Error('Invalid health observation');
    if (item.before) before.push(item.before);
    if (item.after) after.push(item.after);
  }
  validateSnapshot({ schemaVersion: 1, projectId: comparison.projectId, fixture: comparison.fixture, createdAt: comparison.from, observations: before });
  validateSnapshot({ schemaVersion: 1, projectId: comparison.projectId, fixture: comparison.fixture, createdAt: comparison.to, observations: after });
}
function mdSource(row, label) { return `[${label}](<${new URL(row.source.url).href}>) (${row.observedAt})`; }

export function renderMarkdown(snapshot, comparison = null) {
  validateSnapshot(snapshot);
  validateReportComparison(snapshot, comparison);
  const lines = [`# Competition evidence — ${mdEscape(snapshot.projectId)}`, '', snapshot.fixture ? '**Synthetic demonstration. These are invented fixture values, not live competitor research.**' : '**Research snapshot. Values reflect the cited observations and their limits.**', '', `Observed through ${snapshot.createdAt}.`, '', summary(snapshot, comparison), '', '| Competitor | Dimension / metric | Value | Unit | Evidence kind | Status | Context | Observed | Source |', '| --- | --- | --- | --- | --- | --- | --- | --- | --- |'];
  for (const row of snapshot.observations) lines.push(`| ${mdEscape(row.entity)} | ${mdEscape(row.dimension + ' / ' + row.metric)} | ${mdEscape(display(row))} | ${mdEscape(row.unit)} | ${row.kind} | ${row.status} | ${mdEscape(stable(row.context))} | ${row.observedAt} | [source](<${new URL(row.source.url).href}>) — ${mdEscape(row.source.locator)} |`);
  if (comparison) {
    lines.push('', '## Comparable changes', '', '| Competitor | Metric | Change | Kind | Before | After |', '| --- | --- | --- | --- | --- | --- |');
    for (const item of comparison.changes) lines.push(`| ${mdEscape(item.entity)} | ${mdEscape(item.metric)} | ${mdEscape(changeText(item))} | ${item.kind} | ${mdSource(item.before, 'before')} | ${mdSource(item.after, 'after')} |`);
    lines.push('', '## Source and panel checks', '', ...comparison.health.map(item => `- ${mdEscape(item.entity)} / ${mdEscape(item.metric)}: ${mdEscape(item.reason)}.`));
  }
  lines.push('', '## Research limits', '', 'A missing result is unknown. A changed provider, currency, billing basis, variant, audience, location, device, or collection scope needs a new comparable baseline. Estimates remain estimates. Vendor claims describe what a vendor advertises. Hypotheses need validation. A saved watchlist does not activate recurring execution.', '');
  return lines.join('\n');
}

export function renderHtml(snapshot, comparison = null) {
  validateSnapshot(snapshot);
  validateReportComparison(snapshot, comparison);
  const rows = snapshot.observations.map(row => `<tr data-dimension="${htmlEscape(row.dimension)}"><td>${htmlEscape(row.entity)}</td><td>${htmlEscape(row.dimension)}<small>${htmlEscape(row.metric)}</small></td><td>${htmlEscape(display(row))}<small>${htmlEscape(row.unit)}</small></td><td>${htmlEscape(row.kind)}<small>${htmlEscape(row.status)}</small></td><td>${htmlEscape(stable(row.context))}</td><td>${htmlEscape(row.observedAt)}</td><td><a href="${htmlEscape(row.source.url)}" rel="noopener noreferrer">Source</a><small>${htmlEscape(row.source.locator)}</small></td></tr>`).join('');
  const changes = comparison?.changes.map(item => `<li><strong>${htmlEscape(item.entity)} · ${htmlEscape(item.metric)}</strong><br>${htmlEscape(changeText(item))} · ${htmlEscape(item.kind)}<br><a href="${htmlEscape(item.before.source.url)}">Before</a> (${htmlEscape(item.before.observedAt)}) → <a href="${htmlEscape(item.after.source.url)}">After</a> (${htmlEscape(item.after.observedAt)})</li>`).join('') ?? '';
  const health = comparison?.health.map(item => `<li>${htmlEscape(item.entity)} · ${htmlEscape(item.metric)}: ${htmlEscape(item.reason)}</li>`).join('') ?? '';
  const label = snapshot.fixture ? 'Synthetic demonstration · invented fixture values, not live research' : 'Research snapshot · cited observations with explicit limits';
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'"><title>Competition Analyzer &amp; Tracker — ${htmlEscape(snapshot.projectId)}</title><style>body{font:16px/1.55 system-ui,sans-serif;background:#f3f5fa;color:#142033;margin:0}main{max-width:1280px;margin:auto;padding:48px 28px}header{background:#182454;color:#fff;padding:36px;border-radius:20px}h1{font-size:clamp(26px,4vw,42px);line-height:1.1;margin:8px 0 20px}.eyebrow{color:#71e8da;font-weight:700;letter-spacing:.08em;font-size:13px}.badge{background:#eef2ff;border-left:4px solid #4e5be6;padding:14px 20px;margin:24px 0}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px}.card{background:white;padding:24px;border-radius:16px}h2{font-size:21px}small{display:block;color:#516075;font-size:12px;margin-top:6px;overflow-wrap:anywhere}.table{overflow-x:auto;background:#fff;border-radius:16px}table{width:100%;border-collapse:collapse;min-width:1000px}th,td{padding:16px;text-align:left;border-bottom:1px solid #e1e6ef;vertical-align:top;font-size:14px}th{background:#e9eef8}td:nth-child(5){max-width:200px;overflow-wrap:anywhere}a{color:#334bb4;text-decoration:underline}li{margin-bottom:14px}.limits{margin-top:24px;color:#45556a}a:focus-visible{outline:3px solid #17a99b;outline-offset:3px}@media print{body{background:#fff}main{padding:0}header{color:#142033;background:#eee}.table{overflow:visible}table{min-width:0}th,td{padding:8px;font-size:10px}}</style></head><body><main><header><div class="eyebrow">COMPETITIVE INTELLIGENCE</div><h1>Competition Analyzer &amp; Tracker</h1><p>${htmlEscape(snapshot.projectId)} · ${htmlEscape(snapshot.createdAt)}</p><p>${htmlEscape(summary(snapshot, comparison))}</p></header><div class="badge">${htmlEscape(label)}</div><div class="grid"><section class="card"><h2>Comparable changes</h2>${comparison ? `<ul>${changes || '<li>No comparable change crossed the selected thresholds.</li>'}</ul>` : '<p>Baseline snapshot. Refresh the same panel to compare changes.</p>'}</section><section class="card"><h2>Source health and comparability</h2><ul>${health || '<li>No source-health or panel-change issue in this comparison.</li>'}</ul><p>${comparison ? `${comparison.added.length} baseline additions; ${comparison.suppressed} numeric changes below threshold.` : 'Source availability is recorded for every observation below.'}</p></section></div><h2>Evidence ledger</h2><div class="table"><table><thead><tr><th>Competitor</th><th>Dimension / metric</th><th>Value / unit</th><th>Kind / status</th><th>Comparable context</th><th>Observed at</th><th>Evidence</th></tr></thead><tbody>${rows}</tbody></table></div><section class="limits"><h2>Research limits</h2><p>Missing data stays unknown. Different providers, currencies, billing periods, variants, audiences, locations, devices or collection scope require a new baseline. Estimates remain estimates. Vendor claims describe advertised capabilities. Hypotheses need validation. This report has no external assets or scripts and activates no recurring collection.</p></section></main></body></html>`;
}

export async function writeNewFile(path, contents) {
  const handle = await open(path, 'wx', 0o600);
  try { await handle.writeFile(contents, 'utf8'); } finally { await handle.close(); }
}
async function readJson(path) {
  const handle = await open(path, 'r');
  try {
    const stat = await handle.stat();
    if (!stat.isFile() || stat.size > MAX_BYTES) throw new Error('Input must be a JSON file smaller than 8 MiB');
    return JSON.parse(await handle.readFile('utf8'));
  } finally { await handle.close(); }
}
async function main(args) {
  const [command, ...paths] = args;
  if (command === 'validate' && paths.length === 1) { validateSnapshot(await readJson(paths[0])); process.stdout.write('Snapshot valid\n'); return; }
  if (command === 'watchlist' && paths.length === 1) { validateWatchlist(await readJson(paths[0])); process.stdout.write('Watchlist valid; no schedule activated\n'); return; }
  if (command === 'diff' && [3, 4].includes(paths.length)) {
    const result = compareSnapshots(await readJson(paths[0]), await readJson(paths[1]), paths[3] ? await readJson(paths[3]) : {});
    await writeNewFile(paths[2], JSON.stringify(result, null, 2) + '\n'); process.stdout.write('Comparison saved\n'); return;
  }
  if (command === 'report' && [2, 3, 4].includes(paths.length)) {
    const snapshot = await readJson(paths[0]);
    const comparison = paths[2] ? compareSnapshots(await readJson(paths[2]), snapshot, paths[3] ? await readJson(paths[3]) : {}) : null;
    if (!/\.(?:html|md)$/i.test(paths[1])) throw new Error('Report output must end in .html or .md');
    await writeNewFile(paths[1], paths[1].toLowerCase().endsWith('.html') ? renderHtml(snapshot, comparison) : renderMarkdown(snapshot, comparison));
    process.stdout.write('Report saved\n'); return;
  }
  throw new Error('Usage: node evidence.mjs validate SNAPSHOT | watchlist WATCHLIST | diff BEFORE AFTER NEW_OUTPUT [THRESHOLDS] | report SNAPSHOT NEW_OUTPUT.html|.md [BEFORE [THRESHOLDS]]');
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main(process.argv.slice(2)).catch(error => {
    const message = error instanceof SyntaxError ? 'Invalid JSON' : error.code === 'EEXIST' ? 'Output already exists; choose a new path' : error.code ? 'File could not be read or written; check access and paths' : error.message;
    process.stderr.write(`Evidence validation: ${message}\n`); process.exitCode = 1;
  });
}
