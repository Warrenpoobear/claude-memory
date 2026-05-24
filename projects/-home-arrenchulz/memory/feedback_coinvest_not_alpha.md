---
name: Coinvest is a filter, not standalone alpha
description: 13F manager-held backtest shows coinvest works as quality filter / sanity check, not dominant long signal. Not-held names outperform held on raw returns (lottery premium). Do not increase institutional weighting without risk-adjusted decomposition.
type: feedback
originSessionId: a773d6d6-8ca8-4bb1-9107-deded3eaf3f1
---
Coinvest is a filter, not standalone alpha.

**Why:** Backtest (74 monthly periods, 2020-2026): manager-held EW +0.82%/mo vs not-held +1.73%/mo. Q5-Q1 spread +0.76%/mo at t=0.95 (not significant). Not-held pocket = small-cap lottery with uglier risk. Held beats XBI (+0.41%/mo, 58% hit) but loses to not-held by 0.92%/mo.

**How to apply:**
- Use coinvest as quality filter, sanity check, agent explanation feature
- Do NOT use "manager-held" as a top-level long signal
- Do NOT increase institutional block weighting (currently 65%) without risk-adjusted decomposition
- Next edge: separating "smart sponsorship" from "ignored micro-cap optionality", not more raw manager coverage
- Treat manager additions as system completeness, not research victories
