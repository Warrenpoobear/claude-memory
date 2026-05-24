# Ruleset Promotion Governance Pipeline

## Overview
End-to-end pipeline: evaluator → CI gate → promote script with audit trail.

## Ruleset Evaluator (`scripts/eval_ruleset.py`)
- **~870 lines**, tests: 30 in `test_eval_ruleset.py`
- Evaluates candidate vs baseline rulesets across date ranges
- Metrics: stability (top-K overlap, rank shifts), portfolio returns, regime slices
- Gate: PASS/WARN/FAIL; zero evaluated dates → WARN (not PASS)
- Exit codes: 0=PASS, 1=FAIL, 2=config error
- CLI: `--candidate`, `--baseline`, `--start`, `--end`, `--k`, `--horizon`, `--cost-bps`, `--gate`, `--out-dir`
- Output: `ruleset_eval.json` + `ruleset_eval.md` + `per_date_metrics.csv`
- Schema: `ruleset_eval.v1`
- Skips: RULESET_MISMATCH (snapshot pinned to different ruleset), degraded, missing data

## CI Promotion Gate Workflow (`.github/workflows/ruleset-promotion-gate.yml`)
- `workflow_dispatch` with inputs: candidate_ruleset_path, baseline_ruleset_path, start_date, end_date, top_k, horizon, cost_bps, fail_on_warn
- Steps: checkout → setup python → install deps → hydrate inputs (market data + price CSV from replay bundle) → download snapshots → validate → run evaluator → build job summary → upload artifacts → final verdict
- Price CSV hydration: extracts from replay bundle artifact via `find` (path has `replay_bundle_v1/` prefix)
- Snapshot download: `gh api` to fetch `phase2-snapshot-{date}` artifacts per date in range
- Exit: FAIL→1, WARN→0 (unless fail_on_warn), PASS→0
- Artifact: `ruleset-gate-{start}-to-{end}` with 30-day retention

## Daily CI Ruleset Evaluation (in `phase2-daily-production.yml`)
- "Evaluate ruleset" step with trailing ~15-day window
- Single-day fallback when trailing window yields 0 evaluated dates
- Wired after monitoring gate, before outcome

## Hardened Promote Script (`scripts/promote_ruleset.py`)
- **~655 lines**, tests: 20 in `test_promote_ruleset.py`, 10 in `test_promote_ruleset_rollback.py`
- Gate validation: `--gate-summary PATH` required (or `--force`)
  - Checks: verdict==PASS, n_evaluated>=1, candidate ID match
- Deterministic updates:
  - Manifest: candidate→active, old active→retired
  - Pinned IDs: regex replaces `PHASE2_PINNED_RULESET_ID` in run_screen.py + run_phase2_snapshot_delta.py
  - Default path: regex replaces filename in `PHASE2_DEFAULT_RULESET_PATH`
- Promotion receipt: `artifacts/promotions/{promotion|rollback}_{date}_{id}.json` (schema `promote_receipt.v1`)
  - Receipt fields: `action` ("promote"|"rollback"), optional `reason`
- File ID verification: SHA-256 content hash must match manifest entry
- CLI: `--gate-summary`, `--gate-run-url`, `--commit`, `--dry-run`, `--force`, `--rollback`, `--reason`
- **First-class rollback** (no `--force` required):
  - `--rollback --reason "..."` — governed rollback with audit trail
  - `--rollback` without `ruleset_id` → auto-discovers last-known-good via `_find_last_known_good()` (walks manifest in reverse, finds first retired entry with `updated_by` starting with `"promote_ruleset.py"`)
  - Skips changelog validation for rollbacks
  - `--rollback --force` still works (backward compat)
- **Pitfall**: `test_promote_ruleset_rollback.py` must patch ALL module paths (PROJECT_ROOT, RULESETS_DIR, PINNED_FILES, RECEIPTS_DIR, CHANGELOG_PATH) — missing patches cause tests to write to real files

## Post-Promotion Health Monitor (`tools/ruleset_health_monitor.py`)
- **~250 lines**, tests: 10 in `test_ruleset_health_monitor.py`
- Compares daily drift metrics against active ruleset's promotion receipt baseline
- Thresholds (`HealthThresholds` dataclass): overlap_warn_delta=10.0, rank_shift_warn_factor=3.0, consecutive_warn_days_for_rollback=3
- Rolling history: `artifacts/ruleset_health_history.jsonl` (append-only, one JSON line per day)
- Output: `ruleset_health.json` sidecar (schema `ruleset_health.v1`)
- Gate: `ruleset_health` in GATE_ALLOWLIST (WARN-only, never FAIL)
- Graceful cold start: no receipt → PASS, no drift report → PASS
- Wired after drift monitoring gate in `run_daily_production.py`

## Manifest Invariants (`tests/test_ruleset_manifest_invariants.py`)
- 5 tests enforced in CI:
  1. Exactly one active entry
  2. No duplicate IDs
  3. Unique (id, file) pairs
  4. Active matches PHASE2_PINNED_RULESET_ID in both run_screen.py and run_phase2_snapshot_delta.py
  5. Pinned file exists and DecisionRuleset.from_json computes expected ID

## Manifest State (as of 2026-02-27)
- 17 rulesets total (was 20; removed 3 duplicates: 0c1129f6 candidate, 6b12517f v1.2_candidate, bf6815e2 v1.2.1_candidate)
- Active: `0c1129f6` (v1.6.1_alpha_modifier_within_tier.json)
- Candidates: 25f50278, 054bc5cc, f9842e1f
