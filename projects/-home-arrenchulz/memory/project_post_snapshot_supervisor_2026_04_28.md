---
name: Post-snapshot task supervisor (Phase 1 shipped 2026-04-28)
description: Watchdog gate fix + supervisor for AACT/Herald post-snapshot recovery on WSL2 kills; first-week review scheduled 2026-05-05
type: project
originSessionId: 80a49e2e-e457-4bfa-bfbb-338c2fafa501
---
## Watchdog gate fix (`tools/cron_watchdog.sh:39`)

Pre-2026-04-28: gate was `grep "Starting daily production for $TODAY" cron.log` — written by wrapper before any work, so it can't distinguish completed runs from killed-mid-pipeline. Three consecutive runs (04-27 AM, 04-27 PM, 04-28 AM) showed as "Production already ran" while no rankings existed.

Post-fix: gate is `[ -f "$REPO/data/snapshots/$TODAY/rankings.csv" ]` — same signal the wrapper itself uses for its own rank-change monitor. This is the snapshot-promotion marker; pre-snapshot kills correctly trigger re-run.

**Why:** WSL2 sleep/wake reaps the parent of run_daily_production silently — Python timeouts don't fire, no completion line is written. Detection-side fix bypasses it.

**How to apply:** if any future watchdog logic reads "did production complete" — gate on rankings.csv, NOT on cron.log start-line. Same gate is also used by `run_post_snapshot_supervisor.py` to refuse-to-run.

## Post-snapshot task supervisor (Phase 1)

Files:
- `tools/run_post_snapshot_supervisor.py` — task registry, gates, ledger writer
- `tools/run_post_snapshot_supervisor.sh` — env loader, locks, 2400s outer timeout, defers if `.daily_production.lock` PID is alive
- Watchdog hook: invokes supervisor when `rankings.csv` exists AND `artifacts/post_snapshot_done/$TODAY.complete` missing

Phase 1 covers two tasks (the empirically-killed ones):
- **AACT** (Step 5n) — gate: Monday OR latest snapshot >7d old; done predicate: `data/aact/snapshots/{date}/aact_health.json`
- **Herald** (Step 5l.5) — three-stage chain (fetch 1800s → dedupe 120s → classify 300s); done predicate: `data/press_releases/deduped/deduped_{date}.jsonl`

Each task is idempotent: gate checks artifact existence and skips if present. Re-running daily_production after a successful supervisor pass is also a no-op via the same predicate.

Status semantics in ledger (`artifacts/post_snapshot_done/{date}.jsonl`): `ok` (ran, succeeded), `skipped` (artifact already there), `not_applicable` (calendar gate said no — e.g. AACT on a non-weekly day with fresh snapshot), `fail` (subprocess non-zero exit), `timeout` (timed out). Marker file `{date}.complete` written iff all tasks in `{ok, skipped, not_applicable}`.

## Phase 1 verified on first day

2026-04-28 ledger: `aact: not_applicable` (Tue, latest snapshot 7d old — gate False), `herald: ok` (supervisor actually ran the Herald chain because daily_production hadn't reached Step 5l.5 by supervisor invocation time). Marker written. The build saved one production day's Herald output that would otherwise have been lost.

## NOT covered (Phase 2/3)

Phase 2 candidates (other post-snapshot subprocesses): 5b drift, 5o construction_v2_shadow, 5p build_daily_v2_compare, 5q rolling_options_ev_summary, 6 PIT backfill. None observed to fail yet — review 2026-05-05 will tell.

Phase 3 (deferred, may never need): ~23 in-process post-snapshot diagnostic emitters in `run_daily_production.py` between 5a.1 and 5s. Fast and rarely the kill point.

## Review scheduled

`tools/cron_one_shot_2026_05_05.sh` fires 2026-05-05 17:00 ET (crontab `0 17 5 5 *`). Reads supervisor ledgers from 2026-04-28 → 2026-05-05 (6 weekdays), tallies per-task outcomes, cross-checks daily_production logs for non-Phase-1 subprocess timeouts, writes `artifacts/post_snapshot_done/REVIEW_2026-05-05.md`. Read-only; no code changes.

Recommendation rules in the audit:
- ≥2 non-Phase-1 steps faulted → BUILD PHASE 2
- exactly 1 → REVISIT ANOTHER WEEK
- Phase-1 faults but no Phase-2 hits → HOLD, investigate Phase-1 root cause
- All clean → HOLD, re-evaluate after a month or on next observed kill
