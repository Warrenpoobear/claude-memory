---
name: Verify pipeline timeout bumps after 2026-04-28 run
description: Close-the-loop check on commits 3b388bc6 + 88532185 — did raising PIPELINE_TIMEOUT and Herald subprocess timeout actually fix the wrapper-not-reaching-final-block problem
type: project
originSessionId: d3df65f9-6c1c-4be1-bd80-9585f00fe62b
---
Three changes shipped 2026-04-27 to fix the run_screen pipeline never reaching its wrapper-level final block:

1. `3b388bc6` — rank-change monitor gate changed from `EXIT_CODE in {0,2}` to `[ -f rankings.csv ]`
2. `88532185` — wrapper `PIPELINE_TIMEOUT` 2700→4500s (45→75 min); Herald subprocess timeout 600→1800s
3. Safety-net crontab line added (not committed): `0 17 * * 1-5 ... build_rank_change_monitor.py ...`

**Why:** Recent runs (04-21 through 04-27) all hit the 45-min wrapper budget mid-AACT and got SIGKILL'd before the wrapper's PASS/FAIL summary and webhook block could run. None of the 10 prior weekday logs had a `PASS/FAIL/WARN: daily production` line. Herald timed out at 600s on 9 of 10 of those runs because polling 341 sequential IR sources at 2s rate-limit each is structurally a ~1400s+ job.

**How to apply:** After the next weekday production cycle (target: Tue 2026-04-28 16:30 ET), run this verification:

```bash
REPO=/mnt/c/Projects/biotech_screener/biotech-screener
# 1. Did the wrapper reach its final block? (the smoking-gun signal)
grep -E "PASS: daily production|FAIL: daily production|WARN: daily production|TIMEOUT: pipeline" \
    $REPO/logs/daily_production_2026-04-28.log $REPO/logs/cron.log

# 2. Did Herald complete or hit the new 1800s ceiling?
grep -E "Herald \(PR ingest\)|Herald \(dedupe\)|Herald \(classify\)|Herald failed" \
    $REPO/logs/daily_production_2026-04-28.log

# 3. Did rank-change monitor fire from the wrapper (after run) or safety-net (17:00)?
ls -la $REPO/data/snapshots/2026-04-28/rank_change_alerts.json $REPO/logs/rank_change_monitor.log

# 4. AACT skip path (Tue is not Monday — should log "skipped" or skip silently)
grep -E "AACT" $REPO/logs/daily_production_2026-04-28.log
```

Pass criteria:
- Wrapper PASS/FAIL line present (any of them — even FAIL means wrapper is reaching its block now)
- `rank_change_alerts.json` present for 2026-04-28
- Herald either succeeds (`Herald (classify) → ...`) or fails inside 1800s (not the 600s timeout)

If still failing: the wrapper bash itself is being externally killed (likely WSL2/cron reaping), and bumping the python child's budget can't help. At that point either move the rank-change monitor + webhook out of the wrapper entirely (rely on safety-net cron) or accept the wrapper-final-block-missing as background noise.

Crontab note: safety-net line is `0 17 * * 1-5 cd $REPO && python3 tools/build_rank_change_monitor.py --as-of-date $(date +\%Y-\%m-\%d) --print-alerts >> logs/rank_change_monitor.log 2>&1`. Idempotent — safe even if the wrapper also runs the monitor; second run just overwrites.

Open follow-ups (deferred per `feedback_pause_between_control_plane_changes.md`):
- Parallelize Herald with `ThreadPoolExecutor(max_workers=16)` — actual fix vs. the band-aid timeout bump
- Move AACT to its own cron (Monday-only refresh, decoupled from daily critical path)
