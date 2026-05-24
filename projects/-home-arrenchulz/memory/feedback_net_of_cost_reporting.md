---
name: Net-of-cost reporting default
description: All performance results must be shown net of trading costs first; gross is secondary
type: feedback
originSessionId: 5ba4ffdd-7e02-4b9f-ad61-fe538d3076f8
---
All performance reporting — backtests, forward shadows, live monitors, trailing returns,
strategy comparisons — must show **net-of-trading-cost returns as the primary result**.

**Rules:**
1. Net returns first, always. Gross is secondary and labeled "Gross (before costs)".
2. Separate historical/pseudo-PIT from live/production period in every report.
3. Always show: cumulative, annualized, excess vs XBI, monthly excess, t-stat, hit rate, max drawdown.
4. Default cost assumption: **Base 50bps one-way**. Also show Low 25bps and High 100bps.
5. Apply costs using actual turnover, not assumed full replacement.
6. XBI stays gross unless explicitly told otherwise.
7. Current conventions: regenerated PIT v2 / current ruleset, live starts 2024-10-01, JBIO excluded.
8. Headline numbers must say "net excess vs XBI" — never present an unlabeled return.
9. A single topline number without net/gross label is an error. Default to net.
10. Older analyses must be restated on a net basis before drawing conclusions.

**Why:** Gross returns overstate realized edge. The strategy has ~19% monthly one-way turnover;
at 50bps base cost this is ~19bps/month drag. Presenting gross as the headline creates false
confidence. The edge survives costs (breakeven at ~500bps) but the honest number is the net number.

**How to apply:** In every performance output, first table = net results. Second table = optional
gross vs net bridge. Final verdict based on net, never gross.
