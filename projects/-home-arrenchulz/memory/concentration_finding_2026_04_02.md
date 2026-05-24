---
name: concentration_finding_2026_04_02
description: CRITICAL FINDING — DEM Top-20 beats Top-30 by +139pp. The pruner's value was concentration, not inst_delta_z stock-picking.
type: project
---

## Concentration Finding (2026-04-02)

### The result that changes the architecture

| Strategy | 63d excess/mo | Cumulative | IR |
|----------|-------------|------------|-----|
| EW Top-30 | +1.91pp | +138pp | 0.19 |
| **DEM Top-20** | **+3.84pp** | **+277pp** | **0.32** |
| IDZ Top-20 | +3.72pp | +268pp | 0.30 |

### Decomposition
- **Concentration effect** (20 vs 30): +1.93pp/mo = 106% of total improvement
- **IDZ stock picking**: -0.12pp/mo = slightly negative
- **Overlap**: DEM Top-20 and IDZ Top-20 are 94% the same names

### What this means
- The pruner was getting credit for concentration, not inst_delta_z
- DEM's rank order is already the best ordering within the top-30
- Just holding fewer names (20 instead of 30) is the entire improvement
- inst_delta_z adds nothing on top of DEM's existing ordering

### Optimal Top-N (63d, 72 months)
| N | Excess/mo | Cum | IR |
|---|-----------|-----|-----|
| 10 | +3.32pp | +239pp | 0.19 |
| 15 | +3.48pp | +250pp | 0.25 |
| **20** | **+3.84pp** | **+277pp** | **0.32** |
| 25 | +2.60pp | +188pp | 0.26 |
| 30 | +1.91pp | +138pp | 0.19 |

### Revised architecture
- **DEM picks 20** (not 30, and no pruner needed)
- EW Top-20 is the optimal portfolio
- inst_delta_z is not a stock-picker, just a concentration proxy
- The "pruner" should be replaced by simply lowering the portfolio count

**Why:** This is a simpler, more honest result. The edge is concentration, not signal.
**How to apply:** When discussing the pruner with Scott/IC, present the decomposition honestly. The recommendation changes from "DEM+pruner" to "DEM Top-20 directly."
