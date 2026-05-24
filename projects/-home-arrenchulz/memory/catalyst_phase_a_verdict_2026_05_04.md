---
name: Catalyst Phase A verdict (2026-05-04)
description: Catalyst role verdicts after Phase A descriptive audit — selector ACTIVE/NO_MORE_WEIGHT (already weighted via selector_catalyst_block), ranker SHADOW only on catalyst_score, EV non-evaluable until prediction-binder wired
type: project
status: active
related: clinical_phase_a_verdict_2026_05_04.md, regime_post_cohort_change_distortion_2026_04_28.md, spec_072_screener_vnext_2026_05_01.md
supersedes: (extends — does not invalidate prior catalyst-related findings)
originSessionId: 293f6ecf-b892-40d7-8ab7-99e0bf62faca
---
# Catalyst Phase A verdict (2026-05-04)

Phase A descriptive audit run 2026-05-04 against actual production baseline (2-feat ranker_v2 deployed_live_pilot; catalyst already in selector via `selector_catalyst_block` default 0.25 weight in `module_5_composite.py:682`). Sample: 17 post-PIT-fix snapshots, n_avg=297. Resolved outcomes since 2026-04-13: 43 HIT/MISS + 12 NEEDS_REVIEW + 2 DELAYED.

## Verdicts (frozen)

- **Selector → ACTIVE / NO_MORE_WEIGHT.** Catalyst already carries selector weight through `selector_catalyst_block` (cross-sectional ρ vs selector_score = +0.27, vs final_score = +0.27). Top-30% representation is FLAT across proximity buckets (0-30/31-60/61-120/120+/no-cat all ≈30%) — production already absorbs the proximity sweet spot via `catalyst_decay_w`. NO_CATALYST names sink to median rank 267 (vs CLINICAL median 133). Adding raw has-catalyst / proximity / catalyst_in_window as new selector weights would either double-count or import 18.8% false-catalyst noise. **Lane closed for new weight.**
- **Ranker → SHADOW (single candidate, deferred + gated).** Only `catalyst_score` is the candidate (+0.19 conditional ρ within top-coinvest, range [+0.09, +0.26], 17/17 snaps positive — much more stable than clinical's +0.07-0.08). **Materially stronger conditional signal than clinical**, but: (a) hard to disentangle from selector_catalyst_block which already encodes most of it; (b) 18.8% false-catalyst contamination at universe (6-8% at top-30/60); (c) sample underpowered (16 trading days post-PIT). **Defer to ≥ 2026-05-22** (post-cohort-window close + post-13F refresh). False-catalyst hygiene gate required before any ranker test. Do NOT add `catalyst_in_window` separately — overlaps `catalyst_score` mechanically.
- **EV / catalyst predictions → SHADOW + non-evaluable.** Preferred lane per user. 43 resolved HIT/MISS exist with 81% aggregate hit rate (mostly definitional — event-as-predicted, not stock direction). Single anti-signal: `CORPORATE_UPDATE` 0/6 hit rate (n=8 too small for verdict). **`prediction_composite_score` binder: CLOSED (spec_073, commit `09b04fc1f`, 2026-05-04) — 113/120 records now populated.** Post-binder sanity audit (2026-05-06) found `prediction_composite_score` is the WRONG field for EV calibration: it is a screener/stock-quality composite (coinvest + financial + inst_delta), near-degenerate (12 distinct values, 79% in 4 buckets), Brier WORSE than baseline, HIT rate INVERTED (Hi bucket = worst). The correct field is `event_ev_p_hit` from `event_ev/outcome_model.py` (Bayesian posterior per-event P(HIT)); it exists in `artifacts/event_ev/{date}_event_ev_full.json` but is NOT bound into resolution records. Spec_077 scoped 2026-05-06: forward-only binding via node_id exact match / (ticker, date ±7d) fallback. Backfill not safe (30% match rate). Post-PIT HIT/MISS n=7 — calibration not runnable until n≥30 (~2026-07-01).

**Why:** Catalyst differs structurally from clinical. Clinical was negatively-correlated with production unconditionally and had to be argued for via Spec 057's conditional lane. Catalyst is *already in production* via selector and is positively-correlated throughout. The Phase A question for catalyst was therefore not "does it have signal?" (yes) but "is there signal beyond what the selector already captures?" — and the answer is "maybe (+0.19 residual conditional ρ) but unprovable without false-catalyst hygiene + outcome-binder + power."

**How to apply:**
- Do NOT propose adding more catalyst weight to selector. Existing 0.25 weight via `selector_catalyst_block` is the production design.
- Treat `catalyst_score` as the single ranker-shadow candidate; do NOT broaden to other catalyst features without explicit re-audit.
- Treat resolved-outcome `HIT` as event-occurred-as-predicted; NOT a stock-direction signal.
- `CORPORATE_UPDATE` 0/6 hit rate is the only candidate negative signal — flag for monitoring but n=8 is below promotion power.
- 18.8% false-catalyst contamination (15 high-conf + 1 ambiguous out of 85 CT.gov audited at 2026-04-29) is a real hygiene problem — must be addressed before any catalyst-quality ranker test.
- Two dead production fields: `de_sort_contrib_catalyst_bonus` and `de_sort_contrib_calendar_alpha` both 0% nonzero across 17 snapshots. The de_sort path is wired but never fires. Either remove or fix.
- Open work item: catalyst prediction-binder (write `prediction_composite_score` and `prediction_dem_rank` into resolution records at decision time, so EV calibration can bin by prediction quality). Required before 2026-05-22 review can verdict EV. Symmetric in shape to the clinical TX outcome binder; different writer.
