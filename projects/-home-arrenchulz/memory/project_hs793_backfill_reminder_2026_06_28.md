---
name: hs793-backfill-reminder-2026-06-28
description: "Reminder to finish HS793 daily return index backfill — 197 tickers remaining, quota exhausted 2026-06-28 (second time)"
metadata: 
  node_type: memory
  type: project
  status: active
  expires: 2026-06-30
  originSessionId: 343b1f0b-e32c-430c-9ed2-a4dd08e02a94
---

Morningstar HS793 (daily return index) backfill is INCOMPLETE — quota hit twice on 2026-06-28.

**Current state (as of 2026-06-28 second attempt):**
- `morningstar_returns_history.json`: 345 tickers, 55.5 MB
- HS793 current (>= 2026-04-01): **148/345**
- HS793 stale: **197 tickers** — cut off before Apr 2026
- Completed batches: IDs[0:150] (batches 1-3 from original + retry batch 1)

**What needs to run 2026-06-29:**
Retry IDs[150:] — approximately 4 batches of 50, ~180k cells.

**Why:** Quota resets daily (~490k cells/day). Use `start_date='2024-01-01'` to stay within quota.

Script to run (in repo root, after loading .env):
```python
import os, json, math, time
from dotenv import load_dotenv; load_dotenv('.env')
import morningstar_data as md
from pathlib import Path
from datetime import date

DATA = Path('production_data')
BATCH = 50
START = '2024-01-01'

id_map = json.loads((DATA / 'morningstar_id_map.json').read_text()).get('ticker_to_id', {})
id_to_ticker = {v: k for k, v in id_map.items()}
seen_ids = set(); fetchable = []
for t, sid in id_map.items():
    if sid not in seen_ids:
        fetchable.append((t, sid)); seen_ids.add(sid)
all_ids = [sid for _, sid in fetchable]
retry_ids = all_ids[150:]  # IDs[150:] — first 150 already done
print(f'Retry IDs: {len(retry_ids)}')

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
    print(f'Batch {i//BATCH + 1}/{math.ceil(len(retry_ids)/BATCH)} ...', end=' ', flush=True)
    time.sleep(3)
    try:
        df = md.direct.get_returns(investments=batch, freq=md.direct.Frequency.daily, start_date=START)
        if df is not None and not df.empty:
            rows_fetched = 0
            for _, row in df.iterrows():
                sid = str(row['Id']); dt = str(row['Date'])[:10]
                val = clean_val(row.iloc[2])
                if val:
                    hs793_new.setdefault(sid, []).append({'date': dt, 'value': val})
                    rows_fetched += 1
            print(f'OK ({df["Id"].nunique()} tickers, {rows_fetched} rows)')
        else:
            print('empty')
    except Exception as e:
        print(f'FAIL: {str(e)[:120]}')

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
print(f'Done. {rh_path.stat().st_size/1e6:.1f} MB')

cutoff = '2026-04-01'
current = sum(1 for r in rh_records.values() if r.get('HS793',{}).get('time_series') and r['HS793']['time_series'][-1]['date'] >= cutoff)
print(f'HS793 current (>= {cutoff}): {current}/{len(rh_records)}')
```

**MD_AUTH_TOKEN:** Was valid as of 2026-06-28 session. May need refresh if >24h old.
