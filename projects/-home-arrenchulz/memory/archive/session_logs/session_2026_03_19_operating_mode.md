---
name: 2026-03-19 session — operating mode + PCR shadow
description: Shifted to operating mode, rebuilt PIT panel with 8-K, ran crowding study, wired PCR penalty shadow overlay
type: project
---

## Session Summary

### PIT Panel Rebuild
- Filled 2025 monthly 8-K gap (11 dates, 4,145 events)
- Rebuilt all 43 PIT bundle dates (3 components each)
- Coverage lift: +2.3 to +9.2pp across 2025 dates
- Frozen as formal catalyst research base (commit `7bbff57e`)
- Manifest: `manifests/pit_panel_eval_dates.txt` (70 dates)

### Build-Window Clinical Tilt Rerun
- Reran on enriched PIT panel: improved from -0.14pp → +0.01pp at 84d hedged
- Still below +0.20pp promotion bar → NEEDS_MORE
- Candidate `d59b6cc3` stays in shadow

### Crowding Study
- Composite `crowding_z`: ABANDON (IC=0.011, below 0.05 threshold)
- `pre_event_put_call_ratio`: NEGATIVE_ALPHA_CANDIDATE
  - Raw IC: -0.059 (5d), -0.109 (20d)
  - Incremental IC: -0.058 (5d), -0.091 (20d) — survives quality control
  - Strongest in build_window CLINICAL (IC=-0.186 at 20d)
  - Temporal stability: 50-60% sign consistency (borderline, 6 snapshots)

### PCR Shadow Overlay (commit `4915a9d0`)
- `pre_event_put_call_ratio` computed from Massive day aggs (10-day lookback) in run_screen.py
- DE: `pcr_penalty_mode` (off/tiebreak), `pcr_penalty_weight`, gated to build_window + CLINICAL
- Shadow candidate: v1.11.2 / `eeded48d` (tiebreak, w=0.25)
- Default OFF in active ruleset
- Research script: `scripts/research/eval_put_call_ratio_focused.py`

### Operating Mode Established
- Daily production ran clean (2026-03-19, WARN, 193 eligible)
- Decision memo + action lists + shadow portfolio generated
- NO_TRADE (not rebalance day)

## Next Session Checklist (PCR Shadow)
1. PCR coverage in build_window CLINICAL (count, %, non-neutral)
2. Signal shape: do high-PCR names look crowded to PM?
3. Outcome maturity: new 5d/20d rows, sign consistency
4. If sufficient: rerun focused study → formal shadow A/B
5. Do NOT: turn on penalty, widen scope, revive composite crowding
