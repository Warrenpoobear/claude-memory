---
name: project-jd-entity-study-phase-24-2026-07-07
description: "AA model — new Phase 24 entity-study workstream to deterministically reproduce the firm's 11-tab Wake Robin asset-allocation study for the J&D Trust; design-lock DRAFTED, not committed"
metadata: 
  node_type: memory
  type: project
  status: active
  created: 2026-07-07
  originSessionId: 7e4e3e0f-c930-464d-924a-c7a0a4688fbb
---

New AA-model workstream started 2026-07-07. Goal: give the model a first-class **entity** dimension and reproduce the firm's standard **Wake Robin 11-tab asset-allocation study** for a single entity, deterministically, from source docs the model already ingests.

**Pilot entity:** J&D Trust (Jim & Donna household; James W.F. Brooks Trust). Source template: `C:\Users\DarrenSchulz\...\Investment - Documents\Jim and Donna\JWB Trust Asset Allocation Study - 4.30.2026.xlsx` (as-of 04/30/2026, 11 tabs).

**User decisions (2026-07-07):** (1) **reproduce from source data** (compute the study; the `.xlsx` is blueprint + validation oracle) — NOT ingest-as-reference; (2) scope = **full 11-tab study** in one design-lock.

**11 tabs → model layers (all sources already targeted):** Balance_Sheet→NAV≠liquidity segmentation; Allocation-vs-Target→PublicAllocationConfig; Holdings_Detail→position ingestion (Ph15); PE_Alternatives→PE commitment book (Ph23); Liquidity_Lens→coverage (Ph16); Burn_Rate/Cash_Flow→spending (Ph12); Liquidity_Projection→quarterly ledger + Cashflow_v7 "J&D" tab; Fidelity_Recon→recon gates (Ph21). 7 Wake Robin policy classes (RE OpCo Stabilized, Real Estate, Equity, PE, Absolute Return, Fixed Income, Cash) = aggregation crosswalk over position `_ASSET_CLASS_LITERAL`.

**Key architecture finding:** a "study" today is one `StudyConfig`→one run with **NO top-level entity object**. Phase 24 adds `EntityStudyConfig` that *wraps* StudyConfig (no-entity path stays byte-identical). New: `EntityPolicyConfig` (7 classes), committed policy-class + liquidity-tier crosswalks, `EntityStudyResult` (pure data) + markdown & xlsx-11-tab renderers, local gitignored oracle harness vs the real `.xlsx`.

**Privacy (load-bearing):** committed design-lock is **generic/methodology-only** — NO client names/values/fund names/real entity_ids. All J&D specifics (config, manifests, oracle notes) live **gitignored-local** (`data/external/*_local`, `configs/*_local.yaml`). Same posture as Phase 14/23.

**State (2026-07-07):** design-lock DRAFTED at `docs/phase_24_entity_study_design_lock.md`. **Sub-step 1 IMPLEMENTED** (per user "start by making this workbook reproducible as an entity fixture" — deterministic entity perimeter/account-scope/balance-sheet-segmentation/PE-commitment-exposure). New package `src/aa_model/entity/` (`schemas.py` `EntityFixture`/`BalanceSheetSegmentRecord`/`PECommitmentExposureRecord`; `fixture.py` canonical_dict/canonical_json/content_hash/load_entity_fixture + `segment_totals`/`pe_exposure_totals` reducers). Money = `Decimal` (exact recon); reuses Phase-15 `AccountRecord`; investable segments carry 1 of 7 policy classes, structural NAV never investable (NAV≠liquidity). Synthetic committed fixture `data/fixtures/entities/entity_synth_a.yaml`; 17 tests in `tests/test_phase24_entity_fixture.py` (all pass; full suite 435 pass; ruff clean; byte-stable — no existing file touched).

**PR #6 MERGED to main 2026-07-07 (`a4fe4b1`) — entity dimension is LIVE.** Branch `feat/phase24-entity-fixture` had 5 commits:
- `ac7cfb4` sub-step 1: design lock + entity fixture (schemas/fixture/synth/17 tests).
- `2434f99` sub-step 2: core allocation lenses (balance_sheet/allocation_vs_target/liquidity + EntityPolicyConfig + liquidity_tier).
- `ff2edc3` PE tightening from J&D oracle (over-called funds; unfunded floors at 0).
- `5fe9935` SPEC amendment — entity dimension (Phase 24) per §11 "no deviation without amendment".
- `452cfb4` holdings-detail lens (position-level, reconciles to segments) + liquidity-projection lens (QuarterProjectionRecord roll-forward + chain continuity; trajectory/min/runway-breach signal). Full suite 453 pass.

**Holdings-ingestion wiring (2026-07-08, branch `feat/phase24-holdings-ingestion`, commit `cbe1d46`, NOT pushed):** `entity/crosswalk.py` (asset_class+bucket→policy class, RE disambiguated; bucket→tier; fail-loud on infra/commodity/direct_operating/other) + `entity/bridge.py` `holdings_from_positions()` (Phase-15 PositionRecord→HoldingRecord, float→Decimal at boundary, URL-safe deduped keys). 28 synthetic tests. Path: Investment Summary → Phase-15 ingest → bridge → holdings_detail_lens. Real-data oracle (J&D Holdings_Detail tab, 47 positions): **all 6 classes reconcile to the penny** (real_estate/equity/PE/absolute_return/fixed_income/cash each subtotal == investable segment, Δ=0.00; holdings total = $39.245M investable base).

**J&D ORACLE (real workbook, gitignored `data/external/entity_jd_local.yaml`, 12 segments/23 funds/28 projection quarters/47 holdings):** balance-sheet investable/structural/**total NAV reconcile to the penny**; **Σ PE commitment reconciles to the penny**; **liquidity projection Q1 2025–Q4 2031 reproduces exactly**; **holdings detail all 6 classes reconcile to the penny** (roll-forward + chain continuity hold, zero adjustment residual; trajectory ~$7.57M→~$50.3M, min ~$8.07M @2025Q1, no runway breach). Finding: **3 funds over-called** (paid-in > commitment, recallable) → workbook "Remaining Commit" negative. So schema tightened: dropped `called ≤ commitment`; unfunded is floor-0 = max(0, commit−called). Net commit−called ~$1.0M vs workbook ~$1.01M note (consistent). Full suite **453 pass**, ruff clean, byte-stable. Local build script: scratchpad `build_jd_fixture.py` (reads Balance_Sheet C-col, PE_Alternatives B–F, Liquidity_Projection r5/r19 + r6–18 line items → gitignored fixture; NEVER committed, no $ echoed).

Numbering: takes Phase 24; PE projection anchoring (prev provisional-24) → Phase 25. Real fixture never committed (data/external/* gitignored). Next options: push + PR the branch; OR continue — holdings-detail lens + cash-flow/liquidity-projection lenses (need Phase-15 position ingestion + Cashflow_v7 J&D tab wired to entity); OR reviewer tightening / SPEC amendment. Extends [[asset_allocation_project_state]], [[asset_allocation_phase_23_followup]].
