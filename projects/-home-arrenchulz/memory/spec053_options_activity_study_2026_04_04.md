---
name: Spec 053 Options Activity Study
description: Comprehensive study proving options signals do NOT beat institutional baseline — lane closed for systematic alpha
type: project
---

## Spec 053 — Options Activity Study (2026-04-04)

**Result: OPTIONS DO NOT PREDICT BIOTECH RETURNS AS SYSTEMATIC ALPHA.**

### Key Findings
- 37 options signals tested across 71 PIT-safe snapshots (11,145 ticker-months)
- 27 NO_GO, 6 SHADOW, 3 HOLD, 1 PROMOTE_CANDIDATE (cheap_vol_score only)
- **No options signal improves B6 selector** (coinvest+inst at +2.23pp t=4.41)
- **No options signal improves pairwise_minimal ranker** (coinvest+inst IC=+0.107)
- Best options-only selector: +1.53pp t=1.65 (much worse than institutional)

### Why Options Fail in Biotech
- High IV = risk/distress marker, not alpha signal (all IV signals destructive: -2.3pp to -3.8pp)
- Event premium is efficiently priced (high EP names return -1.61pp vs +2.32pp for no-EP)
- IV momentum is the most destructive signal tested (-3.83pp, t=-3.86)
- Options capture risk pricing; institutions capture informed capital flow

### What Survived (as diagnostic only)
- `cheap_vol_score`: PROMOTE_CANDIDATE univariate but year-unstable (negative 2023, 2025)
- `ovf11_score`: IC=+0.107 as near-catalyst tiebreaker
- `opt_term_slope`: ranker IC=+0.069 (t=3.37) but zero selector delta
- EXTREME IV regime: genuine risk flag (-4.00pp vs +2.42pp NORMAL)

### Lane Status
- **CLOSED** for systematic alpha (selector, ranker, construction)
- **KEEP** as diagnostic overlay (risk flags, chartbooks, catalyst tiebreaker)
- **Gate reopening** on volume/OI/flow data availability (current data is IV-surface only)

### Artifacts
- Script: `scripts/research/options_activity_study.py`
- Results: `output/options_activity_study/` (master JSON, signal table, bundle tables, memo)
- Spec: `specs/changes/spec_053_options_activity_study.md`

**Why:** The institutional baseline (coinvest+inst_delta) is the real alpha source. Options reflect how the market prices risk, not where informed capital flows. These are fundamentally different information sets, and in biotech the institutional signal dominates.

**How to apply:** Do not attempt to promote options signals to selector or ranker. Keep existing options infrastructure for diagnostics and risk controls only. If volume/flow data becomes available, a separate study on activity-based signals (not IV-based) would be warranted.
