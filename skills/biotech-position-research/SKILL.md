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

CONTEXT
[Any relevant notes from model — e.g., tier boundary, catalyst type]
```
