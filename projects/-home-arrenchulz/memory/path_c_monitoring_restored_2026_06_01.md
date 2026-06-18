---
name: path_c_monitoring_restored_2026_06_01
description: Path C governance monitoring fully operational; drawdown metric wired; Phase 2 Day 1 locked
metadata: 
  node_type: memory
  type: project
  status: active
  date: 2026-06-01
  expires: 2026-06-03
  related: 
    - governance_decision_path_c_2026_05_28
    - phase2_execution_log
  originSessionId: b4c593fc-9d54-4d1e-a337-a8143bf78810
---

# Path C Governance Monitoring — Restored & Locked (2026-06-01)

**Status:** MONITORING OPERATIONAL  
**Commit:** `b87d9a8d` (feat: implement Path C drawdown monitoring)  
**Ready for:** June 3 window-close decision

## Implementation Complete

**What was implemented:**
- `tools/compute_path_c_drawdown.py`: Locked Day 1 portfolio drawdown vs XBI metric
- `run_screen.py`: Integration into snapshot writer (portfolio_positions.json)
- `tools/daily_path_c_monitoring.sh`: Enhanced status reporting (PASS/FAIL_HARD_EXIT/DATA_UNAVAILABLE/METRIC_MISSING)
- Tests: 5/5 passing (PASS, FAIL, DATA_UNAVAILABLE cases)

**Metric (locked):**
```
drawdown_vs_xbi_pp = 
  (portfolio cumulative return since 2026-05-29) 
  - (XBI cumulative return since 2026-05-29)

Hard exit: FAIL_HARD_EXIT if result <= -2.00pp
```

**Portfolio scope:** Phase 2 paper portfolio (Day 1 holdings only, not universe)

## Operational Integration

**Fields added to portfolio_positions.json:**
- `drawdown_vs_xbi_pp`: float | null
- `drawdown_vs_xbi_status`: PASS | FAIL_HARD_EXIT | DATA_UNAVAILABLE | METRIC_MISSING
- `drawdown_vs_xbi_baseline_date`: "2026-05-29"
- `drawdown_vs_xbi_latest_date`: string | null

**Daily monitoring (`daily_path_c_monitoring.sh` step [2/4]):**
- ✓ PASS: {pp:.2f}pp (outperforming XBI)
- 🔴 FAIL_HARD_EXIT: {pp:.2f}pp (underperforming by 2+pp) 
- ⏳ DATA_UNAVAILABLE (prices not ready)
- ✗ METRIC_MISSING (fields not in JSON)

## June 3 Decision Gate

**Current state (2026-06-01):**
- IC observability: `IC_UNOBSERVABLE` (expected PIT cold-start)
- 13F cohort: Stable at Jaccard 0.875 (no hard exit)
- Drawdown monitoring: ✓ RESTORED (was missing, now implemented)
- Emergency triggers: None active

**Options at window close:**
1. **EXTEND Path C until ~2026-06-17** (first observable IC)
   - All monitoring channels operational
   - IC unobservability is expected cold-start
   - No hard-exit conditions met
   
2. **REVERT to HOLD** (conservative)
   - Closes override immediately
   - Triggers Path A design (post-freeze)

**Governance stance:** Monitoring fully instrumented; decision gate is clear.

## Boundary Assurance

✓ Monitoring/instrumentation only  
✓ No ranker changes  
✓ No selector changes  
✓ No sizing changes  
✓ No signal changes  
✓ No Path A implementation  
✓ No cron changes  
✓ No production behavior changes  

---

**Phase 2 Status:** ACTIVE (Day 1 locked 2026-06-01)  
**Path C Status:** MONITORING_OPERATIONAL (June 3 decision pending)  
**Next action:** Operator decision on window close (extend or revert)
