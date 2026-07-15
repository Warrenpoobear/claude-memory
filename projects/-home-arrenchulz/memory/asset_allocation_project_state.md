---
name: Asset allocation project state + next move
description: Wake Robin SFO model — Phases 1–22 + 14.3 + MC-0…MC-3 + Morningstar CMA + Phase 24 entity dimension + Phase 26 purpose lens shipped. HEAD d1277dc (2026-07-15, 574 tests, ruff clean), main clean & synced. May-05 governance flag RESOLVED (fc04aeb); doc-as-spec now docs/MODEL_DOCUMENTATION.md. L19 PARTIALLY RESOLVED (Phase A human authoring pending); Phase 23 design locked, deferred until user gathers client data; next: fill pilot CSV → "go — validate completed pilot row-classification worksheet"
type: project
status: active
originSessionId: 44856c6e-4397-4a8a-899b-f2984a0bd7c1
---
## Project location + scope

`/mnt/c/Projects/asset allocation/asset-allocation/` — Python 3.12.3, venv at `.venv/`, GitHub **`WR-SW-Dev/WR-asset-allocation`** (remote renamed from Warrenpoobear/asset-allocation; verified from push output 2026-07-14). Repo dir name unchanged.

**Authoritative scope: `PROJECT_SCOPE.md`** (root, locked 2026-05-02 commit `69cae5c`). Project codename in docs only: **Wake Robin Liquidity Architecture** (diagram at `docs/wake_robin_liquidity_architecture.png` / `.svg`). Model is for a **Gen3–Gen5 single-family-office** balance sheet — seven layers: Entity, Account/Position, Cash-flow, PE pacing, RE+OpCo, Liquidity, Allocation/Policy.

**Standing principle (load-bearing for every spending / liquidity / RE phase):**
```
NAV is not liquidity.
Appraisal value is not spending capacity.
OpCo value is not automatically distributable capital.
Development and land assets require separate capital-need and monetization assumptions.
```

`docs/MODEL_DOCUMENTATION.md` (moved from root 2026-07-14, `c8e1e55`; single copy) remains authoritative for **how** the model is built; `PROJECT_SCOPE.md` is authoritative for **what** the project is for. Designed PDF export tracked alongside it; regen via `node data/external/model_doc_export/render_pdf.mjs`.

## External read-only integration targets (NEVER committed)

- `Cashflow Modeling v7.xlsx` — `C:\Users\DarrenSchulz\Brooks Capital Management\Accounting - Documents\Cashflow\` — canonical for Cash-flow + Entity layers. v7 has 43 sheets total. **Layout finding:** entity-style sheets place quarterly headers on **row 4** in `q_yyyy` format ("Q1 2025"-style); aggregate / display sheets repeat row labels across sub-sections (must be `display_only`).
- `Investment Summary for Categorization March 2026.xlsx` — `C:\Users\DarrenSchulz\Brooks Capital Management\Investment - Documents\` — canonical position universe (Phase 15 territory; not yet started).

Live values, person names beyond entity types, and forecast tables are out of scope for repo artifacts. `HERMES_TRACKING.md` **is tracked and regularly committed** (`docs(tracking): MODE A sync …` commits on main; the earlier "keep it untracked / don't touch" note was superseded long ago — committing tracker syncs when asked is normal, e.g. `469ef69` 2026-07-14). Don't casually edit it during unrelated model work, but syncs are legitimate commits.

## State at 2026-07-06 (Monte Carlo + Morningstar CMA calibration shipped) — superseded by §Session 2026-07-14 below

- **`origin/main` @ `98295ca`** (2026-07-06 09:44) — `fix(monte_carlo): make per-path seed derivation cross-process stable (#1)`. Working tree clean; `main` fully synced with `origin/main` (0 unpushed). **423 tests collected** (up from 391 at `0280024`).
- **Monte Carlo module NOW SHIPPED (MC-0…MC-3).** This closes the long-standing **L2 open-architecture item** (previously "deferred until deterministic SFO layers honest"). Post-merge hardening PRs: `580521f` #3 — required reserves via **closed-form solve** (not proxy); `98295ca` #1 — per-path seed derivation **cross-process stable**; `22aceb9` #4 — docs schema comment fix.
- **Empirical CMA calibration from Morningstar benchmark feed merged** (`cbff447` merge; `d2e3da1` feat; `24fe8b7` ruff). ⚠️ This is the adapter a **parallel Claude session independently built the identical version of** — see [[feedback_asset_allocation_shared_checkout_2026_07_06]]. Consumes the `morningstar_feed` pip package + `datasets.json` (see [[reference_morningstar_benchmark]]).
- Prior recorded state below (`0280024`, 391 tests, 2026-05-05) remains accurate for everything through Phase 22 + the external-review triage; the two items above are the delta since then. Phase 23 still DEFERRED (design lock unchanged).

## State at 2026-05-05 (post external-review triage, all pushed)

- **`origin/main` @ `0280024`** — 2026-05-05 external review triage (3 grouped commits). 391 tests, all green. Working tree clean.
- Triage chain on top of `fc85426`: `021a408` fix(pe) — TA final-quarter liquidation (golden CSV regenerated, terminal NAV now 0), fund_count derived from full positive-fund set (was capped at 5 by accident), reconciliation zero-denominator guard. `d2d9e09` fix(config) — `hash_study_config` covers Phase 13–21 optionals when set (additive; None-only configs hash unchanged), overlay loader normalizes both `workbook_ingestion.workbook_path` and `position_ingestion.workbook_path`, `ReconciliationGatesConfig` gets `extra="forbid"`, `LiquidityCoverageConfig` gets `Field` bounds + `warning>=breach` validator, `runway_horizon_quarters` wired into warnings list. `0280024` fix(manifest) — `make_run_id` validates `invocation_id` against `^[A-Za-z0-9_-]{1,80}$` (path-traversal sanitization).
- New regression test file: `tests/test_review_fixes_2026_05_05.py`.

## State at 2026-05-04 (post-Phase-22 + 14.3 + Phase-23 design lock, all pushed)

- **`origin/main` @ `f81ff43`** (Phase 23 design lock — docs-only). All Phase 19/20/21/22/14.3 commits + Phase 23 design lock PUSHED. Working tree clean.
- Latest chain: `af58dd3` Phase 19 → `a5114f6` Phase 20 → `412e1ee` Phase 21 → `a6db960` Phase 22 → `82ce2ec` Phase 14.3 → docs/lint sweeps → `07327e1` (post-Phase-21 sync) → `f81ff43` Phase 23 design lock (2026-05-04).
- **Phase 23 implementation DEFERRED.** Design locked at `docs/phase_23_design_lock.md`; user gathering client commitment book + Archway monthly actuals + entity registry data before implementation. See `asset_allocation_phase_23_followup.md` for resumption gating.
- **Test count: Phase 17/18/19/20/21 targeted: 35/35 pass + 4 pre-existing cvxportfolio failures** (unrelated to any of these phases).
- The **L19 thread's full lineage** spans these commits: design + impl pairs for Phase 12 (`33307d5` / `92c327d`), Phase 12.5 (`63ec0ef` + `7505770` / `9e77fb1`), Phase 13 (`89ab712` + `345f964` / `efbfcf1`), Phase 14 (`52721fb` + `cdd73c4` / `2534834`), Phase 14.1 (`a88253c`), scaffold (`bf9d4bf`), Phase 14.2 (`28d8e60`), through Phase 17 (`af947f1`).
- **Three local-private artifacts under `data/external/` + `configs/workbook_v7_manifest_local.yaml`** — all gitignored, never committed:
  1. `configs/workbook_v7_manifest_local.yaml` — 43 declarations matching v7 (3 family_aggregate / 5 board_snapshot / 35 entity_sheets [2 display_only + 33 horizontal_quarter])
  2. `data/external/workbook_v7_classification_checklist.csv` — 35 entity_sheet rows; 33 need `row_classification_rules`; 0 missing-header issues
  3. `data/external/workbook_v7_row_label_export.csv` — 437 row labels across 33 sheets; 93 subtotal candidates; 1,197 blank/spacer rows skipped

## L-status

- **RESOLVED**: L4 (Phase 5) · L6 (Phase 6) · L8 (Phase 8) · L13 (Phase 4b) · L15 (Phase 4a) · L16 (Phase 11) · L18 (Phase 4a)
- **PARTIALLY RESOLVED**: L1 (Phase 7, engine-conditional) · L14 (Phase 10, scope-conditional) · **L19 (Phase 12 + 12.5 + 13 + 14 + 14.1 + 14.2; full ingestion stack + discovery scraper + manifest scaffold; pending only operational classification + reconciliation)** · **L2/liquidity coverage (Phase 15 + 16 + 17 + 18 + 19 + 20 + 21; capital_call_coverage deterministic via PE pacing bridge; reconciliation gates + policy thresholds wired; pending Monte Carlo gate)**
- **RESOLVED (2026-05-03)**: L20 — workbook-driven capital-call obligation source confirmed (source_used="cashflow_workbook", capital_call records > 0 in next-12m window, nonzero obligation). PE pacing serves as reconciliation cross-check. Live values remain local/private.
- **ACCEPTED LIMITATION**: L3 · L7 · L9 · L11 · L12 · L17
- **ENVIRONMENT NOTE**: L10
- **OPEN — architecture**: L2 (Monte Carlo gate; deferred until deterministic SFO layers honest)
- **OPEN — schema**: L5 (`flow_id` upgrade; rides a future phase)
- **OPEN — operational**: L19 production realism gate (see "Remaining L19 gate" below)

## L19 governance statement (current as of 2026-05-03)

```
Phase 12:    spending base denominator can exclude paper NAV
Phase 12.5:  distributable_income consumer-side infrastructure exists
Phase 13:    config-driven producer exists
Phase 14:    workbook-driven producer + ingestor exist (read-only)
Phase 14.1:  workbook layout discovery support (header_row_index,
             period_header_format per-sheet, display_only)
Phase 14.2:  discovery scraper + draft-manifest generator (CLI)
scaffold:    configs/workbook_v7_manifest.yaml committed (template)
local artifacts: configs/workbook_v7_manifest_local.yaml +
                 data/external/*.csv (all gitignored)
Phase 15:    position ingestion (StudyConfig.position_ingestion field;
             load_position_manifest() helper in ingestion layer)
Phase 16:    liquidity coverage (compute_liquidity_coverage engine)
Phase 17:    StudyConfig orchestration wires Phase 15 + Phase 16;
             new fields: position_ingestion, liquidity_obligations,
             liquidity_coverage_config; _run_liquidity_coverage()
             orchestration helper; render_coverage_report_section()
             updated with explicit spending_base_mode parameter
             HERMES_TRACKING.md excluded (local unstaged, intentional)
Phase 18:    SpendingBaseBreakdown bridge into liquidity coverage;
             _normalize_bool_keyed_dict + _extract_spending_base_for_coverage
             in orchestrator; liquid_to_spending_base and
             liquid_nav_to_annual_income_estimate now populated from
             Owl diagnostics when year-boundary snapshot exists;
             bootstrap + run-too-short advisories injected
Phase 19:    PE pacing → next-12m capital-call obligation bridge;
             derive_pe_capital_call_obligation in pe/call_obligation.py;
             capital_call_coverage now deterministically populated from
             forward PE projections (T4: no unfunded × heuristic);
             override precedence: explicit | pe_pacing | unavailable;
             PECallObligationBridgeDiagnostics threaded to report
Phase 20:    PE call-obligation reconciliation to cash-flow worksheet
             (commit a5114f6); source precedence:
             explicit_config > cashflow_workbook > pe_pacing_model > unavailable;
             WorkbookCallReconciliationDiagnostics replaces
             PECallObligationBridgeDiagnostics in report surface.
             L20 NOT RESOLVED — live workbook run confirming
             source_used="cashflow_workbook" still required (authoring
             category="capital_call" rules in local manifest is the gate).
Phase 21:    Reconciliation gates / policy thresholds (commit 412e1ee);
             ReconciliationGatesConfig, ReconciliationGateResult,
             ReconciliationGateError added; default mode: blocking →
             requires_override; hard_fail is opt-in; explicit_config
             bypasses enforcement; StudyConfig.reconciliation_gates added.
```

PARTIALLY RESOLVED — production realism still depends on:
1. Human authoring `row_classification_rules` for 33 entity_sheets locally (the remaining L19 blocker)
2. Live ingestion run against the completed local manifest
3. Reconciliation review (board-snapshot deltas advisory only)
4. Narrowed L19 RESOLVED wording: "RESOLVED for modeled distributable-income ingestion; legal / tax / entity-governance distributability remains out of scope"

L20 gate: author category="capital_call" rules in `configs/workbook_v7_manifest_local.yaml`, then run live ingestion to confirm source_used="cashflow_workbook" in WorkbookCallReconciliationDiagnostics output.

**The blocker has moved from scraping to human classification.** No further code is needed before that step. The model can ingest a completed local manifest immediately.

## Automation boundary (load-bearing design decision)

**Automatic** (Phase 14.1 + 14.2):
- Sheet discovery, role/layout detection, row-4 quarterly header detection, q_yyyy period format, horizontal_quarter vs display_only, draft manifest generation, row-label export, privacy-safe redaction

**NOT automatic — human classification required:**
- Whether a row is legally distributable
- Whether cash is restricted
- Whether an OpCo cash flow is available to the family office
- Whether a row is recurring or one-time
- Whether a row should become distribution_inflow
- Tax or entity-governance interpretation

**Schema enum values for classification (RowClassificationRule):**
- direction: `inflow` | `outflow`  (no "internal" — use ignore/exclude)
- recurrence_type: `recurring` | `one_time` | `unknown`  (no "variable")
- certainty: `actual` | `contractual` | `forecast` | `scenario`
- domain: `real_estate` | `opco` | `entity` | `portfolio` | `development` | `land`
- Mapping: operating→opco, trust→entity, investment→portfolio, other→entity

**Pilot workflow:**
1. Fill `data/external/workbook_v7_rule_authoring_pilot.csv` (234 rows, 209 TODO, gitignored)
2. Send `go — validate completed pilot row-classification worksheet`
3. If clean, apply pilot rules to manifest (requires explicit approval)
4. Validate pilot ingestion before expanding to all 33 sheets

## Remaining L19 gate (ordered)

1. **Human authors `row_classification_rules`** for 33 horizontal_quarter entity sheets, working from `data/external/workbook_v7_row_label_export.csv` and editing `configs/workbook_v7_manifest_local.yaml` directly. Per-row tuple: `(direction, distributable_candidate, restricted, recurrence_type, certainty, domain)`. Subtotal candidates excluded via the manifest's `subtotal_label_patterns` or simply not mapped into rules.
2. **Validate completed local manifest** via `WorkbookManifestConfig.model_validate`. Aggregate-only diagnostics (sheets covered, rules per direction / domain / recurrence / certainty).
3. **Run live ingestion** with the workbook + completed local manifest.
4. **Review reconciliation deltas** + unmatched lines.
5. **Narrow L19 wording** to RESOLVED-with-caveats per reviewer guidance.

Path 2 has a staged Claude prompt the user supplied; it is NOT yet invoked.

## Privacy posture (load-bearing across all L19 work)

- The workbook (`Cashflow Modeling v7.xlsx`) is **never committed**, **never mutated**.
- Live values, dollar amounts, formulas, row contents, and person identifiers **never paste into chat**.
- Sheet names that decode to family-internal abbreviations are redacted in any committed artifact.
- Local-private artifacts (`*_local.yaml`, `data/external/*`) are gitignored at `.gitignore:30` and `.gitignore:48` (verified via `git check-ignore`).
- Every CLI / probe / export confirms gitignore membership BEFORE writing.
- Phase 14 RT4 + Phase 14.2 RT discipline: tests use synthetic-only fixtures; no real workbook data committed.
- Privacy fixes shipped in Phase 14.1: `IngestionDiagnostics.unmatched_lines_sample` redacted (row position only); duplicate-row ValueError redacted (label LENGTH only, not content).

## Phase 14.x implementation surface (Phase 15+ context)

**Schema (`io/schemas.py` + `ingestion/schemas.py`):**
- `WorkbookManifestConfig` — workbook_version (URL-safe required), expected_workbook_filename, default_header_row_index (Phase 14.1), period_header_format, family_aggregate_sheets, board_snapshot_sheets, re_partnership_sheets, entity_sheets, subtotal_label_patterns
- `EntitySheetSpec` — sheet_name, entity_id (URL-safe, no colons), entity_type (10-value Literal), display_name, parent_entity_id, cash_flow_role, row_classification_rules, header_row_index (Phase 14.1 override), period_header_format (Phase 14.1 override), layout_type (horizontal_quarter | display_only)
- `RowClassificationRule` — row_label_pattern, direction, category, domain (optional), distributable_candidate, restricted, recurrence_type, certainty
- `EntityRecord` / `CashFlowLineRecord` — normalized output rows (sign convention enforced at construction)
- `IngestionDiagnostics` — workbook_hash, formula_cache_caveat (standing, RT1), board_snapshot_reconciliations (advisory, RT3), unmatched_lines_sample (label-redacted, RT2)

**Ingestor (`ingestion/workbook.py`):**
- `ingest_workbook(workbook_path, manifest, *, manifest_version)` — read-only via openpyxl(read_only=True, data_only=True, keep_links=False); SHA256 hash for provenance; per-sheet header_row_index honored; layout_type=display_only short-circuits; reconciliation advisory-only; never raises on a delta
- `workbook_lines_to_producer_config(result, manifest)` — bridge: producer_id = `f"{workbook_version}__{sheet}__{row_label}__{quarter}"` (anchored on workbook_version per Phase 14 RT2; hash NOT in producer_id)

**Producer (`producers/distribution.py` + `ingestion/workbook_producer.py`):**
- `make_distribution_producer(cfg, *, engine)` — `engine="config"` (Phase 13) or `engine="workbook"` (Phase 14)
- `WorkbookDrivenProducer` delegates to `ConfigDrivenProducer` on the bridge-derived config

**Discovery (`ingestion/discovery.py`, `ingestion/discover_workbook.py`):**
- `discover_workbook(path)` — read-only structural scrape; HeaderCandidate scan rows 1-15; role classification by keyword + shape; layout_type horizontal_quarter / display_only; manifest-level majorities
- `build_draft_manifest(discovery, *, mode, workbook_version)` — privacy_safe (default) or local_private; row_classification_rules deliberately empty (TODO)
- CLI: `python -m aa_model.ingestion.discover_workbook --workbook PATH --mode {privacy_safe,local_private} [--out PATH] [--dry-run]`. local_private path-safety: refuses non-`_local.yaml` and non-`data/external/` outputs.

**Orchestrator wiring (post-Phase-17):**
- `cfg.workbook_ingestion: WorkbookIngestionConfig | None` on StudyConfig (default None)
- `cfg.distribution_producer: DistributionProducerConfig | None` on StudyConfig (default None)
- workbook_ingestion takes precedence over distribution_producer when both are set
- `cfg.position_ingestion: PositionIngestionConfig | None` on StudyConfig (Phase 15/17, default None)
- `cfg.liquidity_obligations: list[LiquidityObligation] | None` on StudyConfig (Phase 16/17, default None)
- `cfg.liquidity_coverage_config: LiquidityCoverageConfig | None` on StudyConfig (Phase 16/17, default None)
- `_run_liquidity_coverage(cfg, positions, ...)` orchestration helper dispatches Phase 16 engine
- **Phase 18 shipped:** spending_base bridged from Owl diagnostics; liquid_to_spending_base and liquid_nav_to_annual_income_estimate populated. **Phase 19 shipped:** pe_call_obligation_usd derived from pe_proj next-4-quarter window; _build_ledger returns 11 elements (pe_call_bridge_diag); capital_call_coverage deterministic. **Phase 20 shipped:** source precedence explicit_config > cashflow_workbook > pe_pacing_model > unavailable; WorkbookCallReconciliationDiagnostics replaces PECallObligationBridgeDiagnostics. **Phase 21 shipped:** ReconciliationGatesConfig + ReconciliationGateResult + ReconciliationGateError; blocking default with opt-in hard_fail; StudyConfig.reconciliation_gates field added.

**Report (`integration/report.py`):**
- `## Workbook ingestion (advisory)` — workbook hash, version, manifest version, sheet counts, row counts, per-entity totals, board-snapshot reconciliation deltas (advisory only), distribution candidates by domain, restricted exclusions, unmatched lines, standing CAVEAT for cached-formula stale-state risk (Phase 14 RT1)
- Composes with Phase 12.5 `## Owl spending base (advisory)` and Phase 13 `## Distribution producer (advisory)`

## Adapter governance contract (FIVE families locked, post-Phase-14; Phase 17 adds orchestration surface)

AllocationAdapter (stub/riskfolio/cvxportfolio) · ImplementationAdapter (stub/cvxportfolio) · SpendingRule (FlatReal/Smoothing/Owl) · PEAdapter (TA/STAIRS) · **DistributionProducer (config / workbook)** · **LiquidityCoverage engine (Phase 16; StudyConfig-orchestrated via Phase 17)**.

## Operational checkpoints

- Phase 14.1 layout probe (`/tmp/phase14_layout_probe.py`) — diagnosed v7's row-4 + q_yyyy layout; not committed; produced the schema extension justification.
- Phase 14.2 live discovery (privacy_safe dry-run) — 42 of 43 sheets parseable under the new knobs (vs. 4 of 43 under Phase 14 row-1 assumption); detected_format_majority=q_yyyy, header_row_majority=4; 33 redacted of 43.
- Local manifest validation — `WorkbookManifestConfig.model_validate` passes; 43 declarations match.
- Classification checklist — 33 horizontal_quarter entity_sheets need `row_classification_rules`; 0 missing-header orphans.
- Row-label export — 437 labels across 33 sheets; 93 subtotal candidates; 1,197 blank/spacer rows skipped.
- Phase 17 targeted: 9/9; Phase 18 targeted: 8/8; Phase 19 targeted: 6/6; Phase 20 targeted: 8/8; Phase 21 targeted: 12/12; Phase 14.3 targeted: 8/8; full suite: **332 passed, 6 skipped** (non-cvxportfolio).
- Phase 17 `af947f1` + Phase 18 `5acfd0a` + Phase 19 `af58dd3` + Phase 20 `a5114f6` + Phase 21 `412e1ee` + Phase 22 `a6db960` + Phase 14.3 `82ce2ec` all pushed to origin/main.

## Audit cadence

User runs design-review-then-implement cycles via external reviewer. Pattern verified across Phase 11 → 12 → 12.5 → 13 → 14 → 14.1 → 14.2 → 15 → 16 → 17: design-lock + tightenings → implementation. Each design-lock typically receives a tightening pass as a separate docs-only commit before implementation.

## Working-tree hygiene

- `HERMES_TRACKING.md` has shown as modified across multiple sessions; do NOT touch it.
- `data/external/*` and `configs/*_local.yaml` are gitignored zones for sensitive workbook-derived artifacts.
- The 12 user dirty files from prior sessions have been resolved into `aa5bc32` (chore lint commit) and other user-authored commits.

## Local config state (2026-05-03)

`configs/base_local.yaml` created (gitignored). Local overlay format with:
- `extends_from: configs/base.yaml`
- `workbook_ingestion` → Cashflow Modeling v7.xlsx + `manifest_path: configs/workbook_v7_manifest_local.yaml`
- `position_ingestion` → Investment Summary March 2026.xlsx + `manifest_path: configs/investment_summary_manifest_local.yaml`

Validation PASS (inline script): base.yaml parses, both workbook files found, both manifests validate against WorkbookManifestConfig and PositionManifestConfig. No study run yet.

**Pending before L20 live run:** `load_local_study_config()` loader extension (reads manifest_path → inline dict, constructs StudyConfig with workbook_ingestion + position_ingestion populated). `run_orchestrator` would then point at `base_local.yaml`.

## Phase 22 shipped (2026-05-03)

`compute_manager_terms_diagnostics()` in `src/aa_model/liquidity/manager_terms_diagnostics.py`. 15 tests in `tests/test_phase22_manager_terms_diagnostics.py`. Wired into `_build_ledger` (12th return element) and `write_markdown_report`. Full suite: 324+6 skipped (non-cvxportfolio), 15 new Phase 22 tests all pass.

## L20 live validation status (2026-05-03)

**Infrastructure complete:**
- `load_local_study_config(local_path)` implemented in `src/aa_model/io/loaders.py` — resolves `manifest_path`, builds `WorkbookIngestionConfig(manifest=dict)` + `PositionIngestionConfig`. All assertions pass.
- `workbook.py` epoch guard fix: `_parse_period_header` for `calendar_qe` now rejects years outside 1990–2060 (prevents `pd.Timestamp(0)` = `1970Q1` from formula-zero header cells).
- Full workbook ingestion (all 35 entities) succeeds without crashes: 699 lines, 0 errors.
- Capital_call rules authored for entity_27/28 in `configs/workbook_v7_manifest_local.yaml`.

**Capital_call records: 0 (blocked by two issues):**
1. entity_27 (PB Westplan) + entity_28 (PB Westplan v2): currently `display_only`. Root cause: two investor sections with identical deal-name row labels → dedup collision. **Phase 14.3 now ships `row_range` scoping** — fix is to replace entity_27 with entity_27a (row_range=[5,44]) + entity_27b (row_range=[47,94]) in `configs/workbook_v7_manifest_local.yaml`. Exact row numbers require opening the sheet in Excel to verify section boundaries. Same pattern for entity_28.
2. entity_29 (2025 Actual): `header_row_index: 12` is wrong — row 12 contains raw dollar amounts, not period header dates. The actual period header row (with calendar quarter-end dates) is in a different row. Fix requires opening the sheet in Excel to find the row containing "3/31/2025", "6/30/2025"-style dates.

**`calendar_qe` entities (01, 04, 23, 29): produce 0 lines.** The header rows for these entities in the v7 workbook don't contain parseable calendar dates. The `header_row_index` values in the manifest may be wrong for some of these (confirmed for entity_29: row 12 has dollar amounts).

**Next steps for L20 capital_call gate:**
1. Open entity_27 (PB Westplan) sheet in Excel → find row boundaries for section 1 (Westplan partners) and section 2 (SE Holland) → replace entity_27 with entity_27a (row_range=[?, ?]) + entity_27b (row_range=[?, ?]) in local manifest; same for entity_28
2. Restore `layout_type: horizontal_quarter` on the scoped specs; confirm capital_call rules apply
3. Open "2025 Actual" sheet in Excel → find the row with calendar quarter-end dates → update `header_row_index` for entity_29 (current value 12 is wrong — row 12 is a data row); entity_29 is monthly 2025-only so may still produce 0 lines
4. Run live ingestion probe → confirm capital_call records in coverage window
5. Run full orchestrator via `load_local_study_config` → confirm `source_used="cashflow_workbook"` in report

## Next moves (post-L20)

**Practical roadmap (locked 2026-05-03):**

1. Finish L19 row classification (pilot CSV → validate → inject → iterate → Phase E gate)
2. Validate full cash-flow workbook ingestion; keep L20 regression green (source_used=cashflow_workbook)
3. Build deterministic PE pacing from real fund commitment data (fund_id/manager_id/vintage/commitment/called/distributed/NAV/unfunded/curves/entity mapping)
4. Populate manager terms locally (lockups/notice/gates/side-pockets/fees/carry — Phase 22 already built)
5. Add stress/liquidity scenarios
6. Only then revisit Monte Carlo / L2

**Before Monte Carlo:** completed cash-flow classification + stable position universe + deterministic PE pacing + validated liquidity coverage + manager terms populated + reconciliation gates on real data.

**Deferred (not next):** semi-liquid redemption modeling, secondary-sale/haircut, fee-aware optimization, tax-aware cash flows, entity-governance restrictions, stochastic STAIRS, L5 PE-leg pairing.

**Next action:** fill pilot CSV locally → `go — validate completed pilot row-classification worksheet`.

## Audit cadence — staged prompts

The user's pattern after each phase ships: confirm PASS → stage the next prompt template in chat → wait for explicit "go". Do not invoke staged prompts without explicit invocation. Pattern verified across all L19-thread phases.

## Session 2026-07-14 — governance + docs housekeeping (all pushed, HEAD `19b4def`)

Five commits on main this session, all mine, all pushed directly (push hook no longer blocks this repo — see [[aa-ci-green-and-push-constraints-2026-07-07]]):
- `469ef69` tracker MODE A sync 2026-07-12 committed (550 tests, ruff clean, Phase 24).
- `3afd16b` + `f1b68fc` — user's designed model-doc PDF export tracked, then moved to `docs/`.
- `fc04aeb` — **68-day stale governance flag RESOLVED**: doc-as-spec entries written for the three
  2026-05-05 external-review fixes (`0280024` manifest invocation_id path-safety; `d2d9e09`
  config-hash expansion + overlay workbook_path resolution + gate/coverage schema tightening;
  `021a408` TA terminal wind-down to zero + fund_count uncapped + zero/zero delta guard).
  Tracker warning CLEARED by MODE A sync `94d843d` (2026-07-15): flag line now "RESOLVED
  2026-07-14 (fc04aeb, disposition (a)) — no open flags"; sync also notes doc-as-spec path change
  for any governance tooling grepping the old root path.
- `c8e1e55` — `MODEL_DOCUMENTATION.md` moved root → `docs/` (user instruction); README/CLAUDE.md/
  PROJECT_SCOPE path refs updated. docs/ copy never existed before this, contrary to old memory.
- `19b4def` — PDF export regenerated fresh (15pp): adds hardening + change-discipline sections,
  550-test stats, PE lifecycle figure redrawn from `tests/golden/ta_single_fund.csv` (which IS the
  $100M illustration, scale 1.0) as two panels (no dual axis). Pipeline: print-HTML + Playwright
  Chromium (`~/.cache/ms-playwright` chromium-1223, global @playwright/test), persisted gitignored
  at `data/external/model_doc_export/{model_doc.html,render_pdf.mjs}` — update HTML from md, then
  `node render_pdf.mjs`.

Also this session: Jim's Trust fixture v2 rebuild + artifact publish (see
[[project-jd-entity-study-phase-24-2026-07-07]]); `asset-alloc-status` skill rewritten with current
repo facts (was stale at HEAD 0280024/391 tests).


## Session 2026-07-15 — Phase 26 purpose lens shipped same day the tab appeared

- Tracker MODE A sync `94d843d` (cleared the resolved gov flag) → design lock `4364863` →
  **PR #18 squash-merged `d1277dc`**: purpose (goals-based) allocation lens per
  `docs/phase_26_purpose_allocation_design_lock.md`. Suite 550→**574**, ruff clean,
  no-purpose output byte-identical. Oracle 56/56 vs the workbook's new Purpose_Allocation tab.
  Detail in [[project-jd-entity-study-phase-24-2026-07-07]].
- Phase numbering: 25 = PE projection anchoring (reserved, unstarted); 26 = purpose lens (done).
- HERMES_TRACKING.md synced post-merge: MODE A sync #2 `23d9b9b` + count fixup `0f47dd1`
  (2026-07-15) — governance PASS, Phase 26 gate checked, no open flags. HEAD = `0f47dd1`.
- Ops lesson: pushing a NEW branch can exceed 2 min (pre-push ruff hook on /mnt/c is slow) —
  give push commands ≥5 min timeout before assuming failure.
