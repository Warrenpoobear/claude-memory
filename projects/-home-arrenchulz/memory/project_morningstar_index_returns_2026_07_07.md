---
name: project-morningstar-index-returns-2026-07-07
description: "Morningstar Direct historical index-return ingestion pathway for the AA study model — built 2026-07-07, uncommitted in a worktree"
metadata: 
  node_type: memory
  type: project
  originSessionId: 09f65fb2-d353-4bb7-a04e-fe4e3926d2e5
---

Durable Morningstar Direct index-return ingestion for the Wake Robin asset-allocation model. Built 2026-07-07; **NOT committed** (user rule: no commit without explicit instruction).

**Location:** git worktree `/mnt/c/Projects/asset allocation/aa-morningstar` on branch `feat/morningstar-index-returns` off `main` (`372a6f2`). Created isolated so it can't tangle with the uncommitted Phase 24 work in the primary checkout `.../asset-allocation` (branch `feat/phase24-entity-fixture`). See [[asset_allocation_project_state]], [[project_jd_entity_study_2026_07_07]], [[feedback_asset_allocation_shared_checkout_2026_07_06]].

**Key finding:** the source workbook `Index Returns - June 30 2026.xlsx` (at `…/BCM Working Investment Committee/2026/July 6 2026 Meeting/Performance Worksheets/`, licensed/proprietary — never commit) is a **cross-sectional trailing-return snapshot** (1M/3M/6M/1Y/3Y-5Y-10Y-15Y-ann/inception per index), NOT a monthly time series. Return dates vary per row (modal 2026-03-31, NOT the filename's June 30; Credit Suisse/NCREIF/S&P-UBS-LevLoan/Galene are stale). User chose **long-by-horizon** normalized store; the `horizon=='1M'` slice = canonical monthly return.

**Files added:** `configs/morningstar_index_universe.yaml` (36 indices, byte-exact display names, morningstar_id null), `configs/asset_class_index_map.yaml`, `src/aa_model/ingestion/morningstar_schemas.py`, `src/aa_model/ingestion/morningstar_returns.py`, `scripts/import_morningstar_index_returns.py`, `tests/test_morningstar_index_returns.py` (17 tests, synthetic fixtures only), `docs/morningstar_index_returns_spec.md`; `.gitignore` extended (data/vendor/, data/normalized/*, reports/morningstar_*).

**Complements, does NOT replace,** the pre-existing live-daily-feed CMA adapter `aa_model.assumptions.benchmark_calibration` (uses `morningstar_feed` from `C:\Projects\morningstar`, 3 buckets, diagnostic-only). Live/API fetch for this export path **intentionally deferred** (documented TODO). No orchestrator wiring; no allocation changes.

**Status:** 17 new tests pass; full suite 397 passed / 6 skipped / **4 pre-existing cvxportfolio failures** (optional dep not installed — unrelated). Dry-run against real workbook: all 36 captured, 324 rows, 5 stale flagged. Next: user review → decide commit / integrate.
