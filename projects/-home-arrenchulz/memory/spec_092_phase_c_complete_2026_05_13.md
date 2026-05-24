---
name: spec_092_phase_c_complete_2026_05_13
description: Spec 092 Phase C (historical research panel backfill) shipped 2026-05-13
metadata: 
  node_type: memory
  type: project
  status: shipped
  date: 2026-05-13
  commits: 
    - "34902dbb: feat(bioshort): Spec 092 Phase C — Historical research panel builder"
  originSessionId: 64125f0f-c9ea-4206-bd73-07c2f93a88dc
---

## Phase C: Historical Research Panel Backfill — COMPLETE

**Shipped:** 2026-05-13 (commit `34902dbb`)  
**Branch:** origin/main  
**Duration:** 146 snapshots × ~3 sec/invocation ≈ 7 minutes runtime  
**Success rate:** 146/146 (100%)  

## Implementation Summary

### Code Changes

**tools/build_bioshort_research_panel.py** (new):
- Enumerate historical snapshots with `portfolio_positions.csv` (found 146 clean dates, 2024-10-18 → 2026-05-13)
- Orchestrate producer invocation with `--research-mode` flag for each snapshot
- Extract feature rows: as_of_date, verdict, recommendation, hedge_score, confidence, best_vehicle, xbi_beta, xbi_r2, ibb_beta, ibb_r2, primary_cost_bps, options_source, portfolio_n, portfolio_weight_sum, top_contributors, error_status
- Aggregate into panel.csv (146 rows) + backfill_manifest.json
- Safety checks: verify --research-mode exists in producer, confirm isolation before write

**tools/verify_bioshort_isolation.py** (new):
- Audit isolation: confirm panel.csv written, no mutations to live output/hedge_report/
- Report manifest metrics (snapshot count, success count, date range)
- Verify parquet status

### Output Artifacts

**artifacts/research/bioshort_backfill/**
```
panel.csv                       # 146 rows × 16 feature columns
backfill_manifest.json          # schema v1, commit 34902dbb, all 146/146 ok
reports/
  hedge_report_2024-10-18.json  # per-snapshot JSON output
  hedge_report_2024-10-18.md    # per-snapshot markdown summary
  ...
  BIOSHORT_VERDICT.json         # latest verdict (from 2026-05-13)
  BIOSHORT_VERDICT.md           # markdown summary
  archive/                       # weekly diffs (research path)
```

### Isolation Verification

✅ 146 snapshots enumerated successfully  
✅ 146/146 producer invocations succeeded (0 failures)  
✅ 147 reports written to research dir (hedge_report JSON/MD pairs + 1 verdict pair)  
✅ Live archive untouched (5 pre-existing files, 397KB — zero mutations from backfill)  
✅ panel.csv written with all 146 rows + header  

**Pseudo-PIT caveat:** Features computed using current `tools/biotech_hedge_report.py` logic against historical snapshot inputs (acceptable for descriptive panel, not for promotion claims per Spec 092 §A6).

## Unblocks

**Phase D: Forward Returns Analysis**
- Panel ready for label joining (external price/return data)
- **Requires:** PIT-safe price source for forward_1d, forward_5d, forward_20d, max_drawdown_20d, realized_vol_20d
- **Target:** Verdict accuracy (% HIT / MISS), median return by verdict, correlation with confidence

## Schema Compliance

Panel schema (16 columns):
1. as_of_date (YYYY-MM-DD)
2. verdict (e.g. DEFER, WATCH)
3. recommendation (e.g. "XBI Straight put 15% OTM")
4. hedge_score (numeric, nullable)
5. confidence (LOW, MEDIUM, HIGH)
6. best_vehicle (ticker, optional)
7. xbi_beta (numeric, nullable)
8. xbi_r2 (numeric, nullable)
9. ibb_beta (numeric, nullable — not computed in Phase C)
10. ibb_r2 (numeric, nullable — not computed in Phase C)
11. primary_cost_bps (numeric, nullable)
12. options_source (e.g. "cached", "bs", missing)
13. portfolio_n (number of positions)
14. portfolio_weight_sum (cumulative weight)
15. top_contributors (JSON array)
16. error_status (ok, skipped_*, error_*)

Forward-return / risk labels deferred to Phase D (separate join, preserves feature/label separation).

## Manifest

- **Generated:** 2026-05-13T19:39:50Z
- **Code commit:** 08d14c3aa4d60da24d67183b8843dc48fda15b81 (Phase B test fix)
- **Date range:** 2024-10-18 → 2026-05-13
- **Snapshot count:** 146
- **Success count:** 146
- **Failure count:** 0
- **Status by date:** all "ok"
- **Parquet status:** available

## Next Steps

1. Phase D: Source price history for forward-return labeling (PIT-safe, same cache as screener)
2. Phase D: Join forward returns to panel (separate pass, maintains feature/label separation)
3. Phase D: Compute verdict accuracy, median returns, confidence correlation
4. Observation: Track whether Phase D analysis yields actionable signal (pseudo-PIT caveat applies)

## QA Notes

- All pre-commit hooks (black, isort, flake8, detect-secrets) passing
- Isolation verified: zero mutations to live `output/hedge_report/` path
- Panel enumeration matches Spec 092 Phase A inventory (146 usable snapshots)
- Builder script idempotent: can re-run to refresh panel (overwrites previous)
