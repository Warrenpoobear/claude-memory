---
name: ranker_pivot_2026_04_02
description: Pivot ranker roadmap away from options surface shape to non-options signals (inst_delta, volume_z, AACT deltas)
type: feedback
---

Options surface shape does NOT predict within-top-30 returns. 50-month backtest: IC negative at all horizons (v1 and v2). The asymmetry score is a shadow diagnostic for discretionary review, not a systematic ranker.

**Why:** Event premium, skew richness, IV momentum, cheap vol, and implied_vs_realized ratio do not differentiate performance inside the DEM top-30. The market is usually right about which catalysts are big. Surface profile ≠ mispricing.

**How to apply:**
- Options lane = ops/discretionary context (outlier flags, digest, surface regime). NOT ranking.
- Do not propose options-based weight changes or systematic reweighting from EPD features.
- Next ranker candidates are non-options: inst_delta_z (anchor), total_volume_z (Apr 7 gate), AACT timeline deltas (Phase 3), catalyst-type priors.
- Promotion bar unchanged: top-30 IC positive + RW beats EW net of costs.
- Sequence: total_volume_z validation → AACT deltas → inst_delta weight sensitivity → non-options ranker v1.
- Stop: no more options surface-shape weight tuning, no event premium rescue attempts, no full-universe rank experiments, no fixed sleeve revisits.
