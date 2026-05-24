---
name: Snapshot integrity verifier (Tier 1) — approved, gated on 2026-04-28 verification
description: Approved Tier 1 build plan for tools/verify_snapshot_integrity.py — read-only consumer of existing manifests; do not build until pause policy clears
type: project
originSessionId: d3df65f9-6c1c-4be1-bd80-9585f00fe62b
---
**Status**: approved by user 2026-04-27. **Do not build until** the 2026-04-28 production verification passes per `policy_pause_until_2026_04_28_verification.md`. Resumption order is: (a) verify the wrapper finishes cleanly, (b) review last cycle's diagnostic outputs, (c) only then build this.

**Rename note**: this is *integrity verification*, not *replay*. "Replay" is reserved for actually rerunning the pipeline (Tier 2/3). Tier 1 only consumes existing manifests; no rerun, no API calls, no production mutation.

## Build (when allowed)

`tools/verify_snapshot_integrity.py` — read-only verifier, ~80 LOC + tests.

**Inputs (read only):**
- `data/snapshots/{as_of_date}/rankings.csv`
- `data/snapshots/{as_of_date}/rankings.csv.sha256`
- `data/snapshots/{as_of_date}/inputs_manifest.json` (18 dep entries with sha256/path/load_site/required)
- `data/snapshots/{as_of_date}/run_manifest.json` (git block, ruleset, row counts)

**Checks:**
1. Re-hash rankings.csv → compare to recorded sha256
2. Re-hash every dependency in inputs_manifest.json → compare to recorded sha256
3. Report any required input missing
4. Report any sha mismatch (ranking or dep)
5. Compare current `git rev-parse HEAD` to `run_manifest.git.sha` (if present)
6. Verify both manifests are parseable JSON

**Severity:**
- PASS: all hashes match, all required inputs present, git SHA matches (or unavailable)
- WARN: git HEAD differs but file hashes match (code drifted, snapshot didn't)
- FAIL: rankings.csv hash mismatch, required input missing, or any dep hash mismatch

**Outputs:**
- `data/snapshots/{as_of_date}/snapshot_integrity_verification.json`
- `data/snapshots/{as_of_date}/snapshot_integrity_verification.md`

**Tests** (synthetic-fixture, mirroring the integrity-report test pattern):
- clean manifest passes
- rankings.csv hash mismatch → FAIL
- required dependency missing → FAIL
- optional dependency missing → WARN
- git SHA mismatch → WARN
- malformed manifest → FAIL gracefully (caught, not raised)

**Do NOT** wire into `cron_daily_production.sh` until user explicitly asks. This is an audit tool, not a daily diagnostic.

## Spec only — Tier 2 pseudo-replay

`specs/changes/spec_067_snapshot_replay_verifier.md` — design document, no code.

Spec must cover:
- Pseudo-replay: rerun `run_daily_production.py --as-of-date $DATE` into a staging dir, compare outputs
- Compare layers: byte-identical → row-set identical → top-30 set match → top-30 ordered match → cohort set match → numeric column drift within ε
- Reuses `diff_rankings_blast_radius.py` for the diff render
- **Live API drift caveat**: explicitly label this as pseudo-replay, not true PIT replay; yfinance/Massive/EDGAR/NCBI can return different bytes today than at original snapshot time
- Useful only within hours-to-days of snapshot creation, before caches drift
- "Future work: Tier 3" — short section noting the frozen-input replay path requires invasive shims at every read site, deferred until concrete failure mode demands it

**Do NOT build Tier 2.** Spec only.
**Do NOT scope Tier 3 beyond the short future-work paragraph.**

## When engineering resumes

The build prompt is essentially:
> Build `tools/verify_snapshot_integrity.py` per the plan in
> `plan_snapshot_integrity_verifier_tier1.md`. No rerun, no API calls,
> no model changes. Write spec_067 for Tier 2 pseudo-replay (no code).
> Skip Tier 3 entirely.
