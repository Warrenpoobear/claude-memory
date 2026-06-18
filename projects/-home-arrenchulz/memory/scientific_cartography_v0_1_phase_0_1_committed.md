---
name: scientific_cartography_v0_1_phase_0_1_committed
description: Scientific Cartography Layer v0.1 Phase 0/1 committed and pushed — baseline locked at commit ba7cb602 (merged via 418353cb)
metadata: 
  node_type: memory
  type: project
  status: resolved
  completed_date: 2026-06-17
  commit_hash: ba7cb602
  merge_commit_hash: 418353cb
  originSessionId: 2939d787-8865-47fd-905a-06d889a9f688
---

## Durable State

```text
SCIENTIFIC_CARTOGRAPHY_LAYER_V0_1_PHASE_0_1_COMMITTED
Commit: ba7cb602
Pushed via merge commit: 418353cb
READ_ONLY_DIAGNOSTIC_BASELINE_LOCKED
NO_PRODUCTION_MODEL_CHANGE
READY_FOR_PHASE_2_ASSET_PROGRAM_BUILDER
Tests: 53/53 PASS
```

## Committed Baseline

**Commit ba7cb602**: "Add Scientific Cartography Layer v0.1 Phase 0/1"
- 17 files, 1974 insertions
- scientific_cartography/ package (14 files)
- tests/scientific_cartography/ (3 files)

**Pushed via merge commit 418353cb** to origin/main
- Merge resolved with 18 files from upstream (Hermes skill updates, learning docs)
- final status: main == origin/main

## Implementation Locked

Package structure:
- `scientific_cartography/` with schemas/, normalize/, build/, ingest/, export/, qa/
- `scientific_cartography/schemas/disease_schema.py` (DiseaseRecord)
- `scientific_cartography/schemas/program_schema.py` (ProgramRecord)
- `scientific_cartography/normalize/disease_normalizer.py` (DiseaseNormalizer)
- `scientific_cartography/normalize/stage_normalizer.py` (StageNormalizer)
- `scientific_cartography/cli.py` (build, qa commands)
- Documentation: README.md, GOVERNANCE.md, PHASE_0_1_SUMMARY.md

Tests locked:
- test_disease_normalizer.py: 17 tests ✅
- test_stage_normalizer.py: 36 tests ✅
- Total: 53/53 PASS

## Important Note

Pre-commit hook (black formatter) modified `disease_normalizer.py` before commit. The **committed baseline is not exactly the pre-hook working copy**, but:
- Tests still pass (53/53)
- Functionality unchanged (formatting only)
- Pushed commit 418353cb is authoritative

## Governance Compliance Verified

- ✅ READ_ONLY_DIAGNOSTIC mode
- ✅ NO_RANKER_CHANGE, NO_SELECTOR_CHANGE, NO_SIZING_CHANGE
- ✅ NO_ALPHA_PROMOTION
- ✅ POINT_IN_TIME_SAFE (all records include as_of_date + source_refs)
- ✅ CACHE_ONLY production mode
- ✅ UNKNOWN_PRESERVATION (low confidence, not guessed)

## Next Phase: Phase 2 Asset/Program Builder

When ready, start new task/chat with Phase 2 boundary prompt (see below).

Phase 2 scope: Create trustworthy `ProgramRecord` spine
- existing_universe_ingest (cache-only universe reader)
- ctgov_ingest (local ClinicalTrials.gov parser, no network)
- asset_alias_resolver (exact/alias matching, ambiguity preservation)
- sponsor_resolver (existing company/ticker metadata)
- asset_indication_builder (ProgramRecord JSONL generator)
- Extended CLI build to write program_records.jsonl from local fixtures
- Targeted test suite with local fixtures only

Hard constraints for Phase 2:
- No network calls in build
- No production pipeline wiring
- No ranker/selector/sizing/final_score/run_screen.py changes
- No mechanism/modality inference beyond pass-through explicit fields
- Every ProgramRecord includes as_of_date, confidence, source_refs
- Ambiguous/missing fields remain unknown with warnings

---

## Phase 2 Bounded Prompt

```text
Implement Scientific Cartography Phase 2 only from baseline 418353cb.

Scope:
- Add CompanyRecord, AssetRecord, and TrialRecord schemas.
- Implement existing_universe_ingest.py as a cache-only reader for current screener snapshot/universe files.
- Implement ctgov_ingest.py as a local-cache/fixture parser only; no network calls.
- Implement asset_alias_resolver.py with exact/alias matching and ambiguity preservation.
- Implement sponsor_resolver.py using existing company/ticker metadata where available.
- Implement asset_indication_builder.py to generate ProgramRecord JSONL from existing universe + cached CTGov/SEC-like inputs.
- Extend CLI build enough to write program_records.jsonl from local fixtures.
- Extend coverage_report with tickers_with_programs and program_records.
- Add targeted tests for asset alias resolution, sponsor resolution, CTGov parsing, and ProgramRecord generation.

Hard constraints:
- No network calls in build.
- No production pipeline wiring.
- No ranker, selector, sizing, final_score, or run_screen.py changes.
- No mechanism/modality inference beyond pass-through explicit fields.
- Every mapped ProgramRecord must include as_of_date, confidence, and source_refs.
- Ambiguous/missing fields must remain unknown with warnings.

Return:
- Diff summary.
- Test results.
- Any low-confidence or ambiguous mapping cases.
```

**Phase 2 focus**: Create trustworthy `ProgramRecord` spine before any mechanism, cluster, or LangGraph orchestration work.
