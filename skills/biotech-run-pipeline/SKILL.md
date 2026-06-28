---
name: biotech-run-pipeline
description: |
  Trigger the daily biotech screener pipeline to generate a snapshot for a given date. Use when the user says "run the pipeline", "generate today's snapshot", "run the screener for DATE", "run batch", or similar. Runs run_batch.py, tails the log, verifies rankings.csv was written, then reports outcome. Repo: /mnt/c/Projects/biotech_screener/biotech-screener/.
allowed-tools:
  - Bash(cd *)
  - Bash(python3 *)
  - Bash(ls *)
  - Bash(tail *)
  - Bash(cat *)
---

# Biotech Run Pipeline

Trigger the daily snapshot pipeline for the biotech screener.

## Steps

### 1 — Determine target date
If the user specified a date, use it. Otherwise use today's date (YYYY-MM-DD).

### 2 — Check if snapshot already exists
```bash
ls /mnt/c/Projects/biotech_screener/biotech-screener/data/snapshots/YYYY-MM-DD/rankings.csv 2>/dev/null \
  && echo "ALREADY EXISTS" || echo "NOT FOUND — will run"
```
If already exists, confirm with user before re-running.

### 3 — Run the pipeline
```bash
cd /mnt/c/Projects/biotech_screener/biotech-screener && source .env && \
python3 scripts/run_batch.py --date YYYY-MM-DD 2>&1 | tee /tmp/pipeline_run_YYYY-MM-DD.log
```
Pipeline takes several minutes. Report progress as it runs.

### 4 — Verify output
```bash
ls -la /mnt/c/Projects/biotech_screener/biotech-screener/data/snapshots/YYYY-MM-DD/
```
Expected artifacts: `rankings.csv`, `institutional_summary.json`, `market_data.json`, and others.

### 5 — Quick sanity check
```bash
python3 - <<'EOF'
import pandas as pd
df = pd.read_csv('/mnt/c/Projects/biotech_screener/biotech-screener/data/snapshots/YYYY-MM-DD/rankings.csv')
print(f"Tickers ranked: {len(df)}")
print(f"Top-5: {df.nsmallest(5,'actionable_rank')[['actionable_rank','ticker','tier_any']].to_string(index=False)}")
EOF
```

### 6 — Report
```
PIPELINE RUN — YYYY-MM-DD

Status:   COMPLETE / FAILED
Duration: Xm Xs
Tickers:  NNN ranked
Top-5:    COGT, DNTH, ORIC, NRIX, URGN

Artifacts written:
  rankings.csv              ✓
  institutional_summary.json ✓ / ✗
  market_data.json          ✓ / ✗

[Any errors or warnings from log]
```

## Notes
- Requires `.env` sourced (yfinance, SEC API keys)
- If yfinance rate-limited, pipeline will stall on price fetches — check `yfinance-check` first
- Pipeline root: `data/snapshots/` (not `data/snapshots_pit/`)
