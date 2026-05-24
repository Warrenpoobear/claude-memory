---
name: Timing hazard layer (updated 2026-04-06)
description: Adaptive near-term rules, MEDIUM outcome fix, concentration diagnostics, shrinkage — dashboard-only
type: project
---

## Current State (2026-04-06) — v4, dashboard-only, non-binding

**Architecture:** hybrid near-term override + rolling sliced base rate
- Near-term (0-30d): adaptive rates from 90-day rolling window of resolved outcomes
- Medium+ (31d+): family×horizon sliced rolling rates, 120-day window

**Adaptive near-term rates** (self-calibrating daily):
- Computes 4 rates: REGULATORY, HARD, SOFT, UNKNOWN from resolved ledger outcomes
- Bayesian shrinkage toward fallback constants: α = n_tickers / (n_tickers + 10)
- Fallback constants (from OOS 2026-04-06): REG=0.98, HARD=0.95, SOFT=0.87, UNK=0.80
- Minimum 20 resolved outcomes per slice; else falls back to constants
- `prob_method` = "near_term_adaptive" or "near_term_rule_fallback"

**Concentration diagnostics** (per calibration slice):
- n_distinct_tickers, n_distinct_events, top_ticker_share
- event_weighted_on_time_rate (one vote per ticker, not per prediction)
- Key risk: repeated-ticker slices inflate apparent n (e.g., 77 MEDIUM "observations" from 10 tickers)

**Calibration (post-fix, 2026-04-06):**
- Ledger: 1,336 entries (1,217 backfill + 119 forward), 1,217 resolved
- NEAR: 86.2% ON_TIME (n=961) — believable
- MEDIUM: 69.1% ON_TIME (n=256) — fixed from 0% (outcome resolution bug)
- Near-term Brier: 0.131 (was 0.421 before constant recalibration)

## Bugs Fixed (2026-04-06)

1. **NEAR_TERM_SOFT_PROB was 0.28, actual OOS = 87%** — catastrophic miscalibration.
   Derived from all-horizon soft catalysts, not near-term specifically. Fixed to 0.87.
2. **NEAR_TERM_HARD_PROB was 0.85, actual OOS = 95.7%** — too pessimistic. Fixed to 0.95.
3. **MEDIUM outcome resolution bug** — `_resolve_outcome_multi()` early slip detection
   was marking events as SLIP before expected date arrived. Single date pushout in any
   snapshot triggered premature resolution. Fixed: require 2 consecutive confirmed pushouts.
4. **No UNKNOWN path** — unknown family catalysts fell through to SOFT. Added NEAR_TERM_UNKNOWN_PROB.

## Key Files
- Production: `tools/compute_timing_hazard.py` (adaptive rates, concentration diagnostics)
- Backfill: `scripts/research/backfill_timing_calibration.py` (outcome resolution logic)
- Ledger: `artifacts/timing_hazard/calibration_ledger.jsonl`
- Slices: `artifacts/timing_hazard/calibration_by_slice.json`

## How to apply
- Dashboard-only, diagnostic, non-binding — NOT selector/ranker/sizing input
- Main risk is now concentration (repeated tickers), not miscalibration from bad constants
- Shrinkage handles low-diversity slices automatically
- Next: watch adaptive rate stability over daily runs; if stable, system is self-maintaining
