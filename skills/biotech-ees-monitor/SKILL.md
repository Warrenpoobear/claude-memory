---
name: biotech-ees-monitor
description: |
  Run the EES v3 raw_veto_core shadow monitor for a given date. Use when the user says "run the EES monitor", "EES shadow monitor", "run EES", "check EES gates", "EES veto alpha", or similar. Reads today's status card and parses gate progress. Observation-only — non-blocking on production model.
allowed-tools:
  - Bash(python3 *)
  - Bash(ls *)
  - Bash(cat *)
---

# Biotech EES v3 Monitor

Run the EES v3 raw_veto_core daily shadow monitor.

## Context

- **Script**: `scripts/research/ees_v3_raw_veto_shadow_card.py`
- **Lead policy**: `raw_veto_core` (IC 0.064, t=2.36, LATE +7.1% excess vs XBI)
- **Gate**: 20 completed 20d observations before freeze-lift review
- **20d gate as of 2026-06-25**: MET (35/20) — observation continues
- **Cron**: `ees3a1b2c3d4e5` — weekdays 17:50 ET (`no_agent` script, no LLM session)

## Steps

### 1 — Determine as-of date
Use today's date unless user specifies another. Format: YYYY-MM-DD.

### 2 — Read today's status card
```bash
REPO=/mnt/c/Projects/biotech_screener/biotech-screener
DATE_US=$(date +%Y_%m_%d)
cat "$REPO/artifacts/readiness/EES_V3_RAW_VETO_SHADOW_STATUS_${DATE_US}.md" 2>/dev/null || \
  ls -t "$REPO/artifacts/readiness/EES_V3_RAW_VETO_SHADOW_STATUS_"*.md 2>/dev/null | head -1 | xargs cat
```

### 3 — Parse gate and alpha from ledger
```bash
python3 - <<'EOF'
import json
from pathlib import Path

REPO = Path('/mnt/c/Projects/biotech_screener/biotech-screener')
LEDGER = REPO / 'artifacts/shadow/ees_v3_raw_veto_shadow_ledger.jsonl'

if not LEDGER.exists():
    print("Ledger not found:", LEDGER); exit(1)

rows = [json.loads(l) for l in LEDGER.read_text().splitlines() if l.strip()]
# settled = fwd_20d_settled True AND had actual vetoes (n_vetoed > 0)
settled_20d = [r for r in rows if r.get('fwd_20d_settled') is True and r.get('n_vetoed', 0) > 0]
gate_obs = len(settled_20d)
gate_met = gate_obs >= 20
print(f"Ledger rows: {len(rows)}")
print(f"20d gate: {gate_obs}/20 [{'MET' if gate_met else 'UNMET'}]")

# Values stored as percentage points (7.4 = 7.4%) — do NOT multiply by 100
alpha    = [r['fwd_20d_veto_alpha']      for r in settled_20d if r.get('fwd_20d_veto_alpha')      is not None]
veto_exc = [r['fwd_20d_vetoed_excess']   for r in settled_20d if r.get('fwd_20d_vetoed_excess')   is not None]
sel_exc  = [r['fwd_20d_selected_excess'] for r in settled_20d if r.get('fwd_20d_selected_excess') is not None]
if alpha:
    print(f"Mean 20d vetoed excess:   {sum(veto_exc)/len(veto_exc):.1f}%")
    print(f"Mean 20d selected excess: {sum(sel_exc)/len(sel_exc):.1f}%")
    print(f"Cumulative veto alpha:    {sum(alpha)/len(alpha):.1f}pp")
    print(f"Alpha+ rate: {sum(1 for a in alpha if a > 0)/len(alpha)*100:.1f}%")
EOF
```

### 4 — Run the script (if card is missing or stale)
```bash
cd /mnt/c/Projects/biotech_screener/biotech-screener
python3 scripts/research/ees_v3_raw_veto_shadow_card.py --as-of-date YYYY-MM-DD 2>&1 | tee -a logs/ees_v3_veto_monitor.log
```

### 5 — Report
```
EES v3 SHADOW MONITOR — YYYY-MM-DD

Snapshot:    YYYY-MM-DD__pre_<hash>
Vetoed:      N — [TICKER, ...]
Selected:    N

20d gate:    N/20 [MET / UNMET]
Veto alpha:  X.Xpp  (veto excess minus selected excess, 20d)

GOVERNANCE: DIAGNOSTIC_ONLY | NO_PRODUCTION_CHANGES | FREEZE_ACTIVE
Gate MET ≠ freeze lifted — operator memo required before any production integration.
```

## Pitfalls

- **"No snapshot found"**: Script falls back to prior trading day if today's production snapshot isn't ready (runs 5:50 PM, production ~4:30 PM). Normal — check log for "Using snapshot:".
- **Gate MET ≠ action**: 20d gate met means sample is adequate for review, not that the freeze is lifted. Requires explicit operator instruction.
- **EES v2 vs v3**: Old script is `ees_v2_phase3_shadow_monitor.py` (retired). Old ledger is `ees_v2_phase3_shadow_ledger.jsonl`. Use only v3 paths.
- **Cron is no_agent**: The Hermes cron job runs the shell wrapper directly — no LLM session is created. Check the log file for run results, not Hermes session output.

## Session-end learning

After this skill runs, if anything surprised you, log a learning per `~/.claude/docs/session-end-learning.md` (Pattern-Key `SKILL_BIOTECH_EES_MONITOR_{description}`).
