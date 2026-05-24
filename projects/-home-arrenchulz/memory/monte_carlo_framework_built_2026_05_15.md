---
name: monte-carlo-liquidity-stress-framework-built-2026-05-15
description: "Full Monte Carlo framework (MC-0 through MC-3) delivered; synthetic/advisory only, awaiting L19/L20/Phase 23 for decision-grade status; 416 tests passing"
metadata: 
  node_type: memory
  type: project
  status: active
  expires: 2026-11-15
  related: 
    - asset_allocation_project_state.md
    - spec_095_ic_scope_gap_critical.md
  originSessionId: a2bfc1f5-9995-4977-9f51-b591f24f0713
---

## What Was Built

**Monte Carlo Liquidity Stress Framework — COMPLETE (2026-05-15)**

Four phases, 1,780 LOC, 25 acceptance tests, 416 total tests passing.

| Phase | Commit | Purpose | LOC | Tests |
|-------|--------|---------|-----|-------|
| MC-0 | `d2c3144` | Design lock — architecture, boundaries, synthetic scope | 400 | — |
| MC-1 | `478d902` | Simulation core — seeded paths, reproducible | 600 | 12 |
| MC-2 | `971379f` | Liquidity stress — paths → coverage metrics, breach | 330 | 5 |
| MC-3 | `9b34373` | Reporting — CSV, parquet, markdown, JSON artifacts | 450 | 8 |
| Docs | `7ba967d` | MODEL_DOCUMENTATION.md record | — | — |

## What It Does

**Input:** Monte Carlo config (return scenarios, spending shocks, PE call timing) + positions + obligations

**Output:** 
- monte_carlo_summary.csv — key metrics (breach probability, coverage percentiles, reserves)
- monte_carlo_paths.parquet — quarterly NAV/coverage/breach per path
- monte_carlo_report.md — narrative report with interpretation & caveats
- monte_carlo_manifest.json — audit trail (config_hash, fixture_hash, metrics)

**Standing guarantees:**
- Same seed + same config → byte-stable output (deterministic reproducibility)
- Opt-in only (never invoked without explicit `cfg.monte_carlo_config`)
- Deterministic liquidity coverage unaffected (existing reports unchanged)
- Advisory-only outputs (explicitly marked "not decision-grade")
- No global numpy.random state (seeded per-instance)

## Current Status: SYNTHETIC/ADVISORY

✅ **What's working:**
- Seeded stochastic path generation (MC-1)
- Per-path liquidity stress computation (MC-2)
- Breach probability and reserve estimation
- Full reporting pipeline (MC-3)
- 416 tests passing; no regressions

❌ **What's NOT ready for decisions:**
- Live client-data integration (awaiting L19, L20, Phase 23)
- Hard policy gates or decision automation
- Real manager terms, entity cash flows, RE stress calibration
- Fee modeling, tax effects
- Stochastic STAIRS enhancements

## Key Files

**Code:**
- `src/aa_model/monte_carlo/config.py` — MonteCarloConfig, ReturnScenario, SpendingScenario, CallTimingScenario
- `src/aa_model/monte_carlo/random_paths.py` — RandomPathGenerator (seeded, no global state)
- `src/aa_model/monte_carlo/result.py` — frozen dataclasses (MonteCarloPathResult, MonteCarloResult, Manifest)
- `src/aa_model/monte_carlo/runner.py` — compute_monte_carlo() entry point
- `src/aa_model/monte_carlo/liquidity_stress.py` — apply_monte_carlo_stress_to_positions()
- `src/aa_model/monte_carlo/reporting.py` — write_monte_carlo_artifacts(), summary/paths/report/manifest generators

**Tests:**
- `tests/test_phase_mc1_simulation_core.py` — 12 tests (seed stability, schema validation, zero-vol collapse)
- `tests/test_phase_mc2_liquidity_stress.py` — 5 tests (deterministic unchanged, opt-in, breach detection)
- `tests/test_phase_mc3_reporting.py` — 8 tests (CSV, parquet, markdown, JSON formats)

**Docs:**
- `docs/phase_mc0_design_lock.md` — 400-line architecture document (locked, non-negotiable)
- `MODEL_DOCUMENTATION.md` — Monte Carlo status and transition criteria (2026-05-15 update)

## How to Use It Now

```python
from aa_model.monte_carlo import (
    CallTimingScenario,
    MonteCarloConfig,
    ReturnScenario,
    SpendingScenario,
    compute_monte_carlo,
)
from aa_model.monte_carlo.liquidity_stress import apply_monte_carlo_stress_to_positions
from aa_model.monte_carlo.reporting import write_monte_carlo_artifacts

# 1. Create config
config = MonteCarloConfig(
    num_paths=100,
    horizon_quarters=12,
    random_seed=12345,  # For reproducible results; None for non-deterministic
    return_scenarios={
        "public_equity": ReturnScenario("public_equity", 0.07, 0.15, 0.05),
    },
    spending_scenarios={
        "base": SpendingScenario("base", 0.03, 0.01, None),
    },
    call_scenarios={
        "pe_buyout": CallTimingScenario("pe_buyout", [0.25, 0.5, 0.75, 1.0] + [1.0]*8, 2.5, 0.1),
    },
)

# 2. Generate paths
mc_result = compute_monte_carlo(
    config,
    initial_nav=1_000_000,
    initial_liquid_nav=200_000,
    annual_spend=50_000,
)

# 3. Apply stress
stress_by_path = apply_monte_carlo_stress_to_positions(
    mc_result,
    positions,  # list[PositionRecord]
    obligations,  # LiquidityObligationConfig
)

# 4. Write artifacts
artifacts = write_monte_carlo_artifacts(
    mc_result,
    output_dir="./monte_carlo_results",
)
# Produces: summary.csv, paths.parquet, report.md, manifest.json
```

## Advisory Language (Locked)

All reports include this standing caveat:

> "These Monte Carlo results are stochastic stress-test simulations using synthetic assumptions for return volatility, spending shocks, and call timing. They do not represent financial forecasts and are not actionable policy until:
> 1. Row-level cash-flow classifications are completed (L19).
> 2. Workbook capital-call reconciliation is validated (L20).
> 3. Real PE commitment plan and actuals are integrated (Phase 23).
> Current outputs reflect CMA long-term return assumptions and generic PE call hazard rates. Entity-specific cash flows are not yet modeled."

Do NOT remove or modify this language without explicit user approval.

## Transition to Decision-Grade

**Blocked by three client-data gates (all pending):**

1. **L19** — User must fill `data/external/workbook_v7_rule_authoring_pilot.csv` and complete row-classification workflow
2. **L20** — User must fix entity scoping (27a/27b) + header-row detection (entity_29) and validate workbook ingestion
3. **Phase 23** — User must gather PE commitment book (plan table, snapshot actuals, monthly actuals, entity registry)

Once all three are complete and validated:
- Deterministic spine (liquidity coverage, PE pacing, reconciliation gates) will be honest
- Monte Carlo can be wired into orchestrator (`cfg.monte_carlo_config` field on StudyConfig)
- Standard MC configs can be authored (conservative, base, aggressive)
- Reserve thresholds and breach gates can be calibrated to real data
- Outputs can be promoted from advisory to decision-grade

**Current expected timeline:** L19/L20/Phase-23 validation complete ~2026-05-26, then orchestrator wiring + live-data calibration by ~2026-06-30.

## Standing Rules (Load-Bearing)

**DO NOT violate these without explicit user approval in writing:**

1. **Opt-in always.** Monte Carlo is never invoked unless `cfg.monte_carlo_config` is explicitly set and not None.
2. **Outputs remain advisory** until L19/L20/Phase-23 validation complete. Standing caveat must appear in all reports.
3. **Zero global state.** No calls to `numpy.random.seed()` or `random.seed()`. All randomness seeded through explicit MonteCarloConfig.random_seed.
4. **Deterministic unchanged.** Existing liquidity coverage, PE pacing, and reconciliation layers must work identically whether Monte Carlo is invoked or not.
5. **No hard gates before validation.** Do not wire Monte Carlo breach thresholds into hard fail conditions or recommendation gates until live data validates.

## Known Limitations (By Design)

- **Synthetic fixtures only** — Monte Carlo uses CMA long-term return assumptions and generic PE hazard rates; no real position data, manager terms, or entity cash flows yet
- **No fee modeling** — spending paths do not deduct management fees, incentive fees, or tax impacts
- **No RE/OpCo stress calibration** — real-estate and operating-company distributions use placeholder assumptions
- **No stochastic STAIRS** — PE pacing uses deterministic base + timing multipliers; future enhancement to model regime-dependent returns
- **No Monte Carlo orchestration yet** — separate entry point `compute_monte_carlo()`, not yet wired into standard `run_orchestrator()` workflow
- **Advisory-only** — outputs are not machine-readable thresholds for automation until live validation complete

## Next Steps (Recommended Sequence)

**Pause Monte Carlo feature work.** Return to:

1. **L19 pilot** (Task #5) — fill row-classification worksheet, validate, inject
2. **L20 fixes** (Task #6) — entity scoping + header-row detection
3. **Phase 23 data gathering** (Task #7) — PE commitment book from client

After those three complete:
- Orchestrator wiring (add `cfg.monte_carlo_config` to StudyConfig)
- Live MC configs (conservative, base, aggressive with real data)
- Reserve/breach calibration (from live stress tests)
- Promotion to decision-grade (with full board review)

## Reference

- **Design lock:** `docs/phase_mc0_design_lock.md` (400 lines, architecturally frozen)
- **Status update:** `MODEL_DOCUMENTATION.md` (2026-05-15 entry)
- **Commit history:** `d2c3144` (MC-0) → `478d902` (MC-1) → `971379f` (MC-2) → `9b34373` (MC-3) → `7ba967d` (docs)
- **Tests:** 416 total (25 new for MC); all passing
- **Repository:** `/mnt/c/Projects/asset allocation/asset-allocation/` on origin `WR-SW-Dev/WR-asset-allocation`

## How to Describe This to Others

> "We have built the Monte Carlo liquidity stress framework. It can generate reproducible stochastic paths, apply them to liquidity coverage, and produce decision-support reports. Currently advisory-only — it should remain synthetic until the cash-flow, entity, and PE commitment data are validated through L19, L20, and Phase 23."

Or more concise:

> "Monte Carlo is built for synthetic stress testing. Not yet decision-grade. Awaiting L19/L20/Phase-23 validation before orchestrator wiring and live-data calibration."
