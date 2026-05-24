---
name: Forward-return test — production vs coinvest-only top-30 (2026-05-01)
description: 8-snapshot test, INFORMATIVE BUT INCONCLUSIVE. Production had small median edge (+0.31pp vs coinvest-eligible, +0.88pp vs coinvest-full), but sign-test 4/8 and rescued-vs-suppressed differential +0.10pp. Posture: keep observing; do not change ranker. Re-run at 2026-05-22.
type: project
status: active
expires: 2026-05-22
related:
  - scoring_model_identity_2026_04_06
  - regime_post_cohort_change_distortion_2026_04_28
  - screener_vnext_d8_d9_first_candidate_2026_05_01
  - policy_freeze_architecture_2026_04_19
  - incomplete_production_run_fallback_2026_05_01
originSessionId: 5817ee52-e367-41a5-af14-3cb8ef51f022
---
# Forward-return test — production top-30 vs coinvest-only top-30 (2026-05-01)

The 8-snapshot forward-return test on 2026-04-14 → 2026-04-23 (T+5 resolved through 04-30) was informative but **inconclusive**. Production top-30 had a small median advantage versus coinvest-only top-30 (+0.88pp vs coinvest-full, +0.31pp vs coinvest-eligible), but the sign-test versus coinvest-eligible was **4/8** (chance) and the rescued-vs-suppressed differential was **+0.10pp** (≈ 0).

**Conclusion**: production ranker deviations from coinvest are **not proven to add alpha**, but evidence is too small (n=8) and cohort-contaminated (post-2026-04-25 SIGNAL_ALERT window) to change or remove the ranker. **Coinvest is still doing the main work. The ranker's deviations are unproven, but not clearly harmful. Keep observing. Do not tune.**

**Why**: prevents future-me from over-reading either direction. The +0.88pp/+0.31pp medians look like signal but the +0.10pp rescued-vs-suppressed kills the "ranker work earns alpha" claim cleanly. If a future audit finds either "production beats coinvest by Xpp" or "ranker is wasted", route here first to check if it's the same n=8 sample being re-aggregated.

**How to apply**: when ranker-removal or ranker-tuning proposals come up between now and 2026-05-22, the answer is "wait for the verification re-run." Re-run this test at the 2026-05-22 verification window with ≥30 resolved snapshots — at that volume, the per-snapshot median's SE drops from ~0.5pp to ~0.25pp, making +0.31pp meaningful (1.2σ) if it persists or clearly null if it shrinks.

## Load-bearing numbers

Per-snapshot median (8 resolved snapshots):
- Production T+5 excess vs XBI: **-0.86pp** (range [-3.21, +1.59])
- Coinvest-full T+5 excess vs XBI: -1.85pp
- Coinvest-eligible T+5 excess vs XBI: -1.07pp
- **Production − Coinvest-full**: **+0.88pp** (range [-1.11, +2.20])
- **Production − Coinvest-eligible**: **+0.31pp** (range [-2.02, +1.75])

Sign-test:
- Production beats coinvest-full: 5/8 (62.5%)
- Production beats coinvest-eligible: 4/8 (50% — pure chance)

Rank-order pathology (decisive cleanest test):
- SUPPRESSED names (high coinvest, prod drops): n=92, mean T+5 excess = -1.06pp
- RESCUED names (low coinvest, prod includes): n=92, mean T+5 excess = -0.96pp
- **Differential: +0.10pp ≈ 0** — production's deviations don't earn alpha in this window

Per-name observations (chronic 8/8 snapshots):
- Big rescue WIN: RCUS (+6.29pp) — would be missed by coinvest-only
- Big rescue LOSS: SLDB (-4.69pp) — production wrongly rescued
- Big suppression CORRECT: SION (-5.68pp), DYN (-4.20pp), IMCR (-3.54pp)
- Big suppression INCORRECT: ACAD (+4.42pp) — production wrongly excluded a winner

Net effect ≈ zero. Mixed deviation skill cancels out at the portfolio level.

## Why "wait, don't tune" is the right posture (NOT just inertia)

1. **n=8 with per-snapshot SD ~1.4pp** → SE on the median is ~0.5pp. The +0.31pp median is well within 1 SE of zero.
2. **All portfolios are losing to XBI** in this window's median (-0.86pp / -1.85pp / -1.07pp). Recent window was bad for biotech stock-picking generally — these absolute numbers don't represent typical performance.
3. **Cohort-quarantine window active** per `[regime_post_cohort_change_distortion_2026_04_28]` through ~2026-05-15. Forward returns from 04-15 → 04-23 partly contaminate.
4. **2026-05-22 verification has the same dependency** (resolved L3 panel + ≥30 trading days). Re-running BOTH the forward-return test AND vNext D7/D8/D9 at that date gives a much sharper read with shared infrastructure.
5. **Architecture frozen** per `[policy_freeze_architecture_2026_04_19]` — no tuning anyway.

## Hard rules until 2026-05-22 re-run

- DO NOT change the ranker (no removal, no reweighting, no feature additions)
- DO NOT change the selector (institutional weight, financial weight, etc.)
- DO NOT modify coinvest gate or threshold
- DO NOT promote vNext (separate verification path; same date)
- DO NOT loosen the +0.10pp rescued-vs-suppressed differential threshold even if next sample tilts marginally positive

## Cherry-pick guidance for commit `7213b2ef` (recorded 2026-05-01)

Per user direction at this milestone:
- **Do NOT merge the whole source branch** (`spec-071-lane-1-catalyst-status-reject`) into main if it drags unrelated Spec 071 commits along.
- **Cherry-pick `7213b2ef` only** if it is exactly the bounded Spearman/hygiene fix (3 files: `scripts/research/ees_validation_table.py`, `tests/test_ees_validation_table.py`, `RANKER_HYGIENE_NOTE_2026_05_01.md`).
- **Verify touched files before cherry-pick**: `git show --stat 7213b2ef` should show only those 3 files. If anything else appears, STOP and report — don't proceed with the cherry-pick.

## Artifacts

- Production-vs-coinvest analysis: ran inline 2026-05-01 against `data/snapshots/_forward_returns_panel.csv`; output in conversation transcript only (not persisted to repo).
- Same forward-return panel feeds the 2026-05-22 verification agent (`trig_017s1kczCPEzp4ecNaPP4vYr`).
