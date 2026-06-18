---
name: scientific_cartography_v0_1_phase_0_1
description: Scientific Cartography Layer v0.1 Phase 0/1 implementation complete — read-only diagnostic skeleton with DiseaseNormalizer and StageNormalizer
metadata: 
  node_type: memory
  type: project
  status: resolved
  completed_date: 2026-06-17
  originSessionId: 2939d787-8865-47fd-905a-06d889a9f688
---

## Completion Summary

Scientific Cartography Layer v0.1 completed Phase 0 + Phase 1 as a standalone read-only diagnostic module.

## Deliverables

**Package Structure**:
- `scientific_cartography/` package with organized subdirectories (schemas/, normalize/, build/, ingest/, export/, qa/)
- CLI shell with build/qa commands
- README.md, GOVERNANCE.md, PHASE_0_1_SUMMARY.md documentation

**Schemas (Phase 0)**:
- DiseaseRecord dataclass with disease_id, raw_name, normalized_name, mondo_id, therapeutic_area, confidence, source_refs, as_of_date
- ProgramRecord dataclass with asset/company/disease/stage/mechanism fields, to_dict/from_dict serialization

**Normalizers (Phase 1)**:
- **DiseaseNormalizer**: manual override CSV support (highest priority) → MONDO exact/synonym match → case-insensitive → unknown preservation with confidence=0.0
- **StageNormalizer**: alias normalization, hierarchy ranking (approved=5 > filed=4 > phase3=3 > ... > preclinical=0), active/inactive classification, highest-stage selection

## Test Results

**53/53 tests pass** (5.23s):
- test_disease_normalizer.py: 17 tests ✅
  - Manual override priority, MONDO caching, unknown preservation, serialization
- test_stage_normalizer.py: 36 tests ✅
  - Alias normalization, hierarchy, active/inactive, stage selection, edge cases

## Governance Compliance

Classification:
```text
SCIENTIFIC_CARTOGRAPHY_CONTEXT_LAYER
READ_ONLY_DIAGNOSTIC
NO_RANKER_CHANGE
NO_SELECTOR_CHANGE
NO_SIZING_CHANGE
NO_ALPHA_PROMOTION
POINT_IN_TIME_SAFE_REQUIRED
```

- ✅ No ranker/selector/sizing/final_score modifications
- ✅ No production pipeline changes
- ✅ Cache-only mode enforced for production
- ✅ All records include as_of_date and source_refs
- ✅ Unknown preservation (low confidence, not guessed)

## Key Design Decisions

**Unknowns Stay Unknown**: Unmapped diseases preserve raw_name with confidence=0.0 and source="unmapped". No fuzzy matching or inference in Phase 0/1.

**Deterministic Priority Order**: Disease mapping follows fixed priority (manual override > MONDO exact > MONDO synonym > unknown). Stage mapping follows alias-first ordering. No runtime configuration.

**Point-in-Time Safe**: Every record includes as_of_date (YYYY-MM-DD) and source_refs (traceable sources). Production builds reject future-dated sources.

**Dataclass Schemas**: Matches repo conventions (not Pydantic). Includes to_dict/from_dict for JSONL serialization.

**Stable IDs**: Disease IDs are SHA256 hashes of normalized_name+mondo_id, not timestamps.

## Boundary Correctly Identified

Phase 0/1 is **safe foundation work** — normalization and schema definitions only, no asset/program mapping where confidence and source traceability become critical.

Phase 2 (asset/program builder) is where **ambiguity and false confidence start**. Asset-indication mapping requires strict unknown preservation, source_refs on every record, and careful sponsor/ticker resolution.

## Next Phase (Phase 2)

Scope: Asset/program builder foundation (designed, not yet implemented)

Inputs:
- Existing screener universe/rankings snapshot (cache-only)
- Local ClinicalTrials.gov-style cached records (no network)
- SEC filing program data (cached)

Outputs:
- ProgramRecord JSONL with asset, company, disease, stage, mechanism, source_refs, as_of_date, confidence
- Extended coverage_report with tickers_with_programs count
- Preserved unknowns (ambiguous assets, unmapped sponsors, missing diseases/stages)

Non-negotiable:
- Cache-only production mode
- source_refs on every mapped record
- Unknown preservation (no guessing on ambiguous cases)
- No network calls in production pipeline
- Untouched ranker/selector/sizing/final_score

## Files Created

14 files total:
- 7 module files (cli.py, normalize/disease_normalizer.py, normalize/stage_normalizer.py, schemas/disease_schema.py, schemas/program_schema.py, __init__.py x3)
- 3 documentation files (README.md, GOVERNANCE.md, PHASE_0_1_SUMMARY.md)
- 3 test files (test_disease_normalizer.py, test_stage_normalizer.py, __init__.py)
- 4 placeholder subdirectory stubs (build/, ingest/, export/, qa/)

## Status

**SCIENTIFIC_CARTOGRAPHY_LAYER_V0_1_PHASE_0_1_COMPLETE**

Governance-compliant skeleton ready for Phase 2 review. No production model changes. All test coverage passing.

## Next Task

When ready, implement Phase 2 (asset/program builder) with:
- AssetRecord, CompanyRecord, TrialRecord schemas
- existing_universe_ingest (cache-only universe reader)
- ctgov_ingest (local ClinicalTrials.gov cached record parser)
- asset_alias_resolver (exact/alias matching, ambiguity preservation)
- sponsor_resolver (existing company/ticker metadata)
- asset_indication_builder (ProgramRecord JSONL generator)
- Extended CLI build step to write program_records.jsonl

Phase 2 acceptance: targeted tests pass, CLI builds program_records.jsonl from local fixtures, all records include as_of_date/confidence/source_refs, unknowns preserved, rankings.csv untouched.
