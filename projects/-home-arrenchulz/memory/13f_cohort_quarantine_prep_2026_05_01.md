---
name: 13F cohort-quarantine prep — Q1 2026 refresh framework (2026-05-01)
description: Prep artifact + read-only harness skeleton for Q1 2026 13F refresh ~2026-05-15. Defines pre/post diff schema, quarantine triggers (Top-30 Jaccard <0.70, manager Δ >5, coverage drop ≥10pp), April-outage guardrails (G1/G2/G3), refresh-day checklist. Diagnostic only — no production wiring.
type: project
status: active
expires: 2026-05-29
related:
  - regime_post_cohort_change_distortion_2026_04_28
  - incomplete_production_run_fallback_2026_05_01
  - feedback_cohort_change_quarantine
  - feedback_manager_acceptance_test
  - policy_coinvest_context_layer_2026_04_25
  - interp_framework_forward_shadows_2026_04_28
originSessionId: 5817ee52-e367-41a5-af14-3cb8ef51f022
---
# 13F cohort-quarantine prep (2026-05-01)

Path: `13F_COHORT_QUARANTINE_PREP_2026_05_01.md` (in repo root) + skeleton harness `tools/check_13f_cohort_quarantine.py`.

**Why**: Q1 2026 13F refresh expected ~2026-05-15. Without a pre-built quarantine framework, the refresh will either look like a regime shift (and trigger spurious decisions) or get silently treated as normal data (and contaminate top-30 attribution per `regime_post_cohort_change_distortion_2026_04_28`). The framework defined here is to be *exercised* when refresh lands, not run preemptively.

**How to apply**: when 13F-refresh / cohort-quarantine / inst_delta_z-shift questions come up, route here. The pre/post diff harness `tools/check_13f_cohort_quarantine.py` enforces three guardrails before computing any quantitative diff:
- G1 — snapshot completeness (rankings.csv + institutional_summary_delta.json + inst_delta_z sd > 0.1)
- G2 — producer freshness (`institutional_summary.json:cache_as_of_date` advanced + `prior_date` in delta JSON advanced)
- G3 — distinguish manager-level vs window-level (prior_date roll) cause
Sanity-tested 2026-05-01: correctly emits `REFRESH_NOT_LANDED` because refresh hasn't landed yet (`prior_date=2025-12-31` still, `cache_as_of_date=2026-04-13`).

## Key constants

- **Quarantine trigger** (Top-30 Jaccard): < 0.70 → quarantine 10 trading days; 0.70–0.85 → standard cohort window; ≥ 0.85 → no special handling
- **Manager Δ trigger**: new + removed > 5 → cohort-contaminated ~3 weeks
- **Coverage drop trigger**: ≥ 10pp drop in `tickers_common` → producer audit (likely producer fault, not regime)
- **inst_delta_z KS-stat threshold**: ≥ 0.30 vs pre-refresh = expected (this IS the refresh)
- **coinvest_score_z KS-stat threshold**: ≥ 0.20 = registry change suspected; manual review

## Refresh-day checklist (per artifact §5)

When `production_data/institutional_summary.json:cache_as_of_date` advances past 2026-04-13 (current frozen value):

1. **Pre-capture** state into `data/snapshots/_13f_quarantine_2026q1/*.PRE.*` BEFORE refresh lands
2. **Detect refresh** by mtime + cache_as_of_date check
3. **Post-capture** first post-refresh snapshot's outputs into same dir as `*.POST.*`
4. **Run** `python -m tools.check_13f_cohort_quarantine --pre-date X --post-date Y --output artifacts/13f_diff_2026_05_15.md`
5. **Apply quarantine** if triggers fire — log in memory, update MEMORY.md Active Monitoring Windows
6. **Exit verification** ~2026-05-29 (10 trading days post-refresh): re-run with `--exit-check` (not yet implemented)

## Hard rules

- ❌ DO NOT modify `production_data/manager_registry.json` (use `tools/onboard_manager.py` only, with explicit approval)
- ❌ DO NOT modify `production_data/institutional_summary.json` (producer-only)
- ❌ DO NOT modify `data/snapshots/<date>/*` rankings or delta files
- ❌ DO NOT wire harness into production cron — manual on-demand only
- ❌ DO NOT promote Form 4 / change selector / change ranker / change scoring in this context
- ❌ DO NOT re-run prior cohort quarantine (04-25 → ~05-15) — that's already in effect
- ❌ DO NOT merge/cherry-pick commits `7213b2ef` (Spearman hygiene) or `470987df` (Form 4 operational repair) as part of this prep

## Status

Spec drafted 2026-05-01. Skeleton harness committed-pending (untracked, not staged). **No production code or cron changes from this prep.** Refresh-day exercise is the operational use; until then, this memo and the artifact are the load-bearing reference.

## Open questions (resolve at refresh-day, not now)

1. Exact quarantine window length — 10 trading days is default; calibrate after one observed cycle
2. KS-stat thresholds — 0.30 / 0.20 are heuristic; calibrate on actual refresh data
3. Whether to wire harness into cron — probably no (risks misfiring on partial refresh days)
4. Sector/stage skew Chi-sq threshold — sample-dependent; consider Fisher's exact for n=30
5. Coordinate Form 4 re-eval (~05-08) with cohort window — dependency check needed if eligibility sample overlaps quarantine

## Queue (per user direction)

| Date | Task |
|---|---|
| 2026-05-01 | 13F cohort-quarantine prep (this memo + artifact + skeleton) |
| ~2026-05-08 | Form 4 stable-snapshot re-evaluation (5 days post-`470987df`) |
| ~2026-05-15 | Run refresh-day diff when Q1 2026 13Fs land |
| ~2026-05-22 | vNext D7/D8/D9 verification (remote agent `trig_017s1kczCPEzp4ecNaPP4vYr`) + production-vs-coinvest forward-return re-test |
| ~2026-05-29 | Exit-quarantine verification (10 trading days post-refresh) |
