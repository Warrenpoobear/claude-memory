---
name: spec_104_insider_stabilization_phase_a
description: "Spec 104 Phase A implementation shipped — insider diagnostic coverage measurement (4 trading days, 100% nonblank, 0.00% variance)"
metadata: 
  node_type: memory
  type: project
  status: shipped
  originSessionId: aa59b343-1bcf-4550-8276-0cdf7344c285
---

## Spec 104: Insider Signal Stabilization — Phase A Closure

**Commit:** `b98ffbac` (2026-05-14)
**Status:** SHIPPED; awaiting Phase B (5+ snapshots requirement)

### Deliverables

1. **tools/measure_insider_coverage.py**
   - Main function: `measure_snapshot(snapshot_path)` reads rankings.csv and classifies insider_net_buy_value_90d
   - Classification logic: blank (None/empty) vs numeric; numeric: zero (0.0) vs positive vs negative
   - Output structure: snapshot_date, total_tickers, coverage dict with counts and percentages
   - Helper: `generate_date_range(start, end)` → business-day-only list
   - Helper: `emit_stabilization_report()` → markdown report with coverage table and verdict
   - Emits artifacts per snapshot (JSON) and final stabilization report (MD)

2. **tests/test_insider_diagnostic_spec104.py** (7 tests)
   - TestInsiderNotInAlphaRegistry: 3 tests verifying NOT in SNAPSHOT_COLUMNS as required, NOT in ACTIVE_SIGNALS, NOT in selector/ranker
   - TestInsiderSemantics: 2 tests confirming blank≠zero distinction preserved in measurement
   - TestInsiderNotInExpectationModel: 2 tests ensuring ExpectationErrorModel does NOT read insider
   - All tests passing

3. **artifacts/insider_diagnostics/**
   - coverage_2026_05_11.json → coverage_2026_05_14.json (4 snapshots, 299 tickers each)
   - stabilization_report_2026_05_14.md: coverage summary table + verdict

### Measurement Results

**Period:** 2026-05-11 through 2026-05-14 (4 trading days)
**Coverage:** 100% nonblank (299/299 tickers, 0 blank)
**Breakdown:** ~40% zero (no activity), ~60% activity (positive/negative)
**Stability:** 0.00% variance across all 4 days (PERFECT)

### Phase A Verdict

✅ **PASSED**
- Blank/zero semantics preserved in code
- Insider NOT promoted to alpha (confirmed via tests)
- Coverage stable and measurable
- Ready for Phase B (pending 5+ consecutive snapshots, expected ~2026-05-15)

### Phase B Prerequisites

- Measure 2026-05-15 snapshot when available
- Validate 5-day aggregate coverage ≥30% (tracked-nonblocking threshold from Spec 105 FEATURE_COVERAGE_REQUIREMENTS)
- No code/logic changes required; Phase B = measurement extension only
- Timeline: 1 additional trading day (~48 hours from 2026-05-14)

### Related Specs

- **Spec 105**: Expectation layer coverage verification (insider is tracked-nonblocking field, ≥30% threshold)
- **Spec 101**: Runway severity export (parallel work, completed)
- **Spec 102**: Historical backfill (deferred pending Spec 104 Phase B completion)

## Implementation Notes

- Worktree approach used for safe commit (post-catastrophic deletion recovery)
- Files staged with explicit pathspecs (no `git add -A`)
- Pre-commit hooks (black, isort, flake8) auto-fixed formatting
- Rebase required during push (main had newer commits)
- All 7 tests pass; no blocking issues
- Post-shipment hardening (commit `1ebd7f02`):
  * Fixed ExpectationErrorModel import path to `event_ev.expectation_error_model` (prevents silent skip)
  * Added CLI args to measure_insider_coverage.py: --start-date, --end-date, --snapshot-dir, --artifacts-dir
