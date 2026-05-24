---
name: inst_delta forward-shadow window — T0 2026-04-28, hypothesis pre-registered
description: Forward shadow comparing CURRENT (production) vs COUNTERFACTUAL (today's selector_score adjusted by Δinst_delta from pre-rebuild 2026-04-24) at top-10/20/30/40/50/60. Pre-registered hypothesis locked. Daily compare cron at 19:30 ET Mon-Fri until ~2026-07-21. Frozen-membership EW portfolios; PIT-safe.
type: project
originSessionId: d23dc9cc-6e15-4e35-a37f-c052a24155e0
---
**Status: ACTIVE forward-shadow window. T0 = 2026-04-28. First comparison checkpoint = 2026-04-29.**

**Why:** The 2026-04-25 cohort rebuild added 4 new 13F managers, contaminating `inst_delta_z` byte-identical from 04-25 → 04-28. Attribution showed 13/30 of today's top-30 wouldn't be top-30 with pre-rebuild inst_delta. Running a regular backtest on contaminated rankings would lock in artifact-driven "alpha" — so we ship a forward shadow instead, comparing the same model with two inst_delta states held constant.

**How to apply:** Until horizon checkpoints clear, treat any "CURRENT outperforms COUNTERFACTUAL" finding as suspect. Don't redesign cutoffs. Don't promote / demote names based on early reads. Apply the pre-registered verdict expectation as the prior; refresh only when the actual results are in.

### Lock file (frozen at T0)
- `artifacts/audit/inst_delta_forward_shadow/T0_2026-04-28_lock.json` — gitignored, local only.
- 69 unique tickers across portfolios; all have T0 prices captured.
- XBI T0 close = $133.80 (benchmark).

### Pre-registered hypothesis (verbatim, in lock file)
1. CURRENT may outperform 1–10 days if cohort-shock names momentum; outperformance fragile/concentrated.
2. Apparent edge concentrates in Top-10/Top-20 (COGT/NRIX-style names sit high).
3. COUNTERFACTUAL should look better on stability metrics (turnover, concentration, cutoff-curve smoothness).
4. If CURRENT wins only via the 6 artifact names — not model alpha, cohort luck.
5. If COUNTERFACTUAL matches/beats CURRENT by 20d/60d → "inst_delta cohort shock created false short-term confidence."
6. If CURRENT broad-base-beats COUNTERFACTUAL by 20d/60d → "rebuild surfaced real manager-cluster signal earlier" (less likely).
7. Most likely pattern: Top-10 CURRENT highest upside + fragile; Top-30 noisy; Top-40/50/60 differences compress; CF Top-30/40 wins risk-adjusted.

**Pre-registered verdict expectation:** "Do not change production cutoff based on CURRENT results before 13F refresh. Use COUNTERFACTUAL as the cleaner reference portfolio. Treat CURRENT outperformance as suspect unless it survives 20d/60d and is not dominated by the six artifact names."

### Methodology
- **CURRENT**: Top-N by `actionable_rank` from today's `data/snapshots/2026-04-28/rankings.csv`.
- **COUNTERFACTUAL**: Top-N reranked by `selector_score_today − 0.35 × (inst_delta_z_today − inst_delta_z_2026-04-24)`.
- **Cutoffs**: top-10, 20, 30, 40, 50, 60.
- **Weighting**: equal-weight, no rebalancing, frozen membership.
- **Pricing**: T0 close from `production_data/price_history.csv` (frozen in lock); forward marks from same file daily.
- **Returns**: simple total return (no dividend adj).
- **Benchmark**: XBI EW.
- **Known artifact tickers** (high |Δinst_z|): NRIX, COGT, ZYME, MIRM, ORKA, ABVX. Their isolated contribution to CURRENT performance tracked separately.

### Infrastructure
- Tool: `tools/inst_delta_forward_compare.py` — daily MTM, all metrics, JSON checkpoint + JSONL append.
- Wrapper: `tools/cron_inst_delta_forward_compare.sh` — date-guarded, weekend-skip, post-horizon auto-skip.
- Cron: `30 19 * * 1-5` — runs Mon–Fri 19:30 ET, ~3h after production cron. Auto-deactivates after 2026-07-21.
- Outputs: `artifacts/audit/inst_delta_forward_shadow/checkpoint_{date}.json` + `checkpoints.jsonl` (gitignored).

### Horizon milestones (estimated trading-day dates)
| Horizon | Date | Significance |
|---|---|---|
| h1d | 2026-04-29 | First mark; smoke test |
| h5d | 2026-05-05 | Short-term verdict (matches Phase 2 step 2 6-K post-snapshot review) |
| h10d | 2026-05-12 | Medium-term verdict |
| h20d | 2026-05-26 | **Pre-13F-refresh decision point** (~2026-05-15 self-heal estimate) |
| h60d | 2026-07-21 | Final shadow verdict |

### Companion artifacts
- `regime_post_cohort_change_distortion_2026_04_28.md` — regime memory (do-not-fix policy).
- `artifacts/audit/inst_delta_attribution_2026-04-28.{md,json}` — point-in-time attribution decomposition.

### What ENDS this window
- 2026-07-21 horizon clears, OR
- 13F refresh ~2026-05-15 produces a clean snapshot earlier than expected. In that case, freeze any partial verdict and start a new forward window from the post-refresh snapshot.

### Cutoff for verdict
Real verdict requires h20d AND h60d — short-horizon noise dominates earlier reads. Don't draw production conclusions before h20d (2026-05-26).
