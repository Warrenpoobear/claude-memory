---
name: project-dem-model-lesson-2026-06-28
description: "DEM model edge = quality/survivability selection (convex), failure = repeat-offender/event-premium exposure; stress-wrapper shadow built, not the ranker"
metadata: 
  node_type: memory
  type: project
  status: active
  related: 
    - project-model-investability-verdict-2026-06-26
    - project-rank-depth-shadow-2026-06-28
  originSessionId: 288d161d-2b0d-4ba9-a697-3a0270b79120
---

**Operator model lesson (2026-06-28):** DEM's edge is **quality/survivability selection under stress (convex upside), NOT momentum**. The avoidable failure mode is **event-premium / repeat-offender exposure, NOT a broken ranker**. Actionable conclusion: **keep the ranker frozen; add a conditional stress *wrapper* (shadow first), do not change the core model.**

**Design (operator-specified):** wrapper activates only in failure-type environments (`rolling_4w_xs<=-5pp` OR `repeat_offenders>=2` OR `EES_false_top30>=5` OR build_window/less_binary exposure elevated). When active, shadow-compare raw_top30 vs EES-guarded / repeat-offender-guarded / rank31_60-replacement baskets. **EES = insurance not alpha** (helps failure windows, drags success windows → no unconditional veto; escalation: EES-False=warning, +repeat-offender=stronger, +build_window+recent-neg=shadow exclusion). **Ranks 31-60 = stress replacement bench only** (Top-30 carries convexity; never wholesale Top-60 swap). Regime = interpretation only, NOT regime-aware ranking (classify weeks BEAR/MILD_RALLY/STRONG_RALLY so mild-rally lag isn't misread as failure).

**Built (PR #441, commit 417e9e82, "foundation first"):** `fill_forward_returns.py::compute_name_forward_returns()` (per-name forward return+xs, the data unlock) + `tools/stress_wrapper_monitor.py` (repeat-offender table + `conditional_risk_wrapper_active` flag + weekly card → `artifacts/validation/stress_wrapper/`). 11 tests. Shadow-only, NO_MODEL_CHANGE/NO_SELECTOR_CHANGE. Current card: wrapper INACTIVE (rolling 4w +2.5%, 0 offenders). PENDING (need matured fwd windows): substitution net delta, EES-guarded basket return, catalyst-bucket exposure.

**⚠️ FLAGGED CONFLICT — needs reconciliation:** operator premise "model strongest when XBI bearish" CONFLICTS with the validated corpaction regime breakdown (`dem_corpaction_repaired.json` window_statistics): regime_bear t=1.69 (mean +1.94pp) was the **WEAKEST** of the three vs bull t=2.33 / neutral t=2.26. Either a different artifact (regime-conditional-alpha / backfilled monitors) supports "bearish=strongest", or the claim needs correction before regime interpretation is wired. Do NOT hard-code "bear=expected outperform" until reconciled.

**Investability status:** PILOT_INVESTABLE_WITH_SHADOW_GUARDS (not fully investable). Promotion question: does raw Top-30 + monitored stress guards produce better *net forward* outcomes without killing convexity? See [[project-model-investability-verdict-2026-06-26]] (gate ladder, bootstrap p≈0.009, batting-avg/payoff). Do NOT: change ranker, promote EES, swap Top-30→Top-60, manually remove names, or size up on the strong in-sample bootstrap.
