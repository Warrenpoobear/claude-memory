---
name: biotech-portfolio-status
description: |
  Quick read-only health check of the agentic Robinhood account (802349084). Use when the user says "portfolio status", "how's the account", "check the portfolio", "what's my P&L", "account value", or similar. No trades ever. Reports: account value, cash, buying power, per-position P&L vs avg cost, drawdown vs XBI, drift flags, model alignment. Account: 802349084.
allowed-tools:
  - mcp__robinhood-trading__get_portfolio
  - mcp__robinhood-trading__get_equity_positions
  - mcp__robinhood-trading__get_equity_quotes
  - mcp__robinhood-trading__get_index_quotes
  - mcp__robinhood-trading__get_option_chains
  - mcp__robinhood-trading__get_option_instruments
  - mcp__robinhood-trading__get_option_quotes
  - Bash(cat *)
  - Bash(ls *)
  - Bash(python3 *)
---

# Biotech Portfolio Status

Read-only health check for account 802349084. No trades.

## Steps

### 1 — Account summary
`get_portfolio(account_number="802349084")` → total_value, equity_value, cash, buying_power

### 2 — Position table
`get_equity_positions(account_number="802349084")` → for each position:
- Ticker, quantity, average_buy_price (entry), current price (from equity_value / quantity or quotes), market_value
- P&L $ = market_value − (quantity × avg_buy_price)
- P&L % = P&L $ / cost_basis × 100
- Sort by market_value descending

For current prices, use `get_equity_quotes([list_of_tickers])` if not returned by positions.

### 3 — Drawdown gate vs XBI
```python
# Get XBI current price
# get_equity_quotes(["XBI"]) → xbi_price_now
#
# Compute portfolio return since last rebalance:
#   portfolio_return = (current_equity - baseline_equity) / baseline_equity
#
# Get XBI return over same period:
#   xbi_return = (xbi_price_now - xbi_price_at_baseline) / xbi_price_at_baseline
#
# drawdown_pp = (portfolio_return - xbi_return) * 100
#
# Thresholds:
#   drawdown_pp > -1.0pp  → CLEAR
#   -2.0 < drawdown_pp <= -1.0  → ⚠️ APPROACHING (within 1pp of gate)
#   drawdown_pp <= -2.0pp → 🚨 GATE BREACHED — report immediately
#   drawdown_pp <= -5.0pp → 🚨🚨 EMERGENCY — full liquidation required
```
Note: If no rebalance baseline is stored, use avg_buy_price weighted cost as portfolio basis.

### 4 — Drift check
```python
equal_weight_target = equity_value / num_positions
for each position:
    drift_pct = (market_value - target) / target * 100
    if abs(drift_pct) > 25:
        flag as rebalance trigger
```

### 5 — Options IV (optional — run if user asks or IV context is relevant)

For held positions with liquid options (ARWR, RVMD, NRIX, PRAX, NBIX, ALKS, MIRM, RYTM, XENE):
1. `get_option_chains(underlying_symbol=TICKER)` → chain_id, nearest expiry
2. `get_option_instruments(chain_id, expiration_dates=nearest_expiry, type="call"|"put", strike_price=ATM)` → instrument IDs
3. `get_option_quotes(instrument_ids=[...])` → IV, delta, OI, bid/ask (batch all in one call)

Only report names with OI_call + OI_put > 5. Flag IV regime:
- <60% → NORMAL, 60-80% → ELEVATED, >80% → EXTREME
- Skip if user did not ask for options data (avoid unnecessary calls)

### 6 — Model alignment
```bash
python3 - <<'EOF'
import pandas as pd, glob
snaps = sorted(glob.glob('/mnt/c/Projects/biotech_screener/biotech-screener/data/snapshots/*/rankings.csv'))
if snaps:
    df = pd.read_csv(snaps[-1])
    top30 = set(df[df['actionable_rank'] <= 30]['ticker'].tolist())
    print("Top-30:", sorted(top30))
else:
    print("No snapshot available")
EOF
```
Report: how many held tickers are in top-30, which held tickers are outside top-30 (with their current rank).

---

## Output format

```
━━━ ACCOUNT 802349084 ━━━
Value: $XXX.XX  |  Equity: $XXX.XX  |  Cash: $XX.XX  |  BP: $XX.XX

POSITIONS (N)
Ticker   Value     P&L$     P&L%    vs Target
------   -----     ----     ----    ---------
COGT     $XX.XX   +$X.XX   +X.X%   -X.X% [OK / ⚠️ DRIFT]
...

GOVERNANCE
Drawdown vs XBI:  X.XXpp  [CLEAR / ⚠️ APPROACHING / 🚨 BREACHED]
Drift triggers:   [none | TICKER at $X.XX vs $XX.XX target (+XX%)]

OPTIONS IV  (if requested, liquid names only)
  TICKER  IV    Delta  OI(C/P)  Regime    Expiry
  ARWR    57%   0.50   526/441  NORMAL    Jul-17
  RVMD    51%   0.57   2470/25  NORMAL    Jul-17
  [omit if not requested]

MODEL ALIGNMENT  (snapshot: YYYY-MM-DD)
In top-30:      N/N held  ✓
Outside top-30: TICKER (rank NN), ...
Not in model:   TICKER, ...
```

## Session-end learning

After this skill runs, if anything surprised you, log a learning per `~/.claude/docs/session-end-learning.md` (Pattern-Key `SKILL_BIOTECH_PORTFOLIO_STATUS_{description}`).
