---
name: Spec 069 Module 2 v2 schema restore
description: Bug + spec for restoring has_revenue / revenue_scale_bucket emission dropped in Module 2 v2; alpha-affecting; Checklist v2 required
type: project
originSessionId: 6ade3205-6cd1-47d8-8f13-bf6cae946429
---
# Spec 069 — Module 2 v2 schema restore (2026-04-28)

**Status:** spec only, NOT implemented. Alpha-affecting → Checklist v2 required.

**The bug:** `module_2_financial_v2.py:compute_module_2_financial` does not emit `has_revenue` or `revenue_scale_bucket` fields that v1 produced. `run_screen.py:9720-9721` reads them with defaults (`False`, `"pre_revenue"`), so the `commercial_biotech` promotion at `run_screen.py:408-410` is dead code. The `commercial_pharma` archetype path (Yahoo industry → INDUSTRY_TO_ARCHETYPE map) is unaffected.

**Why:** discovered while investigating Spec 068 audit's 4 HIGH mismatches (MESO/VCEL/HALO/MLYS). The display-level fix (Lane 1, shipped) is `development_stage_overrides.json`; this spec is the structural fix (Lane 2).

**How to apply:** when the next ranker retrain or cohort change is being scoped, this is one of the priority candidates because it would shift 67 tickers (29% of `drug_developer` cohort, 4 of top-30) into `commercial_biotech` and tighten clinical_score_z stats. Do not bundle with other archetype changes — keep the change isolated for clean Checklist v2 attribution.

## Blast radius (measured 2026-04-28)

- **67 tickers** would promote drug_developer → commercial_biotech (Revenue ≥ $100M)
- **Top-30 impact**: IMCR, INSM, MIRM, STOK (4 names, selector_scores 0.87-0.92)
- **Top-60 impact**: AXSM, IDYA, IMCR, INSM, JAZZ, KRYS, MIRM, PTCT, SNDX, STOK, ZYME (11 names)
- **clinical_score_z cohort**: drug_developer 230→163, commercial_biotech 0→67
- **Clinical activity filter**: 67 tickers gain exemption
- **Top revenue: REGN $14.3B, VRTX $12B, ONC $5.3B, INCY $5.1B, JAZZ $4.3B, ALNY $3.7B, BMRN $3.2B, HALO $1.4B**

## Repair options (Spec 069 §3)

1. **Restore schema in Module 2 v2** (recommended) — single source of truth, ~10 LOC patch in `module_2_financial_v2.py`. Need to verify the v1→v2 schema drop wasn't intentional via git log.
2. **Compute revenue bucket locally in `run_screen.py`** — rejected. Defeats Module 2 encapsulation.

## Pre-implementation gates

Per `policy_alpha_freeze_2026_04_04`, this requires Checklist v2:
- Forward-modeling diff in selector top-30 composition + simulated returns
- Block bootstrap of the diff with horizon-matched lag
- FDR (single-test correction)
- LOSO stability over rolling window
- Year stability (with pseudo-PIT caveat)
- Cohort-change quarantine plan per `feedback_cohort_change_quarantine`
- Per-ticker blast-radius diff per `feedback_quarantine_blast_radius_diff`

## Open questions

1. Was the v2 schema drop intentional? `git log -p -- module_2_financial*.py | grep -A5 -B2 has_revenue`.
2. Should the Spec 068 override map be retired once Spec 069 lands? HALO/VCEL would auto-promote (Revenue ≥ $100M); MESO/MLYS still need overrides (revenue too small).

## References

- Spec doc: `specs/changes/spec_069_module_2_v2_schema_restore.md` (commit `bbf2ab8e`)
- Lane 1 (shipped): `production_data/development_stage_overrides.json` (commit `b72afc6c`)
- Spec 068 audit: `specs/changes/spec_068_development_stage_external_cache_audit.md` (commit `ad8831da`)
- Code: `module_2_financial.py:559-665` (v1), `module_2_financial_v2.py:1340+` (v2 wrapper), `run_screen.py:380-412` + `9714-9727` (consumer)
