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

**CANONICAL = PR #441** (`tools/stress_wrapper_monitor.py` + `fill_forward_returns.py::compute_name_forward_returns()`, merged to main). A **concurrent agent** also built a parallel implementation at commit **e9a94bc2** (`scripts/research/conditional_risk_wrapper.py`, `stress_wrapper_card.py`, `ees_guarded_shadow.py`, `repeat_offender_monitor.py`, `dem_regime_forward_monitor.py`, etc. — 22 files, local-only, NOT pushed/merged, no PR). **Operator decision (2026-06-28): keep #441 canonical; DO NOT merge e9a94bc2; extract only read-only diagnostics; archive the branch.** Archived as tag `archive/concurrent-stress-wrapper-2026-06-28`.

**⚠️ REGIME RECONCILIATION — UNRESOLVED / MIXED (corrected; prior "CONFIRMS bearish=best" was an overclaim):** evidence is definition- and sample-dependent. Full-history HAC regime analysis (`dem_regime_conditional_alpha.json`, 69 monthly periods, trailing-20d-XBI def, Newey-West) shows **bear is the THINNEST edge** (mean +1.94pp, t=1.95, hit 62%) — neutral best (+6.76pp), bull solid (+3.05pp); alpha classified `RALLY_PARTICIPATION_ALPHA`. The concurrent narrower weekly/YTD stress cut (<-3% threshold) suggested bear/stress windows look better (+1.08pp). Both can be true under different definitions, but **"bearish=best" is NOT established** and the larger/cleaner sample points the other way. **Conclusion: regime is interpretation-only — must NOT drive ranking, selection, sizing, or guard activation without forward validation.** Stress-wrapper activation is driven by realized drawdown / repeat-offenders / EES-false / replacement-bench behavior, NOT by regime label. Reconciliation artifact: `artifacts/backtests/regime_reconciliation/`.

**Investability status:** PILOT_INVESTABLE_WITH_SHADOW_GUARDS (not fully investable). Promotion question: does raw Top-30 + monitored stress guards produce better *net forward* outcomes without killing convexity? See [[project-model-investability-verdict-2026-06-26]] (gate ladder, bootstrap p≈0.009, batting-avg/payoff). Do NOT: change ranker, promote EES, swap Top-30→Top-60, manually remove names, or size up on the strong in-sample bootstrap.
