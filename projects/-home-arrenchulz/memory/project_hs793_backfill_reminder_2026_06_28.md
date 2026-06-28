---
name: hs793-backfill-reminder-2026-06-28
description: "Reminder to finish HS793 daily return index backfill — 247 tickers remaining, quota exhausted 2026-06-28"
metadata: 
  node_type: memory
  type: project
  status: active
  expires: 2026-06-30
  originSessionId: 343b1f0b-e32c-430c-9ed2-a4dd08e02a94
---

Morningstar HS793 (daily return index) backfill is INCOMPLETE — hit daily cell quota (443,792 cells) on 2026-06-28.

**What's done:**
- `morningstar_mcp_data.json`: 337 tickers, fresh (2026-06-28)
- `HS377` daily price: 332 tickers current
- `HP010` monthly returns: 332 tickers current
- `HS793`: only 97 tickers current — **247 still stale (cut off Feb 2026)**
- `price_history_split_adj.csv`: 400 tickers, current through Jun 26

**What needs to run tomorrow (2026-06-29):**
Retry HS793 batches 3–7 (IDs index 100–342 in deduplicated id_map).

**Why:** Quota resets daily. Use `start_date='2024-01-01'` instead of '2021-01-01' to cut cell consumption ~60% and stay within quota.

**How to apply:** At session start on 2026-06-29, remind user: "HS793 backfill is still pending for 247 tickers — run the retry script or start_date='2024-01-01' version."

Script to run (in repo root, after loading .env):
```python
import os, json, math, time
from dotenv import load_dotenv; load_dotenv('.env')
import morningstar_data as md
from pathlib import Path
from datetime import date

DATA = Path('production_data')
BATCH = 50
START = '2024-01-01'  # shorter lookback to stay within quota

id_map = json.loads((DATA / 'morningstar_id_map.json').read_text()).get('ticker_to_id', {})
id_to_ticker = {v: k for k, v in id_map.items()}
seen_ids = set(); fetchable = []
for t, sid in id_map.items():
    if sid not in seen_ids:
        fetchable.append((t, sid)); seen_ids.add(sid)
all_ids = [sid for _, sid in fetchable]
retry_ids = all_ids[100:]  # skip first 100 already done

rh_path = DATA / 'morningstar_returns_history.json'
rh = json.loads(rh_path.read_text())
rh_records = rh.get('records', {})

def clean_val(v):
    if v is None: return None
    try:
        f = float(v)
        return None if math.isnan(f) else str(f)
    except: return None

hs793_new = {}
for i in range(0, len(retry_ids), BATCH):
    batch = retry_ids[i:i+BATCH]
    print(f'Batch {i+1}-{i+len(batch)} / {len(retry_ids)} ...', end=' ', flush=True)
    time.sleep(3)
    try:
        df = md.direct.get_returns(investments=batch, freq=md.direct.Frequency.daily, start_date=START)
        if df is not None and not df.empty:
            for _, row in df.iterrows():
                sid = str(row['Id']); dt = str(row['Date'])[:10]
                val = clean_val(row.iloc[2])
                if val: hs793_new.setdefault(sid, []).append({'date': dt, 'value': val})
            print('OK')
        else: print('empty')
    except Exception as e: print(f'FAIL: {str(e)[:100]}')

for sid, rows in hs793_new.items():
    ticker = id_to_ticker.get(sid)
    if not ticker: continue
    rec = rh_records.setdefault(ticker, {'morningstar_id': sid})
    date_map = {r['date']: r['value'] for r in rows}
    existing = rec.get('HS793', {})
    if isinstance(existing, dict) and 'time_series' in existing:
        for r in existing['time_series']:
            if isinstance(r, dict) and r['date'] not in date_map:
                date_map[r['date']] = r.get('value')
    rec['HS793'] = {'time_series': [{'date': d, 'value': v} for d, v in sorted(date_map.items())]}

rh['records'] = rh_records
rh.setdefault('metadata', {})['hs793_hp010_refreshed_at'] = date.today().isoformat()
rh_path.write_text(json.dumps(rh, indent=2, default=str))
print(f'Done. Wrote {rh_path.stat().st_size/1e6:.1f} MB')
```

Also note: MD_AUTH_TOKEN issued 2026-06-28, expires in ~23h — will need a fresh token again if not refreshed before the new session.
