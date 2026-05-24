---
name: AACT execution-delta revalidation (2026-04-05)
description: aact_execution_score NO GO for promotion, keep shadow — IC +0.012 improvement over 2-feat ranker is not significant (t=0.53)
type: project
---

## AACT Execution-Delta Revalidation — 2026-04-05

**Verdict: NO GO for promotion. Keep as shadow. Lane remains OPEN.**

### As 3rd ranker feature (coinvest + financial + aact)
- IC improvement: +0.012 (t=0.53) — NOT significant
- 87% overlap with 2-feat production ranker
- Does not reliably improve the production model

### Standalone Checklist v2: 1/5 gates
- FM NW-t=1.49 (FAIL, needs 1.96)
- Bootstrap CI spans zero (FAIL)
- FDR q=0.106 (FAIL, needs <0.10) — borderline
- LOSO unstable (FAIL)
- Year stability: 2/6 negative (2020: -4.61pp, 2025: -3.26pp)

### Why it's still the best remaining candidate
- Genuinely incremental: 80% IC retained after coinvest control
- Ranker IC: +0.069 (t=2.92) — decent standalone
- Independent of institutional block (unlike options/insider)
- Only 18 AACT snapshot pairs — insufficient evidence, not failed evidence

### Re-evaluation triggers
- 24+ AACT snapshot pairs (currently 18)
- 2026 full-year data
- Checklist v2 passes ≥3 gates
- Do NOT promote without meeting these criteria
