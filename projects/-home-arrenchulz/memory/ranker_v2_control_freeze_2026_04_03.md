---
name: Ranker v2 Control Freeze
description: Frozen control config for ranker v2 incremental testing — pairwise C1 minimal, institutional+risk only
type: project
---

## Ranker v2 Control Freeze (2026-04-03)

**Frozen control configuration** — do not modify until Form 4 incremental test completes.

- A4 selector
- Pairwise logistic, C1 cohort (top-60, no catalyst window gate)
- Minimal feature set, 200 epochs
- Institutional + risk blocks only

**Why:** Ablation shows institutional is +1.62pp, risk is +0.89pp. Clinical is destructive (-0.35pp). Options are noise (0.00pp). No reason to add complexity to blocks that subtract value.

**How to apply:**
- Do NOT cut over production before Form 4 incremental test
- Do NOT add clinical or options features back to ranker v2
- Next experiment: pairwise C1 minimal + Form 4 insider features vs pairwise C1 minimal without
- Judge on: incremental excess, Δ vs control, turnover change, small-cap subgroup, catalyst-near subgroup

### Ablation Evidence (expanded blocks, pairwise C1, 59 periods)
| Dropped | Excess pp/mo | Δ vs full |
|---------|-------------|-----------|
| institutional | 0.60 | -1.62 |
| risk | 1.33 | -0.89 |
| clinical | 2.57 | +0.35 |
| options | 2.23 | +0.00 |
