---
name: Cross-signal forward shadow — T0 2026-04-28, no historical backfill
description: Forward DEM × cross-signal bucket logger. Daily 19:40 ET Mon-Fri. T0 buckets HH=5, HL=17, LH=7, LL=17. Path (c) chosen: NO regen of historical snapshots. Schema-era descriptive note produced; no historical alpha conclusion drawn.
type: project
originSessionId: d23dc9cc-6e15-4e35-a37f-c052a24155e0
---
**Status: ACTIVE forward log. T0 = 2026-04-28. Path (c) chosen — no historical backfill.**

**Why:** Robustness battery (2026-04-28) flagged top-30 mean cross-signal agreement = 0.10 — leaders depend mostly on DEM/institutional layer. The unresolved question: is weak cross-signal agreement *alpha orthogonality* (DEM finds something other signals miss) or *false-positive risk* (DEM picks names that fail when other layers don't confirm). Only forward evidence can answer it; historical backfill would be pseudo-PIT.

**How to apply:** Treat HL bucket (DEM-high + cross-signal-low) as the focal bucket — that's where the orthogonality-vs-false-positive question concentrates. Do NOT draw conclusions before forward returns mature at h20d (2026-05-26) or h60d (2026-07-21). The schema-era descriptive note is informational only.

### Path-(c) decision (2026-04-28)
Explicitly **declined** to regenerate 134 historical snapshots (2024-10-18 → 2026-04-02) to fill in missing column data. Reasoning preserved in commit `40c1ef0c`:
- `clinical_score_v2_z` and `selector_*_block` columns are produced mid-pipeline by current scoring logic.
- Retroactively applying today's code to 18 months of historical inputs = pseudo-PIT, not valid evidence.
- Standing policy (`historical_backtest_invalidated_2026_04_17`) already states "no historical alpha claim is credible; forward monitoring is the only valid evidence."
- Compute cost would also be 30–80 hours and would clobber preserved historical artifacts including the 04-25 cohort_state quarantine doc.

### Bucket definitions (locked)
- **DEM-high**: top quintile of `selector_score`
- **DEM-low**: bottom quintile of `selector_score`
- **cross-signal-high**: `agreement_score >= 0.50`
- **cross-signal-low**: `agreement_score <= 0.10`
- `agreement_score` = (top-quintile signals) / (available signals); independent signals = `clinical_score_v2_z`, `financial_score`, `selector_clinical_block`, `selector_catalyst_block`, `selector_survivability_block`, `selector_market_block`. **Excludes** B6 components (coinvest, inst_delta) and institutional block.

### T0 buckets (2026-04-28)
- HH (DEM-high + cross-high): 5
- **HL (DEM-high + cross-low, focal)**: 17 — `ABVX, ANNX, CGON, CLDX, COGT, INSM, KALV, MLTX, NAMS, NGNE, ORKA, PHVS, PRAX, RCUS, SLDB, STOK, TNGX`
- LH (DEM-low + cross-high): 7
- LL (DEM-low + cross-low): 17

### Schema-era descriptive note (2026-04-03 → 2026-04-28, 21 snapshots, 5d/10d only)
Labeled "**schema-era descriptive behavior — NOT historical alpha evidence**" per standing policy. Tiny effective N; observations heavily overlapping; window includes post-04-25 cohort contamination period.

5d face means by bucket: HH −1.6%, HL +0.8%, LH +1.0%, LL +2.3%, MIDDLE +2.2%.
10d face means: HH −2.1%, HL +3.3%, LH +2.0%, LL +6.4%, MIDDLE +4.7%.

Directional read (do not generalize): HL did not catastrophically underperform in this window. HH had small-sample drawdown. LL had highest mean — likely small-cap mean reversion, not signal.

### Infrastructure
- Logger: `tools/cross_signal_forward_logger.py` (committed `40c1ef0c`).
- Wrapper: `tools/cron_cross_signal_forward_logger.sh` — Mon–Fri 19:40 ET, no auto-disable.
- Cron line: `40 19 * * 1-5` (installed; pre-edit snapshot at `artifacts/ops/crontab_snapshot_2026-04-28T21-13_pre_cross_signal_logger.txt`).
- Outputs: `artifacts/audit/cross_signal_forward_shadow/buckets_{date}.json` per day + `buckets.jsonl` running log + one-shot `descriptive_audit_2026-04-28.{md,json}`.

### Evaluation milestones
- h20d (2026-05-26): first defensible read on whether HL bucket diverges from MIDDLE/HH.
- h60d (2026-07-21): final shadow verdict.
- 13F refresh ~2026-05-15: not directly relevant here (cross-signal excludes inst_delta).

### Companions
- `inst_delta_forward_shadow_T0_2026_04_28.md` — separate forward shadow for inst_delta contamination question
- `regime_post_cohort_change_distortion_2026_04_28.md` — do-not-fix policy for the regime
- Robustness battery `artifacts/audit/inst_delta_robustness_battery_2026-04-28.{md,json}`
- Attribution `artifacts/audit/inst_delta_attribution_2026-04-28.{md,json}`
