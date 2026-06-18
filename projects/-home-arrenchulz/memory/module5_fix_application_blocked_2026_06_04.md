---
name: module5-fix-application-blocked-2026-06-04
description: Module 5 fix code exists but June 4 snapshot still shows broken composite scores (0.06-0.10 range)
metadata: 
  node_type: memory
  type: project
  status: active
  date: 2026-06-04
  severity: critical
  blocks: phase2-unblocking
  originSessionId: a6447a04-5415-446a-8dde-c297c95a4065
---

# Module 5 Fix Application Blocked — June 4, 2026

## Critical Issue
The Module 5 fix (commit 01f9aeda6) EXISTS and is APPLIED, but **composite scores are still collapsed** (0.06, 0.10, 0.04 instead of 50-60).

**ROOT CAUSE FOUND**: The problem is NOT the aggregation fix. The UPSTREAM normalized component scores are already broken before reaching the aggregation logic:
- **DNTH**: normalized_scores = {clinical: 5.0, financial: 5.2} ← TOO LOW
- **BMRN**: normalized_scores = {clinical: 66.98, financial: 69.52} ← NORMAL
- **BEAM**: normalized_scores = {clinical: 77.0, financial: 79.85} ← NORMAL

The broken normalized values come from `_apply_cohort_normalization_v3()` or `_rank_normalize_winsorized()` — these functions are COLLAPSING the component scores for some tickers.

## Evidence

### Fix Is In Code ✅
- **Commit**: 01f9aeda6 "fix(module_5): weakest-link aggregation collapse..."
- **File**: `module_5_scoring_v3.py`
- **Lines**: 3970–3989
- **Change**: Use `comp.normalized` directly instead of reconstructed `underlying = contributions[c] / effective_weights[c]`
- **Tests**: 2/2 regression tests PASS (`test_module_5_weakest_link_regression.py`)
- **In HEAD**: ✅ `git show 931e51b40:module_5_scoring_v3.py` includes fix

### But Production Broken ❌
- **June 4 snapshot**: `data/snapshots/2026-06-04/rankings.csv`
- **DNTH**: 0.0566 (should be ~55)
- **NRIX**: 0.0599 (should be ~55)  
- **URGN**: 0.1000 (should be ~55)
- **Validation**: PASS (all 4 gates), but scores are collapsed

### Production Imports ✅
1. `run_screen.py` → imports `module_5_composite_with_defensive`
2. `module_5_composite_with_defensive` → imports `module_5_composite_v3`
3. `module_5_composite_v3` (line 93) → imports `_score_single_ticker_v3` from `module_5_scoring_v3`
4. Call site: line 964 of `module_5_composite_v3.py`
5. The function IS being called with fixed code ✅

## Hypotheses

### Hypothesis 1: Python Bytecode Cache (MOST LIKELY)
**Issue**: `.pyc` files cached BEFORE fix was applied
**Solution**: Clear cache before next run
```bash
find . -name "*.pyc" -delete
find . -name "__pycache__" -type d -exec rm -rf {} +
```

### Hypothesis 2: Wrong Code Path
**Issue**: Production using different scoring path that bypasses `_score_single_ticker_v3`
**Investigation**: Add logging to confirm `_score_single_ticker_v3` is called

### Hypothesis 3: Component Scores Empty
**Issue**: `component_scores` list empty, fix can't find normalized values
**Investigation**: Add diagnostics to check list size and values

### Hypothesis 4: Fix Applied to Wrong File
**Status**: UNLIKELY - fix is in correct file `module_5_scoring_v3.py` and tests pass

## Blocking Impact

- **Phase 2 restart blocked**: Cannot lock canonical Day 1 snapshot with collapsed scores
- **SEC 8K incident moot**: Data issues secondary if scoring is broken
- **Path C monitoring waiting**: Cannot track portfolio changes if baseline is corrupted

## Next Steps (URGENT)

1. **Clear cache** (5min)
2. **Add debug logging** to `_score_single_ticker_v3` to confirm fix code path (10min)
3. **Re-run snapshot** with cache cleared (20min)
4. **Validate** composite scores in 50-60 range (5min)
5. **Lock Phase 2 Day 1** upon validation (15min)

---

## Files Involved
- `module_5_scoring_v3.py` (200KB, fix at lines 3970–3989)
- `module_5_composite_v3.py` (83KB, calls fixed function at line 964)
- `module_5_composite_with_defensive.py` (imports v3)
- `run_production_screen.py` (entry point)
- `data/snapshots/2026-06-04/` (broken snapshot)
- `tests/test_module_5_weakest_link_regression.py` (PASS)

## Related Memories
- `[[canonical-snapshot-2026-06-01-failure]]` — original composite aggregation bug
- `[[path_c_decision_log_2026_06_03]]` — governance decision (complete, waiting on snapshot)
