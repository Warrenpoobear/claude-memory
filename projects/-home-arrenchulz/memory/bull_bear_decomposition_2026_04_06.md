---
name: Bull/bear asymmetry decomposition (2026-04-06)
description: Bear IR=3.35 vs bull IR=-0.21 is mostly EW-vs-XBI benchmark mismatch, not signal failure
type: project
---

## Key Finding

The "bear-market engine" narrative was an artifact of benchmarking EW portfolios against cap-weighted XBI.

**True selection alpha (vs EW all-eligible biotech):**
- Bear: **+1.14 pp/month** (real, coinvest protects downside)
- Neutral: **+1.31 pp/month** (real)
- Bull: **-0.19 pp/month** (noise, not systematic loss)

**Bull "underperformance" vs XBI decomposition:**
- Total: -6.57 pp/month
- Benchmark mismatch (EW-all vs XBI): **-6.38 pp** (97% of the gap)
- True selection effect: **-0.19 pp** (noise)

**Why:** XBI is cap-weighted. In bull markets, a few large-cap biotech winners rally hard and drag XBI up. Any EW portfolio — coinvest-selected or random — lags by ~6pp. This is sector construction, not signal failure.

## Additional Findings

- **Coinvest vs DEM ranking:** +2.77 pp/mo in bear, -0.66 pp/mo in bull. Coinvest selection IS genuinely defensive.
- **Within-portfolio coinvest split:** High-minus-low is near zero in both regimes. Value is binary (in top-30 vs not), not linear.
- **EW all-eligible also beats XBI in bear** (-6.04% vs -7.53%). Some bear "alpha" is just EW construction.

## Implications

1. **Regime-conditional sizing is NOT the answer.** Selection alpha is +1.14 bear / -0.19 bull — mildly asymmetric, not worth switching complexity.
2. **Benchmark choice matters more than model changes.** Track vs EW biotech, not XBI, for honest alpha measurement.
3. **Coinvest is a genuinely useful asymmetric signal:** protects downside (+1pp/mo in bear) without costing upside (flat in bull vs EW universe).
4. **The model is better than "C+"** — reframed correctly, it's a consistent +1pp/mo selector in bear/neutral (75% of months) and neutral in bull.

**Why:** Prior framing of "bear IR 3.35, bull IR -0.21" made it look like the model fails half the time. Correct framing: it adds ~1pp in most environments and the bull "failure" is a benchmark artifact.

**How to apply:** Use EW-all-eligible as primary benchmark. Carry XBI comparison for context but don't make allocation decisions based on XBI excess. No regime switching needed.

## Script
`scripts/research/bull_bear_decomposition.py` — 67 monthly periods, PIT-safe snapshots, coinvest-ranked top-30.
Output: `artifacts/bull_bear_decomposition.json`
