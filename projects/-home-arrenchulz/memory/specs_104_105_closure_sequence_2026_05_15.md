---
name: specs_104_105_closure_sequence
description: Spec 104/105 closure sequence pending 2026-05-15 snapshot; QA + measurement triggers + close conditions
metadata: 
  node_type: memory
  type: project
  status: active
  expires: 2026-05-16
  originSessionId: aa59b343-1bcf-4550-8276-0cdf7344c285
---

## Closure Sequence: Specs 104 & 105 (2026-05-15 Snapshot)

**Trigger:** 2026-05-15 snapshot available (typically ~04:00 ET next business day)

### Spec 105 Closure (Expectation Coverage Verification)

**Command:**
```bash
python tools/production_qa_check.py --as-of-date 2026-05-15 \
  | tee artifacts/spec_105/coverage_verification_2026-05-15.txt
```

**Close condition:** All feature_coverage floors PASS
- short_interest_pct ≥ 90%
- close_price ≥ 99%
- market_cap_mm ≥ 95%
- priced_move_pct ≥ 80%
- insider_net_buy_value_90d ≥ 30% (tracked_nonblocking; not required)

**Status on PASS:** Spec 105: CLOSED (live QA artifact verified)

### Spec 104 Phase B Closure (Insider Diagnostic Stabilization)

**Command:**
```bash
python tools/measure_insider_coverage.py \
  --start-date 2026-05-11 \
  --end-date 2026-05-15
```

**Output:** artifacts/insider_diagnostics/coverage_*.json (5 snapshots); stabilization_report_2026_05_15.md

**Close conditions:**
1. **Nonblank coverage:** All 5 snapshots ≥ 100% (0 blank values across all tickers)
2. **Variance:** Coverage variance across 5 days ≤ 5 percentage points
3. **Diagnostic guards:** insider NOT in ACTIVE_SIGNALS, NOT in SNAPSHOT_COLUMNS (required), NOT consumed by ExpectationErrorModel — all verified via tests passing

**Status on PASS:** Spec 104: Phase B CLOSED; full closure: RESOLVED

### Related Specs (Informational)

- **Spec 101**: CLOSED (ev_severity_score export + schema)
- **Spec 102**: CLOSED (19-snapshot backfill; commit b8df2663)
- **Spec 087 B-series**: Formally closed
- **Spec 087C**: Phase A/B research shipped
- **Spec 088 Phase B**: Shipped

### Commit Scope (Critical)

**COMMIT ONLY:** Closure artifacts/memos
- `artifacts/spec_105/coverage_verification_2026-05-15.txt` (QA output)
- `artifacts/insider_diagnostics/coverage_*.json` and `stabilization_report_2026_05_15.md` (Spec 104 measurement artifacts)

**DO NOT COMMIT:** Regenerated production data
- `data/snapshots/2026-05-15/` and any other modified snapshots
- All snapshot data remains gitignored by design

### Implementation Notes

- Both commands are idempotent; safe to re-run if snapshot freshness in doubt
- Closure memos/artifacts should be committed immediately post-verification
- 2026-05-15 data freshness: verify via `data/snapshots/2026-05-15/rankings.csv` exists
