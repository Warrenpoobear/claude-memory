---
name: project-model-investability-verdict-2026-06-26
description: "Operator investment verdict on the biotech screener model — not investable yet; DEM=current ranker; pre-2025 alpha real; 2025+ rally-concentrated; 2026 flat (not adverse); forward shadow monitor is next step; backtest now uses split-adj prices"
metadata: 
  node_type: memory
  type: project
  status: active
  originSessionId: ee7dd5fd-41f8-494b-a2a7-14094857cdfa
---

Operator verdict (2026-06-27, corrected): **Not investable. Forward shadow validation required.**

**Price file corrected (2026-06-27):** `pit_backtest_a4.py` now uses `price_history_split_adj.csv`. Corporate action audit complete (2026-06-27): `dem_corporate_action_repaired/` is the authoritative artifact; prior YTD/regime/validation artifacts are STALE.

**Corrected backtest statistics — three scenarios (2026-06-27):**
| Window | n | Raw | Split-adj | Spinout-excl | t-adj | t-excl |
|---|---|---|---|---|---|---|
| Full history | 69 | +3.05 | +3.33 | +3.24 | **3.632** | **3.557** |
| Pre-2025 | 55 | +1.81 | +1.81 | +1.81 | **2.914** | **2.914** |
| 2025+ | 14 | +7.90 | +9.27 | +8.84 | **2.688** | **2.548** |
| 2026 YTD | 2 | +2.19 | +4.26 | +4.49 | 0.938 | 1.042 |
| Rally cluster | 5 | +21.82 | +21.69 | +21.69 | 3.523 | 3.523 |
| Ex-rally (64p) | 64 | +1.58 | +1.89 | +1.80 | **3.259** | **3.169** |
| 2025+ ex-rally | 9 | +0.17 | +2.37 | +1.70 | 1.401 | 1.188 |

**HAC robustness (2026-06-28):** t-adj column above is naive (IID) and inflated — per-period excess returns are autocorrelated (lag-1 = +0.45, overlapping monthly→multi-month windows). Newey-West HAC(L=3) t-stats: full-69p 3.63→**2.58**, pre-2025 2.91→**2.76** (robust), ex-rally 3.26→**2.91** (robust), 2025+ 2.69→**2.16** (marginal), 2025+ ex-rally 1.40→**1.45** (insignificant). Edge is real but ~30% less significant than raw t implies; reinforces "not investable, forward validation required". Addendum: `artifacts/backtests/dem_corporate_action_repaired/HAC_TSTAT_ADDENDUM.md` (+`.json`). NO_MODEL_CHANGE. See [[project-rank-depth-shadow-2026-06-28]].

**Corporate action taxonomy:**
- SPINOUT (RNA ×3, REPL ×1): `SPINOUT_UNOBSERVABLE_EXCLUDED` — true investor return unavailable; name excluded from basket in spinout_excl scenario
- REVERSE_SPLIT (GOSS ×2): `SPLIT_ADJUSTED_CORRECT` — split-adj prices are accurate
- DIVIDEND (CMPS/DRUG/ERAS ×3 on 2026-02-28): `DIVIDEND_ADJUSTED_CORRECT` — small adjustments, handled correctly

**Key corrections vs raw:** 2026-01-30: −5.05 → −0.28 (adj) → +0.18 (excl); 2025-04-30: +1.35 → +9.48 (adj) → +2.48 (excl, REPL artifact removed); 2025-12-31: −5.10 → −1.05 (adj) → −0.61 (excl).

**Repair classification:** `SPLIT_ADJUSTED_BACKTEST_PRICE_SOURCE_REPAIR_PARTIAL_NO_MODEL_CHANGE` — partial because spinouts not fully solvable without spinco price data.

**Current status labels (2026-06-27, post regime-conditional diagnostic + price correction):**
```
DEM_IS_CURRENT_RANKER
RAW_PRICE_BACKTEST_CONTAMINATED_BY_CORPORATE_ACTIONS
SPLIT_ADJUSTED_PRICE_SOURCE_REPAIR_APPLIED
SPINOUT_PERIODS_REQUIRE_FLAG_OR_EXCLUSION
PRE_2025_ALPHA_CLEAN
2026_YTD_VALIDATED_POSITIVE_AFTER_CORPORATE_ACTION_REPAIR
FULL_HISTORY_ALPHA_POSITIVE
PRE_2025_ALPHA_PERSISTENT
2025_PLUS_ALPHA_RALLY_CONCENTRATED
2025_PLUS_EX_RALLY_ALPHA_NOT_SIGNIFICANT
FORWARD_SHADOW_VALIDATION_REQUIRED
A4_OVERLAY_FROZEN_FAILED
PRIOR_ARTIFACTS_STALE
```

**Architecture correction (closed 2026-06-27):** Prior "DEM vs A4" framing was wrong. DEM = current production ranker (actionable_rank from run_screen.py). A4 was a failed recomputation overlay. There is no longer a DEM-vs-A4 comparison — A4 is a dead branch.

**Regime-conditional diagnostic result (2026-06-27):**
Two distinct alpha modes found:
- Pre-2025 (55 periods): DEM mean +1.81 pp, t=2.914 — persistent cross-sectional alpha, moderate beta (0.17), positive in bear/moderate-drawdown environments
- 2025+ ex-rally (9 periods): DEM mean +0.17 pp, t=0.108 — zero outside 5 biotech rally months
- Rally cluster (5 periods): DEM mean +21.8 pp, t=3.58 — May/Jun/Jul 2025 + Sep 2025 + Feb 2026 = 99.7% of all 2025+ cumulative alpha
- 2026 YTD (2 periods, corrected with split-adj prices): Jan-30 = −0.28 pp (flat), Feb-28 = +9.08 pp (rally cluster). Both non-negative. Prior "adverse" label retired — raw price contamination caused apparent losses.
- Beta to XBI: 0.173 full history / 0.569 in 2025+ only
- 2025+ ex-rally (corrected): t=1.401 (was 0.108 on raw prices) — still not significant, but less dead

**What this means:**
The forward question is not "does the model beat XBI historically?" — it does. The forward question is: which mode is the current environment in? 2026 YTD is flat (not adverse); Feb-28 was a rally-cluster period. 2025+ non-rally ex-cluster periods (9p) remain weak (t=1.401), not yet cleared.

**Shadow tests (all closed/failed):**
All three repair paths failed: inst_delta relaxation, clinical shadow, catalyst-optionality selector. DEM alpha names score low on every signal used for confirmation — structural unreachability. No further selector research justified.

**Next operational step:** `DEM_FORWARD_REGIME_SHADOW_MONITOR_NO_MODEL_CHANGE`
Track every production date: DEM top-30 vs XBI, regime bucket, rally vs non-rally classification, beta/convexity, contribution concentration, top-10/20/30 monotonicity, EES warnings. Gate: repeatable excess return *outside* narrow biotech rally cluster.

**Forward validation gate:**
| Gate | Pass condition |
|---|---|
| Minimum sample | 20 completed forward periods |
| Benchmark | XBI |
| Main metric | DEM excess return |
| Regime split | Rally and non-rally reported separately |
| Concentration | Top-3 names + top-3 periods cannot explain all alpha |
| Downside | No severe underperformance cluster vs XBI |
| Monotonicity | Top-10/20/30 not persistently inverted |
| A4 | Frozen — do not revisit |

**Allowed:**
- Paper trading, tiny live learning position, daily/weekly shadow validation, human review

**Not allowed:**
- Production sizing, automated trading, portfolio integration, ranker promotion, selector changes

Operator verdict (2026-06-26): **Interesting research system: yes. Investable model: not yet.**

**Phase 3 explanation status (corrected 2026-06-27):**
Phase 3 (May 18–Jun 9): mean IC = −0.048, top-20 excess = −1.78% vs XBI. **Operator assessment (2026-06-27): not confirmed underperformance.** Statistical basis: t-stat = −0.96 over 16 dates (|t| < 1.96 = not significant). Historical BEAR base rate is already IC = −0.013 (slightly negative is expected in bear biotech markets for a coinvest-type signal). XBI itself averaged −9.2% vs SPY during Phase 3, so the top-20 underperformed XBI by 1.78pp but beat SPY by ~7.4pp. Prior "genuine underperformance" label was premature — the data is within BEAR base-rate noise.

**Why the corrected BEAR replay didn't change the IC:** ranker_v2 in pairwise_minimal mode uses only coinvest_score_z and financial_score (both pre-regime computed), so rankings are identical regardless of BEAR-mode weights — IC stays at −0.048. The regime-input alternative was ruled out but the IC comparison has no correct counterfactual baseline without a model change.

**Correct Phase 3 verdict:** Noisy negative IC within expected BEAR base rate. Not statistically confirmed underperformance. Not investability clearance. Forward live shadow validation is the right path.

**Gates COMPLETE (2026-06-26):**

`PHASE3_CORRECTED_REGIME_RANKING_REPLAY_DIAGNOSTIC_NO_MODEL_CHANGE`
Result: 16/16 Phase 3 dates — identical top-30 under corrected BEAR regime. ranker_v2 uses only coinvest_score_z and financial_score (both regime-independent). Phase 3 mean IC = −0.048 is unchanged. Regime-input alternative RULED OUT.

`PHASE3_COMPONENT_ATTRIBUTION_DIAGNOSTIC_NO_MODEL_CHANGE`
Result: Component attribution complete across all 16 Phase 3 dates, 8 target names.
Failure modes: DRUG=FINANCING_UNDER_PENALIZED, CELC/ABVX=EES_VETO_FAILED, PRAX/TYRA=UNEXPLAINED.
Structural finding: financial_z is nearly identical between losers (−0.707) and winners (−0.719) — financial stress does NOT discriminate. Discriminating signals (EES losers −0.368 vs winners +0.674, momentum 48.8 vs 83.6, clinical 36.2 vs 57.1) are all outside ranker_v2.
Core issue: ranker_v2's negative financial weight promotes financially stressed names without catalyst quality discrimination; ees_v3 exists but is not a ranker_v2 input.
Output: `artifacts/autopsy/phase3_component_attribution/`

**Prior gate (closed):**
`PHASE_3_INVERSION_EXPLANATION_REQUIRED_BEFORE_CAPITAL_SCALE` — Regime-input alternative ruled out. Phase 3 failure modes identified.

**Why Phase 3 looked like inversion (revised understanding):** The model ran on UNKNOWN/neutral weights during a genuine BEAR period where XBI was underperforming SPY by 5–14% over 30 days. A momentum-biased ranker running neutral weights during sector risk-off is expected to underperform — this is now the leading explanation over "model breakdown."

**Use-case verdict:**

| Use case | Verdict |
|---|---|
| $100 live account / learning harness | Reasonable |
| Paper trading with full audit trail | Yes |
| Human-reviewed idea generation | Yes |
| Model-selected top-30 basket | No |
| Automated sizing / production capital | No |
| Marketing as proven alpha | Absolutely not |

**Shadow monitor (2026-06-26):**
`STRESSED_OPTIONALITY_FORWARD_MONITOR_NO_MODEL_CHANGE` — forward-validation ledger active.
Rule: Path 1 (EES ≤ −0.75 → suppress), Path 2 (fi_z ≤ −1.0 AND NOT EES>0 AND momentum≥60 → suppress). Parameters locked. REVIEW_REQUIRED if n_suppressed ≥ 8/30.
Artifact: `artifacts/shadow_monitor/stressed_optionality/`.
Early signal (May 18-22 weekly): DEGRADED (mean delta −1.48pp). Rule is suppressing 8-10/30 names broadly including COGT rank 1. Aggregate Phase 3 improvement (+0.78pp) came from later Phase 3 dates (DRUG/CELC/ABVX losses). Forward validation required before any production use.
Verdict: PROMISING_SHADOW_GUARDRAIL_REQUIRES_FORWARD_VALIDATION.

**13F PIT Audit — COMPLETE (2026-06-26):**
`13F_BACKTEST_PIT_AUDIT_DIAGNOSTIC_NO_MODEL_CHANGE`
Artifact: `artifacts/audit/13f_backtest_pit/`

- **63 contaminated snapshots** (2024-10-18 → 2025-11-07): holder-count path leaked Q3 2025 13F data (filed 2025-11-14). ~246 tickers/snapshot (~84% of universe). PIT-clean overlap = 0 for all 63.
- **Conviction path was already correctly filtered**; holder-count activation gate was not.
- **Repair applied**: `filed_at > ref_date` guard added. Future runs clean; 63 backtest archives still need regeneration for authoritative evidence.
- **Phase 3 re-attribution**: 13F NOT primary driver. None of CELC/PRAX/DRUG/TYRA/ABVX would have been actionable top-30 purely from composite rank. CELC (arank=3) and PRAX (arank=17) were catalyst-tier promoted; 13F added secondary sponsor_confirmed flag. Contamination inflated scores uniformly across universe (losers and winners alike).
- **Clean-window IC** (27 PIT-valid snapshots, Nov 2025–Mar 2026): 20d IC=-0.027 WEAK; 60d IC=+0.017 WEAK. Excl. Feb 2026 drawdown cluster: 20d IC≈+0.021. **smart_money: 74% hit rate, +3.2% IC** (highest component). Clinical: 11% hit, -8.3% IC (severe drag). 27 snapshots insufficient for decision-grade conclusions.
- **Gaps remaining**: `institutional_validation_v1_2.py` not found (path unaudited); 63 archives need regeneration; canonical-date imprecision per quarter.

**Next milestone gate:**
`PHASE_3_INVERSION_EXPLANATION_REQUIRED_BEFORE_CAPITAL_SCALE`

**Phase 3 autopsy candidate causes:**
1. Momentum/regime detector lagged
2. Catalyst/veto stack over-penalized risk during recovery
3. EES/veto logic suppressed names that beta would carry
4. Top-ranked names too idiosyncratic — missed sector move
5. XBI rally driven by names outside model's preferred universe
6. Model is structurally defensive after drawdowns

**Minimum bar to scale capital:**
- 6+ months clean PIT / live-forward evidence
- Mean IC > 0.04
- Positive excess return across ≥55% of non-overlapping forward windows
- Regime-gated version avoids Phase 3-style anti-prediction
- No options/catalyst lookahead
- Human-review layer confirms top ideas are economically coherent

**Why:** Operator determined this in context of the YTD PIT backtest (v1.4+ clean: −14.8pp, mean IC +0.010, Phase 3 IC range −0.05 to −0.21 for 19 snaps). See [[ees-shadow-monitor-state-2026-06-23]].

**How to apply:** Do not scale capital, do not run automated sizing, do not claim investability until Phase 3 explanation is in hand and the minimum bar above is met. Current right use: biotech research OS, idea generation, human-review routing.
