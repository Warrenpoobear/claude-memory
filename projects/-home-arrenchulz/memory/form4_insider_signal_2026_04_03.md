---
name: Form 4 Insider Signal Decision
description: Form 4 insider buying approved as shadow ranker feature — spec, priority, and implementation stance
type: project
---

## Form 4 Insider Signal — Approved for Shadow Queue (2026-04-03)

**Decision**: Test Form 4 as a shadow **ranker** feature, NOT selector. Selector stays A4.

**Why:** Institutional block is the most valuable feature block (+0.48pp/mo); clinical hurt, options mildly hurt, risk added nothing. Minimal feature set beats expanded. Form 4 is a clean institutional-refinement signal, EDGAR-native, no vendor dependency.

**How to apply:** Slot into ranker v2 C1 shadow track as a new institutional-refinement block.

### Priority Queue (ordered)
1. Re-run **pairwise C1 minimal** at full training strength
2. Compare against production
3. Add **Form 4 insider shadow features** (in parallel or immediately after)
4. Test in **minimal ranker only**, not expanded

### Core Signal Family
- `insider_net_buy_value_90d`
- `insider_net_buy_shares_90d`
- `insider_buy_count_90d`
- `insider_sell_count_90d`
- `insider_net_buyer_flag_90d`
- `insider_buying_by_exec_flag_90d` (CEO/CFO/COO/Pres)
- `insider_cluster_buy_flag_90d` (2+ insiders buying in window)

### Event-Aware Variants
- 30d / 60d / 90d pre-catalyst windows (default: 90d)
- Interaction terms: `insider_net_buy * small_cap`, `* catalyst_near`, `* drug_developer`

### PIT Discipline (NON-NEGOTIABLE)
Use **filing date / EDGAR acceptance timestamp**, not transaction date. Form 4 can disclose after the fact.

### Implementation
- Medium effort, CCFT-feasible
- Higher priority than new data vendors, lower than pairwise rerun
- Start simple: net dollar buying, exec-only, cluster, buys/sells separated
- Expected edge: small/mid-cap catalyst names, tie-breaker/reranker role
- NOT expected to be a selector anchor by itself

### Classification
- EDGAR-native, open data
- Effort: medium
- Promotion bar: same as all ranker features — top-30 IC positive + RW beats EW net of costs
