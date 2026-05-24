---
name: 2026-03-18 session — bioshort build + production fixes
description: Built bioshort hedge report tool end-to-end, then fixed four production-run blockers for clean 2026-03-18 baseline
type: project
---

## Bioshort (Spec 027-029)

Built `tools/biotech_hedge_report.py` from scratch in one session:
- Multi-source options (Tastytrade/Massive/realized vol proxy)
- Historical backtest via Massive S3 day aggs (11/12 months actual option closes)
- Multi-DTE evaluation across 4 buckets (21-35/36-60/61-90/91-120)
- Full Greeks (per-leg, net structure, hedge-position level)
- IC decision banner (HEDGE NOW/WATCH/DEFER), confidence (0-100), policy trigger
- Weekly archive + week-over-week diff
- Governed verdict artifact (BIOSHORT_VERDICT.json/.md)
- 45 tests

**Status**: weekly production, feature freeze until late April 2026.

## Production Fixes (4 blockers cleared)

1. **CTGov diff gate** (`build_data_collection_health.py`): WARN when calendar coverage healthy + diff=0. FAIL only when both absent. Commit `14c91872`.

2. **Readiness pre_trade** (`weekly_readiness_scorecard.py`): Missing pre_trade.json is PASS on snapshot-only runs. Commit `b09a2dbe`.

3. **Float .strip() crash** (`run_daily_production.py` line 2828): opt_atm_iv can be float from JSON. Commit `b09a2dbe`.

4. **Straddle mispricing never wired** (`run_screen.py`): `compute_cheap_vol_score()` existed but was never called. Wired into enrichment block + added columns to SNAPSHOT_COLUMNS. 170/296 tickers scored. Commit `131860a1`.

**Why:** These four issues combined to block every production run since at least the Spec 026 data-collection-health gate was added. The straddle issue (cheap_vol_score=0%) was pre-existing — the function was defined but never integrated.

**How to apply:** 2026-03-18 is the new clean production baseline. Next: verify with one more clean daily run, then lock.
