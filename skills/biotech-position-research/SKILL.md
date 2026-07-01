---
name: biotech-position-research
description: |
  Look up a specific ticker's full model diagnostic from the biotech screener. Use when the user says "what does the model say about TICKER", "look up TICKER", "TICKER model rank", "research TICKER", "what's the thesis on TICKER", or asks about a specific company's ranking or drivers. Read-only. Returns: rank, tier, alpha cohort percentile, catalyst timing, momentum state, top drivers, and current position status across all accounts.
allowed-tools:
  - mcp__robinhood-trading__get_equity_positions
  - mcp__robinhood-trading__get_equity_quotes
  - mcp__robinhood-trading__get_accounts
  - Bash(cat *)
  - Bash(ls *)
  - Bash(python3 *)
---

# Biotech Position Research

Full model diagnostic for a single ticker. Read-only.

## Steps

### 1 — Load model data for ticker
```bash
python3 - <<'EOF'
import pandas as pd, glob, json, sys

TICKER = "PLACEHOLDER"  # replace with requested ticker

snaps = sorted(glob.glob('/mnt/c/Projects/biotech_screener/biotech-screener/data/snapshots/*/rankings.csv'))
if not snaps:
    print("No snapshots found"); exit(1)

latest = snaps[-1]
import os
snap_date = os.path.dirname(latest).split('/')[-1]
df = pd.read_csv(latest)

row = df[df['ticker'] == TICKER]
if row.empty:
    print(f"{TICKER} not found in {snap_date} snapshot")
    # Check if in universe at all
    all_snaps = sorted(glob.glob('/mnt/c/Projects/biotech_screener/biotech-screener/data/snapshots/*/rankings.csv'))
    for s in reversed(all_snaps[-10:]):
        d = pd.read_csv(s)
        r = d[d['ticker'] == TICKER]
        if not r.empty:
            print(f"Found in {os.path.dirname(s).split('/')[-1]}: rank {r['actionable_rank'].values[0]}")
            break
    exit(0)

print(f"Snapshot: {snap_date}")
print(row.to_string(index=False))
EOF
```

### 2 — Check holdings across all accounts
```
get_accounts() → all account numbers
get_equity_positions(account_number=X) for each account
```
Report if TICKER is held in agentic account (802349084), Roth IRA, or Traditional IRA.
Include: shares held, avg cost, current market value, P&L %.

### 3 — Current price
`get_equity_quotes([TICKER])` → current price, day change

### 4 — Historical rank trend (last 7 snapshots)
```bash
python3 - <<'EOF'
import pandas as pd, glob, os

TICKER = "PLACEHOLDER"
snaps = sorted(glob.glob('/mnt/c/Projects/biotech_screener/biotech-screener/data/snapshots/*/rankings.csv'))[-7:]
for s in snaps:
    date = os.path.dirname(s).split('/')[-1]
    df = pd.read_csv(s)
    row = df[df['ticker'] == TICKER]
    rank = row['actionable_rank'].values[0] if not row.empty else "not ranked"
    print(f"  {date}: rank {rank}")
EOF
```

### 5 — Options diagnostic (from universe snapshot)

```python
import json
from pathlib import Path

TICKER = "PLACEHOLDER"
REPO = Path('/mnt/c/Projects/biotech_screener/biotech-screener')

snap_path = REPO / 'production_data/options_snapshot_latest.json'
if not snap_path.exists():
    dated = sorted((REPO / 'production_data').glob('options_snapshot_2*.json'))
    snap_path = dated[-1] if dated else None

if snap_path is None:
    print("No options snapshot available")
else:
    opt = json.loads(snap_path.read_text())
    snap_date = opt['metadata']['as_of_date']
    o = opt['tickers'].get(TICKER, {})

    if not o or not o.get('opt_has_data'):
        print(f"No options data for {TICKER} in snapshot {snap_date}")
    else:
        def sf(v):
            try: f = float(v); return f if f == f else None
            except: return None

        atm    = sf(o.get('opt_atm_iv'))
        iv_rk  = sf(o.get('opt_iv_rank_tw'))
        iv_pct = sf(o.get('opt_iv_percentile'))
        iv_rk_tos = sf(o.get('opt_iv_rank_tos'))
        regime = o.get('opt_iv_regime', '—')
        liq    = o.get('opt_liquidity_state', '—')
        evt    = o.get('opt_event_premium', '—')
        slope  = sf(o.get('opt_term_slope'))
        front  = sf(o.get('opt_front_iv'))
        back   = sf(o.get('opt_back_iv'))
        usable = o.get('opt_use_for_judgment', 'N')
        iv_5d  = sf(o.get('opt_iv_5d_change'))

        # Interpret slope
        if slope is not None:
            if slope < -0.20:   slope_read = "steep backwardation — near-term binary event priced"
            elif slope < -0.05: slope_read = "mild backwardation — front-weighted risk"
            elif slope > 0.50:  slope_read = "steep contango — market expects near-term calm"
            elif slope > 0.10:  slope_read = "contango — longer-dated uncertainty"
            else:               slope_read = "flat — no strong term signal"
        else:
            slope_read = "no term data"

        print(f"OPTIONS DIAGNOSTIC: {TICKER}  (snapshot {snap_date})")
        print(f"  ATM IV:     {atm*100:.0f}%" if atm else "  ATM IV:     —")
        print(f"  IV Rank TW: {iv_rk*100:.0f}%" if iv_rk else "  IV Rank TW: —")
        print(f"  IV Rank ToS:{iv_rk_tos*100:.0f}%" if iv_rk_tos else "  IV Rank ToS:—")
        print(f"  IV %ile:    {iv_pct*100:.0f}%" if iv_pct else "  IV %ile:    —")
        print(f"  IV 5d chg:  {iv_5d*100:+.0f}pp" if iv_5d else "  IV 5d chg:  —")
        print(f"  Regime:     {regime}")
        print(f"  Liquidity:  {liq}")
        print(f"  Evt premium:{evt}  (front={front*100:.0f}% back={back*100:.0f}%)" if front else f"  Evt premium:{evt}")
        print(f"  Term slope: {slope:+.3f}  ({slope_read})" if slope else f"  Term slope: —")
        print(f"  Usable:     {usable}")
```

---

## Output format

```
━━━ MODEL DIAGNOSTIC: TICKER  (snapshot: YYYY-MM-DD) ━━━

Rank:           N / 30
Tier:           A / B / C
Alpha cohort:   XX.X percentile
Catalyst:       Xd (BUCKET)
Momentum:       [state]
Top drivers:    driver1, driver2, driver3

PRICE
Current:  $XX.XX  (day: +X.X%)

HOLDINGS
Agentic (802349084):  X shares @ $XX.XX avg  →  $XX.XX  (+X.X%)
Roth IRA (••••0727):  X shares @ $XX.XX avg  →  $XX.XX  (+X.X%)
Trad IRA (••••0174):  not held
Total exposure: $XX.XX across all accounts

RANK TREND (last 7 days)
YYYY-MM-DD: rank N
...

OPTIONS  (snapshot YYYY-MM-DD)
  ATM IV:      XX%   (regime: NORMAL / ELEVATED / EXTREME)
  IV Rank TW:  XX%   (position vs. 52wk own history)
  IV %ile:     XX%
  IV 5d chg:  +Xpp
  Liquidity:   liquid / thin / absent
  Evt premium: YES (front XX% vs back XX%, slope -0.XX) / NO
  Term:        [steep backwardation — near-term binary event priced]
               [contango — market expects near-term calm]
               [flat — no strong term signal]
  Usable:      YES / NO
  [or: No options data for this ticker]

CONTEXT
[Any relevant notes from model — e.g., tier boundary, catalyst type]
```

## Session-end learning

After this skill runs, if anything surprised you, log a learning per `~/.claude/docs/session-end-learning.md` (Pattern-Key `SKILL_BIOTECH_POSITION_RESEARCH_{description}`).
