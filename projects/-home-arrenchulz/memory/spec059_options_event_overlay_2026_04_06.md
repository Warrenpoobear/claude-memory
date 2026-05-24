---
name: Spec 059 Options Event Overlay
description: Options overlay for event-EV engine — calibration, branch Greeks, surface diagnostics, risk matrix. IMPLEMENTED + WIRED 2026-04-06.
type: project
---

**Spec 059 — Options Event-Pricing & Greeks Overlay — COMPLETE + WIRED (2026-04-06)**

**Why:** Options lane closed for alpha (Spec 053), but options-implied pricing and Greeks are valuable as event-intelligence overlays for operator awareness and risk management.

**Four modules in `event_ev/`:**
1. `implied_realized_calibration.py` — CRT-calibrated move priors, blended into payoff engine (50/50)
2. `branch_sensitivity.py` — HIT/MISS/MIXED branch Greeks, IV crush profiles, breakeven straddle
3. `surface_diagnostics.py` — 7-state term classifier, cross-sectional anomaly detector, belief modifier
4. `catalyst_risk_overlay.py` — risk matrix, hedge cost, escalated alerts (EXTREME+<7d+>20%)

**Production wiring:**
- EV calculator: branch_sensitivity computed per catalyst in `_process_single()`
- run_screen.py: 3 JSON sidecars per snapshot (forward_log, surface_anomalies, catalyst_risk_overlay)
- Dashboard: 3 new API endpoints + enriched ticker detail with risk_overlay

**67 new tests, 117 total with existing event_ev tests.**
**Zero selector/ranker/decision engine changes.**

**How to apply:** All outputs are diagnostic/overlay. Forward log grows calibration table over time. Surface anomalies and risk alerts feed operator review. Do NOT use any output as selector/ranker input.
