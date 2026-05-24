---
name: Spec 056 Herald Precision Signal Study
description: event_type_score is FIRST signal to PASS full Checklist v2 (5/5 gates) — use as diagnostic, not selector weight
type: project
---

## Spec 056 — Herald Precision Study (2026-04-04)

**COMPLETE.** First study under Promotion Checklist v2.

### PASS: event_type_score (5/5 gates)
- Signal card: Δ=+1.52pp (t=3.74), IC=+0.008
- **FM incremental NW-t = +2.34** after coinvest+inst+financial controls
- Bootstrap: 95% CI excludes zero
- BH FDR: q = 0.096 < 0.10
- LOSO: no unstable dimensions

### But: does NOT improve B6 selector bundle
- Every B6 + herald bundle is WORSE than B6 alone
- Same pattern as options/execution: incremental cross-sectional power doesn't translate to better sorting
- **Best use: diagnostic filter, event-type conditioning, risk/sizing modifier**

### Other findings
- `is_hard_catalyst`: +3.44pp spread (strong) but fails FM incremental (NW-t=1.74). Use as risk/sizing modifier.
- SEC-sourced near-catalyst: +5.22pp (n=136) — operational intelligence, too small for systematic
- Hard + low coinvest = +3.77pp — hard catalysts can rescue undiscovered names
- Soft + low coinvest = −1.95pp — worst quadrant, avoid
- `clinical_date_confidence`: inverted, CLOSED as signal

### Infrastructure
- Script: `scripts/research/herald_precision_study.py`
- Output: `output/herald_precision_study/`
