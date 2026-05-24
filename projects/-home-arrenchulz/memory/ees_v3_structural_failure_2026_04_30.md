---
name: EES v3 structurally invalid — lane closed (2026-04-30)
description: EES v3 cannot be alpha because its 0.70-weight component is a monotonic transform of priced_move_pct (Spearman -0.978). Bin-residual IC ≈ 0. Lane CLOSED. Do not reopen without external (non-pmv) inputs.
type: project
status: resolved
related:
  - ees_v3_incremental_ic_first_read_2026_04_30
  - spec_064_ees_v3_promotion_battery_2026_04_23
  - project_alpha_extraction_roadmap_2026_04_14
  - signal_research_history
originSessionId: 5817ee52-e367-41a5-af14-3cb8ef51f022
---
# EES v3 — structural pmv-dominance, lane closed (2026-04-30)

EES v3 is **structurally non-promotable** as an independent alpha signal.
Three convergent diagnostic tests run on the resolved forward-return panel
(n=1856 quarantine-clean, T+5, 7 trading days 2026-04-14 → 2026-04-23)
prove the formulation family cannot extract signal independent of raw
implied move.

**Why**: prevents the next "let's try residualizing EES differently" or
"let's reweight misprice/expected_move" cycle. Three independent residualization
approaches (linear, bin/decile, full non-parametric orthogonalization) all
returned the same null. There is nowhere left for signal to hide. More data
will only reduce noise around zero — it will not reveal hidden signal.

**How to apply**: when EES v3, EES v2, `conditional_misprice_score`, or
`base_rate_gap_score` come up in any future research question, route to
this memo first. Do NOT re-run the validation harness on more days hoping
for a different answer. Do NOT propose tuning the 0.70/0.30 weights.
Do NOT propose adding features to the existing formulation. The formulation
itself is the problem.

If the user revisits the "options market mispricing of biotech catalysts"
thesis, the rule is: **do NOT use raw implied move as the primary input.**
Candidate independent inputs include IV-vs-realized-vol history, cross-
sectional dispersion vs sector baseline, or microstructure flow. That work
is out of scope until the next ranker-retrain horizon.

## Load-bearing numbers

### D1 — sub-feature dependence on pmv (within-decile IC vs ex5d)

| field | weight in EES v3 | Spearman(field, pmv) | mean within-decile IC vs ex5d |
|---|---|---|---|
| `conditional_misprice_score` | **0.70** | **-0.978** | -0.018 |
| `conditional_misprice_z` | (z-form, used) | -0.976 | -0.049 |
| `conditional_expected_move` | 0.30 | +0.240 | -0.010 |
| `conditional_expected_move_z` | (z-form, used) | +0.240 | -0.004 |
| `ees_v3_score` (combined) | — | -0.815 | -0.028 |

The 0.70-weight component has **-0.978 Spearman with pmv**. That's a
monotonic transform, not a correlation. It IS pmv. The 0.30-weight
component is more independent (+0.240) but its predictive content is
zero with chaotic per-decile sign flipping.

### D2 — bin-residualized (non-parametric pmv-orthogonalization)

| field | n | Spearman(resid, ex5d) | t-stat | top⅓−bot⅓ |
|---|---|---|---|---|
| `ees_v3_score` | 1856 | -0.017 | -0.73 | -0.30pp |
| `conditional_misprice_score` | 1856 | -0.014 | -0.60 | -0.43pp |
| `conditional_expected_move_z` | 1856 | -0.007 | -0.30 | -0.20pp |

All three indistinguishable from zero. Bin-residualization removes ALL
monotonic pmv dependence — strongest test possible. No signal survives.

### D3 — `expectation_error_score` (EES v2)

| metric | value |
|---|---|
| Spearman(ee_v2, pmv) | +0.427 (more independent than v3 by far) |
| Spearman(ee_v2, ex5d) overall | -0.031 (t=-1.32) |
| Mean within-decile IC | -0.029 |
| **Bin-residualized IC** | **-0.039** (t=**-1.69**) |

Plot twist: v2 is more independent of pmv than v3 BUT mildly anti-predictive
after pmv control. Strongest signal in the entire analysis points the wrong
direction. Reopening v2 as a candidate would be worse than null.

## Root cause (the deeper lesson)

The formulation tries to extract expectation error from `f(implied_move)`
alone. But `implied_move` already encodes the market's expectation. So
`f(expectation) → predict error in expectation` is circular unless external
information is added. This is a general rule worth remembering:

> **You cannot extract expectation error from expectation alone.**

You need at least one of: realized vs implied history, cross-sectional
dispersion, microstructure flow, or event-specific priors. Not just
transformations of IV.

## Status of related artifacts

- **Spec 064 promotion battery** — superseded. The P0/P1/P2 gating path
  is unreachable for this formulation. Do not run it.
- **EES v3 sidecar in production** — keep as **diagnostic** output (no
  cost, harmless, useful for attribution). NOT a candidate signal.
- **Forward-return panel + validation table** — keep. Reusable
  infrastructure for any future expectation-error formulation.
- **`conditional_misprice_score` IC +0.089 t=2.07 (true alpha)** memory
  line — INVALIDATED. That was from the now-INVALIDATED PIT v2 backtests
  (memory `Historical Backtest INVALIDATED 2026-04-17`). Forward evidence
  on clean panels says zero IC after pmv control.
- **2026-05-22 verdict agent** — CANCELLED. Same-day structural verdict
  obviated the need.

## Quarantine context (separate finding, retained)

The diagnostic also pinned an upstream data bug: **`priced_move_pct ≥ 500`
rows have `straddle_price` passed in dollars instead of fractions** for
~14 tickers/day (TRDA, KURA, KMDA, UPB, IMTX, VYGR, ANNX, CRBU, CCCC,
FDMT, AURA, ALDX, ENTA, SIGA). The harness quarantines them. Producer
is NOT patched (alpha-affecting per Spec 064; would need full Checklist
v2 evidence). Quarantine and event-aligned Universe B are disjoint —
blast radius for catalyst-aligned alpha measurement is zero.

## Artifacts

- Filter module: `scripts/research/ees_validation_filters.py`
- Forward-return joiner: `scripts/research/ees_forward_returns.py`
- Validation table: `scripts/research/ees_validation_table.py`
- Panel: `data/snapshots/_forward_returns_panel.csv`
- Validation table: `data/snapshots/_ees_validation_table.csv`
- Tests: `tests/test_ees_validation_filters.py`, `tests/test_ees_validation_table.py` (12 passing)
