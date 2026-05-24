---
name: Asset allocation external review (2026-05-05)
description: External code review of Warrenpoobear/asset-allocation @ fc85426 surfaced 8 findings across orchestrator/loaders/PE/liquidity; all 8 verified, fixed, and pushed in 3 grouped commits ending at HEAD 0280024 (391 tests green). Use as audit trail for what was found / how it shipped / where the regression tests live.
type: project
status: shipped
originSessionId: 6a810053-4668-4fc5-b1b6-73abb1a22b43
---
External review of `Warrenpoobear/asset-allocation` `main` at `fc85426` on 2026-05-05 (focused on runner/orchestrator, loaders, manifesting, PE pacing/reconciliation, liquidity coverage). Verified independently via Explore agent before any code changes — 7 of 8 claims TRUE, 1 PARTIAL (#4: upstream Optional-guard makes the divide reachable only via direct `PECallObligationBridgeDiagnostics` construction with `next_12m_capital_calls_usd=0.0`).

**Why:** External audit before relying on the model for production-style SFO runs. Findings spanned real bugs (#3, #4, #5), config-hash collisions across local overlays (#2), security hygiene (#1), schema discipline gaps (#6, #7), and an accepted-but-unused field (#8).

**How to apply:** When the same reviewer or a similar audit returns, treat these eight as closed. If a future change re-introduces any of these patterns, the regression test file `tests/test_review_fixes_2026_05_05.py` (plus the targeted assertions added to `test_pe_ta.py`, `test_phase19_pe_call_obligation.py`, `test_phase20_pe_call_reconciliation.py`, `test_manifest.py`) will fail loud.

## Findings → resolution map

| # | Severity | Finding | Fix | Commit |
|---|----------|---------|-----|--------|
| 1 | high | `--invocation-id` interpolated unchecked into `out_dir = base_dir / run_id` (path-traversal) | regex `^[A-Za-z0-9_-]{1,80}$` validation in `make_run_id()` (chokepoint — covers CLI, library, sweep) | `0280024` |
| 2 | high | `hash_study_config()` omitted `workbook_ingestion`, `position_ingestion`, `liquidity_obligations`, `liquidity_coverage_config`, `reconciliation_gates`, `distribution_producer` | additive include when not None — None-only configs hash unchanged (preserves existing reproducibility tests) | `d2d9e09` |
| 3 | high | TA model docstring claimed final-quarter liquidation but code only capped quarterly rate at 1.0; golden CSV ended with $7.98M residual NAV | force `distribution = nav_after_call` when `t == n_quarters - 1`; regenerate golden (terminal NAV now 0) | `021a408` |
| 4 | high (partial) | `total_delta_pct = abs(...) / max(wb, pe) * 100.0` could divide by zero when both totals were 0.0 | guard `denom > 0.0`, set pct to 0.0 otherwise | `021a408` |
| 5 | medium | `fund_count = len(top_contributors)` after `.head(5)` capped count at 5 | derive from `positive_fund_totals` before slicing; `top_contributors` still capped at 5 (reporting contract) | `021a408` |
| 6 | medium | `load_local_study_config` only normalized `position_ingestion.manifest_path` | also normalize `workbook_ingestion.workbook_path` and `position_ingestion.workbook_path` | `d2d9e09` |
| 7 | medium | `ReconciliationGatesConfig` lacked `extra="forbid"`; `LiquidityCoverageConfig` lacked bounds/order validation | add `extra="forbid"` to gates; `Field` bounds + `warning_threshold >= breach_threshold` validator on coverage | `d2d9e09` |
| 8 | medium | `LiquidityCoverageConfig.runway_horizon_quarters` accepted but never read | wire into `_build_diagnostics`: emit warning when `runway_quarters < horizon` (silent when runway is None) | `d2d9e09` |

## Commits (chronological on top of fc85426)

- `021a408` fix(pe): TA wind-down, fund_count cap, reconciliation div-by-zero
- `d2d9e09` fix(config): expand hash, resolve overlay paths, tighten policy schemas
- `0280024` fix(manifest): sanitize invocation_id against path traversal

## Test surface

391 tests green (was 371 pre-review per memory; +13 new regression tests, plus the rest are pre-existing). New file: `tests/test_review_fixes_2026_05_05.py`. TA golden CSV regenerated.

## Latent class to watch

Finding #3 was a docstring/code drift — the docstring described a guarantee the code did not deliver. Worth re-checking similar "force / always / cleanly" language in PE / liquidity / reconciliation modules during future reviews; if the comment makes a behavioral claim, write the assertion that proves it.
