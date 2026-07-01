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

### 5.5 — Top-30 IV risk scan (universe snapshot, read-only)

Read the pre-fetched universe options snapshot. This surfaces binary event warnings
and near-term catalyst flags for the full top-30 before the per-position RH pull.

```python
import json, csv, glob, os
from pathlib import Path

REPO = Path('/mnt/c/Projects/biotech_screener/biotech-screener')

# Load universe snapshot (prefer latest.json, fall back to most recent dated file)
snap_path = REPO / 'production_data/options_snapshot_latest.json'
if not snap_path.exists():
    dated = sorted((REPO / 'production_data').glob('options_snapshot_2*.json'))
    snap_path = dated[-1] if dated else None

if snap_path is None:
    print("No options snapshot found — skip Step 5.5")
else:
    opt = json.loads(snap_path.read_text())
    opt_tickers = opt['tickers']
    snap_date = opt['metadata']['as_of_date']

    # Load top-30 from latest rankings
    snaps = sorted(REPO.glob('data/snapshots/*/rankings.csv'))
    df_rows = []
    if snaps:
        with open(snaps[-1]) as f:
            for row in csv.DictReader(f):
                df_rows.append(row)
        df_rows.sort(key=lambda r: int(float(r.get('actionable_rank', 9999))))
        top30 = df_rows[:30]
    else:
        top30 = []

    def sf(v):
        try:
            f = float(v); return f if f == f else None
        except: return None

    # Classify
    extreme, event_prem, high_rank, sell_timing = [], [], [], []
    SELL_ONLY = {'ABVX'}  # sell-only constraint names

    for row in top30:
        t = row['ticker']
        o = opt_tickers.get(t, {})
        atm    = sf(o.get('opt_atm_iv'))
        iv_rk  = sf(o.get('opt_iv_rank_tw'))
        iv_pct = sf(o.get('opt_iv_percentile'))
        regime = o.get('opt_iv_regime', '')
        evt    = o.get('opt_event_premium', '')
        slope  = sf(o.get('opt_term_slope'))

        if regime == 'EXTREME':
            extreme.append((t, atm, iv_rk, iv_pct, slope))
        if evt == 'YES':
            event_prem.append((t, atm, slope))
        if iv_rk is not None and iv_rk > 0.70:
            flag = '⚠ SELL-ONLY + IV PEAK' if t in SELL_ONLY else 'IV near 52wk high'
            high_rank.append((t, iv_rk, flag))
        if t in SELL_ONLY and iv_rk is not None and iv_rk > 0.60:
            sell_timing.append((t, iv_rk, iv_pct))

    print(f"OPTIONS RISK SCAN (snapshot {snap_date})")
    if extreme:
        print(f"  EXTREME IV — binary event signatures:")
        for t, atm, rk, pct, slope in extreme:
            rk_s   = f"{rk*100:.0f}%"   if rk   is not None else "—"
            pct_s  = f"{pct*100:.0f}%"  if pct  is not None else "—"
            slp_s  = f"{slope:+.2f}"    if slope is not None else "—"
            print(f"    {t}: IV={atm*100:.0f}%  IVRk={rk_s}  IV%ile={pct_s}  slope={slp_s}")
    if event_prem:
        print(f"  EVENT PREMIUM (near-term catalyst priced — {len(event_prem)}/30):")
        for t, atm, slope in event_prem:
            slp_s = f"{slope:+.2f}" if slope is not None else "—"
            print(f"    {t}: IV={atm*100:.0f}%  slope={slp_s}")
    if sell_timing:
        print(f"  SELL TIMING — sell-only names near IV peak:")
        for t, rk, pct in sell_timing:
            pct_s = f"{pct*100:.0f}%" if pct is not None else "—"
            print(f"    {t}: IVRk={rk*100:.0f}%  IV%ile={pct_s}  → elevated IV window for exit")
    if not extreme and not event_prem and not high_rank:
        print("  No elevated IV flags in top-30")
```

Skip this step and note "snapshot unavailable" if neither snapshot file exists.

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

### 7 — Regime status (read cached card)

```bash
REPO=/mnt/c/Projects/biotech_screener/biotech-screener
DATE=$(date +%Y-%m-%d)
cat "$REPO/artifacts/regime_monitor/REGIME_CARD_${DATE}.md" 2>/dev/null | head -30 || \
  ls -t "$REPO/artifacts/regime_monitor/REGIME_CARD_"*.md 2>/dev/null | head -1 | xargs head -30 2>/dev/null || \
  echo "No regime card found — run biotech-regime-monitor to update"
```

Report regime label, VIX, XBI vs SPY 30d, and any transition flag.
If card is >1 trading day stale, note it — do NOT run live MCP fetches unprompted.

### 8 — Upcoming catalysts for held positions
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

IV RISK FLAGS (top-30 universe, as of YYYY-MM-DD)
  EXTREME: ORIC(2681%, pctile 100%), TRVI(838%, pctile 96%)   ← binary events
  EVENT PREMIUM: NRIX, ABVX, XENE, PHVS, TYRA                ← near-term catalyst priced
  SELL TIMING: ABVX IVRk=80% pctile=98% — sell-only + IV at peak
  [or: No elevated IV flags in top-30]

OPTIONS IV  (liquid held names, nearest expiry)
  TICKER  IV    Delta  OI(C/P)  Regime     Skew
  ------  ---   -----  -------  ------     ----
  ARWR    57%   0.50   526/441  NORMAL     —
  RVMD    51%   0.57   2470/25  NORMAL     call-heavy OI
  [skip if <2 liquid names]

REGIME  (as of YYYY-MM-DD)
  Label: SECTOR_DISLOCATION  (confidence=0.48)
  VIX: 18.41  |  XBI 10d: +17.1%  |  XBI vs SPY 30d: +17.7pp
  Transition: NO CHANGE (3 days)  — or —  ⚠ SHIFT: A → B

UPCOMING CATALYSTS (≤14 days, held positions)
  Rank N  TICKER  Xd  BUCKET
  ...

STATUS: [ALL CLEAR — no action required / ACTION NEEDED — see above]
```

## Session-end learning

After this skill runs, if anything surprised you, log a learning per `~/.claude/docs/session-end-learning.md` (Pattern-Key `SKILL_BIOTECH_MORNING_BRIEF_{description}`).
