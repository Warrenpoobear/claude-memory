---
name: biotech-governance-check
description: |
  Check all biotech model governance gates in one pass. Use when the user says "governance check", "check the gates", "are all gates passing", "governance status", or before any major portfolio action. Read-only. Checks: drawdown vs XBI (account gate), IC health (model gate), h20d re-eval date, 13F Jaccard, EES shadow monitor. Reports PASS/FAIL/WARN for each gate with a clear overall verdict.
allowed-tools:
  - mcp__robinhood-trading__get_portfolio
  - mcp__robinhood-trading__get_equity_quotes
  - mcp__robinhood-trading__get_equity_positions
  - mcp__robinhood-trading__get_equity_orders
  - Bash(cat *)
  - Bash(ls *)
  - Bash(python3 *)
  - Bash(find *)
  - Bash(grep *)
---

# Biotech Governance Check

Full governance gate sweep. Read-only.

## Gates to check

### Gate 1 — Drawdown vs XBI (account-level)

**Measurement convention (MANDATORY): per-lot XBI-anchored relative performance.**
Each invested dollar is compared to XBI *from its own fill date*, not from account
inception. The naive calc — cost-basis return vs XBI-since-inception — is
**PROHIBITED for this gate**: weekly buys made after XBI rallies drag the anchor
and produce false breaches (demonstrated 2026-07-12: naive read −5.99pp = false
CRIT; per-lot read +3.31pp = PASS).

Algorithm:
1. `get_equity_positions(account_number="802349084")` → per-symbol `quantity`, `average_buy_price`.
2. `get_equity_orders(account_number="802349084", state="filled", created_at_gte=<inception>)` → per-fill (date, symbol, side, qty, price). Paginate if `next` is set.
3. Per symbol: `r_sym = P_end / average_buy_price − 1`;
   `xbi_sym = Σ(w_i × XBI_end / XBI_at(fill_date_i)) − 1` over that symbol's BUY fills, `w_i` = fill dollar weight.
4. Gate value = `Σ cost_weight_sym × (r_sym − xbi_sym)`, `cost_weight = qty × avg_buy_price / total_cost`.
5. **Endpoint parity:** `P_end` and `XBI_end` must be closes from the SAME date — use the
   latest date with full ticker coverage in `production_data/price_history.csv` (XBI row
   included), or same-timestamp live quotes for everything. Never mix a stale portfolio
   value with a fresh XBI quote or vice versa.
6. If fills or XBI history are unavailable, report Gate 1 = UNMEASURED and escalate to the
   operator. Do NOT fall back to the naive calculation for a gate verdict.

Thresholds (unchanged — applied to the per-lot gate value):
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

### Gate 3 — h20d re-evaluation gate
The 2026-07-01 gate was evaluated 2026-07-04: verdict **HOLD / NOT CLEARED**
(authority: `artifacts/readiness/H20D_REEVAL_VERDICT_2026_07_04.md`).
```bash
grep -m2 'Verdict\|Recommendation' /mnt/c/Projects/biotech_screener/biotech-screener/artifacts/readiness/H20D_REEVAL_VERDICT_2026_07_04.md
ls /mnt/c/Projects/biotech_screener/biotech-screener/artifacts/readiness/ | grep -i h20d | tail -3
```
- HOLD: report HOLD (Q1 13F observation-only; no institutional-signal clearance claims)
- Clearable only by `tools/check_13f_cohort_quarantine.py` run against a post-Q1-promotion snapshot (operator action); if a newer verdict doc exists, it governs

### Gate 4 — 13F Jaccard cohort
```bash
python3 - <<'EOF'
import json, glob
snaps = sorted(glob.glob('/mnt/c/Projects/biotech_screener/biotech-screener/data/snapshots/*/institutional_summary.json'))
if snaps:
    data = json.load(open(snaps[-1]))
    print(f"Coverage: {data.get('signal_coverage_pct', 'N/A')}%  (as_of {data.get('as_of_date')})")
    print("NOTE: cohort Jaccard is NOT in this file. Last authoritative 55-manager")
    print("cohort Jaccard = 0.463 (FAIL vs 0.70) per H20D_REEVAL_VERDICT_2026_07_04.md.")
    print("Do not cite the 0.875 figure — that was the Q4/49-manager comparison.")
else:
    print("No institutional summary found")
EOF
```
Thresholds:
- PASS: Jaccard ≥ 0.70
- WARN: 0.40 ≤ Jaccard < 0.70
- FAIL: Jaccard < 0.40  → 13F cohort quarantine

Until a post-promotion quarantine run produces a new Jaccard, report Gate 4 from the h20d verdict doc (currently: WARN-band 0.463, HOLD posture).

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

## Session-end learning

After this skill runs, if anything surprised you, log a learning per `~/.claude/docs/session-end-learning.md` (Pattern-Key `SKILL_BIOTECH_GOVERNANCE_CHECK_{description}`).
