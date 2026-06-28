---
name: biotech-morning-brief
description: |
  Session startup brief for biotech portfolio management. Use at the start of any trading session, or when the user says "morning brief", "what do I need to do today", "session start", "what's pending", "catch me up", or similar. Covers: pending T+1 buys from prior session, governance gate status, today's rebalance trigger check, any roster changes since last session, and upcoming catalyst dates for held positions.
allowed-tools:
  - mcp__robinhood-trading__get_portfolio
  - mcp__robinhood-trading__get_equity_positions
  - mcp__robinhood-trading__get_equity_quotes
  - mcp__robinhood-trading__get_option_chains
  - mcp__robinhood-trading__get_option_instruments
  - mcp__robinhood-trading__get_option_quotes
  - Bash(cat *)
  - Bash(ls *)
  - Bash(python3 *)
---

# Biotech Morning Brief

Session startup checklist. Run at the start of any trading session.

## Steps

### 1 — Account state
```
get_portfolio(account_number="802349084") → equity_value, cash, buying_power
```
Flag if buying_power >> $1.00 (pending T+1 buys may be executable now).

### 2 — Governance gates (quick check)
```
get_equity_quotes(["XBI"]) → current XBI price
```
Compute drawdown vs XBI from last known baseline.
- CLEAR → proceed
- WARN  → note and monitor
- FAIL  → stop, run biotech-hard-exit

### 3 — Pending T+1 buys
Check scratchpad for any open buy orders deferred from prior session:
```bash
ls /tmp/claude-1000/-home-arrenchulz/*/scratchpad/rebalance_open_*.md 2>/dev/null | tail -1 | xargs cat 2>/dev/null || echo "No pending rebalance file found"
```
If pending orders exist and buying_power is now sufficient → flag for execution via biotech-rebalance.

### 4 — Rebalance trigger check (Rule 1)
```
get_equity_positions(account_number="802349084") → all positions
```
Compute equal-weight target. Check if:
- Today is Monday → scheduled rebalance
- Any position drifted >25% from target → drift-triggered rebalance

### 5 — Roster changes since last session
```bash
python3 - <<'EOF'
import pandas as pd, glob, os
snaps = sorted(glob.glob('/mnt/c/Projects/biotech_screener/biotech-screener/data/snapshots/*/rankings.csv'))
if len(snaps) >= 2:
    today = pd.read_csv(snaps[-1])
    prior = pd.read_csv(snaps[-2])
    t30_today = set(today[today['actionable_rank'] <= 30]['ticker'])
    t30_prior = set(prior[prior['actionable_rank'] <= 30]['ticker'])
    new_in   = t30_today - t30_prior
    new_out  = t30_prior - t30_today
    today_date = os.path.dirname(snaps[-1]).split('/')[-1]
    prior_date = os.path.dirname(snaps[-2]).split('/')[-1]
    print(f"Comparing {prior_date} → {today_date}")
    print(f"New entries: {sorted(new_in) or 'none'}")
    print(f"Exits:       {sorted(new_out) or 'none'}")
else:
    print("Only one snapshot available — no comparison possible")
EOF
```

### 6 — Options IV snapshot (liquid held positions) + shadow artifact

For all held positions, pull ATM IV and key greeks via Robinhood MCP, write the RH cache, then run the two-source shadow merge.

**6a — Identify eligible held names**

From positions returned in Step 4, take all tickers. Query option chains for each:
```
get_option_chains(underlying_symbol=TICKER) → chain_id, expiration_dates
```
Run in parallel for all held names. Drop any that return no chain (NO_CHAIN).

**6b — Fetch ATM contracts for each name with a chain**

For each name with a chain, find nearest expiry and ATM strike (nearest $5 to last price; $2.50 if price < $50; $10 if price > $200):
```
get_option_instruments(chain_id=X, expiration_dates=nearest_expiry, type="call", strike_price=ATM)
get_option_instruments(chain_id=X, expiration_dates=nearest_expiry, type="put",  strike_price=ATM)
```

**6c — Batch quote fetch**

Collect all call + put instrument IDs and fetch in one call (max 20 ids per call; batch if more):
```
get_option_quotes(instrument_ids=[id1, id2, ...]) → implied_volatility, delta, gamma, theta, vega, open_interest, volume, bid_price, ask_price, mark_price
```

**6d — Write RH cache**

Build a `tickers` dict from the fetched data and write the RH quotes cache file:
```python
import sys; sys.path.insert(0, '/mnt/c/Projects/biotech_screener/biotech-screener')
from tools.write_rh_options_cache import write_rh_cache
import datetime

tickers_data = {
    "ARWR": {
        "underlying_price": <last_trade_price>,
        "nearest_expiry": "<YYYY-MM-DD>",
        "atm_strike": <strike>,
        "call": {"implied_volatility": <iv>, "delta": <d>, "gamma": <g>, "theta": <t>,
                 "vega": <v>, "open_interest": <oi>, "volume": <vol>,
                 "bid": <bid>, "ask": <ask>, "mark": <mark>},
        "put":  {"implied_volatility": <iv>, ...},
    },
    # ... repeat for each fetched name
}

today = datetime.date.today().isoformat()
cache_path = write_rh_cache(today, tickers_data)
print(f"Cache written: {cache_path}")
```

**6e — Run shadow merge**

```python
from tools.collect_options_shadow import run_options_shadow

result = run_options_shadow(
    as_of_date=today,
    tickers=list(tickers_data.keys()),
    rh_cache_file=str(cache_path),
)
print(result)
```

Read the generated `.md` artifact and display the Signal Summary table:
```bash
cat /mnt/c/Projects/biotech_screener/biotech-screener/artifacts/options_shadow/{today}_options_shadow.md
```

Display only names where OI_call + OI_put > 5. Flag:
- IV > 80% → ELEVATED
- IV > 120% → EXTREME
- event_premium (front > back by >10%) → backwardation flag
- put IV > call IV by >5pp → put skew (fear premium)

Skip steps 6b–6e entirely if fewer than 2 names return a valid chain.

### 7 — Upcoming catalysts for held positions
```bash
python3 - <<'EOF'
import pandas as pd, glob
snaps = sorted(glob.glob('/mnt/c/Projects/biotech_screener/biotech-screener/data/snapshots/*/rankings.csv'))
df = pd.read_csv(snaps[-1])
near = df[(df['actionable_rank'] <= 30) & (df['catalyst_days'] <= 14)][['ticker','actionable_rank','catalyst_days','catalyst_bucket']].sort_values('catalyst_days')
if not near.empty:
    print("CATALYSTS WITHIN 14 DAYS:")
    print(near.to_string(index=False))
else:
    print("No catalysts within 14 days for top-30")
EOF
```

---

## Output format

```
━━━ MORNING BRIEF  YYYY-MM-DD ━━━

ACCOUNT 802349084
  Value: $XXX.XX  |  Cash: $XX.XX  |  BP: $XX.XX

GOVERNANCE
  Drawdown vs XBI: X.XXpp  [CLEAR / ⚠️ WARN / 🚨 BREACHED]

PENDING ACTIONS
  [none]
  [⚠️ T+1 buys available: $XX.XX in buying power — run biotech-rebalance]
  [📅 Monday rebalance due — run biotech-rebalance]
  [⚡ Drift trigger: TICKER at $X.XX vs $XX.XX target]

ROSTER CHANGES (since last snapshot)
  New entries: TICKER, ...  → add at next rebalance
  Exits: TICKER, ...        → [defer to weekly / exit now if rank ≥40]

OPTIONS IV  (liquid held names, nearest expiry)
  TICKER  IV    Delta  OI(C/P)  Regime     Skew
  ------  ---   -----  -------  ------     ----
  ARWR    57%   0.50   526/441  NORMAL     —
  RVMD    51%   0.57   2470/25  NORMAL     call-heavy OI
  [skip if <2 liquid names]

UPCOMING CATALYSTS (≤14 days, held positions)
  Rank N  TICKER  Xd  BUCKET
  ...

STATUS: [ALL CLEAR — no action required / ACTION NEEDED — see above]
```
