---
name: project-agentic-portfolio-testcase
description: "Agentic Robinhood account (802349084) is the live test case for building rules, skills, and memories for managing a live biotech model portfolio with Claude"
metadata: 
  node_type: memory
  type: project
  status: active
  originSessionId: b5a62b40-67a7-4bc7-9db5-ab70c9a2d5f5
---

The agentic Robinhood account (802349084) is being used as a deliberate live test case for developing repeatable operational patterns — rules, skills, and memories — for Claude-assisted management of a live biotech model portfolio.

**Why:** The user wants to build out a structured operational capability, not just execute one-off trades. Each session with the account is both an execution event and a learning/documentation exercise.

**How to apply:** When working with account 802349084, treat every interaction as an opportunity to identify and document: (1) operational constraints (T+1, rate limits, order type restrictions), (2) reusable workflows (rebalance, position review, model rank cross-reference), (3) decision rules (when to trim, when to top up, how to handle sub-$1 minimums). Capture lessons in memory as they emerge.

## Operational constraints discovered (2026-06-24)

- **T+1 settlement**: Cash from same-day sells is NOT available as buying power until next business day. Plan sells and buys across sessions or accept the settlement gap.
- **Rate limit**: ~16-20 orders/minute (429 error). Batch orders with delays between groups.
- **GFD only**: Dollar-based fractional orders do not support GTC time_in_force. Cannot pre-queue buys for market open.
- **$1 minimum**: Dollar-based orders rejected below $1. Positions slightly over target remain untrimmed when delta < $1.
- **ABVX restriction**: Robinhood marks this ticker sell-only ("Instrument currently can only be sold"). Exclude from any buy list.

## Rebalance workflow (validated 2026-06-24)

1. `get_portfolio` → verify buying power and total equity
2. `get_equity_positions` → current holdings and market values
3. Load `data/snapshots/<date>/rankings.csv` → model target weights or equal-weight target
4. Compute per-position delta (target - current)
5. Execute sells first (positive buying power before buys)
6. Execute buys in batches of ~8-10 with brief pauses to avoid 429
7. Log any orders blocked by minimums or restrictions

## Related
[[robinhood-live-execution-2026-06-10]]
[[ees-shadow-monitor-state-2026-06-23]]
