---
name: session_2026_03_15_backtests_and_coverage
description: 33 commits — full options lane, 4yr surface rebuild, anomaly search, FDA catalog (936 events), RR directional signal IC=0.133, April validation plan
type: project
---

## 2026-03-15 Session — Complete Options Research + Regulatory Breakthrough

### 33 commits total

**Key deliverables:**
- Hard-catalyst queue (v3) with surface overlay, forward-carry, production gates
- 4-year historical IV surface (5.68M rows, 1003 dates, real volume)
- Unified signal pack evaluator with 9 lanes + liquidity gate + terciles
- FDA Drugs@FDA historical catalog: 936 regulatory events, 79 tickers
- Event-anchored approach-window study: n=800+ (was n=6)
- RR regulatory promotion spec with pre-event predictions recorded
- Inferred regulatory calendar + confirmation tracking

### Breakthrough Findings

**Regulatory approach-window study (934 events):**
- mean_rr IC=0.133 vs signed_gap (T-210 to T-91): DIRECTIONAL signal
- mean_implied_move IC=0.320 vs abs_gap: MAGNITUDE (market efficient)
- mean_volume IC=-0.280 vs abs_gap: low volume → bigger moves
- IV trend: DEAD (IC~0)

**total_volume_z DOWNGRADED:**
- signed_gap IC=+0.134 unfiltered BUT -0.060 at volume>=100
- Directional signal INVERTS under liquidity gating
- abs_gap IC STRENGTHENS with liquidity (+0.124 at vol>=100)
- Reclassified: magnitude/risk overlay, not directional alpha

**Crush calibration confirmed on 4yr panel:**
- CLINICAL T+1 median = 1.04 (n=100): no systematic crush
- REGULATORY T+1 = 0.98, T+3 = 0.90 (n=6): modest
- Model reworked: base 0.95/0.90 + stress 0.45

### April Pre-Event RR Predictions (Spec 022)
- BIIB: BEARISH (mean RR -0.048)
- CELC: BEARISH (mean RR -0.072)
- PVLA: MIXED (flipping bullish +0.41)
- TBPH: BULLISH (mean RR +0.326, extreme +1.66)
- Gate: >= 3/4 correct → proceed with RR promotion

### Regulatory Source Stack Status
- Confirmed PDUFA: 15 entries (SEC-verified)
- FDA catalog: 936 historical events
- Inferred calendar: 6 entries, 1 confirmed (RGNX, delta=-117d)
- Press releases: 0 regulatory events in cache (low priority)
- Verdict: HOLD_AND_ACCUMULATE_CONFIRMATIONS

### What NOT to do before April
- Do not add production weights
- Do not change Step-10 eligibility
- Do not promote RR before validation gate clears
- Do not invest in press release scraping yet

**Why:** The research is now strong enough that the constraint is events, not features. April outcomes are the single most important next data point.

**How to apply:** Point to Spec 022 and the April validation plan. Run daily screens to accumulate data. Rerun after April 1-3 events resolve.
