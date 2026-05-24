---
name: Sleeve concentration research (2026-03-27)
description: 91-180d sleeve is 92% of shadow loss but concentrated in 3 names — structural, not systematic; cap would also reduce KOD-type wins
type: project
---

## Sleeve Concentration Finding (2026-03-27)

### Facts
- 91-180d sleeve: 54.3% weight (policy target 55%), $-22,423 cumulative, 92% of total loss
- Loss concentrated in 3 names: MAZE (-$6.2K), PEPG (-$3.0K), NUVB (-$2.7K) = 122% of sleeve loss
- KOD alone contributed +$8.7K — largest single winner in the sleeve
- 31-90d and less_binary roughly flat; 0-30d lost $-1.7K

### Loser characteristics
- MAZE: B-tier, rank 37, 158d, CLINICAL, soft catalyst
- PEPG: A-tier, rank 26, 127d, CLINICAL, soft catalyst
- NUVB: D-tier, rank unranked, 96d, CLINICAL, hard catalyst

### Counterfactual (naive linear scaling)
- Cap 91-180d at 45%: +$3.4K improvement
- Cap at 35%: +$6.8K improvement
- Cap at 25%: +$10.2K improvement

### Interpretation
The sleeve loss is **idiosyncratic name risk, not systematic sleeve failure**. Three names drifted pre-catalyst without resolution. KOD (same sleeve) delivered +75% when its catalyst fired.

Capping the sleeve would reduce both downside (MAZE-type drift) AND upside (KOD-type payoff). The better intervention is per-name risk controls within the sleeve, not sleeve-level caps.

### Possible interventions (research, not implemented)
1. **Per-name stop-loss within 91-180d**: exit names that drawdown >25% from entry without catalyst resolution
2. **Tier-gated weight**: only A-tier gets full allocation, B/C/D get reduced weight
3. **Hard-catalyst preference**: within 91-180d, tilt toward hard-catalyst names (NUVB had is_hard=1 but was D-tier)
4. **Momentum filter**: exclude headwind names from 91-180d (MAZE was likely headwind)

### Recommendation
Do not change sleeve policy targets now. The 55/25/10/10 split is reasonable for a binary catalyst portfolio. Monitor per-name concentration and consider adding a per-name drawdown gate within the 91-180d sleeve after April outcomes.

**Why:** 22 days of shadow data is too few to distinguish signal from noise in sleeve performance. KOD's single win nearly offsets the entire sleeve loss.

**How to apply:** Revisit after 60+ days of shadow data. If 91-180d consistently underperforms on a per-name basis (not just aggregate), implement per-name drawdown gate.
