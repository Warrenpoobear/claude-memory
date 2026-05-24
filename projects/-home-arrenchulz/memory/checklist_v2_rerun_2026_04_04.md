---
name: Checklist v2 Selective Rerun Results
description: Official QA baseline — B6 validated, pairwise ordinal-only confirmed, event_type 5/5, insider/AACT downgraded, clinical+financial negative within top-30
type: project
---

## Checklist v2 Selective Rerun (2026-04-04)

Script: `scripts/research/checklist_v2_rerun.py` | Artifacts: `output/checklist_v2_rerun/`

### Queue A — Standalone Signals (5-gate battery)

| Signal | Gates | Verdict |
|--------|-------|---------|
| coinvest_score_z | 3/5 | SHADOW — FM incr NW-t=−0.18, FDR q=0.86 |
| inst_delta_z | 2/5 | NO_GO standalone — LOSO unstable in core bucket |
| event_type_score | 5/5 | PROMOTE (overlay only — does NOT improve B6 bundle) |
| insider_exec_buy_value_90d | 1/5 | NO_GO — FRAGILE robustness, bootstrap CI includes 0 |
| aact_execution_score | 1/5 | NO_GO — bear-unstable (−1.86pp), bootstrap CI includes 0 |

### Queue B — Pairwise Calibration
- ECE=0.129 → POOR (ordinal-only confirmed)
- Within top-30 FM: inst_delta (+2.20) survives; clinical (−2.13) and financial (−3.18) are significantly NEGATIVE
- coinvest misses at NW-t=1.86 within cohort

### Queue C — B6 Bundle
- Bootstrap: +2.42pp/mo, 95% CI [1.25%, 3.70%], P(>0)=99.99% → PASS
- LOSO: ROBUST across all dimensions → PASS

### Pairwise Feature Audit (2026-04-04) — RESOLVED

Script: `scripts/research/pairwise_feature_audit.py` | Artifacts: `output/pairwise_feature_audit/`

- **financial_score: TRUE PENALTY** — negative at all cohort widths, both regimes, 5.84pp spread. Correct model behavior.
- **clinical_score_v2_z: COLLIDER + WEAK PENALTY** — amplifies under selection, vanishes in high-coinvest stratum. Quarterly review.
- **Within top-30 multivariate**: inst_delta (+3.32) dominant positive, financial (−3.41) dominant negative, coinvest washes out (+0.49)

### Production Mental Model (frozen 2026-04-04)

> **coinvest selects, inst_delta ranks, financial penalizes "safe but less catalytic" names, clinical is weak/conditional under review.**

### Policy Decisions (frozen 2026-04-04)
1. **B6 bundle stays in production** — validated under full Checklist v2
2. **Pairwise ordinal-only** — no rank-weighting or confidence sizing
3. **event_type_score** = overlay/diagnostic/sizer, NOT selector weight
4. **insider_exec + AACT** = shadow only, downgraded from earlier reads
5. **financial_score negative weight** = KEEP — true within-cohort penalty, not a bug
6. **clinical_score_v2_z** = quarterly review — collider-amplified, drop from pairwise if coefficient drifts to zero

**Why:** This is the first official QA readout under the Spec 055 statistical bar, plus the resolved pairwise feature audit. All prior signal assessments are superseded by these results for the tested signals.

**How to apply:** Use these verdicts as the authority for any promotion/demotion decisions on these signals. Do not cite old signal card results that conflict with these FM/bootstrap/FDR/LOSO findings. The production mental model ("coinvest selects, inst_delta ranks") should guide future feature engineering and ranker iteration.
