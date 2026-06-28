---
name: yfinance-check
description: |
  Check yfinance data freshness and rate-limit status for the biotech screener. Use when the user says "yfinance check", "is yfinance working", "check price data", "data fresh?", or before running the pipeline. Reports whether price data is current, whether the rate-limit handler is active, and the age of the most recent price fetch.
allowed-tools:
  - Bash(python3 *)
  - Bash(ls *)
  - Bash(tail *)
  - Bash(cat *)
---

# yfinance Check

Verify price data freshness and yfinance API status.

## Steps

### 1 — Check latest price data date
```bash
python3 - <<'EOF'
import pandas as pd, glob, os
from datetime import datetime, timedelta

REPO = '/mnt/c/Projects/biotech_screener/biotech-screener'

# Check production price history
price_file = os.path.join(REPO, 'production_data', 'price_history.csv')
if os.path.exists(price_file):
    df = pd.read_csv(price_file)
    if 'date' in df.columns:
        df['date'] = pd.to_datetime(df['date'])
        latest_date = df['date'].max()
        age_days = (datetime.now() - latest_date.to_pydatetime()).days
        status = "FRESH" if age_days <= 1 else f"STALE ({age_days}d old)"
        print(f"Price history latest: {latest_date.date()} [{status}]")
        print(f"Tickers with data:    {df['date'].eq(latest_date).sum() // len(df['date'].unique()) if len(df) > 0 else 0}")
    else:
        print("price_history.csv found but no 'date' column")
else:
    print(f"price_history.csv not found at {price_file}")
EOF
```

### 2 — Check yfinance rate-limit handler
```bash
python3 - <<'EOF'
import os, sys
REPO = '/mnt/c/Projects/biotech_screener/biotech-screener'
sys.path.insert(0, REPO)

handler = os.path.join(REPO, 'scripts', 'yfinance_safe.py')
if os.path.exists(handler):
    print(f"Rate-limit handler: PRESENT ({handler})")
else:
    print("Rate-limit handler: NOT FOUND (scripts/yfinance_safe.py)")

# Check recent fetch logs
import glob
logs = sorted(glob.glob(os.path.join(REPO, 'logs', '*yfinance*')) +
              glob.glob(os.path.join(REPO, 'logs', '*price*')))
for log in logs[-3:]:
    print(f"\nLog: {os.path.basename(log)}")
    with open(log) as f:
        lines = f.readlines()
    for line in lines[-5:]:
        print(f"  {line.rstrip()}")
EOF
```

### 3 — Quick live fetch test (1 ticker)
```bash
python3 - <<'EOF'
import yfinance as yf
from datetime import datetime
try:
    ticker = yf.Ticker("XBI")
    hist = ticker.history(period="1d")
    if not hist.empty:
        price = hist['Close'].iloc[-1]
        print(f"yfinance live fetch: OK — XBI ${price:.2f}")
    else:
        print("yfinance live fetch: EMPTY response (possible rate limit)")
except Exception as e:
    print(f"yfinance live fetch: ERROR — {e}")
EOF
```

### 4 — Report
```
YFINANCE STATUS — YYYY-MM-DD HH:MM

Price data:
  Latest date:  YYYY-MM-DD  [FRESH / STALE (Nd)]
  Tickers:      NNN

Rate-limit handler (scripts/yfinance_safe.py):  PRESENT / NOT FOUND

Live fetch test (XBI):  OK ($XX.XX) / RATE_LIMITED / ERROR

STATUS: [OK — pipeline can run / ⚠️ STALE — check logs / 🚨 RATE_LIMITED — wait before running pipeline]
```

## Notes
- Rate-limit incident history: 2026-05-23 (4-day outage, all 341 tickers 429'd)
- `scripts/yfinance_safe.py` adds backoff; use it instead of raw yfinance for bulk fetches
- If rate-limited: wait 24-72h before retrying bulk fetch; single-ticker tests may still work
