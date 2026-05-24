---
name: biotech_universe_loading_bug_2026_05_18
description: Debug trace of universe loading bug causing Module 1 to only receive 1 ticker instead of 338
metadata: 
  node_type: memory
  type: project
  status: active
  expires: 2026-05-25
  originSessionId: 1e4158ec-a1e2-44cb-8356-25458ddbc133
---

## Issue Description
May 18 production run only evaluated 1 ticker (_XBI_BENCHMARK_) instead of the expected 338 tickers from universe.json.

### Confirmed Facts
- Production universe.json file exists with 338 valid records ✓
- May 15 production run worked correctly (327 active, 11 excluded) ✓
- May 18 production run shows Module 1 with total_input=1 (only _XBI_BENCHMARK_)
- _XBI_BENCHMARK_ excluded with reason: excluded_missing_data (missing_market_cap)
- Debug logging added to track universe loading:
  - Line 9307-9313 in run_screen.py: trace universe.json loading
  - Line 9374: trace PIT filtering results
  - Line 434 in run_daily_production.py: log subprocess stderr on success

### Root Cause Analysis
The issue is NOT due to:
- File corruption (universe.json loads correctly with 338 records) ✓
- Command line args (--tickers not passed, uses default all-from-universe) ✓
- Stale checkpoints (no checkpoint-dir used in run_daily_production) ✓

The issue IS:
- Module 1 receives only 1 ticker despite 338 in universe.json
- Either: (a) universe loaded as 1 record, OR (b) PIT filter removes 337/338

### Debug Traces Added
- Commit 398dbb21: Added print() statements with DEBUG_TRACE prefix
  - Line 9314: trace loaded universe size
  - Line 9375: trace PIT filter before/after counts
- Commit running with full stderr capture
- Modified run_daily_production.py to log subprocess stderr on success (line 432-434)

### Hypothesis
PIT survivorship filter at line 9338-9393 may have a logic error that filters out most tickers. Specifically:
- `_survivorship_ok()` returns True if `t not in _ipo_tickers` (conservative, keeps unknowns)
- But if ipo_dates.json is missing/corrupted, could filter differently

### Testing State
- May 18 10:06 production run in progress with debug traces
- Monitoring for DEBUG_TRACE output to confirm universe load size and PIT filter results
