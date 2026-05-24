# Signal Research History

## Coinvest Sort Tie-Breaker (v1.9.0 REJECTED — look-ahead contaminated)
- Sort blend: `coinvest_adj = weight * clamp(z)` added to `effective_comp_rank`; positive-only (negative z→0)
- **Look-ahead bias (discovered 2026-03-02)**: all snapshot `coinvest_score_z` came from static `holdings_snapshots.json` (Q3 2025, no date field). Fix = `rerank_snapshots.py --coinvest-pit`
- **v1.9.0 NOT PROMOTED** — PIT-correct: ON signal hurts IC, delta ON even worse
- **CONTRA signal**: Delta CONTRA real in 2025 IS but IS/OOS degradation ~75-80%. Too small for production. **ARCHIVE.**
- **Final coinvest conclusion**: coinvest (level or delta, ON or CONTRA) does not clear production bars under PIT-correct data.
- **Rulesets created**: `research_coinvest_contra_w0p05/10/20.json` (not in manifest)
- **rerank_snapshots.py flags**: `--coinvest-negate`, `--coinvest-delta`, `--require-pit-coinvest`, `--coinvest-pit`

## Alpha Cohort Tiebreak (ARCHIVED — hurts IC)
- `alpha_cohort_tiebreak_weight` in DecisionRuleset; uses `alpha_cohort_pct`
- ALL weights show NEGATIVE ΔIC at 63d/84d (paired t=-2.0 to -4.5); 126d flat
- **Verdict**: ARCHIVE. alpha_cohort_pct as secondary sort hurts IC.

## Clinical Sort Signal (implemented, then OFF in v1.8.2)
- **Columns**: `clinical_score_z` (per-cohort z), `clinical_score_z_tier` (tier-local z)
- **OFF rationale**: clinical tilt net harmful at portfolio level (displacement effect)
- Features remain computed, only sort contribution removed

## Clinical Calendar Alpha v2 (implemented, active at w=0.3)
- **File**: `common/clinical_calendar_alpha.py` (~560 lines)
- 7 sections, 16 new SNAPSHOT_COLUMNS
- A/B replay: w=0.3 vs w=0.5 nearly identical; chose w=0.3 (conservative)

## Institutional Delta (sort signal OFF, weight=0.3)
- **Files**: `institutional_summary.py`, `decision_engine.py`, `run_screen.py`
- PIT hardening: validates `cache_as_of_date`

## Core-Sleeve Neutralization (ARCHIVED — ROLLBACK, 2026-03-12)
- **Candidate**: 9ef27486 (v1.12.0), derived from active 7177a4ea
- **Bug found & fixed**: `neutralize_exposures` wrote residuals to `alpha_cohort_pct` but sort key reads `clinical_optionality_pct_dev` for `sort_anchor=optionality_pct`. Fix: write to all three anchor fields. Commit `5d75b6cb`.
- **Acceptance replay result**: stability PASS (100% median overlap), execution FAIL (cumulative hedged delta -0.36pp vs +0.20pp threshold). Both binary_91_180 and less_binary contributed negative deltas.
- **Matrix false positive**: earlier sleeve-neutral matrix showed core=PROMOTE, but IC was measured on `alpha_cohort_pct` which the live sort key did not consume.
- **Verdict**: ROLLBACK, archived in manifest. Binary neutralization remains in research queue.

## Adaptive Alpha Training (ARCHIVED — structurally disconnected, 2026-03-12)
- **Root blocker**: `alpha_cohort_pct` has ZERO influence on rankings under active ruleset. `alpha_cohort_tiebreak_weight=0.0` and `sort_anchor="optionality_pct"` mean the sort key reads `clinical_optionality_pct_dev`, never `alpha_cohort_pct`. Signal improvement cannot reach rankings.
- **h=126 vs h=84**: NEEDS_MORE. Post-cutoff OOS worse on alpha IC (-0.035), spread (-0.01). Maturity penalty drops 9 dates.
- **h=84 trailing-3 vs trailing-6**: trailing-3 WINS cleanly. Post-cutoff: alpha IC +0.016, spread +0.10pp, incr IC +0.014, incr spread +0.04pp. Best of 6-way grid (t-3, t-6, d-3, d-6, h=63/t-6, h=126/t-6).
- **But**: acceptance replay on regenerated snapshots shows ZERO rank effect because `alpha_cohort_pct` is inert in the sort key. Signal improvement is real but disconnected from live rankings.
- **Verdict**: ARCHIVE entire adaptive-alpha lane unless `sort_anchor="alpha_cohort"` is re-opened or a new integration path is built.
- **Infrastructure built**: `regenerate_snapshots_alpha.py`, `--candidate-snapshot-root` in acceptance replay

## Calendar Alpha Weight Sweep (NEEDS_MORE — w=0.4 best, not promoting, 2026-03-13)
- **Component ablation**: All 6 components (readout_curve, readout_density, execution_momentum, design_quality, endpoint_strength, competitive_intensity) show identical portfolio-level impact at sort weight 0.3; only IC varies (~0.003 spread). Component choice barely matters — weight is the real lever.
- **Weight sweep**: 0.3 (baseline) vs 0.4 vs 0.5 over 34 dates (2025-06-06 to 2025-12-31)
  - 84d hedged: +0.095pp for both 0.4 and 0.5 (plateau at 0.4)
  - 84d IC: +0.053 at w=0.4, +0.050 at w=0.5 (w=0.4 weakly preferred)
  - Turnover: drops slightly (0.1385→0.1346), no harm
  - 0.5 adds NO portfolio benefit over 0.4
- **Decision**: DO NOT PROMOTE. +0.095pp below +0.20pp PROMISING bar. Calendar alpha was already dialed from 0.5→0.3 at promotion; optionality anchor displaced it as primary sort driver. Keep 0.3 active, note 0.4 as best incremental setting if revisited.
- **Tools**: `scripts/research/ablate_calendar_alpha.py`, rulesets `ablation_cal_alpha_w04/w05.json`

## Options IV/Skew Alpha (CORRECTED — verdict deferred, 2026-03-14)
- **Research harness**: `scripts/research/eval_options_alpha.py` (6 sections, `options_alpha_study.v1`)
- **Prior verdict (INVALID)**: `alpha_candidate` classification from 2026-03-14 run on 384 obs / 5 snapshots. ATM IV→signed_gap IC=0.264, term_slope→signed_gap IC=-0.096.
- **Why invalid**: All 111 outcome rows were CTGov completion-date (PCD) calendar noise with avg abs_gap ~2.5%. Zero hard-catalyst rows had realized outcomes. The `is_hard_catalyst` flag and `--hard-catalysts-only` filter were added in `0c0fb9b8` to correct this.
- **Corrected result**: Hard-catalyst subset has 8 SEC 8-K rows but **0 realized outcomes** → `insufficient_sample`. No valid alpha verdict exists.
- **Next valid rerun**: After hard events land — BIIB ~April 3, CELC/PVLA/TBPH ~April 1 are the first refresh candidates.
- **Workflow**: Use daily options review queue (ranks by hard-catalyst status, cheap/rich straddle, disagreement, term-structure flags, extreme skew) as the live operational artifact while waiting for hard outcomes.

## PoS Divergence (CORRECTED — verdict deferred, 2026-03-14)
- **Research harness**: `scripts/research/eval_pos_divergence.py`
- **Prior verdict (INVALID)**: `alpha_candidate` with pos_divergence_z→signed_gap IC=-0.193 (contrarian). Same CTGov PCD contamination as options alpha — all 111 outcome rows were soft calendar milestones.
- **Corrected result**: Hard-catalyst subset has **0 realized outcomes** → `insufficient_sample`. The contrarian pattern may be real but is unproven on hard events.
- **Next valid rerun**: Same as options alpha — after BIIB/CELC/PVLA/TBPH hard events land (~April 1-3).
- **Deployment**: Remains as shadow diagnostic (market_model_disagreement column in rankings.csv), NOT ranking signal. Correct posture regardless of future verdict.

## Form 4 Insider Buying (SHADOW — not promoted, 2026-04-04)
- **Data**: 341 tickers, 137,701 transactions since 2020, PIT-safe (EDGAR acceptance date)
- **Panel**: `data/form4/form4_panel.csv` — 27,177 rows, 36 features (30d/60d/90d windows)
- **Wired into research panel**: `build_signal_research_panel.py` asof merge, 87.1% coverage, 317 tickers
- **Signal cards (9 tested)**: 7 SHADOW, 2 HOLD, 0 PROMOTE, 0 REJECT
- **Best univariate**: `insider_net_buy_value_90d` — selector Δ=+1.37pp (t=1.91), ranker IC=-0.019 (destructive)
- **Exec variant**: `insider_exec_buy_value_90d` — selector Δ=+0.40pp (t=0.99), ranker IC=+0.023 (best but weak)
- **Selector bundles (6 tested)**:
  - B18 (coinvest 55% + inst 25% + exec_buy 20%): Δ=+2.26pp, t=4.03, IR=0.49 — **top raw Δ**
  - B6 (coinvest 65% + inst 35%): Δ=+2.23pp, t=4.41, IR=0.54 — **highest IR, highest t, best bull**
  - B15 (coinvest 50% + inst 30% + net_buy 20%): Δ=+2.03pp, t=3.82, IR=0.47
  - B14 (coinvest 55% + inst 25% + net_buy 20%): Δ=+2.02pp, t=3.74, IR=0.46
- **Regime splits**: insider amplifies bear alpha (+4.5-4.6pp) but degrades bull (+0.04 to -0.04pp vs B6's +0.77)
- **Verdict**: B6 REMAINS best selector. Insider is a contrarian/value signal that hurts in bull markets. B18 worth shadowing for exec-insider tiebreaker. NOT promoted to production.
- **Infrastructure**: `tools/fetch_form4_insider.py`, 8 workers @ 9 req/s, `data/form4/raw/*.json`

## Crowding Penalty (ABANDON — no signal, 2026-03-14)
- **Research harness**: `scripts/research/eval_crowding_penalty.py` + `build_precatalyst_options_panel.py`
- **Panel**: 816 events from 371 archives, 791 with Massive options data (96.9%)
- **Result**: crowding_z raw IC=-0.013 vs fwd_ret_5d (n=790), IC=-0.001 vs fwd_ret_20d (n=504). Below 0.05 threshold.
- **Best component**: chain_breadth IC=-0.078 raw, but incremental IC=-0.057 after controlling for composite_score. Double-sort spread -0.2% (not actionable).
- **Verdict**: ABANDON. Pre-catalyst options activity does not independently predict returns after controlling for quality. Consistent with prior pre-catalyst options research (CONTRA-INDICATOR finding was temporal instability, not durable signal).
