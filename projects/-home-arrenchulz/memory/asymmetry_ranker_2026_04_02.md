---
name: asymmetry_ranker_2026_04_02
description: Top-30 asymmetry score design decisions, status, and accumulation plan — shadow diagnostic not promoted signal
type: project
---

## Top-30 Asymmetry Score (2026-04-02)

**File**: `scripts/research/top30_asymmetry_score.py`
**Status**: SHADOW DIAGNOSTIC — not a promoted signal. Accumulating daily.

### Design
- Second-stage ranker: orders DEM top-30 by upside skew relative to market pricing
- Components: cheap_surface (35%), event_loading (20%), skew_lean (20%), iv_momentum (15%), hard_catalyst (10%)
- Gated by liquidity state + EPD quality
- Wired into daily production (Step 5k.9)

### Current state (day 1)
- 28/30 scored, 2 gated out (SION thin+partial, CLYM no EPD)
- implied_vs_realized: NOW CONNECTED (was empty, fixed event_move_table pass-through)
- cheap_vol_score range narrow (0-0.22) — do not recalibrate yet
- Hard + liquid cohort: only 2/30 — too small to evaluate separately
- EPD history: 1 date — need ~20+ for meaningful backtest

### Discipline
- **Do NOT tinker with formula** until enough dates to judge (target: 20+ monthly snapshots)
- **Do NOT promote** until ranker harness shows positive top-30 IC + RW beats EW net of costs
- Keep running daily, let accumulate
- Evaluate via `ranker_evaluation_harness.py --signal asymmetry_score` once in rankings.csv

### Missing EV terms (future joins)
- CRT outcome priors → P(HIT) by catalyst type
- Realized move lookup → implied_vs_realized in EPD (now connected but REGULATORY not in table)
- AACT deltas → execution signals

### Evaluation plan (when ready)
- Score quintile returns (h5, h20)
- EW vs asymmetry-weighted spread
- Liquid-only subset
- Hard/regulatory subset
- Promotion bar: top-30 IC positive, RW beats EW net of costs

**Why:** DEM is a proven selector but has zero ranking power within top-30. This score is the bridge to a future asymmetry ranker. The right posture is patient accumulation, not premature optimization.

**How to apply:** When asked about ranking or within-top-30 ordering, point here. Do not propose formula changes until backtest history exists.
