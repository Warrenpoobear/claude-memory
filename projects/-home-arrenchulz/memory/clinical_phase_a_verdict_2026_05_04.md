---
name: Clinical Phase A verdict (2026-05-04)
description: Clinical role verdicts after Phase A descriptive audit — selector closed NO_GO, ranker SHADOW only on clinical_design_quality, EV transmission SHADOW but non-evaluable until outcome binder wired
type: project
status: active
related: clinical_quality_score_2026_04_13.md, ees_v3_structural_failure_2026_04_30.md, policy_alpha_freeze_2026_04_04.md
supersedes: (extends Clinical Stack v2 shadow-validation status; does not invalidate prior Spec 057 conditional IC finding)
originSessionId: 293f6ecf-b892-40d7-8ab7-99e0bf62faca
---
# Clinical Phase A verdict (2026-05-04)

Phase A descriptive audit run 2026-05-04 against actual production baseline (2-feat ranker_v2 deployed_live_pilot, clinical selector weight = 0). Sample: 17 post-PIT-fix snapshots (2026-04-13 → 2026-05-04, n_avg=297). Cousin substitutes authorized: endpoint_strength_score, clinical_design_quality, design_quality_score; biomarker_context_score skipped (no analog).

## Verdicts (frozen)

- **Selector → NO_GO.** Unconditional ρ(clinical, selector_score) = −0.16 (median, range [−0.18, −0.13]). Every clinical feature anti-correlated with production composite. Adding clinical to B6 selector would pull against current selection. Spec 057 conditional-positive does NOT rescue this — conditional lane is *inside* coinvest, not a *replacement* for coinvest's selector role. **Lane closed.**
- **Ranker → SHADOW (single candidate, deferred).** Within top-coinvest tertile, `clinical_design_quality` (substitute for protocol_quality_score) shows ρ=+0.084 (range [+0.01, +0.17], 13/17 snaps positive). Cleanest single candidate for future Family-D 3-feat ranker test. **Defer to ≥ 2026-05-22** (post-13F refresh + cohort-quarantine close), and only with full Checklist v2 power. clinical_score_v2_z itself shows ρ=−0.007 in conditional lane — not a candidate.
- **EV / clinical_transmission → SHADOW + non-evaluable.** 16 daily shadow snapshots over 04-15 → 05-04: cumulative 64 drops, 0 gains, 5 perpetual drop targets (RGNX 13/13, TNYA 13/13, VERA 9/13, VRDN 9/13, SEPN 8/13). **Zero resolved outcomes** populated in `clinical_transmission_shadow.jsonl` — `realized_outcome`/`realized_return` fields never bind. Unverdictable until wiring fixed. SEPN drop is suspicious (clinical_z=+0.84, coinvest_z=+0.49, yet TX drops it) — flagged for one-name diagnostic later.

**Why:** Spec 057's conditional-IC finding (+0.103 t=3.53 within top coinvest) is real but role-specific. Phase A confirms clinical is *independent* (not absorbed by coinvest/inst_delta/financial) but *negatively oriented* unconditionally — only flips positive inside coinvest filter. That asymmetry constrains it to ranker-tiebreaker role at most, not selector or standalone alpha. EV transmission would have given a third channel, but the outcome-binder wiring gap blocks evaluation entirely.

**How to apply:**
- Do NOT propose clinical for selector or ranker promotion before 2026-05-22.
- Treat `clinical_design_quality` as the single ranker-shadow candidate; do NOT broaden the test to other clinical features.
- TX drops (RGNX/TNYA/VERA/VRDN/SEPN) are operationally non-actionable until outcome binder ships.
- TX-drop targets have **zero overlap** with false-catalyst audit (16 flagged names) — TX and false-catalyst layers are uncoordinated, work on different signals; do not conflate.
- `clinical_readout_days` confirmed null-as-zero (90.6% present / 6.7% nonzero); only usable when gated by `clinical_date_confidence`.
- Open work item: EV outcome binder (`realized_outcome`/`realized_return` writer to `clinical_transmission_shadow.jsonl`). Plan being drafted same day. Required before 2026-05-22 review can verdict EV.
