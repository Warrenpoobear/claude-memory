---
name: April-May 2026 roadmap
description: 3-phase roadmap — Phase 1+2 COMPLETE, Phase 3 (May) is AACT deltas, DealForma priors, catalyst EV integration
type: project
---

## Phase 1: COMPLETE (2026-04-02)
All 5 items shipped: selection benchmark, monthly IC, txn cost model, post-promotion monitor, total_volume_z validation (NO_GO).

## Phase 2: COMPLETE (2026-04-06)
- #6 Risk layer: Spec 052 — 7 controls (C1-C7), vol targeting, correlation clustering, 16 tests
- #7 Options + event-premium: Spec 059 — calibration, branch Greeks, surface diagnostics, risk matrix, 67 tests
- #8 Herald precision: Spec 056 — event_type_score, Checklist v2 PASS (5/5), overlay-only
- #9 Dashboard integration: AACT index, news panel, options diagnostics, risk monitor, Spec 059 endpoints

## Phase 3: May (NEXT)
10. AACT delta signals (PCD shifts, enrollment changes, results posted) — Spec 054 static features CLOSED, delta lane was open but execution-delta also CLOSED 2026-04-06. Need fresh scoping.
11. DealForma dealability prior (slow-moving shadow feature) — reference data loaded, not yet a signal
12. Catalyst EV model integration — Spec 057 scaffold + Spec 059 overlay exist, need production wiring of full EV pipeline into daily cycle

## Observation-mode items (accumulating)
- Coinvest shadow: 7 arms, ends ~2026-05-03
- Regime shadow: accumulating daily, evaluate after 2-3 weeks (~2026-04-16+)
- Post-promotion monitor: accumulating forward evidence
- BIIB PDUFA: May 24 — RR decider, CRT gated
- 13F refresh: ~May 15 (Q1 2026 filings)

**How to apply:** Phase 3 items can proceed in parallel since they're independent. Observation items should NOT be interrupted — let them accumulate. BIIB and 13F are external triggers, not build items.
