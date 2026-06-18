---
name: scientific_cartography_v0_1_phase_2_committed
description: Scientific Cartography Layer v0.1 Phase 2 committed and pushed — asset/program builder baseline at commit b569d861 (merged 7250023b)
metadata: 
  node_type: memory
  type: project
  status: resolved
  completed_date: 2026-06-17
  commit_hash: b569d861
  merge_commit_hash: 7250023b
  originSessionId: 2939d787-8865-47fd-905a-06d889a9f688
---

## Durable Status

```text
SCIENTIFIC_CARTOGRAPHY_LAYER_V0_1_PHASE_2_COMMITTED_AND_PUSHED
Commit: b569d861
Pushed via merge: 7250023b
READ_ONLY_DIAGNOSTIC_BASELINE_EXTENDED
NO_PRODUCTION_MODEL_CHANGE
READY_FOR_PHASE_3_MECHANISM_MODALITY_NORMALIZER_OR_MANUAL_REVIEW
Tests: 87/87 PASS (53 Phase 0/1 + 34 Phase 2)
```

## Phase 2 Deliverables

**Baseline chain**:
- ba7cb602: Phase 0/1 skeleton + normalizers (53 tests)
- 418353cb: Phase 0/1 pushed
- b569d861: Phase 2 asset/program builder (34 new tests)
- 7250023b: Merged with monitoring data → HEAD origin/main

**Schemas (3)**:
- CompanyRecord: company_id, ticker, company_name, aliases, is_public, source_refs, confidence, as_of_date
- AssetRecord: asset_id, asset_name, asset_aliases, sponsor_company_id, sponsor_name_raw, ticker, modality, mechanism_class, target, source_refs, confidence, as_of_date
- TrialRecord: nct_id, brief_title, official_title, sponsor, collaborators, conditions, interventions, phases, status, enrollment, dates, endpoints, has_results, source_ref, as_of_date

**Ingesters (2, cache-only)**:
- ExistingUniverseIngest: CSV/JSON/rankings CSV support, deduplication, source_refs tracking
- CTGovIngest: JSON/JSONL/API v2 format parsing, no network calls

**Resolvers (2, conservative)**:
- AssetAliasResolver: exact/alias matching, case-insensitive, ambiguity preservation, caching
- SponsorResolver: ticker/name/alias matching, public/private distinction, uses existing company metadata, caching

**Builders (1)**:
- AssetIndicationBuilder: generates ProgramRecords from trials + resolvers, deterministic IDs, mandatory source_refs, confidence scoring, unknown preservation, diagnostics reporting

**Tests (3 files, 34 tests)**:
- test_ingesters.py: 12 tests (CSV/JSON/JSONL parsing, deduplication, error handling)
- test_resolvers.py: 12 tests (asset/sponsor resolution, ambiguity preservation, caching)
- test_asset_indication_builder.py: 10 tests (ProgramRecord generation, source_refs, unknown preservation, diagnostics)

**Fixtures (2)**:
- sample_universe.csv: 5 biotech companies
- sample_trials.jsonl: 3 sample clinical trials

## Key Properties

**ProgramRecord spine**:
- Deterministic IDs (SHA256 hash-based, reproducible)
- Mandatory source_refs on every record (NCT ID, file path, company data)
- Confidence scoring: compound (min of asset_conf, sponsor_conf, disease_conf, stage_conf)
- Unknown preservation: confidence=0.0 where unmapped, not guessed
- Diagnostics reporting: counts of unknown assets/sponsors/diseases/stages, warnings surfaced
- as_of_date tracking (point-in-time safe)

**Entity resolution discipline**:
- No fuzzy matching; only exact/alias matching
- Ambiguous matches preserved as unknown
- Public/private company distinction maintained
- Sponsor name preserved in raw form when unresolved

**Governance compliance**:
- ✅ READ_ONLY_DIAGNOSTIC mode maintained
- ✅ NO_PRODUCTION_MODEL_CHANGE (0 ranker/selector/sizing/final_score modifications)
- ✅ CACHE_ONLY_PRODUCTION (no network calls)
- ✅ POINT_IN_TIME_SAFE (all records dated, source_refs tracked)
- ✅ UNKNOWN_PRESERVATION (low confidence preserved)

## Manual Review Recommended

Key files for inspection (entity resolution logic):
- `scientific_cartography/normalize/asset_alias_resolver.py` — exact/alias matching rules
- `scientific_cartography/normalize/sponsor_resolver.py` — company resolution, public/private distinction
- `scientific_cartography/build/asset_indication_builder.py` — ProgramRecord generation, confidence scoring, diagnostics
- `tests/scientific_cartography/test_asset_indication_builder.py` — test coverage of unknown preservation, multi-intervention/multi-condition handling

## Phase 3 Boundary (Next)

**Scope**: Mechanism/modality normalization only

**In scope**:
- MechanismNormalizer dataclass schema
- Mechanism alias dictionary (JAK inhibitor, IL-13 mAb, etc.)
- Modality normalizer (small molecule, mAb, cell therapy, etc.)
- Target extractor (EGFR, IL13, TYK2, etc.)
- Pass-through assignment into ProgramRecords
- Tests for mechanism/modality resolution

**Out of scope**:
- Competitive clusters (Phase 4)
- Crowding/white-space scoring (Phase 5)
- LangGraph orchestration
- Production pipeline wiring
- Scoring integration or alpha promotion

**Governance for Phase 3**:
```text
READY_FOR_PHASE_3_MECHANISM_MODALITY_NORMALIZATION
PASS_THROUGH_DIAGNOSTIC_ONLY
NO_SCORING_INTEGRATION
NO_PRODUCTION_MODEL_CHANGE
CACHE_ONLY_PRODUCTION
READ_ONLY_DIAGNOSTIC
```

## Test Status

- **Phase 0/1 regression**: 53/53 PASS ✅
- **Phase 2 new**: 34/34 PASS ✅
- **Total**: 87/87 PASS ✅
- **Execution**: 4.75s
- **Post-commit verification**: All tests still pass ✅

## Next Steps

**Option A: Manual Review**
- Inspect the three resolver/builder files listed above
- Verify entity resolution logic and unknown preservation
- Proceed to Phase 3 when confident

**Option B: Phase 3 Implementation**
- Start with Phase 3 mechanism/modality normalizer
- Same discipline: conservative, pass-through, diagnostic-only
- No production wiring, no alpha signals

**Option C: Pause**
- Phase 2 is locked and pushed, ready for future continuation
- No urgent Phase 3 work required
