---
name: readiness_gate_ops
description: Operational notes on readiness scorecard bootstrap sequence and shadow_excess data accumulation
type: feedback
---

Weekend/holiday performance rows have blank `excess_vs_xbi_pct` and DO NOT count toward the `shadow_excess_vs_xbi` readiness check (MIN_PERF_WEEKS=2). Duplicate rows also don't count.

**Why:** Discovered 2026-03-13 when scorecard showed "1 period (need 2)" despite 3 rows for ruleset `7177a4ea` — two were blank weekend entries.

**How to apply:**
- Don't debug "insufficient data" on the scorecard until verifying how many rows have non-blank `excess_vs_xbi_pct` for the active ruleset.
- Bootstrap sequence for a new ruleset: (1) run_screen → snapshot, (2) live_shadow_portfolio → positions, (3) build_trade_plan → writes pre_trade.json to `trade_plan/` even if it fails at readiness gate, (4) re-run scorecard standalone to pick up pre_trade.json, (5) wait for ≥2 valid trading-day perf rows, (6) build_trade_plan should then pass.
- The scorecard reads pre_trade.json from `artifacts/live_shadow/trade_plan/{date}/`, NOT from `pre_trade/{date}/` or `execution/{date}/`. Only `build_trade_plan.py` writes to the correct path.
