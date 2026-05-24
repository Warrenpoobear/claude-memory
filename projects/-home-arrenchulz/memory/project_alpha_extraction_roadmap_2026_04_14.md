---
name: Alpha extraction roadmap (post-validation)
description: EES v3 model built and validated (4/5 checklist). Conditional misprice is the true alpha; trap/base-rate-gap are dead. Waiting on WS4 (effective N) to clear.
type: project
originSessionId: a773d6d6-8ca8-4bb1-9107-deded3eaf3f1
---
## Phase shift (2026-04-14)
System is past signal discovery. The true alpha source is **conditional mispricing**, not trap detection.

**Why:** PIT backtest (72 periods, 6,686 events) proved:
- `conditional_misprice_score`: IC +0.089, NW t=2.07 — **real alpha**
- `base_rate_gap_score`: IC -0.090, t=-2.09 — **anti-predictive** (market is right)
- `trap_overlay_score`: IC ~0 — **dead** (base_rate + misprice cancel)
- `conditional_expected_move`: IC +0.026, NW t=1.83 — **stable, orthogonal**

**How to apply:** Old trap logic is wrong. New model = conditional misprice + expected move.

## EES v3 Model — PROVISIONALLY VALIDATED (4/5)

### Architecture
```
ees_v3_score = 0.70 * z(conditional_misprice_score)
             + 0.30 * z(conditional_expected_move)
```

### Code
- `event_ev/ees_v3.py` — two-factor model, z-scored, gated
- Wired into `run_screen.py` (enrichment after EES v2 + conditional)
- Columns in `run_screen_columns.py`: ees_v3_score, ees_v3_gate, ees_v3_pctile, conditional_misprice_z, conditional_expected_move_z
- Sidecar: `ees_v3_overlay.json`

### Checklist v2 Results
| Check | ees_v3 | misprice | expected_move |
|-------|--------|----------|---------------|
| WS1 Bootstrap CI | PASS [0.001, 0.127] | PASS [0.001, 0.180] | PASS [0.005, 0.056] |
| WS2 LOSO | PASS +0.101/+0.021 | PASS +0.138/+0.040 | PASS +0.024/+0.029 |
| WS3 FM Incr | PASS t=2.09 | PASS t=1.81 | PASS t=2.38 |
| WS4 Eff N | FAIL t_adj=1.53 | FAIL t_adj=1.51 | FAIL t_adj=1.42 |
| WS5 Horizon | PASS | PASS | PASS |

**WS4 gap: 0.12 t-stat units (1.53 vs 1.65).** Structural — slow-moving signals have high rho1. Clears with more observations, not redesign.

### Critical data fix
`priced_move_pct` was never a separate source — it's `implied_event_move × 100` (column rename the PIT pipeline never performed). Recovery: ~55% stable coverage across all years. Not selection-biased. Backtest script `pit_backtest_ees_v2.py` applies this automatically.

## Corrections from v2

| v2 belief | Reality |
|---|---|
| Market neglects base rates | Market is RIGHT (base_rate_gap is anti-predictive) |
| Trap = behavioral alpha | Trap = noise (base_rate + misprice cancel) |
| Quality = timing discipline | Quality = marginal (only -timing, no misprice) |
| EES v2 composite works | EES v2 weak (IC +0.066, decile ~0) |

## Capacity layer: PRODUCTION-READY
- `event_ev/execution_capacity.py` — 6/6 PASS at $3M NAV
- 0 clipped, 0 untradeable. Constraints bite at $25M+.

## Research scripts
- `scripts/research/pit_backtest_ees_v2.py` — full PIT backtest with iem→pm recovery
- `scripts/research/ees_v3_checklist_battery.py` — Checklist v2 (WS1-WS5)
- `scripts/research/backtest_conditional_gap.py` — conditional signal backtest
- `scripts/research/capacity_audit.py` — execution feasibility audit

## Next steps
1. EES v3 emitting as diagnostic overlay. Do NOT promote to ranking until 5/5.
2. Forward monitor: track rolling IC, n_eff progression, WS4 gap
3. Promotion trigger: t_adj ≥ 1.65

## Six market failure modes — corrected mapping

| Phenomenon | Status | Key insight |
|---|---|---|
| Base rate neglect | **DEAD** | Market is right. IC -0.090. Anti-predictive. |
| Mispriced conditionals | **EES v3 alpha (4/5)** | IC +0.089, NW t=2.07. Real signal. |
| Thin book slippage | **Production-ready** | Capacity layer 6/6 PASS |
| Platform divergence | YELLOW | Phase advancement is proxy, not true validation |
| Favourite bias | Solved | coinvest = negative filter |
| Time decay | Marginal | quality_overlay IC +0.061, not standalone viable |
