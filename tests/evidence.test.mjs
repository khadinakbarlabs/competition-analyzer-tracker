import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { validateSnapshot, compareSnapshots, renderMarkdown, renderHtml, writeNewFile, validateWatchlist } from '../skills/competition-analyzer/scripts/evidence.mjs';

function observation(patch = {}) {
  return { entity: 'rival.example', dimension: 'pricing', metric: 'starter', value: 20, unit: 'USD/seat/month', kind: 'measured', status: 'ok', context: { currency: 'USD', billing: 'monthly', market: 'US', variant: 'one-seat' }, source: { url: 'https://rival.example/pricing', actor: 'khadinakbar/website-seo-spider', runId: 'fixture-1', locator: 'row 0; advertised price verified on public page' }, observedAt: '2026-10-10T12:00:00Z', ...patch };
}
function snapshot(patch = {}) {
  return { schemaVersion: 1, projectId: 'demo', createdAt: '2026-10-10T13:00:00Z', fixture: true, observations: [observation()], ...patch };
}
function later(patch = {}) {
  return snapshot({ createdAt: '2026-10-11T13:00:00Z', observations: [observation({ observedAt: '2026-10-11T12:00:00Z', value: 25, ...patch })] });
}

test('valid evidence is accepted without changing its input', () => {
  const input = snapshot(); const copy = structuredClone(input);
  assert.deepEqual(validateSnapshot(input), input); assert.deepEqual(input, copy);
});
test('comparable prices include both sources and correct percentage', () => {
  const result = compareSnapshots(snapshot(), later(), { percent: 5 });
  assert.equal(result.changes.length, 1); assert.equal(result.changes[0].percentChange, 25);
  assert.equal(result.changes[0].before.source.url, 'https://rival.example/pricing');
});
test('small numeric fluctuations are suppressed', () => {
  const result = compareSnapshots(snapshot(), later({ value: 20.2 }), { percent: 5 });
  assert.equal(result.changes.length, 0); assert.equal(result.suppressed, 1);
});
test('zero baseline does not fabricate a percentage', () => {
  const result = compareSnapshots(snapshot({ observations: [observation({ value: 0 })] }), later());
  assert.equal(result.changes[0].percentChange, null);
});
test('a different currency creates a non-comparable observation', () => {
  const result = compareSnapshots(snapshot(), later({ context: { currency: 'EUR', billing: 'monthly', market: 'US', variant: 'one-seat' }, unit: 'EUR/seat/month' }));
  assert.equal(result.changes.length, 0); assert.equal(result.health.some(x => x.reason === 'context_changed'), true);
});
test('provider or unit changes cannot be reported as performance movement', () => {
  for (const patch of [{ unit: 'USD/year' }, { context: { provider: 'new-index' } }, { kind: 'estimated' }]) {
    assert.equal(compareSnapshots(snapshot(), later(patch)).changes.length, 0);
  }
});
test('failed, partial, and missing sources do not imply removed offers', () => {
  for (const status of ['failed', 'partial', 'unknown', 'valid_empty', 'unavailable']) {
    const result = compareSnapshots(snapshot(), later({ status, value: null }));
    assert.equal(result.changes.length, 0); assert.ok(result.health.length > 0);
  }
  const result = compareSnapshots(snapshot(), snapshot({ createdAt: '2026-10-11T13:00:00Z', observations: [] }));
  assert.equal(result.changes.length, 0); assert.equal(result.health[0].reason, 'not_observed');
});
test('new observations are labelled baseline additions, not historical changes', () => {
  const result = compareSnapshots(snapshot({ observations: [] }), later());
  assert.equal(result.changes.length, 0); assert.equal(result.added.length, 1);
});
test('equal content with whitespace changes is suppressed', () => {
  const result = compareSnapshots(snapshot({ observations: [observation({ value: 'Fast   exports' })] }), later({ value: 'Fast exports' }));
  assert.equal(result.changes.length, 0);
});
test('snapshots from different projects and reversed timestamps are rejected', () => {
  assert.throws(() => compareSnapshots(snapshot(), laterSnapshot('other')), /project/i);
  assert.throws(() => compareSnapshots(later(), snapshot()), /chronolog/i);
});
function laterSnapshot(projectId) { return { ...later(), projectId }; }
test('duplicate metric identities and future observations are rejected', () => {
  assert.throws(() => validateSnapshot(snapshot({ observations: [observation(), observation()] })), /duplicate/i);
  assert.throws(() => validateSnapshot(snapshot({ observations: [observation({ observedAt: '2027-01-01T00:00:00Z' })] })), /after/i);
});
test('invalid dates and fabricated values are rejected', () => {
  assert.throws(() => validateSnapshot(snapshot({ createdAt: '2026-02-30T12:00:00Z' })), /date|timestamp/i);
  assert.throws(() => validateSnapshot(snapshot({ observations: [observation({ value: Infinity })] })), /finite/i);
  assert.throws(() => validateSnapshot(snapshot({ observations: [observation({ status: 'unknown', value: 0 })] })), /null/i);
});
test('hypotheses do not trigger observed change alerts', () => {
  const before = snapshot({ observations: [observation({ kind: 'hypothesis' })] });
  assert.equal(compareSnapshots(before, later({ kind: 'hypothesis' })).changes.length, 0);
});
test('unsafe URLs and credential-bearing sources are rejected', () => {
  for (const url of ['javascript:alert(1)', 'https://user:pass@rival.example', 'https://rival.example/?token=secret', 'http://localhost/admin', 'https://127.0.0.1/', 'https://[::1]/']) {
    assert.throws(() => validateSnapshot(snapshot({ observations: [observation({ source: { url } })] })), /url|source|credential|public/i);
  }
});
test('unknown or credential-like fields cannot enter portable reports', () => {
  assert.throws(() => validateSnapshot({ ...snapshot(), apiKey: 'secret' }), /field/i);
  assert.throws(() => validateSnapshot(snapshot({ observations: [observation({ context: { password: 'secret' } })] })), /field|credential/i);
});
test('reports escape malicious HTML and show the synthetic fixture label', () => {
  const malicious = snapshot({ observations: [observation({ value: '<script>alert(1)</script>', entity: '<img src=x onerror=alert(1)>' })] });
  const html = renderHtml(malicious);
  assert.equal(html.includes('<script>'), false); assert.equal(html.includes('<img'), false);
  assert.ok(html.includes('&lt;script&gt;')); assert.ok(html.includes('Synthetic demonstration'));
  assert.ok(renderMarkdown(malicious).includes('Synthetic demonstration'));
});
test('reports retain unknowns, estimates, observation dates and citations', () => {
  const report = renderMarkdown(snapshot({ observations: [observation({ kind: 'estimated' }), observation({ metric: 'enterprise', status: 'unknown', value: null })] }));
  for (const word of ['estimated', 'unknown', '2026-10-10', 'https://rival.example/pricing']) assert.ok(report.includes(word));
});
test('Markdown source links preserve existing URL percent encoding', () => {
  const url = 'https://rival.example/pricing?plan=Team%20Plus';
  const input = snapshot({ observations: [observation({ source: { url, locator: 'Team Plus row' } })] });
  const markdown = renderMarkdown(input);
  assert.ok(markdown.includes(url)); assert.equal(markdown.includes('Team%2520Plus'), false);
});
test('invalid threshold arguments are rejected', () => {
  for (const percent of [-1, Infinity, '5']) assert.throws(() => compareSnapshots(snapshot(), later(), { percent }), /threshold/i);
  assert.throws(() => compareSnapshots(snapshot(), later(), { percentages: 5 }), /field|threshold/i);
});
test('stale observations and changing scalar types require review', () => {
  assert.equal(compareSnapshots(snapshot(), later({ observedAt: '2026-10-10T12:00:00Z' })).health[0].reason, 'stale_observation');
  assert.equal(compareSnapshots(snapshot(), later({ value: '25' })).health[0].reason, 'value_type_changed');
});
test('synthetic fixtures cannot be mixed with real research', () => {
  assert.throws(() => compareSnapshots(snapshot(), { ...later(), fixture: false }), /synthetic/i);
});
test('numeric overflow never becomes a price or percentage alert', () => {
  const before = snapshot({ observations: [observation({ value: -Number.MAX_VALUE })] });
  const result = compareSnapshots(before, later({ value: Number.MAX_VALUE }));
  assert.equal(result.changes.length, 0); assert.equal(result.health[0].reason, 'numeric_range');
  const tiny = snapshot({ observations: [observation({ value: Number.MIN_VALUE })] });
  assert.equal(compareSnapshots(tiny, later()).health[0].reason, 'numeric_range');
});
test('Markdown changes include both dated source links', () => {
  const report = renderMarkdown(later(), compareSnapshots(snapshot(), later()));
  assert.match(report, /\[before\].*2026-10-10/); assert.match(report, /\[after\].*2026-10-11/);
});
test('report rendering rejects unsafe comparison sources', () => {
  const result = compareSnapshots(snapshot(), later());
  result.changes[0].before.source.url = 'javascript:alert(1)';
  assert.throws(() => renderHtml(later(), result), /source|public|url/i);
  assert.throws(() => renderMarkdown(later(), result), /source|public|url/i);
});
test('CLI report and diff apply the same explicit thresholds', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'competition-cli-'));
  try {
    const before = join(dir, 'before.json'), after = join(dir, 'after.json'), thresholds = join(dir, 'thresholds.json');
    await writeFile(before, JSON.stringify(snapshot())); await writeFile(after, JSON.stringify(later()));
    await writeFile(thresholds, JSON.stringify({ percent: 30, absolute: 0 }));
    const helper = fileURLToPath(new URL('../skills/competition-analyzer/scripts/evidence.mjs', import.meta.url));
    execFileSync(process.execPath, [helper, 'diff', before, after, join(dir, 'diff.json'), thresholds]);
    execFileSync(process.execPath, [helper, 'report', after, join(dir, 'report.html'), before, thresholds]);
    assert.equal(JSON.parse(await readFile(join(dir, 'diff.json'), 'utf8')).changes.length, 0);
    assert.match(await readFile(join(dir, 'report.html'), 'utf8'), /1 numeric changes below threshold/);
  } finally { await rm(dir, { recursive: true, force: true }); }
});
test('safe output writes never replace existing files or follow symlinks', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'competition-test-'));
  try {
    const target = join(dir, 'report.html'); await writeNewFile(target, 'first');
    await assert.rejects(writeNewFile(target, 'second'), /exist/i);
    assert.equal(await readFile(target, 'utf8'), 'first');
    await symlink(target, join(dir, 'link.html'));
    await assert.rejects(writeNewFile(join(dir, 'link.html'), 'bad'), /exist|link/i);
  } finally { await rm(dir, { recursive: true, force: true }); }
});
test('watchlists preserve explicit targets and never activate a schedule', () => {
  const watch = { schemaVersion: 1, projectId: 'demo', competitors: [{ id: 'rival', url: 'https://rival.example', relationship: 'direct' }], dimensions: ['pricing', 'positioning'], refresh: { mode: 'manual', timezone: 'Asia/Riyadh' }, thresholds: { percent: 5 }, budget: { perRunUsd: 1, monthlyUsd: 10 } };
  assert.deepEqual(validateWatchlist(watch), watch);
  assert.throws(() => validateWatchlist({ ...watch, refresh: { mode: 'active' } }), /refresh|manual/i);
});
