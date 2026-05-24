---
name: Spec 054 Execution-Timeline Delta Study
description: Trial execution signals study — aact_execution_score SHADOW (incremental to coinvest), static features CLOSED
type: project
---

## Spec 054 — Execution-Timeline Delta Study (2026-04-04)

**COMPLETE.** 12 execution signals tested, 12 selector bundles, 13 ranker bundles.

### Key Results
- **aact_execution_score**: PROMOTE_CANDIDATE — Sel Δ=+1.54pp (t=1.69), Ranker IC=+0.069 (t=2.92)
- **Genuinely incremental**: 80% IC retained after coinvest control (vs 0% for options)
- **S9 bundle** (B6 + aact_score 20%): +2.53pp vs B6 +2.23pp (+0.30pp improvement)
- **Year-by-year unstable**: negative 2020 (−4.6pp) and 2025 (−3.3pp); 2021 outlier (+6.2pp)
- **Static features FAIL**: PCD overdue, update recency, pipeline velocity — all noise/destructive as selectors
- **Update recency is DESTRUCTIVE** (IC=−0.084, partial −0.114) — frequent updates signal trouble
- **Pipeline scale = size proxy**: trial count and breadth have ranker IC but zero selector power
- **Near-catalyst tiebreaker**: exec_pcd_overdue_ratio IC=+0.164 (t=1.98) in 11 periods — promising, needs more data

### Lane Status
- **OPEN for shadow accumulation** of aact_execution_score (need ≥3 more months)
- **CLOSED for static execution features** as standalone selectors
- Future: site-count deltas, protocol amendments when AACT ingestion expands

### Infrastructure
- Script: `scripts/research/execution_delta_study.py`
- Output: `output/execution_delta_study/` (master_results.json, final_recommendation.md)
- Spec: `specs/changes/spec_054_execution_timeline_delta_study.md`
