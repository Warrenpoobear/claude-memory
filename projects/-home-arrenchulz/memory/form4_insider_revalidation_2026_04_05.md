---
name: Form 4 insider revalidation (2026-04-05)
description: Insider signals formally closed — FM NW-t=1.23 (was 1.98), fails 4/6 Checklist v2 gates, selector delta +0.12pp (noise), ranker IC negative
type: project
---

## Form 4 Insider Revalidation — 2026-04-05

**Verdict: NO GO. Lane closed.**

### Why the retest

Prior Checklist v2 showed FM NW-t=1.98 (just above 1.96), keeping insider_exec_buy_value_90d alive as a shadow candidate. The pairwise ablation showed institutional is dominant, and the explicit next step was to test adding Form 4 to the institutional block.

### Answer: No

FM NW-t does not reproduce at 1.98 — re-run shows **1.23**. Even at 1.98, it failed 4/5 other gates.

**Checklist v2 (both signals fail 4/6 gates):**

| Gate | insider_net | insider_exec | Required |
|------|------------|-------------|----------|
| Signal card delta > 0 | PASS (+1.37pp) | PASS (+0.40pp) | > 0 |
| FM NW-t >= 1.96 | FAIL (-0.06) | FAIL (1.23) | >= 1.96 |
| Bootstrap CI excl 0 | FAIL | FAIL | excl 0 |
| BH FDR q < 0.10 | FAIL (q=0.30) | FAIL (q=0.30) | < 0.10 |
| Year stability | FAIL (3/6 neg) | FAIL (3/6 neg) | <= 1 neg |

**Selector: B6+insider_exec = +0.12pp (t=0.62) vs B6 alone.** Noise.
**Ranker IC within top-30: -0.008 (exec), -0.019 (net).** Negative — harmful.
**Overlap with B6: 96%.** Insider barely changes the book.

### Why institutional block already captures this

coinvest_score_z measures the number and quality of institutional co-investors. Insider buying is a SUBSET of institutional activity — when executives buy, it's reflected in 13F institutional flows. The institutional block already absorbs the signal content.

### How to apply

- Do NOT add insider to selector (B6) or ranker (pairwise_minimal)
- Do NOT reopen this lane unless fundamentally new data source (e.g., Form 4 derivative transactions, options grants)
- Keep Form 4 data pipeline operational for potential future use as a diagnostic flag
- The fetch infrastructure (280 tickers, 137K txns) is healthy and can be maintained at low cost
