---
name: project-agentic-portfolio-rules
description: "Operational rules for Claude-managed agentic Robinhood account (802349084) — rebalance triggers, entry/exit, sizing, governance exits, IRA coordination"
metadata: 
  node_type: memory
  type: project
  status: active
  related: project-agentic-portfolio-testcase
  originSessionId: b5a62b40-67a7-4bc7-9db5-ab70c9a2d5f5
---

Confirmed by operator 2026-06-24. Apply these rules whenever managing account 802349084.

## Rule 1 — Rebalance Trigger

- **Calendar cadence**: Weekly, Monday at market open (9:30 AM ET)
- **Drift trigger**: Off-cycle rebalance if any position drifts >25% from equal-weight target (e.g., at $10.82 target → trigger if any position < $8.12 or > $13.52)
- **T+1 skip**: If T+1 settlement gap would block >50% of required buys, defer to Tuesday open

## Rule 2 — Entry/Exit on Roster Changes

- **New ticker enters top-30**: Add at next weekly rebalance (not immediately)
- **Ticker drops out of top-30**: Exit at next weekly rebalance
- **Ticker drops below rank 40**: Exit within the session it's discovered (don't wait for weekly)
- **Binary catalyst within 5 days** (PDUFA, Ph3 readout): Flag for manual review before acting — do not auto-exit or auto-add

## Rule 3 — Position Sizing

- **Standing rule**: Equal weight = total equity / number of positions (currently 30)
- **Switch to model weight**: When account exceeds $5,000 (model `target_weight_pct` from rankings.csv)
- **Exception**: If model weight spread is >3x between highest and lowest position in top-30, escalate for manual decision before rebalancing to model weights

## Rule 4 — Governance Hard Exit

- **Trigger**: Portfolio drawdown vs XBI ≤ −2pp
- **Action**: Full liquidation to cash, market orders, within one session
- **Re-entry**: Not automatic — requires explicit operator instruction after model health review
- **Emergency trigger**: ≤ −5pp → liquidate immediately regardless of session timing or day
- **Check**: Run `get_portfolio` + compare to XBI at start of any rebalance session to verify gate is clear

## Rule 5 — IRA vs Agentic Coordination

- **Managed independently**: IRAs (••••0727, ••••0174) are long-term conviction holds; no scheduled rebalancing
- **No exclusion overlap**: A position held in an IRA can also be held in the agentic account
- **IRA rebalance**: Manual only, on explicit operator instruction — never on a calendar schedule
- **Agentic account**: Follows model top-30 rotation per Rules 1–4 above

## Why
Operator confirmed these as the standing operational rules on 2026-06-24. The agentic account is the live test case for building Claude-managed portfolio operations. Rules should evolve as patterns emerge — update this file when any rule is modified.

**How to apply**: At the start of every rebalance session, check: (1) Is today Monday or a drift trigger hit? (2) Has the top-30 roster changed? (3) Is the drawdown gate clear? Then execute per the above.
