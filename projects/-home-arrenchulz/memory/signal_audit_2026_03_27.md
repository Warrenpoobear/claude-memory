---
name: Sort signal IC audit (2026-03-27)
description: Full IC audit of active ruleset sort signals — inst_delta is the only predictive signal, calendar alpha and optionality are NOISE
type: project
---

## Sort Signal IC Audit — 2026-03-27

350 snapshots (2020-01-03 to 2025-12-12), dev universe.

### Results

| Signal | Weight | 20d IC | 20d t | 60d IC | 60d t | Quality |
|--------|--------|--------|-------|--------|-------|---------|
| optionality_pct (anchor) | anchor | +0.0005 | +0.11 | -0.0012 | -0.25 | NOISE |
| inst_delta_z | 0.3 | +0.0493 | +8.68 | +0.0770 | +11.38 | GOOD/EXCELLENT |
| clinical_score_v2_z | 0.3 | -0.0005 | -0.10 | +0.0010 | +0.21 | NOISE |

Residual IC (after controls) is nearly identical — inst_delta signal is genuine, not market-beta.

### Implications

1. **Calendar alpha v2 should be disabled** — zero IC, contributes noise at 30% weight
2. **Institutional delta is the only real tiebreaker** — carry its weight higher or make it sole tiebreaker
3. **Optionality works as a gate (tier assignment) not as a continuous sort signal** — the anchor is doing tier filtering, not ranking within tier
4. **The active ruleset is effectively a one-signal model** masquerading as a three-signal blend

### Recommended ruleset change

Create candidate with `enable_calendar_alpha_sort=false`. Keep inst_delta at current weight or increase. Run through standard promotion battery (signal evidence, top-60 overlap, max rank shift).

**Why:** Removing a NOISE signal at 30% weight should reduce sort-key randomness and improve rank stability. This is not a new signal — it's removing a harmful one.

**How to apply:** This is a model change requiring human decision. Do NOT auto-promote. Run signal evidence with calendar_alpha OFF, compare to baseline, and decide.
