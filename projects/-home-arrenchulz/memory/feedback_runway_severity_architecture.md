---
name: Runway severity architecture — validated as risk-control, not alpha
description: Runway severity backfill validated (75K obs). IC +0.017 = wrong sign for alpha. Keep as truth gate + EV haircut + sizing overlay. Never promote to ranking. Dual-severity paths (truth vs EV) confirmed correct.
type: feedback
originSessionId: f5d8227d-8cd9-4a06-b21d-030c4adbe51b
---
Runway severity v1.1 is **validated and finalized** as a risk-control overlay.

**Validation verdict (2026-04-15, 75,567 obs, 377 dates, 228 tickers):**
- Severity IC = +0.017 (WRONG SIGN for alpha — higher severity → higher return)
- This is the micro-cap lottery premium: gate failures have 4x vol (111% vs 28%), +32 skew
- Risk-adjusted: Sharpe identical (0.067 vs 0.068). Feature does not predict returns.
- Feature controls the *kind* of returns: prevents portfolio from becoming lottery tickets.

**Policy — PERMANENT:**
- NEVER promote runway severity into ranking or selection
- Keep as truth gate (survivability) + EV haircut (financing damage) + sizing overlay
- Frame as variance-control, not alpha

**Architecture — do not regress:**
- `truth_severity` → financing_truth_gate. Uses T1/T2 decisive horizon.
- `ev_severity` → dilution_haircut + size_multiplier. Uses actual catalyst timing, any tier.
- Separate `compute_severity()` and `compute_ev_severity()` paths. Do NOT collapse.
- Pivotal CT_PRIMARY_COMPLETION promoted to T2 for buffer calc only.

**Why it's still valuable:**
"Does runway severity predict returns?" → No.
"Does it improve the kind of returns you hold?" → Yes. It stops the book from drifting into fragile, dilution-prone micro-cap lottery exposure.
