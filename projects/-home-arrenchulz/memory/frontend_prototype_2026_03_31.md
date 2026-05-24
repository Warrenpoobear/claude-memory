---
name: Frontend prototype state (2026-03-31)
description: React Rankings Table + Ticker Detail prototype built in canvas, ready for FastAPI wiring
type: project
---

## Frontend Prototype (2026-03-31)

### What exists
- React prototype with Rankings Table (landing) + Ticker Detail (click-through)
- Built in Claude Chat canvas — needs to be saved to repo as static files
- Mock data uses actual field names from rankings.csv, decision_portfolio.csv, shadow positions, options, CRT

### Data contracts already queryable
- `rankings.csv`: actionable_rank, tier_any, catalyst_days, catalyst_family, is_hard_catalyst, clinical_optionality_pct_dev, mom_state
- `decision_portfolio.csv`: tier_reason, archetype, alpha_cohort_pct
- Shadow portfolio: bucket, weight_pct, family, regulatory_days
- Options: atm_iv_change_5d, opt_rr_25d, actual_implied_move_pctile
- CRT: outcome, price_direction, prediction_dem_rank

### Existing backend
- FastAPI shell with /api/positions, /api/policy, /api/bioshort, date selectors
- MCP server: mcp_server/ with 12 registered tools
- Both pull from same production_data/ and data/snapshots/ sources

### Page priority (Scott's workflow)
1. **Ticker Detail** — "why this name, what do I do" (where Scott lives)
2. **Rankings Table** — "what's on top today" (entry point)
3. **Options Monitor** — "is the market pricing the catalyst" (shapes conviction)
4. **Calibration/CRT** — governance reviews (not daily)
5. **Command Center** — CTO page, build last

### Next steps
- Add tier grouping to Rankings Table (A-tier pinned at top)
- Wire mock data → fetch('/api/ticker/{ticker}') calls
- Deploy as pages in existing FastAPI app

**Why:** Scott needs a stock picker, not a control room. Every chart answers one question.

**How to apply:** When wiring, replace mock data functions with API fetches — field names already match. No new backend schema needed.
