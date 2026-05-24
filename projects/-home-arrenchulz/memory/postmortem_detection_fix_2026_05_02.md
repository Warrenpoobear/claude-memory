---
name: Postmortem agent detection fix (2026-05-02)
description: Root cause and fix for postmortem agent silence April 3 → May 2; 80 backfilled artifacts; cron wired.
type: project
status: shipped
related: [calibration_evidence_threshold_false_positive_2026_05_02, openclaw_fleet]
originSessionId: c593b8f4-379c-4aaf-b9fa-591f940520fa
---
# Postmortem agent — detection logic repaired 2026-05-02

## Symptom (observed via openclaw-monitor)
- `artifacts/postmortem/` had no entries past 2026-03-30 (15-day "STALE" gap)
- `calibration_evidence` exiting NO_DATA every Friday since 2026-04-17

## Root causes (compounding, three layers)
1. **HEARTBEAT.md heuristic broken.** Agent was instructed to scan latest snapshot for `catalyst_days <= 0`. The screener resets `catalyst_days` to the *next* event the moment a date passes, so this check **never** matched anything in normal operation.
2. **Cron only ran HEARTBEAT, never the script.** `35 18 * * 1-5` invoked `tools/run_agent_direct.py --agent postmortem --message HEARTBEAT`. The actual write path `agents/postmortem/scripts/run_postmortem.py` was never invoked on schedule.
3. **`run_postmortem.py` deduped on ticker, not (ticker, event_date).** Even when run manually, BIIB / CATX / INCY / REGN April resolutions were silently filtered because those tickers had March postmortems.

## Fix
- `agents/postmortem/scripts/run_postmortem.py`:
  - `existing_postmortems()` returns `set[(ticker, event_date)]` instead of `dict[ticker -> date]`
  - `candidates` keyed on `(ticker, event_date)`
  - New `detect_snapshot_transitions()` replaces dead `catalyst_days <= 0` fallback — tracks `next_catalyst_date` advancing forward across consecutive snapshots (canonical resolution signal)
  - Future events filtered (`event_date > today` skipped)
- `HEARTBEAT.md` + `AGENTS.md` updated with detection note and instructed to invoke the script
- Cron added: `33 18 * * 1-5` runs `run_postmortem.py` directly, 2 min before the heartbeat agent so the heartbeat reports on what the script wrote

## Backfill (2026-05-02 manual run)
- 80 new postmortems written, 19 already existed → 100 total on disk
- 1 gap: OCS@2026-04-01 (no price data, likely delisted)
- 55 skipped pending T+3 — entire 04-30 + 05-01 PDUFA/readout cluster (AXSM, ARVN, BIIB, AZN ADCOM, ANAB, BNTX, CMPS, IRON + readouts). These resolve naturally next week as price_history.csv catches up.

## Validation due 2026-05-08 19:00 ET (Friday)
- `calibration_evidence` should NOT exit NO_DATA — postmortems now exist for April resolved events
- If still NO_DATA, real bug is in calibration_evidence's filter (not in postmortem detection)

## Caveats noted during backfill
- ARVN PDUFA in resolution records is dated 2026-04-30 but per memory the actual PDUFA was moved to 2026-06-05 via BPIQ + IR on 2026-04-26. Same for BIIB (real date 2026-05-24). The resolution records may have stale dates that downstream postmortems will reflect — separate issue at the catalyst-source layer, not detection.
