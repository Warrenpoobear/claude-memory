---
name: Options alpha revalidation (2026-04-05)
description: Coverage upgrade revalidation — NO GO for alpha, GO for overlay only. Lane formally closed for production alpha.
type: project
---

## Options Alpha Revalidation — 2026-04-05

**Verdict: NO GO for alpha, GO for overlay only.**

### Why the retest

Coverage upgraded from 193/294 (65.6%) to 290/294 (98.6%) via Massive/Polygon fallback.
Fallback IV quality calibrated (median IV, source-aware thresholds, IV cap, DTE warnings).
Question: does better coverage unlock options alpha?

### Answer: No

The research panel already had 97.9% IV coverage — the 65.6% was a Tastytrade API flag, not a signal gap.
Rebuilding the panel and re-running signal cards changed nothing material.

**cheap_vol_score (best candidate) DEGRADED:**
- Old: +2.28pp selector (t=2.74), IC=+0.085
- New: +1.12pp selector (t=0.64), IC=+0.086
- Fails 5/6 Checklist v2 gates (year-unstable: negative 2023, 2025)

**37 signals tested, all remain NO_GO or SHADOW:**
- 27 NO_GO (destructive or noise)
- 6 SHADOW (weak positive, not robust)
- 3 HOLD (inconclusive)
- 1 degraded PROMOTE_CANDIDATE (cheap_vol_score)

**Every options bundle degrades the incumbent:**
- B6 + any options variant: -0.22pp to -0.90pp vs B6 alone
- Options-only selector: -0.70pp vs B6
- Options ranker: IC=+0.071-0.084 vs institutional IC=+0.107

### What options ARE good for (overlay only)

- EXTREME IV risk flag (high IV = distressed = bad returns)
- Event premium / term structure backwardation alerts
- EPD surface diagnostics (event-loaded, iv-ramping, skew-extreme)
- Near-catalyst tiebreaker (ovf11 IC=+0.107 in near-catalyst context)
- cheap_vol_score shadow monitoring

### Lane status

**CLOSED for production alpha.** No selector, ranker, or sizing use.
**OPEN for operational overlay.** Dashboard, risk flags, event alerts, shadow diagnostics.

### How to apply

- Do NOT reopen options-as-alpha unless fundamentally new data source appears (e.g., order flow, market maker positioning)
- Coverage upgrade was operationally correct — trust the data for diagnostics
- Keep TT and Polygon separated in reporting (calibration differs)
- Options QC summary v3 tracks source quality per production run
