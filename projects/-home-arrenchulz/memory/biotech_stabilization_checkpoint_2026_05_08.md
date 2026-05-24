---
name: Biotech stabilization checkpoint 2026-05-08
description: Session outcome — 4 commits, IC first read OBSERVE verdict, stop-here on model logic, next gates
type: project
status: active
originSessionId: df122f83-ca34-40a2-9455-fa9cb0c92d3f
---
Session closed with operator guidance: stop on model logic, let observability observe.

## Commits landed (HEAD `f388c907`)

- `d9fa06d4` — 13F Q1 2026 refresh readiness (`tools/prep_13f_refresh.py`, quarantine Section A + Telegram alerting, RUNBOOK §11+12)
- `bdeb5a47` — Snapshot content collapse guards: `coinvest_score_z` SD ≤ 0.10 → FAIL; `catalyst_quality` <90% classified → FAIL; wired into `verify_snapshot_integrity.py`; 10 tests
- `1f0621ab` — SOUL.md ruleset test constants updated (v1.13.0 `2a3e79eb` → v1.14.0 `8887576e`)
- `5a457b0b` — `tools/ic_decomposition.py` + 22 tests + first artifact; `f388c907` adds audit readout

## IC decomposition first read

Pooled IC = -0.031, t = -1.99 (14 snap dates, 2026-04-14 → 2026-04-30, n=4158 obs).
April selloff cluster (04-21 to 04-25) drove the negative IC; post-cohort mean IC = -0.008 (flat).
**Decision: OBSERVE.** No weight changes, no demotion, no retrain.
Audit one-pager: `artifacts/audit/ic_decomposition_readout_2026_05_08.md`

**Why:** pre-cohort negativity is regime-driven (XBI selloff), not structural signal inversion. Post-cohort near-zero IC argues against overreacting.

**How to apply:** Do not interpret IC tool output as scoring signal until h20d verdict + 13F refresh clear. `score_rank_pct` degradation alone does not trigger demotion path.

## Open gates before any further IC conclusion

1. WSL2 `powercfg /change standby-timeout-ac 0` — **DONE 2026-05-08**, confirmed by user
2. 13F refresh ~2026-05-15 — run `prep_13f_refresh.py`, then post-refresh run `check_13f_cohort_quarantine.py --pre-date 2026-05-08 --post-date <first_post_refresh_snap>`
3. Next production snapshot — validate collapse guards (coinvest_score_z dispersion, catalyst_quality coverage, no unexpected WARN/FAIL)
4. h20d = 2026-05-26 — IC verdict checkpoint; also wait for `catalyst_quality` segment to populate (needs ≥5 forward-complete snapshots from 2026-05-08)
5. Cross-signal forward shadow verdict also at h20d = 2026-05-26

## What NOT to do next

- No model surgery (weight changes, demotion, retrain, simplification) before all 4 gates above clear
- Do not interpret IC tool output as new scoring signal
- Do not add more tooling; let existing observability run
