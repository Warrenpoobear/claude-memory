# Phase-2 Health Gate (detailed)

## Files
- `run_phase2_snapshot_delta.py` — health gate + delta report (~1220 lines)
- `run_phase2_health_calibration.py` (~790 lines) — replays archives
- Tests: `test_phase2_health_gate.py` (18), `test_phase2_delta_hook.py` (9) — 65 total across Phase-2

## Thresholds
- Pinned: `production_data/phase2_health_thresholds/v1.json` (ID=26f0d3d2)
- `Phase2HealthThresholds` frozen dataclass with `thresholds_id` (sha256[:8]), `to_json()`/`from_json()`
- `PHASE2_PINNED_THRESHOLDS_ID` in `run_screen.py` = "0dae2ff0"

## Tuned values (calibrated against 2025 steady-state, 10 dates)
- warn_a_count_low=2 (P50=2.0; 3 fired 50%, 2 fires 10%)
- warn_weight_l1_pct=55% (recalibrated 2026-02-11, was 45%; P90=50.8%)
- warn_catalyst_drop_pp=5pp (max observed=1.9pp)
- fail_optionality_coverage_min=80% (2026-01 is 0%, 2025 is 100%)

## no_a_tier split
When A-count=0, runs `_optionality_diagnostic()`:
- Coverage < 80% → FAIL `optionality_broken` (broken feed, e.g. 2026-01)
- Coverage >= 80% → WARN `no_a_tier_regime` (legit sparse-catalyst month, e.g. 2025-09-30)
- `PHASE2_A_FLOOR = 0.55` constant for diagnostic (not in thresholds — ruleset property)
- Metrics: `dev_optionality_coverage_pct`, `dev_above_a_floor_count`, `optionality_diagnostic` dict

## Missingness guardrails (thresholds_id `0dae2ff0`)
- FAIL: `drawdown_coverage_low` (<95%)
- WARN: `drawdown_coverage_low` (<99%), `sponsor_coverage_low` (<90%), `catalyst_coverage_low` (<85%), `portfolio_missing_data` (count>0)
- Guarded by `missing_components` column existence

## Alert rates
- WARN=20%, FAIL=0% in 2025 steady state (after split)
- Full calibration (33 archives): 2024 FAIL(catalyst_broken), 2025 OK/WARN, 2026-01 FAIL(no_portfolio+optionality_broken)

## Gate logic
- FAIL (short-circuit) → WARN → OK; returns `HealthResult(status, reasons, metrics)`
- `--strict` in `run_screen.py`: FAIL→exit 1, WARN→exit 2
- `--health-thresholds` override in both `run_screen.py` and calibration harness
