# Institutional Delta Sidecar + Sort Signal

## Institutional Summary Enrichment
- **File**: `institutional_summary.py` — added `elite_holder_shares` (all holders, sorted by name, not capped at 10)
- **Delta function**: `compute_institutional_delta(current, prior)` — new/exit/add/trim counts, shares/value deltas
- **Prior finder**: `_find_prior_institutional_summary(snapshot_dir, current_date, max_candidates=10)`
- **Schema**: `DELTA_SCHEMA_VERSION = "institutional_summary_delta.v1"`
- **Cold-start**: returns `None` if prior lacks `elite_holder_shares` (v1 without enrichment)

## Delta Sidecar in run_screen.py
- **Computation hoisted** before sort (after coinvest z-score block) — needed for sort signal
- **Z-score**: `inst_delta_z` = cross-sectional z of `net_elite_holders_delta` (ddof=0)
- **SNAPSHOT_COLUMNS**: 4 new after `coinvest_filing_age_days`: `inst_delta_z`, `inst_delta_net`, `inst_delta_new`, `inst_delta_exit`
- **Sidecar write**: reuses already-computed `inst_summary` and `inst_delta` (no recomputation at write time)

## Gate Changes
- **Tightened**: `check_institutional_summary()` now has invariant checks (zero universe, signal > universe, managers inconsistency, coverage mismatch)
- **New gate**: `check_institutional_delta()` — WARN-only, PASS if delta exists OR cold-start, WARN if prior with shares but no delta
- **Allowlist**: `"institutional_delta"` added to `GATE_ALLOWLIST`

## Sort Signal (decision_engine.py) — PROMOTED v1.9.0
- **Ruleset fields**: `enable_institutional_sort_signal` (True), `institutional_sort_weight` (0.3), `institutional_positive_only` (True), `institutional_sort_min_nonzero_pct` (10.0)
- **Sort blend**: `inst_adj = weight * clamp(iz)` added to all three mode branches (tiebreaker/blended/off)
- **Pattern**: mirrors coinvest sort tilt exactly (positive-only, ±2.0 clamp)
- **Coverage guard**: if <10% of tickers have nonzero `inst_delta_net`, all `inst_delta_z` zeroed + warning logged. Telemetry: `inst_delta_nonzero_pct` in snapshot columns.
- **Sparsity finding (2026-03-06 live)**: only 5/296 tickers nonzero (1.7%), 2 ineligible → effectively 3 names drove the IS IC. Guard fires at current coverage.
- **Promoted**: v1.9.0 (ID=`e966af9d`), IS 2026 paired IC: 5d +0.0199 t=+6.96 win=93%, 20d +0.0366 t=+13.51 win=100%. Turnover -0.71pp vs baseline. Gate WARN (SLDB archetype oscillation, pre-existing).

## PIT Hardening (implemented)
- **Prior lookup**: `_find_prior_institutional_summary()` now checks `cache_as_of_date == date_str` — skips PIT-mismatched priors
- **Delta provenance**: `current_cache_as_of_date` + `prior_cache_as_of_date` in delta output (optional, additive to schema)
- **Tests**: `test_skips_pit_mismatch`, `test_accepts_matching_pit`, `test_pit_provenance_in_delta`

## Weight Sweep & Calibration
- **Script**: `scripts/sweep_institutional_weight.py` (~150 lines) — iterates weight values, patches baseline ruleset, calls `compare()` from replay harness
- **Backfill**: `compare_rulesets_replay.py` now backfills `inst_delta_z/net/new/exit` with 0 defaults for old snapshots
- **CLI**: `--snapshot-dir`, `--baseline`, `--weights "0.01,0.03,..."`, `--output-dir`
- **Output**: `artifacts/institutional_weight_sweep.{json,md}` — table of top-20/60 overlap, names changed, rank churn per weight
- **First live sweep (2026-02-20)**: 100% overlap at all weights (expected — same Q4 2025 13F filing period for both dates, only 2 tickers with net holder changes)
- **Meaningful differentiation** requires accumulating snapshots across different 13F filing cycles

## Drift Metrics (implemented)
- **Helper**: `_institutional_metrics(rankings)` in `scripts/run_drift_report.py`
- **Metrics**: `inst_delta_z_std`, `inst_delta_z_mean`, `inst_delta_nonzero_pct`, `inst_delta_active_pct`, `inst_top20_positive_delta_pct`
- **Guardrail**: `warn_inst_delta_nonzero_low=5.0` in `DriftGuardrails` — WARN if <5% of dev have nonzero z
- **Guardrails ID**: changed to `ab40add8` (reflects new field)
- **First live values (2026-02-20)**: z_std=1.25, nonzero=100%, active=0.5%, top20_pos=0%
- **Tests**: 5 new in `test_drift_monitoring_gate.py` (present/absent/all-zero/warn/guardrails_id)

## Tests
- `test_institutional_summary.py`: updated per-ticker keys, added `TestEliteHolderShares` (4 tests)
- `test_institutional_delta.py`: 36 tests (delta, prior-finder w/ PIT, gate, invariants, sort signal, PIT provenance)
- `test_drift_monitoring_gate.py`: 29 tests (includes 5 institutional metrics tests)
- `test_phase2_daily.py::TestOpsContract`: updated allowlist assertion
