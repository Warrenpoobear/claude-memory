---
name: Biotech pipeline PIT cache is idempotent — stale file blocks freshness
description: In biotech_screener, cache/ctgov/trial_records_{date}.json is only rewritten if absent; refreshing production_data/trial_records.json alone doesn't propagate.
type: project
originSessionId: 82166979-32c6-4eef-bb43-bc847967c3ab
---
When refreshing trial data for the biotech_screener pipeline, updating
`production_data/trial_records.json` via `collect_ctgov_data.py` is NOT sufficient.

The daily pipeline reads from a PIT cache at `cache/ctgov/trial_records_{as_of_date}.json`
built by `warm_caches.warm_ctgov()`. That function is **idempotent**: if the target file
already exists, it skips the rewrite (warm_caches.py:383-385). If the PIT cache was
built earlier in the day (e.g., by the 06:56 run before a trial_records refresh), every
subsequent pipeline run that day will keep reading the stale cache.

**Symptom:** `catalyst_events_vnext_{date}.json` reports `is_stale: true, age_days: N,
trial_records_date: <old>` even after `collect_ctgov_data.py` has succeeded.

**Why:** Staleness is derived from `max(last_update_posted)` across the records inside
the PIT cache file — not the mtime of either file.

**How to apply:** When refreshing trial data mid-day, delete
`cache/ctgov/trial_records_{as_of_date}.json` before re-running the pipeline.
Also move the existing `data/snapshots/{as_of_date}/` aside or the pipeline will
silently skip regeneration. Then run `tools/cron_daily_production.sh`.

Confirmed 2026-04-22: after this fix, vnext reported
`is_stale: false, confidence: HIGH, trial_records_date: 2026-04-21`.
