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

**Built PR #441 (commit 417e9e82):** `tools/stress_wrapper_monitor.py` + `fill_forward_returns.py::compute_name_forward_returns()`. Shadow-only, NO_MODEL_CHANGE.

**Built commit e9a94bc2 (2026-06-28):** `scripts/research/conditional_risk_wrapper.py` + `scripts/research/stress_wrapper_card.py`. Branch: `research/stress-wrapper-shadow-2026-06-28`.
- 186-window backfill complete: 108 ACTIVE (conditions met), 78 PASSIVE
- ACTIVE windows: raw_top30 = -0.11pp, risk_guarded = +0.07pp → **+0.18pp delta, 51% vs 45% hit rate**
- PASSIVE windows: all baskets = +0.97pp (guards are neutral — convexity preserved)
- Current card: MILD_RALLY regime (+6.8% XBI trailing), wrapper ACTIVE via cond_B+C (3 ROs, 5 EES-False)
- Promotion gate: 20 ACTIVE windows with positive delta → 0/20

**⚠️ REGIME CONFLICT — PARTIALLY RESOLVED:** YTD 186-window analysis confirms XBI bearish <-3% → +1.08pp avg (67% hit). MILD_RALLY 3-8% → -0.41pp (33% hit). This CONFIRMS operator's "bearish=best" lesson from this year's data. Conflict with `dem_corpaction_repaired.json` (regime_bear t=1.69 was weakest) is likely a sample/period difference — the corpaction data covers a different time range. Regime classification in stress_wrapper_card is INTERPRETATION ONLY (no regime-aware ranking change). The conflict is de-risked by keeping it as interpretation context, not a trading gate.

**Investability status:** PILOT_INVESTABLE_WITH_SHADOW_GUARDS (not fully investable). Promotion question: does raw Top-30 + monitored stress guards produce better *net forward* outcomes without killing convexity? See [[project-model-investability-verdict-2026-06-26]] (gate ladder, bootstrap p≈0.009, batting-avg/payoff). Do NOT: change ranker, promote EES, swap Top-30→Top-60, manually remove names, or size up on the strong in-sample bootstrap.
