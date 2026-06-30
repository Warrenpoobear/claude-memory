---
name: biotech-ira-review
description: |
  Review IRA holdings (Roth IRA ending ••••0727 and Traditional IRA ending ••••0174) with P&L and biotech model ranking. Use when the user says "IRA review", "check my IRAs", "how are my IRAs doing", "IRA holdings", "IRA P&L", or similar. Read-only — no trades ever (IRAs are manually managed per Rule 5). Reports per-account and combined P&L, model rank for each position, positions outside top-30 or below rank 40.
allowed-tools:
  - mcp__robinhood-trading__get_accounts
  - mcp__robinhood-trading__get_equity_positions
  - mcp__robinhood-trading__get_equity_quotes
  - mcp__robinhood-trading__get_portfolio
  - Bash(cat *)
  - Bash(ls *)
  - Bash(python3 *)
---

# Biotech IRA Review

Read-only review of both IRA accounts vs biotech model rankings.
**No trades.** IRAs are manually managed (Rule 5) — any action requires explicit operator instruction.

## Accounts
- Roth IRA:        account ending ••••0727
- Traditional IRA: account ending ••••0174
- Agentic (skip):  802349084

## Steps

### 1 — Discover IRA account numbers
```
get_accounts()
```
Filter out account 802349084. The remaining accounts are the IRAs. Match by last 4 digits (0727 = Roth, 0174 = Traditional) to label them correctly.

### 2 — Pull positions from both IRAs
```
get_equity_positions(account_number=<roth_account_number>)
get_equity_positions(account_number=<trad_account_number>)
get_portfolio(account_number=<roth_account_number>)
get_portfolio(account_number=<trad_account_number>)
```

### 3 — Get current prices
`get_equity_quotes([all_unique_tickers])` → current prices for P&L calculation

### 4 — Load model rankings
```bash
python3 - <<'EOF'
import pandas as pd, glob
snaps = sorted(glob.glob('/mnt/c/Projects/biotech_screener/biotech-screener/data/snapshots/*/rankings.csv'))
if snaps:
    df = pd.read_csv(snaps[-1])
    ranks = df[['ticker','actionable_rank','tier_any','alpha_cohort_pct','catalyst_days']].set_index('ticker')
    print(ranks.to_string())
else:
    print("No snapshot available — ranks unavailable")
EOF
```

### 5 — Build table and compute P&L
For each IRA position:
- P&L $ = (current_price − avg_buy_price) × quantity
- P&L % = P&L $ / cost_basis × 100
- Model rank = from rankings.csv; "Not in universe" if absent
- Flag if rank ≥ 40 or not in top-30

### 6 — Summary
- Per-account: value, P&L $, P&L %
- Combined: total IRA value, aggregate P&L
- Model alignment: in top-30 / out of top-30 / not in universe

---

## Output format

```
━━━ IRA REVIEW  (snapshot: YYYY-MM-DD) ━━━

Roth IRA  (••••0727)   Value: $X,XXX.XX  |  P&L: +$XXX.XX  (+XX.X%)
Trad IRA  (••••0174)   Value: $X,XXX.XX  |  P&L: +$XXX.XX  (+XX.X%)
Combined               Value: $X,XXX.XX  |  P&L: +$XXX.XX  (+XX.X%)

HOLDINGS
Ticker  Acct   Shares  Avg Cost   Price    Value     P&L$     P&L%    Rank  Tier
------  ----   ------  --------   -----    -----     ----     ----    ----  ----
RVMD    Roth    0.07   $143.76   $XXX.XX  $XX.XX   +$X.XX  +XX.X%      9   A
...

MODEL ALIGNMENT
In top-30:       N positions
Outside top-30:  TICKER (rank NN — consider review), ...
⚠️ Below rank 40: TICKER (rank NN — flag for manual decision)
Not in universe: TICKER, ...

NOTE: IRAs are manually managed (Rule 5).
No automatic rebalancing. Any action requires explicit operator instruction.
```

## Session-end learning

After completing this skill's task, if you encountered an unexpected behavior, constraint, API response, or workflow edge case, log it:

```
[LRN-YYYYMMDD-NNN]
Pattern-Key: SKILL_BIOTECH_IRA_REVIEW_{description}
Area: hermes_ops | data_pipeline | research | portfolio
Promotion-lane: skill | none
Recurrence-Count: 1
Context: <one line — what happened>
Rule: <one line — what to do differently>
Suggested-Action: <patch to this SKILL.md, or none>
```

Recurrence ≥ 3 in 7 days → propose a patch to this `SKILL.md` via `tools/pattern_to_skillpatch.py`. Full protocol: see `self-improving` skill.
