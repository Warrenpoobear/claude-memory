---
name: 2026-03-18 session B — DE component attribution + rerank experiments
description: Ran component IC attribution and two DE rerank A/Bs. Baseline holds. Clinical negative IC needs bucket-local decomposition.
type: project
---

## Component IC Attribution (2025-01 to 2026-02, 71 dates)

Strongest positive signals (standalone):
- **coinvest_score_z**: IC=+0.122, t=9.3 at 63d (strongest single signal)
- **sponsor_tier1_count**: IC=+0.122, t=9.3 at 63d
- **actionable_rank**: IC=+0.081, t=5.2 at 63d (composite works)

Actively negative signals:
- **clinical_score_z**: IC=-0.055, t=-8.2 at 63d (hurting the ranking)
- **clinical_score**: IC=-0.053, t=-6.2 at 63d
- **rsi_14d**: IC=-0.046, t=-4.7 at 20d (short-term contra)
- **drawdown**: IC=-0.080, t=-3.6 at 63d

## DE Rerank A/B Results

| Experiment | 21d IC | 21d Gross | 63d IC | 63d Gross |
|---|---|---|---|---|
| **Baseline** | 0.0420 | **6.65%** | 0.0523 | **26.95%** |
| binary_now quality | 0.0425 | 6.03% | 0.0512 | 26.64% |
| Coinvest ON w=0.05 | 0.0421 | 6.30% | 0.0526 | 26.49% |

**Baseline wins on gross returns.** Neither rerank improved top-K portfolio.

## Key Conclusions

1. **No broad DE retune justified** — baseline holds
2. **Clinical negative IC** is consistent with v1.8.2 governance (global clinical sort was turned OFF for displacement). Narrow local clinical-quality tilt (v1.11.0 pattern) may still be valid.
3. **Coinvest**: strong standalone IC but doesn't translate to portfolio gain when injected as DE sort tilt — consistent with prior PIT-correct finding
4. **Next step**: bucket-local clinical decomposition (binary_now vs build_window vs less_binary vs core), then local reranks only in sleeves where the sign is favorable

**Why:** Standalone IC ≠ portfolio improvement. The DE sort key integrates many signals, and small tilts don't overcome the existing structure. Local reranks in compressed buckets remain the highest-ROI path.
