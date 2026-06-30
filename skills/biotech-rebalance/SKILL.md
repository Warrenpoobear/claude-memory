---
name: biotech-rebalance
description: |
  Execute the weekly equal-weight rebalance of the agentic Robinhood account (802349084) against the biotech model top-30. Use this skill when the user says "rebalance", "run the rebalance", "do the weekly rebalance", "execute open orders", or similar. Follows confirmed operational rules: check drawdown gate first, sync to today's rankings.csv, compute equal-weight target, sell overweight positions, buy underweight positions in batches. ONLY touches account 802349084 — never IRA accounts. Model: /mnt/c/Projects/biotech_screener/biotech-screener/data/snapshots/<today>/rankings.csv.
allowed-tools:
  - mcp__robinhood-trading__get_portfolio
  - mcp__robinhood-trading__get_equity_positions
  - mcp__robinhood-trading__get_equity_quotes
  - mcp__robinhood-trading__place_equity_order
  - mcp__robinhood-trading__review_equity_order
  - mcp__robinhood-trading__get_equity_orders
  - Bash(cat *)
  - Bash(ls *)
  - Bash(python3 *)
  - Bash(sleep *)
---

# Biotech Rebalance

Weekly equal-weight rebalance of account 802349084 to the model top-30.
**Never touches IRA accounts.** Only account_number: 802349084.

## Pre-flight (always run first)

### 1 — Drawdown gate
```python
# get_portfolio(account_number="802349084") → equity_value
# get_equity_quotes(["XBI"]) → XBI current price
# Load baseline from production_data/AGENTIC_ACCOUNT_RULES.md or last rebalance note
# drawdown_pp = portfolio_return_pct - xbi_return_pct (since last rebalance)
# ABORT if drawdown_pp <= -2.0
```
Report drawdown vs XBI. If ≤ −2pp → STOP, do not trade, report breach.

### 2 — Roster check
```bash
python3 - <<'EOF'
import pandas as pd, glob, os
snaps = sorted(glob.glob('/mnt/c/Projects/biotech_screener/biotech-screener/data/snapshots/*/rankings.csv'))
if not snaps:
    print("ERROR: no snapshots found"); exit(1)
latest = snaps[-1]
print(f"Using snapshot: {os.path.dirname(latest).split('/')[-1]}")
df = pd.read_csv(latest)
top30 = df[df['actionable_rank'] <= 30]['ticker'].tolist()
print("Top-30:", top30)
EOF
```
Compare to current holdings. Flag new entries (add at weekly) and exits (exit now if rank ≥40).

### 3 — T+1 check
`get_portfolio` → if buying_power << cash, prior sells are still settling. Note constraint before placing buys.

---

## Execution

### Step 1 — Snapshot state
```
get_portfolio(account_number="802349084") → total_value, equity_value, cash, buying_power
get_equity_positions(account_number="802349084") → all positions with market_value, average_buy_price
```

### Step 2 — Compute targets
```python
equal_weight_target = equity_value / num_positions  # num_positions = top-30 held count
delta = target - current_market_value
# sell list: delta < -$1.00
# buy list:  delta > +$1.00
# skip:      |delta| < $1.00 (Robinhood minimum)
```
Exclude ABVX from buy list (buy-restricted). Always exclude IRA account numbers.

### Step 3 — Execute sells
- `place_equity_order(account_number="802349084", symbol=X, dollar_amount=abs(delta), side="sell", type="market", time_in_force="gfd", market_hours="regular_hours")`
- Skip if delta < $1.00
- Confirm each fill before proceeding to buys

### Step 4 — Execute buys in batches of 8–10
```bash
# After each batch of 8-10 orders:
sleep 5  # avoid 429 rate limit (~16-20 orders/min)
```
- Check `get_portfolio` buying_power before each batch
- Stop if buying_power < $1.00
- Note any T+1-blocked buys for retry next session

### Step 5 — Report
```
REBALANCE COMPLETE — YYYY-MM-DD

Target per position: $XX.XX (equity / N positions)

SELLS (N):  TICKER -$X.XX ...
BUYS (N):   TICKER +$X.XX ...
SKIPPED:    TICKER (delta < $1 / buy-restricted / insufficient buying power)

POST-REBALANCE:
  Total value:    $XXX.XX
  Positions:      N
  Cash remaining: $XX.XX
  Max drift:      TICKER at $X.XX vs $XX.XX target
```

---

## Operational rules
- **Rule 1**: Trigger = Monday open or >25% drift on any position
- **Rule 2**: New entries added at weekly; exits for rank ≥40 done same session; rank 31–39 defer to weekly
- **Rule 3**: Equal weight (total equity / positions) until account > $5,000
- **Rule 4**: Abort if drawdown vs XBI ≤ −2pp; emergency exit ≤ −5pp
- **ABVX**: Permanently excluded from buys (Robinhood buy-restricted)
- **IRAs**: Never touched by this skill

## Constraints
- T+1: Same-session sell proceeds are cash but not buying power
- GFD only: No GTC for dollar-based fractional orders
- Rate limit: ~16–20 orders/minute → batch 8–10, sleep 5s between batches
- Minimum: $1.00 per dollar-based order

## Session-end learning

After completing this skill's task, if you encountered an unexpected behavior, constraint, API response, or workflow edge case, log it:

```
[LRN-YYYYMMDD-NNN]
Pattern-Key: SKILL_BIOTECH_REBALANCE_{description}
Area: hermes_ops | data_pipeline | research | portfolio
Promotion-lane: skill | none
Recurrence-Count: 1
Context: <one line — what happened>
Rule: <one line — what to do differently>
Suggested-Action: <patch to this SKILL.md, or none>
```

Recurrence ≥ 3 in 7 days → propose a patch to this `SKILL.md` via `tools/pattern_to_skillpatch.py`. Full protocol: see `self-improving` skill.
