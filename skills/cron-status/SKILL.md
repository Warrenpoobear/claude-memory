---
name: cron-status
description: |
  Check WSL crontab and verify recent job execution. Use when the user says "cron status", "did cron run", "check cron jobs", "are the cron jobs running", "cron health", or similar. Lists all registered jobs, checks relevant log files for last-run timestamps, and flags any jobs silent for >24h or >expected interval.
allowed-tools:
  - Bash(crontab *)
  - Bash(ls *)
  - Bash(find *)
  - Bash(tail *)
  - Bash(python3 *)
---

# Cron Status

Check crontab registration and recent execution health.

## Steps

### 1 — List all cron jobs
```bash
crontab -l
```

### 2 — Check log file recency
```bash
python3 - <<'EOF'
import os, glob
from datetime import datetime, timedelta

REPO = '/mnt/c/Projects/biotech_screener/biotech-screener'
log_dir = os.path.join(REPO, 'logs')

if not os.path.exists(log_dir):
    print(f"Log dir not found: {log_dir}")
    exit(0)

now = datetime.now()
logs = glob.glob(os.path.join(log_dir, '*.log'))

print(f"{'Log file':<45} {'Last modified':<22} {'Age'}")
print("-" * 80)
for log in sorted(logs, key=os.path.getmtime, reverse=True):
    mtime = datetime.fromtimestamp(os.path.getmtime(log))
    age = now - mtime
    age_str = f"{int(age.total_seconds()/3600)}h {int((age.total_seconds()%3600)/60)}m"
    flag = " ⚠️" if age > timedelta(hours=26) else ""
    print(f"{os.path.basename(log):<45} {mtime.strftime('%Y-%m-%d %H:%M'):<22} {age_str}{flag}")
EOF
```

### 3 — Tail critical logs
```bash
REPO=/mnt/c/Projects/biotech_screener/biotech-screener
echo "=== cron_daily_production ===" && tail -5 $REPO/logs/cron_daily_production.log 2>/dev/null || echo "not found"
echo "=== cron_evening_catchup ===" && tail -5 $REPO/logs/cron_evening_catchup.log 2>/dev/null || echo "not found"
echo "=== morning_catchup ===" && tail -5 $REPO/logs/morning_catchup.log 2>/dev/null || echo "not found"
```

### 4 — WSL uptime check
```bash
uptime
```
Note: WSL must be running during cron windows (16:00–20:30 ET Mon–Fri). If WSL was suspended, cron jobs in that window were missed.

### 5 — Report
```
CRON STATUS — YYYY-MM-DD HH:MM

REGISTERED JOBS: N
  HH:MM  job_description
  ...

LOG FRESHNESS
  cron_daily_production.log    YYYY-MM-DD HH:MM  (Xh ago)  [OK / ⚠️ STALE]
  cron_evening_catchup.log     YYYY-MM-DD HH:MM  (Xh ago)  [OK / ⚠️ STALE]
  ...

WSL UPTIME: X days, HH:MM

SUMMARY: [All jobs current / N jobs stale — check WSL uptime]
```

## Notes
- WSL required 16:00–20:30 ET Mon–Fri for production cron windows
- Friday calibration_evidence job fires at 19:00 ET — needs WSL up
- Missing log output ≠ cron failure if WSL was sleeping; check uptime first
- 49 jobs registered as of 2026-06-22 (post-reactivation)

## Session-end learning

After completing this skill's task, if you encountered an unexpected behavior, constraint, API response, or workflow edge case, log it:

```
[LRN-YYYYMMDD-NNN]
Pattern-Key: SKILL_CRON_STATUS_{description}
Area: hermes_ops | data_pipeline | research | portfolio
Promotion-lane: skill | none
Recurrence-Count: 1
Context: <one line — what happened>
Rule: <one line — what to do differently>
Suggested-Action: <patch to this SKILL.md, or none>
```

Recurrence ≥ 3 in 7 days → propose a patch to this `SKILL.md` via `tools/pattern_to_skillpatch.py`. Full protocol: see `self-improving` skill.
