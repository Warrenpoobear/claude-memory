---
name: biotech-governance-check
description: |
  Check all biotech model governance gates in one pass. Use when the user says "governance check", "check the gates", "are all gates passing", "governance status", or before any major portfolio action. Read-only. Checks: drawdown vs XBI (account gate), IC health (model gate), h20d re-eval date, 13F Jaccard, EES shadow monitor. Reports PASS/FAIL/WARN for each gate with a clear overall verdict.
allowed-tools:
  - mcp__robinhood-trading__get_portfolio
  - mcp__robinhood-trading__get_equity_quotes
  - Bash(cat *)
  - Bash(ls *)
  - Bash(python3 *)
  - Bash(find *)
---

# Biotech Governance Check

Full governance gate sweep. Read-only.

## Gates to check

### Gate 1 — Drawdown vs XBI (account-level)
```
get_portfolio(account_number="802349084") → equity_value
get_equity_quotes(["XBI"]) → current XBI price
```
Thresholds:
- PASS:  drawdown > −1.0pp
- WARN:  −2.0 < drawdown ≤ −1.0pp  (approaching gate)
- FAIL:  drawdown ≤ −2.0pp  → hard exit required
- CRIT:  drawdown ≤ −5.0pp  → emergency exit required

### Gate 2 — IC health (model-level)
```bash
python3 - <<'EOF'
import json, glob, os
# Look for latest IC dashboard or signal regime sweep artifact
artifacts = sorted(glob.glob('/mnt/c/Projects/biotech_screener/biotech-screener/artifacts/ic_dashboard/*.json')) + \
            sorted(glob.glob('/mnt/c/Projects/biotech_screener/biotech-screener/artifacts/signal_regime/*.json'))
if artifacts:
    data = json.load(open(artifacts[-1]))
    print(json.dumps(data, indent=2))
else:
    print("No IC artifact found — check manually")
EOF
```
Thresholds (score_rank_pct):
- HEALTHY:  mean_ic ≥ +0.03
- WARN:     0.00 ≤ mean_ic < 0.03
- ALERT:    mean_ic < 0.00  → model signal degraded

### Gate 3 — h20d re-evaluation date
Hard gate: 2026-07-01. Check current date vs gate.
- PASS: today < 2026-07-01
- DUE:  today ≥ 2026-07-01 → run quarantine script before next trade

### Gate 4 — 13F Jaccard cohort
```bash
python3 - <<'EOF'
import json, glob
snaps = sorted(glob.glob('/mnt/c/Projects/biotech_screener/biotech-screener/data/snapshots/*/institutional_summary.json'))
if snaps:
    data = json.load(open(snaps[-1]))
    print(f"Jaccard: {data.get('top30_jaccard', 'N/A')}")
    print(f"Coverage: {data.get('signal_coverage_pct', 'N/A')}%")
else:
    print("No institutional summary found")
EOF
```
Thresholds:
- PASS: Jaccard ≥ 0.70
- WARN: 0.40 ≤ Jaccard < 0.70
- FAIL: Jaccard < 0.40  → 13F cohort quarantine

### Gate 5 — EES shadow monitor
```bash
python3 - <<'EOF'
import json, glob
ledgers = sorted(glob.glob('/mnt/c/Projects/biotech_screener/biotech-screener/artifacts/ees_shadow/*.json'))
if ledgers:
    data = json.load(open(ledgers[-1]))
    print(json.dumps(data, indent=2))
else:
    print("No EES shadow ledger found")
EOF
```
Gates (observation only — non-blocking):
- 20 completed 5d exits
- 20 completed 20d exits
Status: OBSERVATION_ONLY until both gates met.

---

## Output format

```
━━━ GOVERNANCE CHECK  YYYY-MM-DD ━━━

Gate 1  Drawdown vs XBI       X.XXpp    [PASS / WARN / FAIL / CRIT]
Gate 2  IC health             +X.XXXX   [HEALTHY / WARN / ALERT]
Gate 3  h20d re-eval          2026-07-01 [PASS / DUE]
Gate 4  13F Jaccard           X.XXX     [PASS / WARN / FAIL]
Gate 5  EES shadow monitor    Xd / Xd   [OBSERVATION / GATES MET]

OVERALL: [ALL CLEAR ✓ / WARNINGS — review before trading / BLOCKED — do not trade]

Actions required:
  - [none / Gate N: description of required action]
```

## Decision matrix
- All PASS → proceed with normal operations
- Any WARN → note and monitor; trading permitted
- Gate 1 FAIL → run `biotech-hard-exit` immediately
- Gate 2 ALERT → do not open new positions; review model
- Gate 3 DUE → run h20d quarantine script before next rebalance
- Gate 4 FAIL → 13F cohort quarantine; no institutional signal use
