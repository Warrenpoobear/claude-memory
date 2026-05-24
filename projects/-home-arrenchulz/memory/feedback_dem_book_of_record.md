---
name: DEM is book of record for all ticker scores
description: Any question about a ticker's score or rank should default to DEM output (decision_portfolio.csv), not composite score from screen_results.csv.
type: feedback
---

Any question about a ticker's score, rank, or standing should default to the **Decision Engine (DEM)** output (`decision_portfolio.csv`) — NOT `composite_score`/`composite_rank` from `screen_results.csv`.

**Why:** The user considers the raw composite score legacy/unreliable. The DEM post-processing layers (L0→L2→L4→L4b→L3) are the authoritative ranking and scoring pipeline. All ticker questions should assume DEM context.

**How to apply:**
1. When asked "what is X ranked?" or "what is X's score?" — look up `decision_portfolio.csv` (actionable_rank, tier, optionality, catalyst_days, etc.)
2. Do NOT default to `screen_results.csv` composite_rank/composite_score
3. The active ruleset's parameters and layer-by-layer DEM trace are authoritative
4. Only reference composite if explicitly asked for it
