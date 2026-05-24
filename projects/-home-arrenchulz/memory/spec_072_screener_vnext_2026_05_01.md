---
name: Spec 072 Screener vNext — manager-gate / traps / catalyst-rank (2026-05-01)
description: Diagnostic-only redesign spec. Coinvest becomes binary gate (not ranker). Trap layer (catalyst+runway+liquidity+dilution+stale-thesis). Catalyst+clinical quality ranks survivors. No production changes.
type: project
status: active
related:
  - ees_v3_structural_failure_2026_04_30
  - policy_alpha_freeze_2026_04_04
  - policy_freeze_architecture_2026_04_19
  - policy_coinvest_context_layer_2026_04_25
  - feedback_runway_severity_architecture
  - clinical_quality_score_2026_04_13
  - spec_064_ees_v3_promotion_battery_2026_04_23
originSessionId: 5817ee52-e367-41a5-af14-3cb8ef51f022
---
# Spec 072 — Screener vNext (2026-05-01)

Path: `specs/changes/spec_072_screener_vnext_manager_gate_traps_catalyst_rank.md`

**Why**: 2026-04-30 ranker dominance audit showed production top-30 is institutional-following + risk-on, not catalyst/clinical alpha. Block deltas: institutional +0.20, coinvest_score_z raw +0.95, inst_delta_z raw +1.09, catalyst block +0.06, **clinical block 0.00**. Spec 057 found clinical IC = +0.103 (t=3.53) **conditional on top-coinvest cohort** — exactly the structure this redesign operationalizes: coinvest gates, catalyst/clinical ranks. EES v3 closure (2026-04-30) cleared bandwidth for this work.

**How to apply**: when redesign discussions arise, route through this spec. The principle is fixed: **coinvest is binary gate (not continuous ranker input); runway/liquidity/dilution/stale-thesis are traps; catalyst+clinical quality ranks survivors**. No code changes from this spec — it's the design document. Implementation requires a follow-up spec + Checklist v2 + explicit user approval.

## Key constants

- **Layer flow**: Universe → Manager-validation gate → Trap filter → Catalyst+Clinical ranker → Portfolio
- **Gate thresholds to test**: τ_coinvest ∈ {0.0, +0.25, +0.5}
- **Hard traps**: missing catalyst, financing_truth_gate==BLOCK, execution blocked, stale coinvest, dilution_haircut≥0.40, fundamental_red_flag
- **Three candidate ranker formulas** (V1=pure event-quality, V2=design-aware, V3=Event-EV-driven)
- **Hard-banned ranker inputs**: coinvest_score_z (gate), inst_delta_z (gate represents), financial_score (anti-alpha), runway_severity (gate/sizing only), EES family (closed), priced_move_pct (closed), base_rate_gap (anti-predictive)
- **Candidate inputs requiring D7-D9 orthogonality pass**: clinical_score_v2_z, clinical_quality_composite, design_quality_score, endpoint_strength_score, catalyst_strength, catalyst_decay_w, binary_quality_score, regulatory_quality, de_sort_contrib_event_ev, etc. The unconditional rejection of clinical_score_v2_z (Δ=-0.68pp) was on the full population; conditional behavior (Spec 057: +0.103 t=3.53 within top-coinvest) may differ.

## 🚨 Orthogonality constraint (non-negotiable)

The single most likely failure mode: silent reintroduction of coinvest into the ranker via downstream-correlated fields (institutions already prefer well-designed trials, cleaner catalysts, higher quality pipelines). **Same failure mode that killed EES v3.**

**Three tests, ALL must pass before any candidate vNext ranker advances:**
- **D7 — per-feature orthogonality**: `Spearman(feature, coinvest_score_z within L3)` median must be |ρ| < 0.30 (pass) / 0.30-0.50 (residualization required) / ≥0.50 (hard exclude).
- **D8 — within-coinvest-decile IC stability**: mean within-decile IC > +0.05 AND ≥7/10 deciles same sign AND no single decile dominates >50% of IC mass.
- **D9 — bin-residualized IC**: residualized IC > 0 AND t > +1.5 preliminary / +1.96 promotion-grade.

If no candidate ranker passes D7-D9, the response is **NOT** "tune weights" — it's "vNext architecture empirically null on current feature set." That's a legitimate outcome.

## Diagnostic plan (D1–D6)

Per-snapshot, no cross-snapshot aggregates per [policy_freeze_architecture]:
- D1: Composition diff (Jaccard < 0.70 or redesign is decorative)
- D2: Block-delta confirmation (catalyst δ ≥ +0.15 AND clinical non-zero)
- D3: Forward-return comparison (vNext vs production vs coinvest-only vs XBI) — **the alpha question**
- D4: Stability (day-over-day Jaccard within 10pp of production)
- D5: Trap attrition audit
- D6: vNext self-dominance check (no single feature should reach ρ>0.85)

## Hard prerequisites before D2/D3 are trustworthy

1. **Spec 071 Lane 1** (false-catalyst data fix) must ship — otherwise vNext inherits 17.6% false-positive catalyst rate
2. **Cohort-change quarantine window** must close (~2026-05-15) before forward-return interpretation is unbiased
3. **Spec 069** (Module 2 v2 schema restore) status TBD — affects 4/30 names (IMCR/INSM/MIRM/STOK)

## Status

Spec drafted 2026-05-01. **No code written.** Production unchanged. Promotion path: diagnostic phase → shadow phase → Checklist v2 → explicit approval. None of these have started.

## What this spec is NOT
- Not a feature add (zero new fields/producers/data sources)
- Not a code change (harness lives in future script under a future spec)
- Not a kill of production (production stays live)
- Not promotion-grade (Section 6 of the spec is exploratory only)
- Not a re-opening of expectation-error (that lane stays closed)
