---
name: scientific_cartography_phase9_committed
description: Phase 9 Asset Indication Map diagnostic layer COMMITTED at 20e522fd
metadata: 
  node_type: memory
  type: project
  status: resolved
  committed_at: 2026-06-17
  commit: 20e522fd
  originSessionId: 94d82eeb-9e2a-435e-adc1-022456c22177
---

## Phase 9 Asset Indication Map — COMMITTED (2026-06-17)

**Commit:** `20e522fd` — Phase 9 Asset Indication Map diagnostic reference layer.

**Status:** LOCKED + OPERATIONALLY_READY

**Deliverables:**

### 1. asset_indication_map_schema.py
- `AssetIndicationMapRecord` (24 fields)
  - Maps company|ticker|asset → raw_indication → MONDO disease with Phase 8 enrichment
  - Fields: record_id, company_id, ticker, company_name, asset_id, asset_name, raw_indication, normalized_disease_name, mondo_id, therapeutic_area, parent_disease, mechanism_class, target, modality, clinical_stage, source_priority (1-9), source_type, source_refs, disease_ontology_confidence, overall_confidence, as_of_date, warnings
  - Governance: read_only_diagnostic=True, all production changes=False
  - to_dict() serialization for JSONL export

- `AssetIndicationMapCoverageReport`
  - Coverage metrics: total_records, unique_companies/tickers/assets/diseases, mapped/unknown disease counts
  - Distribution counts: by_source_type, by_source_priority, by_therapeutic_area, by_clinical_stage, with/without_ticker, with/without_mondo_id
  - Governance: all production changes=False
  - to_dict() serialization

### 2. asset_indication_map_builder.py
- `AssetIndicationMapBuilder` class
  - Initialized with as_of_date and DiseaseOntologyBuilder
  - `build_from_programs(programs: list[ProgramRecord])` → (list[AssetIndicationMapRecord], AssetIndicationMapCoverageReport)
  - Processing steps:
    - Calls Phase 8 DiseaseOntologyBuilder.build_from_raw_diseases() for each program's disease_name
    - Enriches record with mondo_id, therapeutic_area, parent_disease from Phase 8
    - Maps source_priority deterministically (1-9 scale via source_priority_map dict)
    - Generates deterministic record_id: SHA256(company_id|asset_id|raw_indication|mondo_id|source_type|as_of_date)[:16]
    - Computes overall_confidence = min(disease_ontology_confidence, program.confidence)
    - Adds warnings for unmapped diseases and missing tickers
    - Deduplicates by record_id in seen_record_ids set
  - `_build_coverage_report()` aggregates metrics across all records
  - Unknown disease preservation: mondo_id=None with warnings

### 3. test_phase9_asset_indication_map.py
- 15 comprehensive tests across 3 test classes
- **TestAssetIndicationMapSchema** (3 tests)
  - Record initialization, to_dict() serialization, coverage report init
- **TestAssetIndicationMapBuilder** (9 tests)
  - Builds record from program
  - Disease ontology enrichment (mondo_id, therapeutic_area)
  - Unknown disease preserved with warnings
  - Ticker/company fields preserved
  - Source priority assignment (deterministic)
  - Confidence capping with unknown disease
  - Same company-asset-disease relationships (multiple sources)
  - Different assets not collapsed
  - Different diseases not collapsed
- **TestCoverageReport** (3 tests)
  - Unique value counting
  - Source type distribution
  - Governance flags (all production changes=False)

**Test Results:** 15/15 PASS

**Integration:** Phase 8 + Phase 9 = 37/37 PASS

**Governance:**
- READ_ONLY_DIAGNOSTIC: True
- REFERENCE_MAPPING_LAYER_ONLY: True
- All production changes (ranker, selector, sizing, final_score, alpha): False
- No production model wiring
- Cache-only, point-in-time safe

**Deduplication Strategy:**
- By record_id hash: company_id|asset_id|raw_indication|mondo_id|source_type|as_of_date
- Preserves multiple sources (one record per distinct source)
- Deterministic and reproducible

**Next Phase:**
- Phase 7B production hook activation (manual, non-blocking)
- Phase 10+: Portfolio integration decision gate (pending operational use validation)
