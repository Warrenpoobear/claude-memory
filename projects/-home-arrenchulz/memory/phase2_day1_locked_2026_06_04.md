---
name: phase2-day1-locked-2026-06-04
description: Phase 2 Day 1 LOCKED with 2026-06-04 snapshot after decision-model audit. Composite score is non-blocking diagnostic issue.
metadata: 
  node_type: memory
  type: project
  status: active
  date: 2026-06-04
  priority: critical
  resolves: module5_fix_application_blocked_2026_06_04
  originSessionId: a6447a04-5415-446a-8dde-c297c95a4065
---

# Phase 2 Day 1 LOCKED — 2026-06-04 ✅

## Governance Decision: APPROVED

**Phase 2 begins with 2026-06-04 snapshot as Day 1 baseline.**

### Why This Snapshot Was Approved

**Decision-Model Impact Audit** proved that the composite_score collapse (0.04–0.10 range) is:
- ❌ NOT consumed by decision engine
- ✅ Decision model uses ranker_v2_score (healthy: 0.60–0.66 range)
- ✅ Top-60 portfolio: 96.7% stable vs May 29 (only 2 tickers swapped)
- ✅ Eligibility gates: functional (208 eligible)

**Verdict**: Composite score is a **cosmetic/diagnostic issue**, not a **decision-model blocker**.

### Top-60 Locked Holdings

**Confirmed stable across May 22 → May 29 → June 4:**
- COGT, DNTH, NRIX, URGN, ALMS (top 5 unchanged)
- 58/60 overlap vs May 29 (96.7%)
- Changes: MLYS/VERA out → GLUE/IMTX in

### Composite Score Disposition

**Known non-blocking issue** with documentation:
- Root cause: cohort-relative normalization (within-stage percentile ranking)
- Impact: diagnostic/reporting field only
- Timeline: post-Phase-2a audit recommended (~June 17+)
- Status: logged for future investigation

### Phase 2 Baseline

| Metric | Value |
|--------|-------|
| Day 1 Date | 2026-06-04 |
| Portfolio Mode | Paper-only tracking |
| Eligible Tickers | 208 |
| Top-60 Locked | Yes |
| Decision Model Status | Healthy |
| Ranker V2 Score | 0.60–0.66 (stable) |

---

## Operational Setup

- **Daily monitoring**: Authorized (manual/on-demand, awaits cron setup)
- **Governance gates**: Drawdown vs XBI (live after next snapshot), 13F Jaccard weekly, IC observable (~June 17)
- **Path C integration**: Separate governance, extended through ~2026-06-17
- **Checkpoints**: ~30d, ~60d, ~90d post-lock

---

## Governance References

- Approval memo: `PHASE2_DECISION_MODEL_AUDIT_2026_06_04.md`
- Day 1 lock: `PHASE2_DAY1_LOCK_2026_06_04.md`
- Composite diagnostic: `diagnostic_normalization_analysis_2026_06_04.md`
- Path C extended: `PATH_C_DECISION_LOG_2026_06_03.md`

---

## Next Immediate Actions

1. Wire Phase 2 daily tracking cron (10:15 AM ET)
2. Validate baseline artifacts (holdings, performance, churn)
3. Test portfolio_positions.csv output
4. Activate drawdown vs XBI monitoring (live June 5+)

---

**Phase 2 is LIVE with June 4 baseline. Ready for daily execution.**
