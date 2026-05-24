---
name: Two-stage model architecture
description: DEM splits into selector (top-30 filter, proven) + within-top-30 ranker (new, uses options/AACT/inst_delta). Ranker stays shadow until top-30 IC is positive and rank-weighted beats EW net of costs.
type: project
---

## Decision (2026-04-01)
DEM should be split into two jobs:
1. **Selector**: decide which ~30 names deserve attention (PROVEN — keep current DEM)
2. **Ranker**: decide which of those 30 should get most capital (NEW — build as second stage)

## Evidence
- Full-universe IC: -0.044 (negative, t=-6.0) — ranking across universe is poor
- Top-30-only IC: -0.004 (zero, 50.4% positive) — within-bucket ordering doesn't predict
- EW Top-30 excess: +95.2% (2020-2026) — the selection is genuinely strong
- Rank-weighted underperforms EW — because within-top-30 IC is zero

## Ranker features (best candidates for within-top-30 ordering)
1. Options mispricing: actual_implied_move_pctile, event premium decomp, skew/RR
2. AACT timeline deltas: PCD shifts, enrollment changes, results posted
3. inst_delta_z (already the only confirmed sort contributor)
4. total_volume_z (if validated April 7)
5. Catalyst type v2 (regulatory vs pivotal vs mid-stage)
6. DealForma dealability priors (slow-moving, special situations)

## Promotion bar for ranker
- Top-30-only IC meaningfully positive and stable
- Rank-weighted Top-30 beats EW Top-30 net of costs
- Survives by regime, not just one lucky window
- Pairwise accuracy within top-30 > 55%

## What NOT to do
- Don't force current DEM score into a ranker
- Don't use always-on rank-weighting (already shown to underperform)
- Don't use fixed sleeve metadata or dynamic caps
- Keep selector fixed while building ranker

## Implementation path
Phase 1: Keep selector fixed, EW Top-30 control (DONE)
Phase 2: Build top-30 rank dataset (pairwise labels + features)
Phase 3: Train shadow ranker (logistic/GBM, pairwise)
Phase 4: Validate within-top-30 only
Phase 5: Only then let ranker influence capital

**How to apply:** All new feature work (options decomp, AACT deltas, catalyst EV) should be evaluated as within-top-30 ranking features, not full-universe sort signals. The selector is protected — don't change it.
