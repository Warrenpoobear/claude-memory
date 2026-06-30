---
name: biotech-new-entry
description: |
  Add a new position to agentic account 802349084 outside the weekly rebalance cycle. Use when the user says "add TICKER", "buy TICKER now", "enter TICKER", "opportunistic add", or wants to add a specific position before the next Monday rebalance. Requires the ticker to be in the current top-30. Sizes the position at equal-weight target (total equity / positions + 1). Asks for confirmation before executing.
allowed-tools:
  - mcp__robinhood-trading__get_portfolio
  - mcp__robinhood-trading__get_equity_positions
  - mcp__robinhood-trading__get_equity_quotes
  - mcp__robinhood-trading__get_equity_tradability
  - mcp__robinhood-trading__place_equity_order
  - mcp__robinhood-trading__review_equity_order
  - Bash(cat *)
  - Bash(ls *)
  - Bash(python3 *)
---

# Biotech New Entry

Add a new position to account 802349084 outside the weekly rebalance cycle.

## Pre-flight checks

### 1 — Verify ticker is in top-30
```bash
python3 - <<'EOF'
import pandas as pd, glob
TICKER = "PLACEHOLDER"
snaps = sorted(glob.glob('/mnt/c/Projects/biotech_screener/biotech-screener/data/snapshots/*/rankings.csv'))
df = pd.read_csv(snaps[-1])
row = df[df['ticker'] == TICKER]
if row.empty or row['actionable_rank'].values[0] > 30:
    print(f"BLOCKED: {TICKER} not in top-30 (rank {row['actionable_rank'].values[0] if not row.empty else 'not ranked'})")
    print("New entries outside top-30 require explicit operator override.")
else:
    print(f"OK: {TICKER} rank {row['actionable_rank'].values[0]}, Tier {row['tier_any'].values[0]}")
    print(f"Catalyst: {row['catalyst_days'].values[0]}d | Drivers: {row['top_3_drivers'].values[0]}")
EOF
```
If not in top-30, **stop and report** — do not proceed unless user explicitly overrides.

### 2 — Check tradability
`get_equity_tradability(symbol=TICKER)` → confirm not buy-restricted (e.g., ABVX).

### 3 — Compute position size
```
get_portfolio → equity_value
get_equity_positions → current num_positions

new_target = equity_value / (num_positions + 1)  # equal-weight including new position
buying_power_available = buying_power field from get_portfolio
```
If buying_power < new_target: report shortfall, offer to use full available buying_power instead.

### 4 — Confirmation
> "NEW ENTRY PREVIEW
> Ticker: TICKER  (rank N, Tier X)
> Account: 802349084
> Size: $XX.XX (equal weight: equity / N+1 positions)
> Available BP: $XX.XX
> Catalyst: Xd | Drivers: ...
>
> Confirm? (yes / cancel)"

### 5 — Execute
```
place_equity_order(
    account_number="802349084",
    symbol=TICKER,
    side="buy",
    type="market",
    time_in_force="gfd",
    market_hours="regular_hours",
    dollar_amount=min(new_target, buying_power)
)
```

### 6 — Note: existing positions become overweight
Adding a new position without trimming others means all existing positions are now slightly
above the new equal-weight target. This resolves at the next weekly rebalance (Rule 1).
Flag this in the report.

### 7 — Report
```
NEW ENTRY EXECUTED — YYYY-MM-DD

Ticker: TICKER  (rank N, Tier X)
Bought: $XX.XX
Filled: X shares @ $XX.XX

NOTE: Existing N positions are now slightly above equal-weight target.
Will normalize at next weekly rebalance (Monday open).
```

## What this skill does NOT do
- Does not add tickers outside top-30 without explicit override
- Does not trim existing positions to fund the new entry (that's biotech-rebalance)
- Does not touch IRA accounts

## Session-end learning

After completing this skill's task, if you encountered an unexpected behavior, constraint, API response, or workflow edge case, log it:

```
[LRN-YYYYMMDD-NNN]
Pattern-Key: SKILL_BIOTECH_NEW_ENTRY_{description}
Area: hermes_ops | data_pipeline | research | portfolio
Promotion-lane: skill | none
Recurrence-Count: 1
Context: <one line — what happened>
Rule: <one line — what to do differently>
Suggested-Action: <patch to this SKILL.md, or none>
```

Recurrence ≥ 3 in 7 days → propose a patch to this `SKILL.md` via `tools/pattern_to_skillpatch.py`. Full protocol: see `self-improving` skill.
