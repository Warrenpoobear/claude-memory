---
name: Spec 049 Signal Framework Results
description: Phase 1-5 complete — coinvest_score_z is the dominant signal, clinical_score_v2_z rejected as anchor, rank-weighting now justified
type: project
---

**Spec 049 COMPLETE** (2026-04-03) — Selector/Ranker Signal Backtest Framework

## Key findings

- **coinvest_score_z is the strongest signal in the system** — best selector (Δ=+1.75pp, t=3.05), best ranker (IC=0.106, t=3.92), regime stable, 100% coverage
- **clinical_score_v2_z is destructive** — negative selector Δ (−0.68pp), negative ranker IC (−0.02), cumulative −48.5pp. Adding it to any bundle makes it worse.
- **Recommended selector: B6** — coinvest_score_z (65%) + inst_delta_z (35%), Δ=+1.85pp, t=3.56, IR=0.43
- **Recommended ranker: R7** — coinvest_score_z (65%) + inst_delta_z (35%), IC=0.106, t=4.08, RW−EW net=+1.53pp/mo
- **Rank-weighting is now justified** — reverses prior conclusion that EW was always better (old ranking used clinical anchor which was the problem)
- **financial_score REJECT** — damages all selector bundles
- **competitive_intensity_z REJECT** — oncology crowding confirmed dead

## Regime
- All bundles improve in bear markets; the differentiator is bull-market behavior
- B6/R7 are approximately regime-neutral (bull Δ = −0.15pp) — best of all bundles
- clinical-heavy bundles crater in bull markets (−5.62pp)

## Infrastructure built
- `scripts/research/build_signal_research_panel.py` → 11,145 rows, 255 cols, 71 snapshots
- `scripts/research/run_signal_cards.py` → 79 signal cards (13 PROMOTE, 31 SHADOW, 21 HOLD, 14 REJECT)
- `scripts/research/test_selector_bundles.py` → 12 bundles tested
- `scripts/research/test_ranker_bundles.py` → 15 bundles tested
- All outputs in `output/signals/`

## Next steps
- 30-day shadow validation before production change
- Monitor coinvest_score_z IC quarterly (dominance risk)
- Shadow R11 (6-signal with options) until options coverage > 70%

**Why:** PIT-corrected benchmark showed old alpha was contaminated. This framework replaces informal weighting with governed, stage-separated evidence.

**How to apply:** Any discussion of DEM scoring, anchor signals, or rank-weighting should reference these results. Do not cite clinical_score_v2_z as the anchor — it is rejected.
