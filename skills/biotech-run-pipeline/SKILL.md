---
name: biotech-run-pipeline
description: |
  Trigger the daily biotech screener pipeline to generate a snapshot for a given date. Use when the user says "run the pipeline", "generate today's snapshot", "run the screener for DATE", "run production", or similar. Runs tools/run_daily_production.py, tails the log, verifies rankings.csv was written, then reports outcome. Repo: /mnt/c/Projects/biotech_screener/biotech-screener/.
allowed-tools:
  - Bash(cd *)
  - Bash(python3 *)
  - Bash(ls *)
  - Bash(tail *)
  - Bash(cat *)
---

# Biotech Run Pipeline

Trigger the daily snapshot pipeline for the biotech screener.

## Production runner

**`tools/run_daily_production.py`** — NOT `scripts/run_batch.py` (old, deprecated).

Steps in the production runner:
- **1.1–1.4**: price refresh, yfinance (active tickers only — delisted filtered)
- **1.5**: ctgov trial fetch (parallelized, ThreadPoolExecutor 8 workers, ~31s)
- **1.45**: tastytrade options IV snapshot (batch_size=200, ~2s for 349 tickers)
- **1.46**: options enrichment (9-layer shadow, write_shadow_only=True, ~30s)
- **1.47**: options shadow IC update, fast_mode=True — non-blocking, logs daily
- **2+**: run_screen.py (~70s), gates, snapshot promotion

Expected total runtime: **~6 min** (as of 2026-06-28; was ~22 min pre-optimizations).

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
cd /mnt/c/Projects/biotech_screener/biotech-screener && \
ALLOW_AGENT_PUSH=1 python3 tools/run_daily_production.py --date YYYY-MM-DD \
  2>&1 | tee /tmp/pipeline_run_YYYY-MM-DD.log
```
Pipeline takes ~6 min. Report progress as it runs.

### 4 — Verify output
```bash
ls -la /mnt/c/Projects/biotech_screener/biotech-screener/data/snapshots/YYYY-MM-DD/
```
Expected artifacts: `rankings.csv`, `run_manifest.json`, `screen_output.json`, `inputs_manifest.json`.

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
Duration: ~6m
Tickers:  NNN ranked
Top-5:    COGT, DNTH, ORIC, NRIX, URGN

Artifacts written:
  rankings.csv       ✓
  run_manifest.json  ✓ / ✗
  options snapshot   ✓ / ✗ (production_data/options_snapshot_YYYY-MM-DD.json)

[Any errors or warnings from log]
```

## Notes
- Requires `.env` loaded (yfinance, tastytrade, SEC API keys)
- `ALLOW_AGENT_PUSH=1` env var required to allow the pipeline's internal git ops through the pre-push hook
- If yfinance rate-limited, pipeline will stall on price fetches — check `yfinance-check` first
- Delisted tickers are filtered BEFORE yfinance refresh (universe.json `status=delisted`) — saves ~9 min
- ctgov fetch is parallelized (8 workers) — ~31s; serial was 3.3 min
- Options IC (Step 1.47) requires 5 business days of forward price data; logs "accumulating" until then
- run_screen.py invoked internally with `--inputs-manifest write`; valid choices: `off`, `write`, `verify` (NOT `skip`)
- Pipeline root for snapshots: `data/snapshots/`
- Options enrichment artifacts (gitignored): `artifacts/options_enrichment/YYYY_MM_DD/`

## Session-end learning

After completing this skill's task, if you encountered an unexpected behavior, constraint, API response, or workflow edge case, log it:

```
[LRN-YYYYMMDD-NNN]
Pattern-Key: SKILL_BIOTECH_RUN_PIPELINE_{description}
Area: hermes_ops | data_pipeline | research | portfolio
Promotion-lane: skill | none
Recurrence-Count: 1
Context: <one line — what happened>
Rule: <one line — what to do differently>
Suggested-Action: <patch to this SKILL.md, or none>
```

Recurrence ≥ 3 in 7 days → propose a patch to this `SKILL.md` via `tools/pattern_to_skillpatch.py`. Full protocol: see `self-improving` skill.
