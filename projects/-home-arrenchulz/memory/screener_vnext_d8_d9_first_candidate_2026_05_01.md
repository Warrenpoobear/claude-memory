---
name: vNext D8/D9 — first orthogonal candidate signal (2026-05-01)
description: First non-coinvest signal candidate in entire research thread. Conditional clinical-quality IC ≈ +0.20 within L3 (D9 raw t≈+5; effective t after NW correction ≈ +3). Preliminary — verdict review 2026-05-22 after cohort-window close + ≥30 resolved + dedup + NW correction. NOT promotion-grade. DO NOT build composite ranker.
type: project
status: active
expires: 2026-05-22
related:
  - spec_072_screener_vnext_2026_05_01
  - ees_v3_structural_failure_2026_04_30
  - clinical_quality_score_2026_04_13
  - regime_post_cohort_change_distortion_2026_04_28
  - spec_071_catalyst_quality_gate
  - policy_freeze_architecture_2026_04_19
  - policy_alpha_freeze_2026_04_04
originSessionId: 5817ee52-e367-41a5-af14-3cb8ef51f022
---
# vNext D8/D9 — first orthogonal candidate signal (2026-05-01)

The Spec 072 redesign (manager-as-gate / traps / catalyst-clinical-rank) produced its first **structurally clean signal candidate**: clinical-quality features have positive predictive IC **conditional on L3** (post-coinvest-gate, post-trap), with D9 bin-residualized t-stats ≈ +4–5 raw on a pooled 600-row panel. **This is the first time in the entire research thread that a non-coinvest signal has survived rigorous orthogonality (D7) AND within-bin (D8) AND bin-residualized (D9) testing.**

**Why**: prevent revisionism in either direction. Without this memo, future-me will either (a) over-celebrate ("we have alpha!") and try to promote prematurely, or (b) lose the thread and re-derive the same conclusion. Pinning the load-bearing numbers prevents drift.

**How to apply**: when vNext / clinical-quality / conditional-alpha questions arise, route here. **The default response is: this is a preliminary candidate, not promotion evidence — verdict review is 2026-05-22.** When tempted to combine multiple "ADVANCE" features into a composite ranker before verification, this memo says NO. That is exactly how EES v3 happened.

## What got tested

- **Universe**: L3 cohort = manager-validated (`coinvest_score_z ≥ 0`) + trap-survived (catalyst-present + runway-OK + execution-OK + thesis-fresh + dilution-OK + governance-OK)
- **Snapshots**: 16 recent clean (2026-04-15 → 2026-05-01); 7 of those fully T+5 forward-resolved (04-15 → 04-23)
- **L3 size**: ~85 names per snapshot at τ_coinvest=0.0; ~48 at τ=0.5
- **Resolved L3 panel**: 600 (snap, ticker) triples with forward T+5 excess returns
- **Tests**: D7 orthogonality at τ ∈ {0.0, 0.25, 0.5}; D8 within-quintile IC + sign consistency; D9 bin-residualized IC vs coinvest

## Load-bearing numbers (Tier 1 conservative — stable PASS across τ)

| feature | D8 mean within-quint IC | D9 resid ρ | D9 raw t-stat |
|---|---|---|---|
| `clinical_score` | +0.178 | **+0.200** | **+5.00** |
| `clinical_score_v2` | +0.173 | **+0.202** | **+5.05** |
| `clinical_score_v2_z` | +0.173 | +0.202 | +5.05 |
| `clinical_score_z` | +0.161 | +0.174 | +4.25 |
| `readout_density_90` | +0.128 | +0.128 | +3.16 |
| `endpoint_strength_score` | +0.080 | +0.080 | +1.96 (marginal) |
| `binary_quality_score` | +0.032 | +0.023 | +0.56 (FAIL) |
| `calendar_confidence` | -0.000 | +0.014 | +0.34 (FAIL) |

Sign-flippers (Tier 1 caution, advanced at τ=0.0 but flipped sign at τ=0.5):

| feature | D8 mean IC | D9 resid ρ | D9 raw t |
|---|---|---|---|
| `clinical_alpha_z` | +0.167 | +0.164 | +4.06 |
| `design_quality_score` | +0.124 | +0.154 | +3.81 |
| `readout_curve_score` | +0.162 | +0.153 | +3.77 |

## What this CONFIRMS

- **The vNext architecture is structurally viable** — D7 showed no EES-style coinvest leakage; D8/D9 show signal exists *within* the gated cohort.
- **`[Spec 057 Clinical Quality Score]` finding (+0.103 conditional IC, t=3.53) is replicated and amplified** with full Spec 072 trap layer. The new framework strengthens the prior finding.
- **`clinical_score_v2_z` was REJECTED unconditionally** (Δ=-0.68pp; "all clinical lanes CLOSED" in `[Key Signal Evidence]`). Conditional on L3, it's the strongest passing feature. **A failed-unconditional signal can succeed conditionally** — this is the principle.
- **The "two-layer" architecture (institutional validates, clinical ranks)** matches how biotech actually works.

## What this does NOT prove

1. **Statistical significance is overstated.** Pool n=600 has massive cross-day autocorrelation (each ticker on up to 7 consecutive days). **Effective independent observations ≈ 245**. Per Spec 064 P1, NW lag-corrected `t_adj` is the promotion-grade metric. Raw t=+5 likely shrinks to t_adj ≈ +3 after correction. Still significant, but less dramatic.
2. **Multiple ADVANCE features are not independent.** clinical_score family (4 variants) is one underlying signal. readout_density / readout_curve / late_stage_readouts may be one trial-density factor. After dedup, expect ≤3 distinct signals, not 6+.
3. **Cohort-change quarantine window is active** through ~2026-05-15 per `[regime_post_cohort_change_distortion]`. Forward returns measured 04-20 → 04-30 are partially inside the SIGNAL_ALERT window. Some IC may be cohort drift.
4. **Spec 064 P1 promotion gate requires ≥30 live trading days.** We have 7. This is preliminary observation territory, not promotion evidence.
5. **Spec 071 Lane 1 (false-catalyst data fix) hasn't shipped.** 17.6% of CT.gov-derived catalysts in the 04-29 audit were false. L3 inherits that error rate. Some of the +0.20 IC could be artifact of which-rows-survive-the-trap.
6. **Out-of-sample stability untested.** 7 snapshots is too few to detect window-specific luck.

## Hard rules until 2026-05-22 verdict review

1. **DO NOT combine features into a composite ranker.** This is the EES v3 trap.
2. **DO NOT tune τ_coinvest, trap thresholds, or D7/D8/D9 cutoffs** to make more features pass.
3. **DO NOT promote anything to selector or sizing.** Per `[policy_alpha_freeze]`, Checklist v2 required.
4. **DO NOT shadow-ship a vNext top-30 to production**. Per `[policy_freeze_architecture]`, attribution-only.
5. **DO NOT loosen the ADVANCE bar** if features fail at the 2026-05-22 re-run. Per Spec 072 §10 Q7, a real null is a real result.

## Verdict review on 2026-05-22 — what re-run must show

To advance from "candidate" to "promotion-eligible":
1. **At least 1 distinct signal cluster** (post-dedup) maintains D9 t > +1.96 (NW-corrected) over ≥30 resolved trading days
2. **Cohort window has closed** (post-2026-05-15) and signal survives in post-window subset
3. **Cross-feature correlations within L3 are computed** and a single representative feature per cluster is chosen
4. **Spec 071 Lane 1 has shipped** (or false-catalyst rate has been confirmed not to drive the IC)

If any of those fail → either (a) re-test in another window, or (b) accept "vNext architecture is feasible but signal is not robust at current data volume." Both are honest outcomes.

## Architecture milestone (the deeper finding)

The pre-vNext system tried "selection + validation + ranking" all in one function — and the audit showed it became coinvest-following with hygiene filters, not catalyst alpha. **vNext correctly separates layers**: validation (managers) → filtering (traps) → ranking (catalyst/clinical). The D8/D9 result is the first empirical evidence this separation actually surfaces signal.

Whether or not the specific clinical_score signal survives 2026-05-22 verification, **the structural finding stands**: signal exists in the gated universe. The question becomes "which feature, with what weight, after dedup."

## Artifacts

- Spec: `specs/changes/spec_072_screener_vnext_manager_gate_traps_catalyst_rank.md`
- D7 screening run: not persisted yet (lives in conversation transcript only — TODO: emit to `data/snapshots/_d7_orthogonality.csv`)
- D8/D9 run: not persisted yet (same — TODO)
- Forward-return panel (used): `data/snapshots/_forward_returns_panel.csv` (resolved through 04-23)
- Filter/joiner modules: `scripts/research/ees_validation_filters.py`, `scripts/research/ees_forward_returns.py`
