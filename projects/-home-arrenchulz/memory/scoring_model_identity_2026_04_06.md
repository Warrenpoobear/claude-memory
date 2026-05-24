---
name: Scoring model true identity
description: The live model is coinvest + financial penalty + inst-delta filter. Everything else is secondary tie-breakers. Established by full revalidation audit 2026-04-06. v1.14.0 update (2026-05-04) zeroed the inst_delta_z selector weight as a demotion-class hygiene patch — see policy_demotion_path_2026_05_06.md.
type: feedback
originSessionId: 88ed2e87-0990-415b-a2b2-adece877f561
related: policy_demotion_path_2026_05_06
---

## v1.14.0 update (2026-05-04, recorded 2026-05-06)

Ruleset rotated `2a3e79eb` v1.13.0 → `8887576e` v1.14.0. **Selector weights changed:** `inst_delta_z` 35% → 0%; `coinvest_score_z` 65% → 100%. This was a **demotion-class hygiene patch** (per `policy_demotion_path_2026_05_06.md`), not a Checklist v2 promotion — the demotion was driven by `inst_delta_z` two-frame ALERT (mean_ic=-0.097 over 36 dates AND event-IC=-0.244 over 75 postmortems). **The "inst_delta_z prunes" line in §1 below is now historically accurate but operationally inactive in the selector.** The signal still appears as `inst_delta_z_filter_min` in construction-stage filtering elsewhere; selector weighting is what changed. Ranker (2-feat pairwise), EV, sizing (EW Top-30), eligibility unchanged. Spec 086 audit verdict: `artifacts/audit/spec_086_v1_14_0_freeze_compliance_audit_2026_05_06.md`. Conditions for re-opening: inst_delta_z mean_ic must recover above +0.02 sustained for 10+ dates AND event-IC must turn positive — not before both.

## Model Identity (2026-04-06 audit)

The live scoring model is functionally:

1. **coinvest_score_z** selects names (92.7% of selector variance, 53% of ranker on trained basis)
2. **financial_score** penalizes safer/lower-upside names within cohort (47% of ranker on trained basis, negative weight)
3. **inst_delta_z** prunes via IDZ filter (22.75% of selector + construction-stage filter)

**Deployment note (2026-04-20):** The ranker contribution split (53/47) is the **trained basis**. The live deployed artifact is the capped Family C live-pilot vector — coinvest weight capped at +0.02 (trained was +0.0613), financial unchanged at -0.0533. Under the deployed vector the split shifts toward financial. `model_variant = deployed_live_pilot`, `trained_basis = minimal_v2`, `deployment_delta = coinvest weight capped`. Authoritative source for live weights: `production_data/ranker_v2_model.json` `provenance` block.

Other blocks (catalyst 15%, survivability 10%, market structure 10%) are **small marginal refinements**, not primary edge. They occasionally move a name but do not make the model multifactor.

Clinical block (0%), all overlays, catalyst tilt, tier gating = **dead/disabled**.

**Why:** Full revalidation audit on 2026-04-03 snapshot. Institutional block = 92.7% of selector variance. Ranker changes 9/30 names. Three signals explain ~95% of portfolio decisions.

**How to apply:**
- Describe the model honestly: "institutional conviction selects, financial quality penalizes safe names, institutional accumulation prunes"
- Do NOT present ~50 computed signals as meaningfully co-equal
- Do NOT rip out small blocks just because they're small — they're tie-breakers, not dead
- DO remove truly dead code (0% weight blocks, disabled overlays) if operationally costly
- Keep core signals, PIT discipline, risk layer, eligibility gates unchanged
- Any new block must explicitly justify why it adds to the 3 real signals, not just exist alongside them

**Audit memo:** `specs/changes/scoring_logic_revalidation_2026_04_06.md`
