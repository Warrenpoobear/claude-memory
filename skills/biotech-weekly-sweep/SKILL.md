---
name: biotech-weekly-sweep
description: |
  Run the weekly signal regime sweep for the biotech screener model. Use when the user says "weekly sweep", "run the regime sweep", "signal regime check", "weekly signal check", or similar. Finds and runs the weekly sweep script against the latest snapshot, parses the output for IC/hit-rate verdicts, and reports HEALTHY/WARN/ALERT per signal.
allowed-tools:
  - Bash(python3 *)
  - Bash(ls *)
  - Bash(find *)
  - Bash(cat *)
---

# Biotech Weekly Sweep

Run the weekly signal regime sweep against the latest snapshot.

## Steps

### 1 — Find the sweep script
```bash
find /mnt/c/Projects/biotech_screener/biotech-screener/scripts -name "*weekly*sweep*" -o -name "*signal*regime*" 2>/dev/null
find /mnt/c/Projects/biotech_screener/biotech-screener/tools -name "*weekly*" -o -name "*regime*" 2>/dev/null
```

### 2 — Determine latest snapshot date
```bash
ls /mnt/c/Projects/biotech_screener/biotech-screener/data/snapshots/ | sort | tail -1
```

### 3 — Run the sweep
```bash
cd /mnt/c/Projects/biotech_screener/biotech-screener && source .env && \
python3 <sweep_script_path> --date YYYY-MM-DD 2>&1
```
If script takes a flag like `--snapshot-date` or `--as-of`, adjust accordingly.

### 4 — Parse output for IC verdicts
```bash
python3 - <<'EOF'
import json, glob, os

REPO = '/mnt/c/Projects/biotech_screener/biotech-screener'
# Look for sweep output artifact
candidates = sorted(glob.glob(f'{REPO}/artifacts/**/*regime*sweep*.json', recursive=True) +
                    glob.glob(f'{REPO}/artifacts/**/*weekly*sweep*.json', recursive=True) +
                    glob.glob(f'{REPO}/artifacts/**/*signal_regime*.json', recursive=True))
if candidates:
    data = json.load(open(candidates[-1]))
    print(json.dumps(data, indent=2))
else:
    print("No sweep artifact found — check script stdout above")
EOF
```

### 5 — Report
```
WEEKLY SIGNAL REGIME SWEEP — YYYY-MM-DD

Signal: score_rank_pct
  mean_ic:   +X.XXXX  [HEALTHY / WARN / ALERT]
  hit_rate:  XX.X%
  N dates:   NN

Signal: inst_delta_z  (monitor-grade)
  mean_ic:   +X.XXXX  [status]

VERDICT: HEALTHY ✓ / ⚠️ WARN / 🚨 ALERT

Reference: WEEKLY_SIGNAL_REGIME_SWEEP_YYYY-MM-DD.md
```

## Thresholds
- HEALTHY: mean_ic ≥ +0.03, hit_rate ≥ 50%
- WARN: mean_ic 0.00–0.03 or hit_rate 45–50%
- ALERT: mean_ic < 0.00 → notify, do not open new positions
- Last known healthy reading: +0.0432 (2026-06-24)

## Session-end learning

After completing this skill's task, if you encountered an unexpected behavior, constraint, API response, or workflow edge case, log it:

```
[LRN-YYYYMMDD-NNN]
Pattern-Key: SKILL_BIOTECH_WEEKLY_SWEEP_{description}
Area: hermes_ops | data_pipeline | research | portfolio
Promotion-lane: skill | none
Recurrence-Count: 1
Context: <one line — what happened>
Rule: <one line — what to do differently>
Suggested-Action: <patch to this SKILL.md, or none>
```

Recurrence ≥ 3 in 7 days → propose a patch to this `SKILL.md` via `tools/pattern_to_skillpatch.py`. Full protocol: see `self-improving` skill.
