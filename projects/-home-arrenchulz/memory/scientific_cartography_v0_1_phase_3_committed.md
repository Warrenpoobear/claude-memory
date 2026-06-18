---
name: scientific_cartography_v0_1_phase_3_committed
description: Scientific Cartography Layer v0.1 Phase 3 committed and pushed — mechanism/modality normalizer baseline at commit 9abb79c1
metadata: 
  node_type: memory
  type: project
  status: resolved
  completed_date: 2026-06-17
  commit_hash: 9abb79c1
  baseline_chain: ba7cb602 → 418353cb → b569d861 → 7250023b → 9abb79c1
  originSessionId: 2939d787-8865-47fd-905a-06d889a9f688
---

## Durable Status

```text
SCIENTIFIC_CARTOGRAPHY_LAYER_V0_1_PHASE_3_COMMITTED_AND_PUSHED
Commit: 9abb79c1
Branch: origin/main
PASS_THROUGH_DIAGNOSTIC_BASELINE_LOCKED
NO_PRODUCTION_MODEL_CHANGE
Tests: 118/118 PASS (87 Phase 0/1+2 regression + 31 Phase 3 new)
```

## Phase 3 Deliverables

**Implementation (1 file)**:
- `scientific_cartography/normalize/mechanism_normalizer.py` (317 lines)
  - MechanismResolution dataclass
  - MechanismNormalizer class with ~30-entry mechanism/modality/target dictionary
  - Exact/alias matching with manual CSV override support
  - Conservative substring matching with ambiguity detection
  - Confidence scoring (0.95 exact, 0.85 substring, 0.0 unknown/ambiguous)
  - Caching for performance
  - CSV loader for manual aliases

**Tests (2 files, 31 tests)**:
- `tests/scientific_cartography/test_mechanism_normalizer.py` (20 tests)
  - Exact mechanism dictionary matches
  - Case-insensitive matching
  - CAR-T, gene therapy, antibody, RNA therapy, antisense resolution
  - Unknown preservation
  - Manual alias priority
  - Caching, whitespace handling
  - Bulk normalization
  - Substring matching with ambiguity detection

- `tests/scientific_cartography/test_phase3_program_enrichment.py` (11 tests)
  - Mechanism enrichment from explicit interventions
  - Unknown intervention handling
  - Mechanism independent of disease/company
  - ProgramRecord source_refs unchanged
  - ProgramRecord stable IDs unchanged
  - Manual aliases from CSV
  - Mechanism/modality/target independent resolution
  - Warning preservation

**Fixtures (1 file)**:
- `tests/fixtures/scientific_cartography/mechanism_aliases.csv`
  - 6 manual mechanism aliases with different combinations

## Key Design Properties

**Conservative matching**:
- Exact manual alias (highest priority) → exact dictionary → single substring → ambiguous/unknown
- No fuzzy matching, no inference from disease/company/stage

**Independent fields**:
- Mechanism class, modality, target resolve separately
- Mechanism/modality can be known without target (e.g., AAV gene therapy, target=None)
- Target only from explicit mapping or dictionary, never inferred

**Unknown preservation**:
- Unknown and ambiguous remain unknown with confidence=0.0
- Preserved with warnings

**Pass-through diagnostic only**:
- Enriches AssetRecord/ProgramRecord diagnostic fields only
- No integration into final_score, ranker, selector, sizing
- No production pipeline wiring

## Governance Compliance

✅ READ_ONLY_DIAGNOSTIC maintained  
✅ PASS_THROUGH_DIAGNOSTIC_ONLY (no scoring integration)  
✅ NO_RANKER_CHANGE, NO_SELECTOR_CHANGE, NO_SIZING_CHANGE, NO_FINAL_SCORE_CHANGE  
✅ CACHE_ONLY_PRODUCTION  
✅ POINT_IN_TIME_SAFE  
✅ UNKNOWN_PRESERVATION  
✅ NO_PRODUCTION_MODEL_CHANGE (0 modifications)  

## Test Status

- Phase 0/1 regression: 87/87 PASS ✅
- Phase 3 new: 31/31 PASS ✅
- Total: 118/118 PASS ✅
- Time: 4.78s

## Boundary Maintained

✅ No competitive clusters  
✅ No crowding/white-space scores  
✅ No LangGraph orchestration  
✅ No production pipeline integration  
✅ No alpha signals or model changes  
✅ Read-only diagnostic context only  

## Baseline Chain

```
ba7cb602 Phase 0/1 skeleton + normalizers (53 tests)
    ↓
418353cb Phase 0/1 pushed
    ↓
b569d861 Phase 2 asset/program builder (87 tests)
    ↓
7250023b Merged with monitoring data
    ↓
9abb79c1 Phase 3 mechanism/modality normalizer (118 tests) ← HEAD
    ↓
origin/main synchronized
```

## Phase 4 Ready (Not Yet Implemented)

**Scope**: Competitive Clustering (count/structure only, no scoring yet)
- Group programs by disease + mechanism
- Compute public/private/stage counts
- Build CompetitiveClusterRecord
- Keep purely count-based, no crowding/white-space inference

**Constraints**:
- Count-based only (no scoring/landscape conclusions)
- Diagnostic reporting only
- No integration into final_score
- No portfolio interpretation

## Next Steps

Phase 4 is ready to implement whenever needed:
- Competitive clustering (count/structure)
- Public/private/stage stratification
- No scoring or portfolio interpretation

Or pause for manual review before Phase 4.
