---
name: DEM model assessment March 2026
description: Joint operator/Claude assessment — selection is real, portfolio construction is the live leak, sleeve mechanics are highest-leverage next work
type: project
---

## DEM Model Assessment (2026-03-31)

### Selection Layer: GOOD
- Optionality anchor near-optimal; three scopes of tiebreaks tested, all economically immaterial
- Validation: CNTA tier A #2 before Lilly 40% premium bid; KOD tier A before GLOW2 Phase 3 win
- Strategy backtest: DE +10.46% 60d residual vs +6.36% composite baseline
- Core picker is not the main problem

### Scoring Augmentation: LOW INCREMENTAL ROI
- inst_delta is the only real sort signal (IC +0.077 60d)
- cal_alpha: NOISE. Clinical sort: OFF. Coinvest: REJECTED.
- Oncology crowding: real IC but +0.020pp (10x below bar)
- Milestone optionality: IC +0.026 at 84d (t=2.60, 77% positive) but NEEDS_MORE
- total_volume_z: IC +0.134, waiting April gate
- Pattern: "reasonable" secondary reranks repeatedly fail the economic bar

### Portfolio Construction: THE LIVE LEAK
- Shadow portfolio: -7.52% cumulative, -5.86% excess, Sharpe -2.71, 21% win rate
- 91-180d sleeve: -$31,957 of -$34,583 total PnL; 3 names drive 92% of loss
- 31-90d bucket: 7.8% vs 25% policy target (starved)
- The model finds optionality but doesn't translate it into efficient sleeve exposure

### Evidence That Mechanics > Ranking
- rebalance_buffer_ranks=30: improved OOS without changing ranking (pure mechanics)
- Catalyst tilt (a08749e4): most promising shadow, failed weekly gate on 31-90d + cumulative metrics — exactly the sleeve problem
- Every sort signal: directionally real, economically immaterial after portfolio dilution

### Priority Stack (agreed 2026-03-31)
1. **31-90d replenishment policy** — governed rule or sleeve floor, not more discovery
2. **91-180d concentration / carry discipline** — max sleeve weight, tighter carry rules, horizon-sensitive decay
3. **Keep shadow signals alive but don't let them block mechanics work** — milestone optionality as artifact-only, total_volume_z validation April 7

**Why:** The model is not asking for a better selector; it is asking for a better translator from ranked names into sleeve exposure and turnover decisions.

**How to apply:** Steer effort toward sleeve policy, replenishment, holding-period mechanics, and concentration control before spending another cycle on fine-grained sort signals.
