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

**⚠️ Idempotency short-circuit (critical):** if the snapshot dir has a
`_step_progress.json` marker with `manifest_written` done, the runner will
**skip everything** ("Skipping expensive steps (price, cache, screen, audit,
gates)"), return the *existing* manifest instantly (identical rankings hash),
and never re-fetch prices. This looks like a no-op run. To force a genuine
full rerun, remove the marker first (back it up so it's reversible):
```bash
cp data/snapshots/YYYY-MM-DD/_step_progress.json /tmp/_step_progress_backup.json 2>/dev/null
rm -f data/snapshots/YYYY-MM-DD/_step_progress.json
```
If the fresh rankings match the prior snapshot byte-for-byte, the promotion
guard preserves the original and archives nothing; if they differ, the old
snapshot is archived as `YYYY-MM-DD__pre_<hash>` and the new one promoted.

### 3 — Run the pipeline
```bash
cd /mnt/c/Projects/biotech_screener/biotech-screener && \
ALLOW_AGENT_PUSH=1 python3 -u tools/run_daily_production.py --as-of-date YYYY-MM-DD \
  --mode daily-production 2>&1 | tee /tmp/pipeline_run_YYYY-MM-DD.log
```
The flag is `--as-of-date` (NOT `--date`). Pipeline takes ~6 min. The runner
routes its own detailed logging to a file handler, so stdout/tee may look
sparse — check `data/snapshots/YYYY-MM-DD/run_manifest.json` for the result,
not stdout.

**Exit codes (do NOT treat exit 2 as failure):**
- `0` = all gates PASS
- `1` = a blocking gate FAILed — snapshot NOT promoted (real failure)
- `2` = overall status WARN — snapshot **promoted** with non-blocking warnings.
  This is the normal, healthy outcome most days. Report as COMPLETE.

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

Status:   COMPLETE (exit 0/2) / FAILED (exit 1)
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

After this skill runs, if anything surprised you, log a learning per `~/.claude/docs/session-end-learning.md` (Pattern-Key `SKILL_BIOTECH_RUN_PIPELINE_{description}`).
