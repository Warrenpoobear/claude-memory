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

**State:** design-lock DRAFTED at `docs/phase_24_entity_study_design_lock.md` (status DRAFT — pending reviewer tightening). **NOT committed.** ~28 synthetic tests planned; 6 internal sub-steps under one lock. Numbering: this takes Phase 24; PE projection anchoring (prev provisional-24) → Phase 25. Next: reviewer tightening / SPEC amendment, then commit design-lock (docs-only) before any code. Extends [[asset_allocation_project_state]], [[asset_allocation_phase_23_followup]].
