---
name: biotech-ic-check
description: |
  Check the latest signal IC health for the biotech screener model. Use when the user says "IC check", "how's the IC", "is the signal healthy", "check IC health", or similar. Reads the latest IC dashboard or signal regime sweep artifact and reports mean_ic, hit_rate, N dates, and HEALTHY/WARN/ALERT verdict for score_rank_pct (primary selector signal).
allowed-tools:
  - Bash(python3 *)
  - Bash(ls *)
  - Bash(find *)
  - Bash(cat *)
---

# Biotech IC Check

Read latest signal IC health from stored artifacts.

## Steps

### 1 — Find latest IC artifact
```bash
find /mnt/c/Projects/biotech_screener/biotech-screener/artifacts \
  -name "*.json" \( -path "*/ic_dashboard/*" -o -path "*/signal_regime/*" -o -name "*ic*" -o -name "*regime*" \) \
  -newer /mnt/c/Projects/biotech_screener/biotech-screener/artifacts 2>/dev/null \
  | sort | tail -10
```

### 2 — Parse and report
```bash
python3 - <<'EOF'
import json, glob, os

REPO = '/mnt/c/Projects/biotech_screener/biotech-screener'

# Try multiple artifact locations
candidates = (
    sorted(glob.glob(f'{REPO}/artifacts/ic_dashboard/*.json')) +
    sorted(glob.glob(f'{REPO}/artifacts/signal_regime/*.json')) +
    sorted(glob.glob(f'{REPO}/artifacts/*ic*.json')) +
    sorted(glob.glob(f'{REPO}/artifacts/**/*ic*.json', recursive=True))
)

if not candidates:
    print("No IC artifact found. Try running biotech-weekly-sweep first.")
    exit(0)

latest = candidates[-1]
print(f"Source: {latest}")
data = json.load(open(latest))
print(json.dumps(data, indent=2))
EOF
```

### 3 — Interpret results
For `score_rank_pct` (primary selector signal):
| Metric | HEALTHY | WARN | ALERT |
|--------|---------|------|-------|
| mean_ic | ≥ +0.03 | 0.00–0.03 | < 0.00 |
| hit_rate | ≥ 50% | 45–50% | < 45% |
| N dates | ≥ 20 | 10–20 | < 10 (insufficient) |

For `inst_delta_z` (secondary, zeroed in v1.14.0):
- Monitor-grade only; WEAK is non-blocking

### 4 — Report
```
IC HEALTH CHECK — YYYY-MM-DD

Signal: score_rank_pct
  mean_ic:   +X.XXXX  [HEALTHY / WARN / ALERT]
  hit_rate:  XX.X%
  N dates:   NN
  Verdict:   HEALTHY ✓ / ⚠️ WARN — monitor / 🚨 ALERT — do not open new positions

Signal: inst_delta_z  (monitor-grade, zeroed in production)
  mean_ic:   +X.XXXX  [status]
  Verdict:   non-blocking

OVERALL MODEL GATE:
  [PASS — trading permitted / WARN — monitor / BLOCKED — review before trading]
```

## Thresholds (from governance)
- HEALTHY: score_rank_pct mean_ic ≥ +0.03 (confirmed 2026-06-24: +0.0432)
- ALERT trigger: mean_ic < 0.00 → do not open new positions; review model
- Evidence basis: forward-only (no pre-PIT backtest claims)

## Session-end learning

After completing this skill's task, if you encountered an unexpected behavior, constraint, API response, or workflow edge case, log it:

```
[LRN-YYYYMMDD-NNN]
Pattern-Key: SKILL_BIOTECH_IC_CHECK_{description}
Area: hermes_ops | data_pipeline | research | portfolio
Promotion-lane: skill | none
Recurrence-Count: 1
Context: <one line — what happened>
Rule: <one line — what to do differently>
Suggested-Action: <patch to this SKILL.md, or none>
```

Recurrence ≥ 3 in 7 days → propose a patch to this `SKILL.md` via `tools/pattern_to_skillpatch.py`. Full protocol: see `self-improving` skill.
