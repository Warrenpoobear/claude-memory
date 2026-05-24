---
name: FDA designation pathway quality audit (2026-03-21)
description: Regulatory pathway quality audit — engine is correct but coverage is 3.8% (13/341), mostly decorative at current scale
type: project
---

## Audit Summary

### Coverage
- fda_designations.json: 20 entries, 15 tickers, 13 in universe (3.8%)
- Designation types: BTD (7), ODD (5), FT (4), RMAT (1)
- Most designated names are large-cap: ALNY, BEAM, REGN, VRTX, CRSP
- Only CELC (rank 7) is in the top-20

### How it influences output
- FDADesignationEngine computes pos_multiplier (1.12x–1.34x) that scales PoS in Module 5
- BTD +25%, RMAT +20%, ODD +18%, FT +12%
- Applied at module_5_scoring_v3.py line 2930 before cohort normalization
- 328/341 names get multiplier=1.0 (no effect)

### Pipeline trace
1. `production_data/fda_designations.json` (20 entries)
2. `run_screen.py` line 8591 → `FDADesignationEngine.load_designations()`
3. `score_universe()` → per-ticker {designation_score, pos_multiplier, timeline_acceleration}
4. `module_5_composite_v3.py` line 717-721 → multiplies PoS
5. `module_5_scoring_v3.py` line 2930 → same multiplication
6. `fda_designation_signal` dict in output (for attribution)
7. NOT exported to rankings.csv

### Verdict: C — mostly decorative at current coverage
- Engine is correct, multipliers are reasonable
- But 13/341 tickers is too thin to discriminate within the portfolio
- The bottleneck is designation data collection, not engine design

### To make it useful
- Expand fda_designations.json from 20 → 100+ entries
- Systematic extraction from: FDA Orange Book, Drugs@FDA, SEC 8-K filings
- Many universe companies likely have designations that aren't in the file
- This is a data collection project, not an engine improvement

## Data Reconciliation (same session, later)

Local file had regressed from 135→20 entries (commit b59e41d1 overwrote the comprehensive
version from 44b0e672). Restored and merged: 149 entries, 53 tickers, 45 in universe (13.2%).

## IC Check (restored data, 45 tickers)

**FDA designations are a NEGATIVE signal:**
- Binary IC (has_designation): 20d IC=-0.023 (t=-2.96), 63d IC=-0.035 (t=-5.14)
- Continuous IC (designation_score, covered only): 63d IC=-0.228, positive 1/30 dates
- Spread: designated underperforms non-designated by -9.53pp at 63d, positive 3/31 dates

**Root cause**: designations (BTD, ODD, FT) are already priced in when announced.
Companies with designations in this universe tend to be earlier-stage with high uncertainty
in commercially difficult indications. The pos_multiplier (1.12-1.34x) in Module 5 is
directionally wrong — it boosts names that systematically underperform.

**Implication**: pos_multiplier should be turned OFF or at minimum set to 1.0.
This is a potential live improvement (removing a harmful boost), not just a research
finding.

**How to apply:** Do not wire designation signals as positive DEM factors. The current
pos_multiplier is harmful. Consider a spec to neutralize or reverse the multiplier.
Oncology crowding penalty (Spec 033) is still the best positive research lead.
