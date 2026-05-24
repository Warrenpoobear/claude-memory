---
name: Spec 055 Statistical Methods Upgrade
description: 6-method statistical QA layer — FM regressions, bootstrap, FDR, calibration, robustness, survival scaffold
type: project
---

## Spec 055 — Statistical Methods Upgrade (2026-04-04)

**COMPLETE.** 6 methods production-ready. Promotion checklist v2 established.

### Key Results That Changed Conclusions
- **coinvest_score_z FM NW-t = 1.45** (not significant univariate cross-sectionally — weaker than signal-card t=3.05)
- **Only insider_exec_buy_value_90d survives incremental FM** (NW-t = 1.98 after controls)
- **aact_execution_score NW-t = 1.73** — close but doesn't clear 1.96 bar
- **Zero signals survive BH FDR correction** at q < 0.10 in incremental family
- **White's RC p = 0.19** — no selector signal survives data snooping correction
- **Pairwise scores NOT calibrated** (ECE = 0.19) — ordinal ranking only, no sizing
- **clinical_score_v2_z negative across ALL robustness slices** — universally destructive
- Bootstrap: only coinvest + inst_delta have CIs excluding zero vs baseline

### Promotion Checklist v2
1. Signal card: selector Δ > 0, ranker IC > 0, coverage ≥ 40%
2. Fama-MacBeth: incremental NW-t ≥ 1.96 (controls: coinvest, inst_delta, financial)
3. Bootstrap: 95% CI on portfolio delta excludes zero (block=6, n=10000)
4. BH FDR: q-value < 0.10 within testing family
5. LOSO robustness: worst-slice delta still positive
6. Year stability: negative in ≤ 1 of tested years

### Infrastructure
- Package: `common/stats/` (6 modules: cross_sectional, bootstrap, multiple_testing, calibration, robustness, survival)
- Tests: 36 passing in `tests/test_stats_*.py`
- Runner: `scripts/research/statistical_methods_upgrade.py`
- Output: `output/statistical_methods/` (JSON + markdown artifacts)

### Implication for Portfolio
- Institutional stack works via sorting mechanism, not strong marginal prediction
- Do NOT revisit rank-weighting until calibration improves
- Every future signal promotion must pass the full checklist v2
