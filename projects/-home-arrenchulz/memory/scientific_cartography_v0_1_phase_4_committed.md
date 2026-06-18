---
name: scientific_cartography_v0_1_phase_4_committed
description: Scientific Cartography Layer v0.1 Phase 4 committed and pushed — competitive clustering baseline at commit 9c7067fb
metadata: 
  node_type: memory
  type: project
  status: resolved
  completed_date: 2026-06-17
  commit_hash: 9c7067fb
  baseline_chain: 9abb79c1 → 929c5f27 → 9c7067fb
  originSessionId: 2939d787-8865-47fd-905a-06d889a9f688
---

## Durable Status

```text
SCIENTIFIC_CARTOGRAPHY_LAYER_V0_1_PHASE_4_COMMITTED_AND_PUSHED
Commit: 9c7067fb (CLI integration)
Commit: 929c5f27 (Clustering implementation)
Branch: origin/main
COUNT_STRUCTURE_ONLY_BASELINE_LOCKED
NO_SCORING_INTEGRATION
NO_PRODUCTION_MODEL_CHANGE
Tests: 141/141 PASS (118 Phase 0-3 regression + 23 Phase 4 new)
```

## Phase 4 Deliverables

**Implementation (2 files, 472 lines)**:
- `scientific_cartography/schemas/cluster_schema.py` (125 lines)
  - CompetitiveClusterRecord dataclass
  - Fields: cluster_id, disease/mechanism/modality/target, stage counts, public/private split, tickers, sponsors, assets, program_ids, source_refs, as_of_date, confidence, warnings

- `scientific_cartography/build/competitive_cluster_builder.py` (347 lines)
  - CompetitiveClusterBuilder class
  - Deterministic clustering by disease|mechanism|modality|target
  - Stage bucketing (approved, filed, phase3, phase2, phase1, preclinical, discontinued, unknown)
  - Public program detection (company_id or ticker)
  - Deterministic cluster IDs via SHA256
  - Coverage report generation (diagnostic counts only, no scoring)
  - JSONL and JSON artifact writing

**Tests (1 file, 23 tests)**:
- `tests/scientific_cartography/test_competitive_cluster_builder.py` (601 lines)
  - CompetitiveClusterRecord serialization (1)
  - Cluster builder key/ID generation (2)
  - Stage bucketing (3)
  - Public program detection (1)
  - Grouping behavior (2)
  - Unknown preservation (2)
  - Count accuracy (2)
  - Source refs deduplication (1)
  - Deterministic behavior (2)
  - Coverage reporting (2)
  - List field ordering (1)
  - Edge cases (2)
  - Artifact writing (2)

**Package Updates**:
- `scientific_cartography/__init__.py`: Export CompetitiveClusterBuilder + CompetitiveClusterRecord
- `scientific_cartography/cli.py`: Add --build-clusters flag to build command
- `.gitignore`: Exception for scientific_cartography/build/ source directory

## Key Design Properties

**Clustering**:
- Groups programs by: disease_id|mechanism_class|modality|target
- Creates one cluster per unique combination
- Preserves all unknown/ambiguous buckets (disease=None/unknown, mechanism=None/unknown, etc.)

**Count Structures Only**:
- program_count, public_program_count, private_or_unknown_program_count
- Stage counts: approved, filed, phase3, phase2, phase1, preclinical, discontinued, unknown
- Public tickers list (sorted, deduplicated)
- Sponsor names list (sorted, deduplicated)
- Asset names list (sorted, deduplicated)

**Determinism**:
- cluster_id = SHA256(disease|mechanism|modality|target)[:16]
- Sorted lists: tickers, sponsors, assets, program_ids, source_refs
- No insertion-order dependency

**Unknown Preservation**:
- Unknown disease → cluster_id includes "unknown"
- Unknown mechanism → cluster still created, warned
- Unknown modality/target → handled identically
- No inference, no guessing

**Pass-Through Diagnostic**:
- No scoring, no crowding assessment, no white-space scoring
- No differentiation scoring
- No landscape interpretation
- No portfolio ranking
- No production model wiring

## Governance Compliance

✅ READ_ONLY_DIAGNOSTIC  
✅ COUNT_STRUCTURE_ONLY  
✅ NO_RANKER_CHANGE, NO_SELECTOR_CHANGE, NO_SIZING_CHANGE, NO_FINAL_SCORE_CHANGE  
✅ NO_CROWDING_SCORE, NO_WHITE_SPACE_SCORE, NO_DIFFERENTIATION_SCORE  
✅ NO_LANDSCAPE_FEATURES_YET (Phase 5 boundary clean)  
✅ CACHE_ONLY_PRODUCTION  
✅ POINT_IN_TIME_SAFE  
✅ NO_LANGGRAPH_ORCHESTRATION  
✅ NO_PRODUCTION_PIPELINE_WIRING  
✅ NO_ALPHA_PROMOTION  
✅ NO_PRODUCTION_MODEL_CHANGE (0 modifications to ranker/selector/sizing)  

## Test Status

- Phase 0/1/2/3 regression: 118/118 PASS ✅
- Phase 4 new: 23/23 PASS ✅
- Total: 141/141 PASS ✅
- Time: ~5.5s

## Artifact Examples

**competitive_clusters.jsonl** (JSONL format):
```json
{"cluster_id":"abc123...", "disease_id":"DOID_0001", "disease_name":"Alzheimer's", "mechanism_class":"JAK inhibitor", "modality":"small molecule", "target":"JAK", "program_count":5, "public_program_count":3, "private_or_unknown_program_count":2, "approved_count":1, "phase3_count":2, "phase2_count":2, "public_tickers":["COGT","DNTH","ERAS"], ...}
```

**cluster_coverage_report.json** (diagnostic summary):
```json
{"as_of_date":"2026-06-16", "program_records":0, "competitive_clusters":0, "clusters_with_known_disease":0, "clusters_with_unknown_disease":0, "public_programs":0, "private_or_unknown_programs":0, "approved_programs":0, "phase3_programs":0, "phase2_programs":0, "phase1_programs":0, "preclinical_programs":0, "discontinued_programs":0, "unknown_stage_programs":0, "warnings":[]}
```

## CLI Integration

```bash
python3 -m scientific_cartography.cli build \
  --as-of-date 2026-06-16 \
  --output-dir artifacts/scientific_cartography/2026-06-16 \
  --build-clusters

# Output:
# ✓ Competitive clusters written to .../competitive_clusters.jsonl
# ✓ Cluster coverage report written to .../cluster_coverage_report.json
```

## Baseline Chain

```
9abb79c1 Phase 3 mechanism/modality normalizer (118 tests)
    ↓
929c5f27 Phase 4 clustering + builder (141 tests)
    ↓
9c7067fb Phase 4 CLI integration + exports ← HEAD
    ↓
origin/main synchronized
```

## Phase 5 Ready (Not Yet Implemented)

**Scope**: Landscape Features (scoring diagnostics, NOT alpha signals)
- Crowding assessment (count-based structure analysis)
- White-space scoring (unmet-need diagnostic)
- Differentiation scoring (competitive positioning diagnostic)
- No production wiring
- No ranker/selector/sizing integration
- Diagnostic reporting only

**Constraints**:
- No landscape conclusions that affect portfolio decisions
- No alpha signals or model changes
- No investor interpretation
- Purely structural analysis of clusters

## Next Steps

Phase 5 is ready to implement whenever needed, after explicit approval:
- Landscape feature analysis (crowding, white-space, differentiation)
- Diagnostic scoring only (no portfolio interpretation)
- No production model integration

Or pause for manual review before Phase 5.
