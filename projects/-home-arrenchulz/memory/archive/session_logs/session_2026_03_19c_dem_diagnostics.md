---
name: 2026-03-19 session C — DEM diagnostics and liquid assets fix
description: Strategy backtest, rank-aware sizing, sort contribution audit, liquid assets fix; clinical optionality is the sole top-book anchor
type: project
---

## DEM Strategy Backtest (v1.11.0, 31 snapshots Jun-Dec 2025)
- DE weighted: +10.46% 60d residual (hedged vs XBI)
- DE equal-weight: +9.89% 60d
- Composite baseline (EW top-K): +6.36% 60d
- **DE selection is real, sizing adds +0.57pp over EW**

## Rank-Aware Sizing Diagnostic
- Three arms: size-band (live) > rank-aware taper > equal-weight
- Rank-aware at ±10% taper: +10.26% 60d (-0.20pp vs live)
- **No sizing change warranted — rank-weight incongruence is cosmetic**

## Sort Contribution Audit (2026-03-19 snapshot)
- **Top 22 names (binary_now + build_window): 100% clinical optionality**
- Sort key = 0.0 overlays for all; ranked purely by `clinical_optionality_pct_dev` descending
- Overlays (calendar_alpha, clinical_quality_91_180) only fire for `less_binary` bucket
- Clinical sort OFF, coinvest OFF, institutional sort OFF in v1.11.0
- **Top-of-book is a one-factor model anchored on clinical optionality**

## Liquid Assets Fix (commit 0737275d)
- `calculate_liquid_assets()` missed `AvailableForSaleDebtCurrent` in fallback chain
- 58 tickers, $20.2B undercounted (AGIO 859%, SYRE 783%, CYTK 620%)
- Production rerun: rank-neutral on 2026-03-19 but runway/sizing will be more accurate
- Data correctness fix, not a tuning change

## Next Session: Clinical Optionality Robustness Study
The key research question is: **Is clinical optionality robust enough to be the sole top-book anchor?**

Measure:
1. Raw IC by bucket and horizon (5d, 20d, 60d)
2. Incremental IC vs composite / catalyst fields
3. Per-snapshot sign consistency (temporal stability)
4. Top-vs-bottom spread
5. PM intuition on top optionality names
6. PIT/live parity audit (possible implementation drift in bundle helper `_compute_clinical_optionality()`)
7. Alternative anchor comparison (optionality+calendar tiebreak, legacy anchor)

**Why:** optionality_pct decides the entire top-of-book. If it's robust, DEM is fine. If it's fragile, that's the lever to fix — not overlays.
