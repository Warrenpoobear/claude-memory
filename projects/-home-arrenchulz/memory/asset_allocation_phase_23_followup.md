---
name: Phase 23 PE commitment-book input layer — deferred until client data gathered
description: Phase 23 design locked at commit f81ff43 (origin/main, 2026-05-04); implementation deferred until user gathers commitment book + monthly actuals + entity registry data; resumption gating order is documented
type: project
status: stale
expires: 2026-08-04
related: [asset_allocation_project_state.md]
originSessionId: 07c7f16c-1bd1-4118-8676-c147be298ea3
---
Phase 23 design (PE real-data commitment input layer) is **locked at commit `f81ff43`** on `origin/main` (pushed 2026-05-04). Full design at `docs/phase_23_design_lock.md` (431 lines). Implementation is **deferred** — user is gathering required client data before building.

**Why:** The phase is a real-data ingestion layer. Building the loader / diagnostics / EntityRegistry without representative client data risks designing to the wrong shape (Archway monthly Position Reports specifically). User explicitly chose to lock the schema and tests against synthetic fixtures first, then come back when the client extracts are in hand. This is consistent with the project pattern: `design-lock → tighten → wait-on-prereq → implement`.

**How to apply:**
1. Do **not** start implementation without an explicit user go-ahead. The design lock satisfied gate 1 of the four implementation-gating conditions in the doc; gate 2 (no tightening in flight) is open until the user resumes.
2. When the user returns with client data, the locked dependency order is:
   - EntityRegistry adapter (`src/aa_model/ingestion/entity_registry.py`) — depends on workbook manifest + position manifest + optional local entity registry CSV/YAML
   - Synthetic fixtures for the commitment book (no live data)
   - Loader (`src/aa_model/ingestion/pe_commitments.py`) — depends on EntityRegistry
   - `PECommitmentBookDiagnostics` + report section
3. Inputs the user is gathering (locked schema in the design lock):
   - **Plan table**: per-fund `fund_key` (stable, URL-safe), `fund_id`, `manager_id`, `entity_id`, vintage, `commitment_usd`, sleeve (one of seven `pe_*` literals), commitment period dates, expected final liquidation date, status
   - **Snapshot actuals**: per fund per as-of date — called / distributed / NAV / unfunded; `source` in {client_statement, manager_portal, k1, audit, internal}; `confidence` in {actual, contractual, estimated}
   - **Monthly actuals**: Archway monthly Position Reports — per (fund_key, period_month) — call_usd / distribution_usd / nav_usd / unfunded_usd; `archway_monthly` is in the source enum
   - **Entity registry**: any one of (workbook manifest entity_ids / position manifest entity_ids / local entity registry file under `configs/entity_registry_local.yaml`)
4. Hard rules (load-bearing, do **not** drift on resumption):
   - `fund_key` is primary; `fund_name` / `manager_name` are display-only and local-private
   - Decimal everywhere in the new schema; convert to float only at the existing PE adapter boundary; do **not** refactor `FundConfig`
   - Phase 20 source precedence stays `explicit_config > cashflow_workbook > pe_pacing_model > unavailable`; the book feeds the `pe_pacing_model` side only
   - No live client data committed — fixtures synthetic only (e.g. `synthetic_fund_alpha`, `synthetic_manager_a`)
   - Local-private files (`*_local.{csv,yaml}`, anything under `data/external/`) stay gitignored
   - Projection anchoring from monthly actuals is **deferred** to a provisional Phase 24; do not silently expand Phase 23 to include it (re-tighten if it turns out to be small)
5. L-status on resumption: L19 / L20 stay unchanged. L21 (PE pacing realism) narrows but is **not** RESOLVED until projection anchoring lands.
6. Set this memory's `status` back to `active` when user signals data is ready, or update `expires` if the gathering window stretches past 2026-08-04.
