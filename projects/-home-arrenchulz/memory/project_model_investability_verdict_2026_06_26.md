---
name: project-model-investability-verdict-2026-06-26
description: "Operator investment verdict on the biotech screener model — not investable yet, Phase 3 substantially explained as regime-input-contaminated, corrected-regime ranking replay is next gate"
metadata: 
  node_type: memory
  type: project
  status: active
  originSessionId: ee7dd5fd-41f8-494b-a2a7-14094857cdfa
---

Operator verdict (2026-06-26): **Interesting research system: yes. Investable model: not yet.**

**Phase 3 explanation status (updated 2026-06-26):**
Phase 3 (May 18–Jun 9) is now substantially explained: the regime detector was offline (UNKNOWN/neutral weights) during a period PIT-safe reconstruction classifies as BEAR throughout (VIX 15–22, XBI −5% to −14% vs SPY 30d). The old Phase 3 backtest evaluated UNKNOWN/neutral behavior during a genuine BEAR regime — it is *regime-input-contaminated*, not clean evidence of model failure. However, it is not full investability clearance because the corrected BEAR-weighted rankings were not replayed end-to-end. Corrected BEAR weights would have shifted rankings (momentum −20%, quality +20%, financial +20%) but whether that improves top-30 performance is still unproven.

**Gates COMPLETE (2026-06-26):**

`PHASE3_CORRECTED_REGIME_RANKING_REPLAY_DIAGNOSTIC_NO_MODEL_CHANGE`
Result: 16/16 Phase 3 dates — identical top-30 under corrected BEAR regime. ranker_v2 uses only coinvest_score_z and financial_score (both regime-independent). Phase 3 mean IC = −0.048 is unchanged. Regime-input alternative RULED OUT.

`PHASE3_COMPONENT_ATTRIBUTION_DIAGNOSTIC_NO_MODEL_CHANGE`
Result: Component attribution complete across all 16 Phase 3 dates, 8 target names.
Failure modes: DRUG=FINANCING_UNDER_PENALIZED, CELC/ABVX=EES_VETO_FAILED, PRAX/TYRA=UNEXPLAINED.
Structural finding: financial_z is nearly identical between losers (−0.707) and winners (−0.719) — financial stress does NOT discriminate. Discriminating signals (EES losers −0.368 vs winners +0.674, momentum 48.8 vs 83.6, clinical 36.2 vs 57.1) are all outside ranker_v2.
Core issue: ranker_v2's negative financial weight promotes financially stressed names without catalyst quality discrimination; ees_v3 exists but is not a ranker_v2 input.
Output: `artifacts/autopsy/phase3_component_attribution/`

**Prior gate (closed):**
`PHASE_3_INVERSION_EXPLANATION_REQUIRED_BEFORE_CAPITAL_SCALE` — Regime-input alternative ruled out. Phase 3 failure modes identified.

**Why Phase 3 looked like inversion (revised understanding):** The model ran on UNKNOWN/neutral weights during a genuine BEAR period where XBI was underperforming SPY by 5–14% over 30 days. A momentum-biased ranker running neutral weights during sector risk-off is expected to underperform — this is now the leading explanation over "model breakdown."

**Use-case verdict:**

| Use case | Verdict |
|---|---|
| $100 live account / learning harness | Reasonable |
| Paper trading with full audit trail | Yes |
| Human-reviewed idea generation | Yes |
| Model-selected top-30 basket | No |
| Automated sizing / production capital | No |
| Marketing as proven alpha | Absolutely not |

**Next milestone gate:**
`PHASE_3_INVERSION_EXPLANATION_REQUIRED_BEFORE_CAPITAL_SCALE`

**Phase 3 autopsy candidate causes:**
1. Momentum/regime detector lagged
2. Catalyst/veto stack over-penalized risk during recovery
3. EES/veto logic suppressed names that beta would carry
4. Top-ranked names too idiosyncratic — missed sector move
5. XBI rally driven by names outside model's preferred universe
6. Model is structurally defensive after drawdowns

**Minimum bar to scale capital:**
- 6+ months clean PIT / live-forward evidence
- Mean IC > 0.04
- Positive excess return across ≥55% of non-overlapping forward windows
- Regime-gated version avoids Phase 3-style anti-prediction
- No options/catalyst lookahead
- Human-review layer confirms top ideas are economically coherent

**Why:** Operator determined this in context of the YTD PIT backtest (v1.4+ clean: −14.8pp, mean IC +0.010, Phase 3 IC range −0.05 to −0.21 for 19 snaps). See [[ees-shadow-monitor-state-2026-06-23]].

**How to apply:** Do not scale capital, do not run automated sizing, do not claim investability until Phase 3 explanation is in hand and the minimum bar above is met. Current right use: biotech research OS, idea generation, human-review routing.
