---
name: Incomplete-run silent fallback to coinvest+financial (2026-04-07/08/11/12)
description: When institutional_summary_delta.json is missing, rankings.csv emits inst_delta_z=0.0 for all rows. Ranker falls back to coinvest+financial, creating fake "regime" signal. Future audits must check snapshot completeness BEFORE interpreting factor-correlation spikes.
type: feedback
related:
  - feedback_observation_bias_cron_monitoring
  - project_watchdog_recovery_restored_2026_04_24
  - env_wsl_uptime_required
originSessionId: 5817ee52-e367-41a5-af14-3cb8ef51f022
---
# Incomplete-run silent fallback (2026-04-07/08/11/12)

When the snapshot directory is missing `institutional_summary.json` and/or
`institutional_summary_delta.json`, the downstream rankings.csv silently
emits `inst_delta_z=0.0` for every row (graceful fallback). The ranker
then falls back to ordering by coinvest_score_z + financial_score alone.

**Observed effect**: Spearman(coinvest_score_z, final_score) spikes from
the normal +0.88 to ~+0.96, top-30 jaccard with coinvest-only-top-30
spikes from ~57% to ~87%. **Looks like a "regime" but is actually a data
outage.**

The 4 days 2026-04-07/08/11/12 had this pattern. All 4 had:
- 43–46 files in snapshot dir vs 63–67 on normal days
- `institutional_summary*.json` missing
- All `inst_delta_z` = 0 (sd=0, n=297)
- ACTION.json, inputs_manifest.json, drift_report.json, audit/ all missing

**Why**: prevents future-me from interpreting outage artifacts as model regime
shifts. The 04-24 watchdog recovery (`project_watchdog_recovery_restored_2026_04_24.md`)
addressed the underlying cron-failure modes; verified through 2026-04-30
no recurrences.

**How to apply**: when an audit shows ρ(coinvest_score_z, final_score) ≥ +0.95,
or top-30 jaccard with coinvest-only top-30 ≥ 80%, **check snapshot completeness
FIRST** before interpreting:
1. Count files in `data/snapshots/<date>/` — should be 60+ on a normal production day
2. Check for `institutional_summary.json` and `institutional_summary_delta.json`
3. Check sd of `inst_delta_z` across rows — if ≈ 0, the producer didn't run
4. If outage confirmed: exclude that day from the audit, do NOT call it a regime

This connects to `feedback_observation_bias_cron_monitoring`: missing data
biases interpretation toward false-positive signal patterns. The discipline:
**before reading any anomalous-looking signal stat, check production
completeness first**.

## Spearman tied-constant bug (related, fixed 2026-05-01)

The outage scenario also surfaced a latent bug in `scripts/research/ees_validation_table.py:_spearman`. When all xs are equal (e.g., inst_delta_z all zero on outage days), my competitive-ranking implementation produced ranks 1..n in stable-sort order, yielding a numerically meaningless rank correlation rather than None. Fixed to add an explicit tied-constant guard before ranking. 4 unit tests added in `tests/test_ees_validation_table.py`.

The canonical `pit_backtest_ees_v2.py:_spearman_ic` was already correct (uses average ranks + explicit `len(set(...))<3` degeneracy check). Other `spearman_ic` helpers across `scripts/research/` were not audited in this pass — a future hygiene sweep should check whether they handle tied-constant inputs correctly.

## Verified post-fix

- 04-25 onwards: no outage recurrences through 2026-04-30
- Dominance-audit conclusion (coinvest ρ ≈ +0.88 with final_score, Q2 jaccard ~57%) **holds with or without the 4 outage days excluded** — robust to the artifact.
- Forward-return test on production-vs-coinvest-only top-30 is now unblocked but not yet run; will be initiated in a separate change after this hygiene patch commits.
