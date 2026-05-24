---
name: Model directions + BTA calibration corrections
description: Five priority additions (S-curve, runway-to-catalyst, conditioned PoS, M&A, macro) plus BTA calibration findings that correct conditional model assumptions. Updated 2026-04-15.
type: project
originSessionId: a773d6d6-8ca8-4bb1-9107-deded3eaf3f1
---
## Source
BB Biotech annual report, investor synthesis docs, listed vehicle analysis, BioTradingArena calibration (655 cases, 212 tickers, 130 overlap with universe).

## Five-question truth framework
1. Does it work? (scientific/clinical truth)
2. Can it get approved? (regulatory truth)
3. Can it get paid for/adopted? (commercial truth)
4. Can it survive to value inflection? (financing truth)
5. Is price miscalibrated vs probability-weighted outcomes? (expectation gap)

## Priority additions (ranked)

### 1. Runway-to-catalyst severity (HIGHEST VALUE)
- Connects survivability, financing risk, timing, dilution, and EV
- Critical variable: can the company survive to next decisive milestone WITHOUT dilution?
- Compute: catalyst_date - runway_exhaustion_date. Negative = immediate dilution risk.
- Should be a hard gate or severe penalty, not a soft score.

### 2. S-curve / lifecycle stage as first-class feature
- Companies on steepest S-curve part (Phase 2→3, first launch) get concentrated specialist capital
- Lifecycle stage should modify both selector weights and position sizing
- Early = smaller, steep S-curve = larger, mature = capped

### 3. Conditioned PoS — RECALIBRATED per BTA findings
- Mechanism class WORKS: semi-validated (65%) > validated (59%) > novel (54%) > unknown (47%). Keep.
- **Biomarker selection shows NO uplift in BTA data** (selected 57.4% vs unselected 59.7%). Treat skeptically, retest, possibly downweight.
- **Event direction is mandatory for regulatory**: model predicts 72% hit rate for FDA rejections (actual: 23%). Must distinguish approval vs rejection as input.
- **Quintile calibration is flat**: predicted 34-75% all realize at ~50-58%. Model discriminates poorly. Needs recalibration.
- Phase 2/3 positive events underestimated. Model too pessimistic when trials succeed.

### 4. Strategic relevance / M&A optionality
- EV booster for later-stage, differentiated names. Modifier only.
- Patent cliff driving demand for external innovation.

### 5. Macro capital-regime overlay
- Rates, capital availability, IRA pricing → affect terminal value and financing odds.
- Regime overlay adjusting expected multiples, dilution risk, hurdle rates.

## BTA Calibration Summary (655 cases, 2015-2025)
- Overall: predicted 56.8%, realized 54.4% (gap -2.4pp). Decent on surface.
- **Quintile separation is flat** — not discriminating high vs low probability well.
- **FDA rejection blind spot**: predicted 72.1%, realized 23.1% (-49pp gap).
- **Mechanism class gradient confirmed**: semi > validated > novel > unknown.
- **Biomarker uplift NOT confirmed**: selected ≈ unselected in external data.
- Dataset: `production_data/biotradingarena_benchmark.json` (11.3 MB)
- Script: `scripts/research/crt_bta_calibration.py`

## Immediate calibration fixes needed
1. Add event direction (approval vs rejection) to regulatory PoS
2. Recalibrate confidence — model is overconfident at top, underconfident at bottom
3. Downweight biomarker uplift until reconfirmed on more data
4. Keep mechanism class as-is

## Architecture guardrails
- Risk management ≠ alpha. Hedging/derivatives → portfolio layer, not selector.
- Listed vehicle holdings = expectation inference, not copy-trading.
- Truth vs expectation must be separate layers.

## Near-term operational priorities
1. Verify expectation layer plumbing fix in production (short_interest, close_price, market_cap, priced_move now at ~95% coverage)
2. Forward monitoring > new data vendors
3. Rotate BioTradingArena API key (exposed in session log)
