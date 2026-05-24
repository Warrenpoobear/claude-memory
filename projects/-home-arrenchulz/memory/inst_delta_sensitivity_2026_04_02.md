---
name: inst_delta_sensitivity_2026_04_02
description: inst_delta_z weight sensitivity results — best at Top-20, not Top-30. First confirmed ranker anchor baseline.
type: project
---

## inst_delta_z Sensitivity (2026-04-02)

Ran ranker harness across Top-10/20/30 cutoffs, 2024-01 to present (28 monthly dates).

### Results

| Top-N | 20d IC | 63d IC | 63d RW-EW net | Skew spread | Verdict |
|-------|--------|--------|---------------|-------------|---------|
| 10 | +0.059 | -0.047 | -65pp | -4.8pp | NOT_READY |
| **20** | **+0.087** | **+0.047** | **+25pp** | **+7.9pp** | **PROMOTE** |
| 30 | -0.035 | +0.005 | +7pp | -0.7pp | PROMOTE (barely) |

### Key finding
inst_delta_z works best in **Top-20**, not Top-30. At Top-20:
- 63d IC positive (+0.047)
- RW beats EW by +25pp cumulative net of costs
- Strong upside skew: top quintile +15.8pp vs bottom +7.9pp

At Top-30 the signal is basically noise (IC ~0). At Top-10 it inverts.

### Implication for ranker architecture
The stage-2 ranker may need to operate on Top-20, not Top-30. Or: use inst_delta_z to select the best 20 from the Top-30 (a concentrator, not a reweighter).

### Caveat
Only 5 months with enough forward returns (28 dates, but many too recent for 63d). t-stat is 0.36 — not significant. Needs more time to confirm.

**Why:** First confirmed non-options ranker anchor. Establishes baseline for AACT delta comparison.
**How to apply:** Use Top-20 as the target bucket for ranker v1. Test AACT execution_score at same cutoff.
