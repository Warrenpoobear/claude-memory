---
name: EES v3 incremental-IC first read (2026-04-30) [SUPERSEDED]
description: Preliminary T+5 incremental-IC; superseded same-day by structural-failure verdict. Lane closed. See ees_v3_structural_failure_2026_04_30.md.
type: project
status: resolved
supersedes:
related:
  - ees_v3_structural_failure_2026_04_30
  - spec_064_ees_v3_promotion_battery_2026_04_23
  - project_alpha_extraction_roadmap_2026_04_14
originSessionId: 5817ee52-e367-41a5-af14-3cb8ef51f022
---
# EES v3 incremental-IC first read (2026-04-30)

First incremental-IC measurement on the EES v3 forward sidecar, taken at
T+5 days over **7 resolved trading days** (snapshots 2026-04-14 → 2026-04-23,
last fully-resolved snap = 04-23). Result: **EES adds essentially zero
predictive power beyond raw `priced_move_pct`** across all three universes
tested.

## Numbers

| universe | n | Spearman(EES, ex5d) | Spearman(pmv, ex5d) | **Spearman(EES⊥pmv, ex5d)** | top⅓−bot⅓ |
|---|---|---|---|---|---|
| A (broad, pmv<500) | 1856 | +0.026 (t=+1.14) | -0.043 (t=-1.85) | **+0.015 (t=+0.63)** | +0.29pp |
| A & ees_eligible | 1352 | +0.025 (t=+0.90) | -0.045 (t=-1.67) | **-0.007 (t=-0.26)** | -0.20pp |
| B (event-aligned ≤7d) | 63 | +0.074 (t=+0.58) | -0.162 (t=-1.29) | **-0.008 (t=-0.06)** | +0.32pp |

The headline `Spearman(EES⊥pmv, excess_return_5d)` lands at +0.015 / -0.007 /
-0.008 — all within sampling noise of zero. Spec 064 P1 promotion gate
(top⅓−bot⅓ ≥ +2.0pp) **fails by ~6×** in every universe.

What is marginally significant: `Spearman(pmv, ex5d)` ≈ -0.04 (t≈-1.8) in
Universe A. Low-implied-move biotechs have slightly higher 5d excess
returns. EES inherits this sign (because EES is structurally inverse to
pmv, by design — `Spearman(EES, pmv) = -0.77`), but contributes nothing
incremental once pmv is controlled for linearly.

**Why**: this is the first decision-relevant evidence on whether EES has
real signal vs. is a "buy low-IV biotechs" factor in disguise. Captured
because preliminary reads tend to drift in memory; pinning the actual
numbers prevents future revisionism (positive or negative).

**How to apply**: do NOT treat this as a kill — sample is too small (7
trading days, n=63 in B; Spec 064 requires ≥30 live days). Do NOT
promote EES based on the +0.32pp Universe B spread; it has t=+0.58.
When EES comes up between now and 2026-05-22, the answer is "preliminary
read = null incremental, but waiting for ≥30 resolved days." Treat the
EES⊥pmv IC as the headline metric, NOT raw EES IC (which inherits the
pmv signal).

## Three reasons NOT to call it a kill yet

1. **Sample too small.** 7 trading days resolved; Spec 064 requires ≥30.
   Universe B n=63 is technically over the data-integrity floor of 50,
   but t-stats this small have CIs that swallow zero.
2. **Cohort-change quarantine active through ~2026-05-15.** Per
   `regime_post_cohort_change_distortion_2026_04_28`, the SIGNAL_ALERT
   regime is correctly persistent and any signal interpretation in this
   window is suspect.
3. **Linear residualization is incomplete.** `corr(EES_resid, pmv) =
   0.18–0.59` in the three universes — meaning a linear projection
   doesn't fully orthogonalize EES from pmv (because EES uses pmv
   non-linearly via the base-rate table). A non-linear residualization
   (GBM or quantile) might reveal incremental signal that linear missed.
   Worth trying once n grows.

## VERDICT (2026-04-30, same-day): LANE CLOSED — see structural failure memo

D1/D2/D3 decomposition diagnostics run same day made the verdict review
unnecessary. **`conditional_misprice_score` (0.70 weight) has Spearman
-0.978 with pmv** — it IS pmv after a monotonic transform, not "correlated
with" pmv. Bin-residualized IC across all components ≈ 0. EES v2 is more
independent of pmv but anti-predictive after residualization (t=-1.69).

**No verdict agent will be scheduled.** More data only reduces noise
around zero; it does not reveal hidden signal in a structurally
pmv-derived formulation. The 2026-05-22 review is **cancelled**.

This memo is retained as the audit trail of the preliminary read; the
structural verdict lives in `ees_v3_structural_failure_2026_04_30.md`.

## Quarantine context (load-bearing, do not lose)

A separate finding from this run: **`priced_move_pct ≥ 500` rows are
upstream-contaminated** — `straddle_price` was passed in dollars not
fractions for 14 tickers. ~5% of rows daily. The diagnostic harness
quarantines them; the production producer is NOT being patched (alpha-
affecting per Spec 064; would need full Checklist v2 evidence). Tickers
seen: TRDA, KURA, KMDA, UPB, IMTX, VYGR, ANNX, CRBU, CCCC, FDMT, AURA,
ALDX, ENTA, SIGA. Quarantine and Universe B are disjoint in current
data — contaminated tickers happen to not be in near-term catalyst rows
— so blast radius for catalyst-aligned alpha measurement is zero.

## Artifacts

- Filter module: `scripts/research/ees_validation_filters.py`
- Forward-return joiner: `scripts/research/ees_forward_returns.py`
- Panel: `data/snapshots/_forward_returns_panel.csv` (4158 rows × 14
  snapshots; 2376 fully resolved through 04-23)
- Tests: `tests/test_ees_validation_filters.py` (6 passing)
