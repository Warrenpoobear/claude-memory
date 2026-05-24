# Missingness Penalty (config-gated) — Runbook

## What shipped
- New snapshot columns (always populated): `missing_components` (e.g., `catalyst|sponsor|drawdown`), `missingness_penalty` (0..N).
- Ruleset toggles (default **False**): `enable_missingness_sort_penalty`, `enable_missingness_size_penalty`.
- Health metrics (guarded by column existence): `coverage_{catalyst,sponsor,drawdown}_pct`, `portfolio_missing_count`.
- Commits: `0a04828` (feature) + `925a409` (CI green).

## How to verify "defaults unchanged" (must-pass invariance)
1. `python3 -m pytest tests/test_missingness_penalty.py tests/test_decision_engine_contract.py -q`
2. `python3 run_daily.py --as-of-date YYYY-MM-DD --no-skip-existing --no-rollup`
   - Confirm: `rankings.csv` has the 2 new columns; ordering/weights unchanged vs prior baseline run.

## How to enable in a candidate ruleset (safe rollout)
1. Copy current prod ruleset JSON → new JSON in `production_data/decision_rulesets/`
2. Set `enable_missingness_sort_penalty: true`, `enable_missingness_size_penalty: false`
3. Update `manifest.json`, run `python3 -m pytest tests/test_decision_ruleset.py -q`
4. Replay/compare via `run_decision_strategy_backtest.py`

## Known pitfall
- Pandas reads empty CSV cells as `NaN`; `str(NaN) == "nan"` is truthy
- Fix: `pd.notna(x) and ...` whenever scanning `missing_components`

## Sort-Only Candidate Ruleset (v1.3.3) — ACTIVE
- File: `v1.3.3_missing_sort_only_candidate.json` (ID=`e1be5370`)
- `enable_missingness_sort_penalty=true`, `enable_missingness_size_penalty=false`
- Promoted `3380d37` after 24-snapshot replay: 100% overlap, 0 rank churn
- `PHASE2_DEFAULT_RULESET_PATH` → this file
