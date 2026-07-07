---
name: Polymarket alpha verdict (2026-05-05)
description: Polymarket biotech-event prediction-market layer frozen as ANECDOTAL_SHADOW / NO VERDICT — public CLOB archive insufficient for proper alpha test; collector retained for prospective capture only
type: project
status: active
related: catalyst_phase_a_verdict_2026_05_04.md, policy_alpha_freeze_2026_04_04.md
originSessionId: 293f6ecf-b892-40d7-8ab7-99e0bf62faca
---
# Polymarket alpha verdict (2026-05-05)

Phase 0 collector scaffolded `tools/poll_polymarket_biotech.py` (commit `214cd36a`). Historical event-study run 2026-05-05 against public Gamma + CLOB APIs. Output: `data/polymarket/alpha_event_study_2026-05-05.json` (gitignored).

## Verdict (frozen)

- **ANECDOTAL_SHADOW / NO VERDICT.** Below the 25-event minimum-evidence threshold.
- Do NOT promote to selector, ranker, Event EV, dashboards, or rankings.
- Do NOT pursue Goldsky subgraph, Dune Analytics, or on-chain reconstruction now (1-3 day data-engineering task — only revisit if prospective coverage grows).
- Keep `tools/poll_polymarket_biotech.py` running for prospective shadow capture only. Do not change unless needed for capture hygiene.

## Findings (descriptive, not evidence)

1. **Public CLOB price-history is archive-truncated.** `https://clob.polymarket.com/prices-history` returns 0 history points for 2025 closed markets even with `interval=max` / `interval=all`. Recent (~April 2026) markets work; older does not. Bottleneck is data availability, not analysis methodology.
2. **Inventory cap:** 25 closed "FDA approves X" events EVER on PM (back to June 2025). Of those, only 5 have retrievable PM history; only 3 have matching stock-side data (`production_data/price_history.csv`); only **1 is small/mid biotech** (AXSM AXS-05, 2026-04-30, HIT, +12.3% [-1,+1]). Other two (SNY ×2) are large pharma where PM was at 1.00 by T-3 = no alpha extractable.
3. **AXSM gold-anecdote:** PM held YES at 0.71–0.82 in final week (non-trivially positioned), realized HIT, stock rallied. Single observation. Useful as a case study; not statistical evidence.
4. **ARGX Vyvgart (live, ends 2026-05-10):** the next prospective gold-case. PM YES = 0.97 currently. If it resolves with non-trivial PM probability AND material stock move, that's a fresh anecdotal data point — N=2 candidate. Still anecdote, not evidence.
5. **Liquid PM = no alpha:** for SNY/MRK/large-pharma markets, PM converges to 1.00 by T-3 → no information beyond consensus.

## Re-test thresholds (locked)

Re-evaluate this verdict only when prospective HIGH/MEDIUM-confidence matched events with full stock-return windows reach:

| Sample size | Status |
|---|---|
| **< 25** | anecdotal only — current state, don't run formal tests |
| **25–50** | shadow research — Spearman IC, descriptive bootstrap, no promotion |
| **> 50** | Checklist v2-style alpha test eligible (FM-NW-t + block bootstrap + FDR + LOSO) |

**No production promotion from this study at any threshold without an audited replacement plan and explicit user direction.**

## What's the actual question

The alpha question is NOT "is Polymarket calibrated?" (that's an event-probability test). The alpha question is whether `internal_model_p_hit − polymarket_yes_prob` predicts post-event excess returns after controlling for production features. Currently uncomputable — `model_p_hit` field on rankings.csv is null (still the open EV outcome-binder ticket from clinical/catalyst Phase A). Even with prospective volume growth, this verdict can't change until the binder ships.

## Why

Polymarket biotech coverage is structurally thin: ~7 active events at any moment, dominated by large pharma (Lilly Retatrutide $562K vol = 30× the next-largest market). Small/mid biotech matches to our universe are ~1-3 simultaneously. CLOB archive truncation removes the historical sample that would have made a proper alpha test possible. Without a non-CLOB historical source AND a working `model_p_hit` field, the gap signal cannot be tested at promotion-grade power.

## How to apply

- Do NOT propose Polymarket as a signal in any selector / ranker / EV context before the re-test threshold is met AND the EV outcome-binder lands.
- Treat `polymarket_yes_prob` and `model_minus_polymarket_p_hit` as **diagnostic reference fields**, not signal inputs.
- AXSM and ARGX are case-study examples — useful for explaining the framework, not for inference.
- If prospective coverage grows past 25 matches, schedule a focused re-run; do not chase historical sources prematurely.
- If Hermes' "123 markets" claim is later substantiated with a reproducible query path, re-run inventory step before any other work.
- Collector cron NOT scheduled. If/when scheduled later, use the `25 17 * * 1-5` slot pattern (post-prod, pre-evening-agents) only.
