---
name: 2026_05_22_ranker_review_framing
description: 2026-05-22 ranker review is governance checkpoint only; no production changes authorized
metadata: 
  node_type: memory
  type: project
  status: active
  expires: 2026-05-23
  originSessionId: 1d8fa0e0-cd32-4e95-a561-2833608ccaa3
---

# 2026-05-22 Ranker Review Framing

**Purpose**: Governance + evidence checkpoint only.  
**Authorization**: No production ranker change authorized.

---

## Hard Blockers Remaining (All Enforced)

1. **Spec 096 doctrine**: All ranker changes require Specs 094 + 095 + 100 + Checklist v2
2. **Spec 100 true ranker IC tooling**: Scaffold only; forward-return wiring and IC computation still stubbed
3. **Spec 094 marginal-value proof**: Design locked; evidence collection pending post-13F-refresh
4. **Spec 095 IC-scope proof**: Audit memo locked; tool fix (Spec 100) prerequisite
5. **Checklist v2**: Not started; gates remain locked until Specs 094/095 evidence pass
6. **13F Q1 2026 refresh / cohort distortion clearance**: Expected ~2026-05-15; validation required before evidence gates open
7. **Spec 072 D7/D8/D9 re-verification**: Must run post-13F-refresh; results due by 2026-05-22

---

## Spec 100 Timeline Clarification

Spec 100 **should complete** before any post-review ranker promotion evidence is accepted.  
**Target**: Before h20d IC checkpoint (2026-05-26) if feasible.  
**Does NOT block**: The 2026-05-22 review itself (which is governance + briefing only).

---

## Current Operating Stack (2026-05-14)

✅ **Spec 105**: CLOSED (commit `c6bcb91c`)  
- All 4 expectation fields above floors (short_interest 98.3%, close_price 100%, market_cap 100%, priced_move 83.6%)
- Insider confirmed diagnostic-only, not consumed by ranker

⏳ **Spec 104**: Phase B pending (4/5 days measured; needs 2026-05-15 snapshot for final day)

⏳ **Spec 089 Phase 1.5A**: Schema locked (commit `8bee00e4`); implementation deferred post-closures

❌ **Spec 100**: Scaffold only; not usable for promotion evidence until forward-return wiring + IC computation complete

---

## Next Concrete Operational Action

**Wait for 2026-05-15 snapshot / 13F refresh**, then (2026-05-16 onward):

1. **Close Spec 104 Phase B**: Run 5th day measurement; finalize stabilization report
2. **Validate cohort distortion clearance**: Run 6-gate validation (file freshness, as_of_date, inst_delta_z normalization, SIGNAL_ALERT, top-ticker attribution, no model changes)
3. **Update 2026-05-22 blocker table**: Post-refresh status for all 7 hard blockers

**Timeline**: Validation complete 2026-05-16 PM; CRT test 2026-05-20; 2026-05-22 review with actual post-refresh evidence status.

---

## Key Message for Review Attendees

No selector weights, ranker weights, sizing logic, Spec 072 promotion, or score_rank_pct action authorized until post-refresh evidence gates clear (post-h20d checkpoint 2026-05-26).
