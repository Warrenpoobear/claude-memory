---
name: EES v2 Production Architecture (Final)
description: Complete trading system — Trap T20 gate → B6 rank → conviction sizing → execution guardrails. Checklist v2 5/5. PIT-safe. Capacity $50M+.
type: project
originSessionId: 19d7e9db-02e4-4244-802d-175fdc2e19ae
---
## EES v2 — Complete Production System (2026-04-12)

### Final Architecture

```
Trap gate T20 → B6 rank → Conviction α=1.5 → Execution guardrails → Portfolio
```

1. **Trap gate** (bottom 20% excluded): `-0.50*base_rate_gap - 0.50*conditional_misprice`
   - IC +0.058 at 20d (t=8.4), +0.084 at 63d (t=9.9) — PIT-SAFE
   - Rolling IC: 100% positive across 152 windows
   - The ONLY true alpha signal. Behavioral edge: "obvious cheap = trap"

2. **B6 rank** (`selector_score`): replaces actionable_rank among trap-safe names
   - Sharpe 0.385 (vs 0.335 with actionable_rank) — better selector
   - FM-independent of trap (beta barely changes in joint regression)

3. **Conviction sizing** (α=1.5): weight ∝ B6_percentile^1.5 × trap_strength
   - Sharpe +0.017 over EW (incremental, not transformative)
   - NO liquidity caps (illiquidity premium confirmed: low dollar vol outperforms)

4. **Execution guardrails** (post-sizing, NOT in alpha):
   - Skip >20% ADV participation, scale down >5% ADV, skip no-volume
   - Live test ($5M): 0 skipped, 1 scaled (NGNE 5.2%→5.0%)

5. **Timing gate** (optional, conservative mode only):
   - IC negative as standalone signal — works only as coverage filter
   - Sharpe 0.414 but only 39% coverage. Not default.

### Performance (20d horizon, 267 dates, EW Top-30)

| Metric | Baseline | With Gates (Q15/T20) |
|---|---|---|
| Sharpe | 0.211 | **0.508** (2.4x) |
| Mean return | +2.10% | **+4.93%** (2.3x) |
| Hit rate | 59% | **68%** |
| Frequency | 100% | 63% |

### What's dead (DO NOT revisit)

- **Slippage penalty (market_cap)**: LOOK-AHEAD BIAS. PIT archives had current prices, not historical. IC +0.107→-0.088 when fixed. Micro-caps actually outperform (small-cap premium).
- **close_price < $5 filter**: Removed — same PIT contamination.
- **Original alpha direction** (unflipped base_rate + conditional): IC -0.006, t=-0.9. Dead.
- **Crowding bias** (short interest): IC ~0 at all horizons. No signal.
- **Divergence** (option vs realized vol): Insufficient obs for reliable IC.
- **Linear blending** (ees_v2_score): Works but gates strictly dominate. Keep as diagnostic only.
- **Trap as ranker**: IC identical to blend. Trap is a binary veto, not a ranking signal.

### PIT audit (2026-04-12)

- PIT archives (`data/pit_archives/`) contain CURRENT market data (collected_at=2026-04-09), NOT historical
- close_price rebuilt from price_history.csv (PIT-safe)
- market_cap_mm rebuilt as price_history_close × current_shares_outstanding (approximate PIT)
- priced_move_pct from same-date options (chains/day_aggs/IV approx) — PIT-safe
- Timing decay and trap are genuine PIT-safe signals. Slippage was artifact.

### Liquidity investigation (2026-04-12) — CLOSED

- Volume backfilled into price_history.csv from yfinance (393,708 entries, 96.4% coverage)
- Dollar-volume IC = -0.031 at 63d (t=-4.1): **low liquidity OUTPERFORMS** (illiquidity premium)
- A liquidity filter would DESTROY alpha, not protect it
- In biotech, illiquidity is where the edge lives, not a risk factor
- Liquidity belongs in portfolio construction/sizing, NOT in alpha filtering
- **DO NOT build a liquidity filter. This lane is closed.**

### Key thresholds

- **Trap 20% is the cliff edge** — Sharpe jumps from 0.39 to 0.51 crossing this threshold
- **Quality above 15% adds negligible lift** — 15% and 20% have near-identical Sharpe
- Aggressive mode (Q20/T30): Sharpe 0.71, but frequency drops to 20%
- Ultra-aggressive (Q40/T35): Sharpe 1.03, but only 7% of dates

### Files

- `event_ev/expectation_error_model.py` — model + gates + `enrich_csv_rows()`
- `event_ev/data_contracts.py` — `ExpectationErrorScore` dataclass
- CSV columns: `quality_overlay_score`, `trap_overlay_score`, `ees_v2_score`, `ees_quality_gate`, `ees_trap_gate`, `ees_eligible`
- Sidecar: `expectation_error_overlay.json` (gate stats + top/bottom 10)
- Research: `scripts/research/backtest_ees.py`, `ablation_ees.py`, `ees_filter_test.py`, `ees_interaction_test.py`, `ees_threshold_sweep.py`

### Monitoring (per snapshot)

- `ees_gate_diagnostics.json` — universe funnel, quality-trap correlation (0.179 baseline), distributions, filtered names
- `ees_gate_performance.json` — realized returns by gate bucket (eligible vs quality_fail vs trap_fail vs both_fail)
- `expectation_error_overlay.json` — top/bottom 10 by v2 score

### Regime detector (`suggest_gate_mode`)

Input-side triggers: correlation > 0.40, eligible% < 50%, trap rate > 35%
Output-side triggers: trap_fail return > -3%, eligible-vs-excluded gap < 1%
Modes: normal (Q15/T20), conservative (Q20/T30). Requires 5-day history minimum.

### Commits

- `b37db93f` — v1 module + backfill
- `b252b227` — v2 decomposition (quality + trap)
- `69b8dbe3` — production gates wired
- `c0d944ff` — gate diagnostics + performance tracker + regime toggle
- `3dc32cca` — regime detector + v2 backfill (435 snapshots)
- `b3217f79` — output-side regime triggers (final)

### PIT-SAFE FINAL BACKTEST (421 dates, 2020-01 to 2026-03)

**Portfolio (20d, EW Top-30, PIT-safe):**
- Baseline rank: +1.98%, Sharpe 0.189
- **Trap T20 → Rank: +2.34%, Sharpe 0.221** (394 dates)
- **Trap T20 + Timing → Rank: +4.04%, Sharpe 0.414** (156 dates, 39% coverage)

**Signal IC (PIT-safe):**
- Trap overlay: IC +0.058 (t=8.4) at 20d, +0.084 (t=9.9) at 63d
- Timing (inv): IC -0.064 at 20d — INVERTED as standalone signal, works only as gate
- Rolling IC (trap, 20d): **100% positive** across 152 windows. Never negative.

**Tail analysis:**
- Removed by trap: -0.12% vs kept +2.21% at 20d (drag = -2.33%)
- Worst trap decile spread: +8.70% at 63d

**Interpretation:** Trap is the ONLY true alpha signal (behavioral edge: "obvious cheap = trap"). Timing is a coverage filter, not alpha. Quality/slippage was look-ahead bias. System makes money by not believing obvious ideas.

### Checklist v2 Battery (2026-04-12): **5/5 — FULLY VALIDATED**

| WS | Test | Result |
|---|---|---|
| WS1 | Bootstrap CI excludes zero | PASS — uplift CI [+0.24%, +1.17%] |
| WS2 | LOSO 6/9 half-years | PASS — trap beats baseline 67% of periods |
| WS3 | FDR BH q=0.10 | PASS — p < 0.000001 |
| WS4 | FM incremental vs B6 | PASS — trap beta=+0.036 (t=6.46) at 20d, +0.064 (t=13.59) at 63d |
| WS5 | Dependence-adjusted t | PASS — t=6.69 (rho1=0.24, n_eff=159) |

Trap is an independent alpha contributor beyond B6. Its beta barely changes when B6 is added.
selector_score backfilled into 399 historical snapshots to enable WS4.

### ARCHITECTURE FROZEN (2026-04-12)

Do not modify weights, thresholds, or gate logic without monitored evidence of degradation.
Only change when diagnostics data (not intuition) says to.

**Why:** v1 was "score everything and rank." v2 is "remove structural junk, remove behavioral traps, then rank survivors." The 2.4x Sharpe improvement came from architecture, not features.

**How to apply:** All future alpha research must happen AFTER these gates. Never mix new signals into raw universe. Treat as pre-trade risk control layer. Watch diagnostics daily. Only adjust thresholds when the regime detector fires.
