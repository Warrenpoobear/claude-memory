---
name: survivorship_bias_finding
description: V2 clinical priors have survivorship bias — 2,220 terminated/withdrawn trials without labels vs 1,587 labeled. True success rate likely 26-50%, not 63.3%.
type: project
---

## Survivorship Bias in Clinical Outcome Labels (2026-03-16)

### Finding
- 1,587 high-confidence p-value labels (63.3% success)
- 2,220 terminated/withdrawn trials WITHOUT labels (likely failures)
- Missing-failure pool is 1.4x larger than labeled pool
- Worst-case adjusted rate: 26.4% (if all missing = failure)
- Realistic estimate: probably 35-50% true success rate

### Bias by Phase
- Phase 1: 759 unlabeled terminated (most failures, lowest compliance)
- Phase 2: 691 unlabeled terminated
- Phase 3: 308 unlabeled terminated (more reliable labeled sample)

### Impact on V2 Priors
- Phase 2 raw 52.2% is almost certainly overstated
- Phase 3 raw 73.2% is more reliable but still upward-biased
- ±2 cap provides natural protection against over-correction
- Absolute rates should NOT be treated as calibrated truth

### Mitigation
- ±2 cap already limits damage
- Shrinkage toward Wong refs further dampens bias
- Need EDGAR full-text labels for terminated trials to close the gap
- Until then: treat v2 as relative ranking prior, not absolute calibration

**Why:** The labeled pool is heavily survivorship-biased because only
trials that post results to CT.gov get p-value labels. Terminated trials
rarely post results.

**How to apply:** When discussing v2 prior accuracy, always cite the
2,220 missing terminated trials. Do not treat 63.3% as calibrated truth.
The ±2 cap is the correct safeguard.
