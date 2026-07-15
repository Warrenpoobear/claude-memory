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

Read latest signal IC health from the IC dashboard artifacts.

**Scope — what this reads and what it does not:** this skill reads the **IC dashboard**
(`artifacts/ic_dashboard/`), which monitors `score_rank_pct` and `inst_delta_z` at a 20d
horizon over a 60-date **daily-overlapping** window. It is a signal-health monitor only.
It is NOT: the daily forward_eval gate (negated `actionable_rank`, eligible-scoped,
de-overlapped, WARN-only), NOT Spec-100 `final_score` ranker IC, and NOT the DEM
forward-shadow mandate (SM-20260629-001, LIVE 5d-excess windows). A HEALTHY reading here
is not mandate progress and cannot clear any promotion gate.

## Steps

### 1 — Find latest IC artifact
```bash
ls /mnt/c/Projects/biotech_screener/biotech-screener/artifacts/ic_dashboard/ | sort | tail -5
tail -3 /mnt/c/Projects/biotech_screener/biotech-screener/artifacts/ic_dashboard/history.jsonl
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

After this skill runs, if anything surprised you, log a learning per `~/.claude/docs/session-end-learning.md` (Pattern-Key `SKILL_BIOTECH_IC_CHECK_{description}`).
