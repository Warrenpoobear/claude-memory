---
name: biotech-ira-trade
description: |
  Execute a manually-authorized trade in an IRA account (Roth ••••0727 or Traditional ••••0174). Use when the user explicitly instructs a specific IRA trade: "buy X in my Roth", "sell Y from my Trad IRA", "add Z to the IRA", etc. Rule 5 compliance: IRAs are manually managed — this skill enforces an explicit authorization gate before any order. Never auto-rebalances. Never acts on model rankings alone without a direct instruction naming the ticker, account, and action.
allowed-tools:
  - mcp__robinhood-trading__get_accounts
  - mcp__robinhood-trading__get_equity_positions
  - mcp__robinhood-trading__get_equity_quotes
  - mcp__robinhood-trading__get_portfolio
  - mcp__robinhood-trading__place_equity_order
  - mcp__robinhood-trading__review_equity_order
  - mcp__robinhood-trading__get_equity_tradability
  - Bash(cat *)
  - Bash(ls *)
  - Bash(python3 *)
---

# Biotech IRA Trade

Manually-authorized trade execution for IRA accounts.
**Rule 5: IRA trades require explicit operator instruction — never automatic.**

## Authorization gate (always)

Before any order, confirm the instruction contains ALL of:
1. **Account**: Roth IRA or Traditional IRA (or "my IRA" if only one makes sense in context)
2. **Ticker**: specific symbol
3. **Action**: buy or sell
4. **Amount**: dollar amount, shares, or "all" / "full position"

If any element is missing, ask — do not assume or infer.

Example valid instruction: *"Buy $500 of RVMD in my Roth IRA"*
Example incomplete: *"Add some RVMD to the IRA"* → ask: which IRA? how much?

---

## Steps

### 1 — Discover IRA account numbers
`get_accounts()` → filter out 802349084 → identify Roth (••••0727) and Trad (••••0174)

### 2 — Pre-trade context
```
get_portfolio(account_number=<target_ira>) → buying_power, equity_value
get_equity_positions(account_number=<target_ira>) → current holdings
get_equity_quotes([ticker]) → current price
```
For buys: confirm buying_power ≥ order_amount.
For sells: confirm position exists and shares ≥ sell_quantity.

### 3 — Check tradability
`get_equity_tradability(symbol=ticker)` → confirm not restricted.

### 4 — Model context (informational only)
```bash
python3 - <<'EOF'
import pandas as pd, glob
snaps = sorted(glob.glob('/mnt/c/Projects/biotech_screener/biotech-screener/data/snapshots/*/rankings.csv'))
if snaps:
    df = pd.read_csv(snaps[-1])
    row = df[df['ticker'] == 'TICKER']
    print(row[['actionable_rank','tier_any','alpha_cohort_pct','catalyst_days','top_3_drivers']].to_string())
EOF
```
Show model rank and tier for context — **not a recommendation**, just information.

### 5 — Confirmation
Show order summary before placing:
> "ORDER PREVIEW
> Account: [Roth/Trad] IRA (••••XXXX)
> Action:  BUY/SELL TICKER
> Amount:  $XX.XX / X shares
> Price:   ~$XX.XX (market)
> Model rank: N (Tier X)
>
> Confirm? (yes / cancel)"

Execute only after explicit confirmation.

### 6 — Execute
```
place_equity_order(
    account_number=<ira_account_number>,
    symbol=ticker,
    side="buy" or "sell",
    type="market",
    time_in_force="gfd",
    market_hours="regular_hours",
    dollar_amount=amount  # or quantity for full sells
)
```

### 7 — Confirm fill
`review_equity_order` or `get_equity_orders` → confirm fill status and price.

### 8 — Report
```
IRA TRADE EXECUTED — YYYY-MM-DD

Account:  [Roth/Trad] IRA (••••XXXX)
Action:   BUY/SELL TICKER
Filled:   X shares @ $XX.XX = $XX.XX
Status:   FILLED / PENDING

Note: This was a manually-authorized trade (Rule 5).
No automatic rebalancing — next IRA review via biotech-ira-review.
```

## What this skill never does
- Does not auto-rebalance the IRA on any schedule
- Does not act on model ranking changes without a direct instruction
- Does not trade the agentic account (802349084) — that's biotech-rebalance

## Session-end learning

After this skill runs, if anything surprised you, log a learning per `~/.claude/docs/session-end-learning.md` (Pattern-Key `SKILL_BIOTECH_IRA_TRADE_{description}`).
