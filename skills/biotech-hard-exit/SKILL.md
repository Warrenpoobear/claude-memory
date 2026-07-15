---
name: biotech-hard-exit
description: |
  Emergency full liquidation of agentic account 802349084 when the governance drawdown gate is breached. Use when the user says "hard exit", "emergency exit", "liquidate everything", "trigger the exit gate", or when drawdown vs XBI hits ≤ −2pp. Sells ALL equity positions to cash. Requires explicit operator confirmation before executing — this skill asks for confirmation unless the user already said "confirmed" or "execute". Never touches IRA accounts.
allowed-tools:
  - mcp__robinhood-trading__get_portfolio
  - mcp__robinhood-trading__get_equity_positions
  - mcp__robinhood-trading__get_equity_quotes
  - mcp__robinhood-trading__place_equity_order
  - mcp__robinhood-trading__review_equity_order
  - mcp__robinhood-trading__get_equity_orders
  - Bash(sleep *)
---

# Biotech Hard Exit

Emergency full liquidation of account 802349084.
**Irreversible. Confirm before executing.**

## Trigger conditions (Rule 4)
| Condition | Threshold | Action |
|-----------|-----------|--------|
| Drawdown vs XBI | ≤ −2pp | Hard exit — confirm first |
| Drawdown vs XBI | ≤ −5pp | Emergency — execute immediately |
| Operator instruction | "hard exit" / "liquidate" | Confirm first |

## Pre-execution

### 1 — Verify trigger (per-lot convention MANDATORY)

Drawdown vs XBI MUST be computed with the **per-lot XBI-anchored convention**
defined in `biotech-governance-check` Gate 1: each buy fill is compared to XBI
from its own fill date (`get_equity_positions` + `get_equity_orders state=filled`
→ per-symbol `r_sym − xbi_sym`, cost-weighted; endpoint parity on close dates).

The naive calc — cost-basis return vs XBI-since-inception — is **PROHIBITED as a
trigger basis**. It produces false breaches when buys are staggered into a rising
XBI (demonstrated 2026-07-12: naive −5.99pp = false emergency; per-lot +3.31pp =
PASS). A gate breach computed only the naive way is NOT a trigger.

Fail-closed rule: if the per-lot computation cannot be completed (missing fills,
missing XBI history, endpoint mismatch), the trigger is UNVERIFIED — do NOT
execute on the −2pp or −5pp bands; stop and ask the operator. Operator manual
instruction ("hard exit" / "liquidate") remains a valid trigger regardless.

Compute and report: current portfolio value, per-lot drawdown vs XBI, trigger condition met Y/N.

### 2 — Confirmation gate
**Unless drawdown ≤ −5pp OR user already said "confirmed":**
> "This will sell ALL N positions in account 802349084 (~$XXX.XX equity) to cash.
> Drawdown vs XBI: X.XXpp. Gate: [BREACHED / MANUAL INSTRUCTION].
> Re-entry requires explicit operator instruction after reviewing model health.
> **Type 'confirmed' to proceed.**"

Do not execute until confirmed.

## Execution

### Step 1 — Get all positions
`get_equity_positions(account_number="802349084")` → full position list

### Step 2 — Sell everything in batches
For each position:
```
place_equity_order(
    account_number="802349084",
    symbol=ticker,
    side="sell",
    type="market",
    time_in_force="gfd",
    market_hours="regular_hours",
    # Use quantity (not dollar_amount) to ensure full liquidation
    quantity=shares_held
)
```
Batch 8–10 orders, `sleep 5` between batches.

### Step 3 — Verify
`get_equity_positions` → confirm all positions closed (or note any that failed).
`get_portfolio` → confirm equity_value ≈ 0, cash = full proceeds.

### Step 4 — Report
```
HARD EXIT COMPLETE — YYYY-MM-DD HH:MM ET

Trigger: [DRAWDOWN GATE BREACHED: X.XXpp / OPERATOR INSTRUCTION]

SOLD (N positions):
  TICKER  Xshares  $XX.XX proceeds
  ...

Account state:
  Equity:  $0.00
  Cash:    $XXX.XX

RE-ENTRY: Blocked. Requires explicit operator instruction after
model health review. No automatic re-entry.
```

## Post-exit state
- Do not re-enter without explicit instruction
- Do not run `biotech-rebalance` until operator authorizes re-entry
- Log exit event and trigger condition for governance record

## Session-end learning

After this skill runs, if anything surprised you, log a learning per `~/.claude/docs/session-end-learning.md` (Pattern-Key `SKILL_BIOTECH_HARD_EXIT_{description}`).
