---
name: hedge efficacy study — collar vs put finding
description: Historical efficacy study shows collars dominate on DD reduction (60-75%) while bioshort's static scorer ranks OTM puts highest — first evidence of scorer-efficacy misalignment
type: project
---

## Finding (2026-03-18)

Hedge structure efficacy study using 12 months of Massive historical option closes:

- **Collars (5-10% OTM)**: 60-75% DD reduction, near-zero carry, best down-month payoff
- **Straight puts 15% OTM**: +3-9% DD (actually *increases* drawdown), cheapest carry
- **Straight puts 5% OTM**: 18-51% DD reduction, expensive carry

Bioshort's static scorer ranks 15% OTM puts #1 (cheapest carry). Historical efficacy says collars are 6-7x better on drawdown.

**Why:** Static score weights: 35% cost, 30% protection, 15% simplicity, 20% tail. Cost dominance lets cheap puts win even when they hedge poorly.

**How to apply:**
- Do NOT change bioshort scoring yet — feature freeze in effect
- Next steps (in order):
  1. Run 24-month study + rolling subperiod splits
  2. Test up-regime vs down-regime stability
  3. Compare live bioshort picks against collar benchmark in weekly archive
  4. If collar dominance holds across regimes, add historical-efficacy weighting layer
- Script: `scripts/research/hedge_efficacy_study.py`
- Results: `output/hedge_efficacy/` (XBI), `output/hedge_efficacy_ibb/` (IBB)
