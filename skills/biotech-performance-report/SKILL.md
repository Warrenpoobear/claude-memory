---
name: biotech-performance-report
description: |
  Generate a performance report for agentic account 802349084 vs XBI benchmark. Use when the user says "performance report", "how am I doing vs XBI", "attribution", "show me returns", "performance since rebalance", or similar. Read-only. Reports: portfolio return since last rebalance, XBI return over same period, relative performance (alpha), per-position attribution (winners/losers), and model tier breakdown.
allowed-tools:
  - mcp__robinhood-trading__get_portfolio
  - mcp__robinhood-trading__get_equity_positions
  - mcp__robinhood-trading__get_equity_quotes
  - Bash(cat *)
  - Bash(ls *)
  - Bash(python3 *)
---

# Biotech Performance Report

Read-only performance and attribution for account 802349084 vs XBI.

## Steps

### 1 — Current account state
```
get_portfolio(account_number="802349084") → equity_value, cash
get_equity_positions(account_number="802349084") → all positions with average_buy_price, quantity, market_value
```

### 2 — Benchmark: XBI return
```
get_equity_quotes(["XBI"]) → xbi_price_now
```
XBI baseline price: retrieve from stored rebalance record or use the most recent
`artifacts/monitoring/` snapshot. If unavailable, note "baseline not found — showing
position-level P&L only."

### 3 — Per-position attribution
```python
for each position:
    cost_basis   = quantity × avg_buy_price
    market_value = current_value
    pnl_dollars  = market_value - cost_basis
    pnl_pct      = pnl_dollars / cost_basis * 100
    contribution = pnl_dollars / total_cost_basis * 100  # contribution to portfolio return
```

### 4 — Load model context for tier breakdown
```bash
python3 - <<'EOF'
import pandas as pd, glob
snaps = sorted(glob.glob('/mnt/c/Projects/biotech_screener/biotech-screener/data/snapshots/*/rankings.csv'))
if snaps:
    df = pd.read_csv(snaps[-1])
    print(df[['ticker','actionable_rank','tier_any']].to_string(index=False))
EOF
```

### 5 — Compute summary stats
- Total portfolio return % (equity vs cost basis)
- XBI return % over same period
- Relative performance (portfolio − XBI)
- Winners (P&L > 0), losers (P&L < 0)
- Top 3 contributors, bottom 3 detractors
- Tier breakdown: avg return by tier (A/B/C)

---

## Output format

```
━━━ PERFORMANCE REPORT  YYYY-MM-DD ━━━
Period: [last rebalance date] → today

SUMMARY
Portfolio return:   +X.X%
XBI return:         +X.X%
Relative (alpha):   +X.Xpp  [OUTPERFORM / UNDERPERFORM]

Total equity:  $XXX.XX
Cost basis:    $XXX.XX
P&L:          +$XX.XX

ATTRIBUTION (sorted by contribution)
Ticker  Rank  Tier   Value    P&L$     P&L%    Contrib
------  ----  ----   -----    ----     ----    -------
COGT      1    A    $XX.XX  +$X.XX   +X.X%    +X.Xpp
...
[divider]
DRUG     11    A    $XX.XX  -$X.XX   -X.X%    -X.Xpp

TIER BREAKDOWN
Tier A:  avg +X.X%  (N positions)
Tier B:  avg +X.X%  (N positions)
Tier C:  avg +X.X%  (N positions)

TOP 3 CONTRIBUTORS:    TICKER +Xpp, ...
BOTTOM 3 DETRACTORS:   TICKER -Xpp, ...
```

## Session-end learning

After completing this skill's task, if you encountered an unexpected behavior, constraint, API response, or workflow edge case, log it:

```
[LRN-YYYYMMDD-NNN]
Pattern-Key: SKILL_BIOTECH_PERFORMANCE_REPORT_{description}
Area: hermes_ops | data_pipeline | research | portfolio
Promotion-lane: skill | none
Recurrence-Count: 1
Context: <one line — what happened>
Rule: <one line — what to do differently>
Suggested-Action: <patch to this SKILL.md, or none>
```

Recurrence ≥ 3 in 7 days → propose a patch to this `SKILL.md` via `tools/pattern_to_skillpatch.py`. Full protocol: see `self-improving` skill.
