---
name: pos_calibration_finding
description: PoS calibration with CT.gov p-value labels confirms composite_score has weak clinical outcome discrimination (slope=0.032). Real model issue, not labeling artifact.
type: project
---

## PoS Calibration Finding (2026-03-16)

### Labels
- 1,587 high-confidence p-value-based labels from CT.gov Results API
- 1,005 success (p<0.05), 582 failure (p>=0.05)
- Overall success rate: 63.3% (was 75.6% from completion proxy)

### Calibration Result (v2 labels)
- Joinable rows: 819
- Success rate in calibration set: 61.9%
- **Calibration slope: 0.032** (was 0.037 with completion proxy)
- Actual rate by composite_score quintile: 55% → 66% (11pp spread)

### Interpretation
The near-zero slope persists with clean labels. This is NOT a labeling
artifact — composite_score genuinely has weak discrimination between
trial success and failure.

Possible reasons:
1. composite_score is a broad ranking output mixing clinical, catalyst,
   financial, and momentum signals — it was never designed as a PoS predictor
2. The clinical sub-score (clinical_score) may discriminate better but is
   also diluted by non-clinical components
3. The PoS model's base rates may be well-calibrated for population averages
   but not for ranking within the universe

### What this means for DEM tuning
- Do NOT tune DEM weights against composite_score — it's the wrong surface
- Build a dedicated PoS prediction surface from clinical-only features:
  endpoint quality, phase, biomarker selection, enrollment, design quality
- Test that surface against the 1,587 p-value outcomes
- Only after that can you know if clinical features predict PoS in this universe

### Next steps
1. Build clinical-only PoS predictor from trial design features
2. Calibrate against the 1,587 high-confidence labels
3. If clinical features discriminate: tune weights
4. If they don't: the universe may be too homogeneous for within-universe PoS ranking

**Why:** The calibration framework is correct and the labels are now clean.
The model's composite score is simply not a PoS predictor.

**How to apply:** Do not invest in composite_score PoS tuning. Build a
dedicated clinical prediction surface first, then calibrate.
