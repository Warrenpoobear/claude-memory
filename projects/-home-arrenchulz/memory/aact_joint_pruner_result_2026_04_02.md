---
name: aact_joint_pruner_result_2026_04_02
description: AACT execution_score does NOT improve IDZ pruner — joint signal worse at all horizons on 9 dates
type: project
---

## Joint Pruner Test Result (2026-04-02)

**Verdict: DO NOT PROMOTE.** AACT execution_score dilutes inst_delta_z.

### Results (9 dates with both signals >= 15 overlap)

| Horizon | EW30 | IDZ Top-20 | Joint Top-20 | Joint beats both? |
|---------|------|-----------|-------------|-------------------|
| 5d | +0.23pp | +1.29pp | +0.92pp | No (-0.37 vs IDZ) |
| 10d | +0.63pp | +1.20pp | -1.28pp | No (-2.48 vs IDZ) |
| 20d | -2.17pp | -3.21pp | -3.54pp | No |

### Why it failed
- AACT execution_score has low variance on daily snapshots (most tickers show zero change)
- Only 15-18 names per date have both signals nonzero
- Monthly AACT deltas (Jan→Feb→Mar) carry the signal, daily deltas are noise
- 9 dates is early but the direction is consistently wrong

### What to do
- Keep IDZ-only as production pruner (per Spec 045)
- Let AACT accumulate more monthly deltas before retesting
- Next meaningful AACT delta: May 1 (monthly snapshot)
- Do not add aact_execution_score to the pruner formula

**Why:** Per Spec 045 promotion rule, joint must beat BOTH baselines. It doesn't.
**How to apply:** When asked about adding AACT to the pruner, point here. The test was run and it failed.
