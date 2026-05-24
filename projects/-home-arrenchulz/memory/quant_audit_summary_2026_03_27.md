---
name: Quant audit summary (2026-03-27)
description: Complete quant audit of model — 6 priorities investigated, 4 new tools built, calendar alpha ablation candidate created
type: project
---

## Quant Audit Summary (2026-03-27)

### Completed

| # | Priority | Result | Action |
|---|----------|--------|--------|
| 1 | Calendar alpha IC | NOISE (t<1.0 all horizons) | Ablation candidate created, evidence: NEEDS_MORE (+0.04pp) |
| 2 | Joint IC / collinearity | Orthogonal (corr +0.02) | No concern |
| 3 | Rolling IC dashboard | Built + wired (step 5k.7) | Daily tracking of 4 signals |
| 4 | Threshold sensitivity | ALL INSENSITIVE | Optionality anchor dominates top-20 |
| 5 | Sleeve rebalancing | 3-name concentration, not systematic | Monitor, don't cap |
| 6 | Liquidity sizing | Already handled by cost_haircut | No action needed |

### Key model findings

1. **Anchor-dominated top-book**: optionality_pct determines book membership; secondary signals (inst_delta, cal_alpha) affect intra-anchor ordering, not membership
2. **Calendar alpha is noise**: IC=-0.0005 at 20d, zero at all horizons — keep under ablation pressure
3. **Institutional delta is the strongest secondary signal**: IC=+0.049 at 20d (t=8.7), +0.077 at 60d (t=11.4)
4. **91-180d sleeve loss is idiosyncratic**: MAZE/PEPG/NUVB drive 122% of sleeve loss; KOD nearly offsets
5. **Cost haircut already penalizes illiquid names**: micro-caps limited to 6.7% weight

### Refined interpretation (user correction)

"Single-factor" is slightly overstated. The anchor dominates **book membership**, but the engine still has structured secondary contributions. The real alpha leakage is **within-bucket differentiation of catalyst names**, not global threshold tuning.

The repo already has shadow logic for this:
- `binary_now_sort_mode="quality_plus_institutional"` (shadow, default OFF)
- Catalyst-type quality multiplier (Spec 030, dormant)
- Binary rerank showed +5-13 position improvement for higher-quality names

### What to do next (post-April, shadow/evidence only)

1. **Keep calendar_alpha_off in evidence-gathering mode** — do not promote before April
2. **Stop global threshold sweeps** — insensitive, not where alpha lives
3. **Prioritize within-bucket reranking shadow tests:**
   - `binary_now_sort_mode="quality_plus_institutional"` first
   - Catalyst-type quality scaling in less_binary / build_window second
4. **Wait for optionality monitor 60d read** (late April) before any anchor changes
5. All changes through standard governance path
