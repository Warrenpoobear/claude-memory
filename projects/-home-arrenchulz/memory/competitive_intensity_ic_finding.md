---
name: Competitive intensity IC finding (2026-03-21)
description: competitive_intensity_z has significant 63d IC but signal is non-monotonic and confounded with indication market size — not usable as linear sort signal
type: project
---

## Finding

competitive_intensity_z (from CompetitiveIntensityEngine, diagnostic-only in run_screen.py)
was tested for forward return IC across 34 catalyst_tilt_eval dates.

### Results
- 20d IC: +0.006, t=+0.31 — noise
- 63d IC: +0.053, t=+3.45, pos 23/8 — significant but misleading
- Quintile spread (63d): -9.83pp (crowded underperform uncrowded, positive 6/31 dates)

### U-shaped category returns (63d)
- uncrowded: +26.29pp (n=1,372)
- moderate: +18.67pp (n=353)
- crowded: +0.11pp (n=53)
- highly_crowded: +28.40pp (n=2,284)

### Root cause
- Non-monotonic: uncrowded AND highly_crowded both outperform
- highly_crowded = big therapeutic areas (onc, immuno) where market is larger → composition effect
- The significant IC is an artifact of 56% ceiling concentration (all scored 0.718)
- Signal confounded with indication market size, not competitive quality

### Verdict
NOT usable as a linear DEM sort signal. Would need:
- Indication-level normalization (within-indication crowding vs cross-indication)
- Or binary uncrowded-vs-crowded within same therapeutic area
- Current engine treats crowding as a scalar; the data says it's non-linear

## Within-Indication Deep Dive (same session)

Oncology vs non-oncology split reveals OPPOSITE signals:
- **Oncology (n=56/date)**: 63d IC=-0.055, t=-2.76 — crowding HURTS
- **Non-oncology (n=77/date)**: 63d IC=+0.066, t=+3.49 — crowding = validation
- **Oncology uncrowded vs crowded**: +5.35pp at 63d, positive 20/31 dates

### Root cause of cross-universe confusion
Crowding means different things by therapeutic area:
- Oncology: crowded = too many competitors, hurts returns
- Non-oncology (small areas): crowded = indication validated, helps returns

### Potential actionable signal
Oncology-only crowding penalty: IC=-0.055, t=-2.76, +5.35pp uncrowded spread.
39% of universe is oncology (75/190 names). Economically meaningful if it holds.

### Next steps (if pursuing)
- Build oncology-gated crowding penalty (binary or continuous)
- Test on PIT panel with longer date range
- Consider interaction with optionality (does crowding penalty add to optionality or is it redundant?)
- This would be a new Spec (033+) with proper governance

**How to apply:** Do not wire competitive_intensity_z into DEM as-is. The cross-universe
signal is confounded. But oncology-specific crowding penalty is a genuine research lead
worth a dedicated spec if the team wants to pursue it.
