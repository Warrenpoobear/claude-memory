---
name: Family B scrapped (2026-04-19)
description: Family B institutional filter-gate path was explored, sanity-passed technically, then intentionally abandoned before promotion/eval. Do not revive without explicit new direction.
type: project
originSessionId: a00492eb-ebe1-484d-bcf4-5901650c6669
---
Family B (institutional signal as a filter-only gate with zero direct alpha
weight) was the PIT-cleaner re-derivation candidate described in
`docs/PIT_CLEANER_REDERIVATION_PROJECT.md` §Special treatment for institutional
signals.

## What was built (and then fully removed on 2026-04-19)

- `selector_engine.SelectorConfig.institutional_mode` / `institutional_filter_threshold`
  fields and the filter-gate demotion path
- `scripts/research/family_b_sanity_pass.py` and its JSON artifact
- `production_data/ranker_v2_model_family_b.json` and the staged copies under
  `data/staging/pit_regen/2024-10-31/` and `…/2024-11-29/`
- `TestInstitutionalMode` test class in `tests/test_selector_engine.py`

All of the above were deleted or reverted in the same session they were built.
Selector test count is back to the pre-session 26.

## What the sanity pass did show (for the record, not as a promotion case)

- Gate mechanics worked: inst block populated with zero alpha weight, distinct
  values, threshold-based demotion fires correctly.
- On 2024-10-31 / 2024-11-29, Family B vs A4 top-10 overlap was **0/10 on both
  dates**; top-30 overlap was 11/30 and 9/30. Stripping the institutional
  block from alpha fully rewrites A4's top book.
- Demotions split cleanly between gate demotions (AMGN / TECH / VYGR / NVCR /
  LAB — inst_block ≈ 0.3948 from missing-signal neutral) and alpha-recompute
  demotions (RNA / DYN / MLYS / COGT / STOK — strong coinvest, weak non-inst).

**Why:** the path was scrapped by direction before any wider eval sweep —
not because the plumbing failed. No walkforward evidence was collected, no
promotion criteria were evaluated. Treat this as a closed lane, not a
validated-then-rejected one.

**How to apply:**
- Do not re-derive a `ranker_v2_model_family_b.json` or re-add
  `institutional_mode="filter"` plumbing to `selector_engine.py` unless the
  user explicitly reopens this direction.
- Production remains A4 selector + current `production_data/ranker_v2_model.json`
  (Family C live pilot, coinvest weight capped at 0.02). Family B is unrelated
  to that production path and scrapping it does not touch it.
- The sibling `production_data/ranker_v2_model_family_c.json` was left in place
  (pre-existing, unrelated to this scrap).
