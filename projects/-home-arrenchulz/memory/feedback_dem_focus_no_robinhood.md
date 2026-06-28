---
name: feedback_dem_focus_no_robinhood
description: Default focus is daily DEM model runs; never initiate Robinhood portfolio trading unless operator explicitly requests it
metadata: 
  node_type: memory
  type: feedback
  status: active
  date: 2026-06-28
  originSessionId: 343b1f0b-e32c-430c-9ed2-a4dd08e02a94
---

Default focus for biotech work is **daily DEM model runs** (pipeline, snapshots, action cards, shadow monitors, validation).

**Why:** Operator preference locked in 2026-06-28. Robinhood portfolio trading is a separate, explicitly-gated action — not a default next step after any model or card run.

**How to apply:** Do not reference, suggest, or invoke Robinhood trading tools (place_equity_order, review_equity_order, rebalance skills, etc.) unless the operator explicitly asks for portfolio trading in that session. Running an action card does NOT imply authorization to trade. Daily work = model ops, not execution.
