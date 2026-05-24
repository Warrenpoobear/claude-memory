---
name: architecture_pruner_2026_04_02
description: Locked architecture — DEM selector + inst_delta_z pruner (Top-30 → EW Top-20). Committee-ready result.
type: project
---

## Architecture: Selector + Pruner (locked 2026-04-02)

### The model
- **Stage 1:** DEM picks top 30 (selector, frozen)
- **Stage 2:** inst_delta_z drops the worst 10 (pruner)
- **Portfolio:** EW Top-20

### Evidence (76 months, 2020-2026)
- EW Top-30: +1.91pp/mo, +138pp cum, IR 0.19
- **IDZ Top-20: +3.72pp/mo, +268pp cum, IR 0.30**
- Spread: +1.76pp/mo net of costs, +127pp cumulative
- Positive 4/6 years (2020: +6.7pp, 2022: +2.7pp, 2023: +1.2pp, 2025: +0.7pp)

### What was killed and why
- **total_volume_z**: IC = -0.10 on PIT-native (109 obs). Look-ahead bias in original +0.134.
- **Options surface ranker**: IC negative at all horizons over 50 months. Shadow diagnostic only.
- **Rank-weighting**: inst_delta_z has real IC (+0.143, t=2.36) but RW doesn't monetize — pruning does.
- **Fixed sleeve budgets**: retired Apr 1 (+153% drag was the primary construction leak).

### Next test (queued)
- **Baseline:** EW Top-20 by inst_delta_z
- **Challenger:** EW Top-20 by inst_delta_z + aact_execution_score
- **Gate:** joint must beat BOTH EW Top-30 AND IDZ-only Top-20 on IC, spread, net of costs
- **Status:** AACT accumulating daily, need ~20 dates with both signals nonzero

### Committee narrative (one slide)
1. DEM picks the bucket. EW Top-30 is the baseline.
2. inst_delta_z prunes to Top-20: +127pp net over 76 months.
3. Dead lanes killed with discipline (volume_z, options ranker).
4. Next: test AACT execution deltas as add-on. Promote only if it beats both baselines.

### inst_delta_z status
- Signal is LIVE as of Apr 2 (cross-quarter Q3→Q4 fix shipped)
- Was dark Mar 5 – Apr 2 (same-quarter comparison produced zeros)
- Next 13F refresh: ~May 15 (Q1 2026 filings)

**Why:** This is the simplest, most defensible architecture given current evidence.
**How to apply:** Do not propose rank-weighting, options-based ranking, or full-universe IC improvements. The pruner is the path. Test AACT as the one add-on.
