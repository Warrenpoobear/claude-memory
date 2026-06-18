---
name: scientific_cartography_v0_1_phase_5_committed
description: Scientific Cartography Layer v0.1 Phase 5 committed and pushed — landscape features diagnostic baseline at commit 2b6a5e22
metadata: 
  node_type: memory
  type: project
  status: resolved
  completed_date: 2026-06-17
  commit_hash: 2b6a5e22
  baseline_chain: 9c7067fb → 2b6a5e22
  originSessionId: 2939d787-8865-47fd-905a-06d889a9f688
---

## Durable Status

```text
SCIENTIFIC_CARTOGRAPHY_LAYER_V0_1_PHASE_5_COMMITTED_AND_PUSHED
Commit: 2b6a5e22
Branch: origin/main
LANDSCAPE_FEATURES_DIAGNOSTIC_BASELINE_LOCKED
READ_ONLY_DIAGNOSTIC_MAINTAINED
NO_PRODUCTION_MODEL_CHANGE
Tests: 161/161 PASS (141 Phase 0-4 regression + 20 Phase 5 new)
```

## Phase 5 Deliverables

**Implementation (2 files, 538 lines)**:
- `scientific_cartography/schemas/landscape_feature_schema.py` (138 lines)
  - LandscapeFeatureRecord dataclass
  - Fields: feature_id, program_id, cluster_id, disease/mechanism/modality/target, count structures, crowding/white-space scores, confidence, warnings

- `scientific_cartography/build/landscape_feature_builder.py` (400 lines)
  - LandscapeFeatureBuilder class
  - build_from_programs_and_clusters: main method consuming ProgramRecords + CompetitiveClusterRecords
  - _build_cluster_lookup: index clusters by (disease, mechanism, modality, target)
  - _compute_disease_counts: disease-level program aggregation
  - _get_stage_bucket: clinical stage normalization
  - _build_feature_for_program: compute counts and scores for each program
  - mechanism_crowding_score: min(1.0, 0.12*approved + 0.10*filed + 0.08*phase3 + 0.05*phase2 + 0.03*phase1 + 0.02*preclinical)
  - stage_crowding_score: min(1.0, stage_weight * same_stage_program_count)
  - white_space_score: max(0.0, 1.0 - mechanism_crowding_score) when disease/mechanism known
  - Coverage reporting (diagnostic counts only)
  - JSONL and JSON artifact writing

**Tests (1 file, 20 tests)**:
- `tests/scientific_cartography/test_landscape_feature_builder.py` (595 lines)
  - LandscapeFeatureRecord serialization (1)
  - Feature builder: per-program building (1), cluster linking (1)
  - Score computation: mechanism crowding (1), white-space (1), stage crowding (1)
  - Score gating: no white-space for unknown mechanism (1), no stage crowding for unknown stage (1)
  - Missing cluster handling (1)
  - Determinism: feature IDs (1), output ordering (1)
  - Coverage reporting: counts (1), mean scores (1)
  - Source refs aggregation (1)
  - Artifact writing: JSONL (1), JSON report (1)
  - Feature confidence (1)
  - Disease/same-stage counts (2)
  - Edge cases: empty inputs (1)

**Package Updates**:
- `scientific_cartography/__init__.py`: Export LandscapeFeatureBuilder + LandscapeFeatureRecord

## Key Design Properties

**Count Structures**:
- disease_program_count: aggregated from all clusters targeting this disease
- mechanism_program_count: from matching disease/mechanism/modality/target cluster
- same_stage_program_count: from cluster stage distributions
- approved/phase3/phase2/phase1/preclinical/discontinued/unknown counts
- public/private split

**Diagnostic Scores** (read-only, no portfolio integration):
- mechanism_crowding_score: weighted sum of stage counts in cluster (0.0 to 1.0)
- white_space_score: 1.0 - mechanism_crowding (conservative, requires known disease+mechanism)
- stage_crowding_score: same-stage competition intensity (0.0 to 1.0)
- differentiation_proxy_score: reserved for future (None in Phase 5)

**Determinism**:
- feature_id = SHA256(program_id|as_of_date)[:16]
- Sorted lists: source_refs
- Deterministic output ordering by feature_id

**Unknown Preservation**:
- Unknown disease → disease_program_count = None, no crowding scores
- Unknown mechanism → no mechanism_crowding_score, no white_space_score (warning added)
- Unknown modality/target → preserved, no score gating yet
- Unknown stage → no stage_crowding_score (warning added)

**Pass-Through Diagnostic Only**:
- No scoring integration into final_score, ranker, selector, sizing
- No portfolio language or interpretation
- No production pipeline wiring
- No LangGraph orchestration
- No alpha signals

## Governance Compliance

✅ READ_ONLY_DIAGNOSTIC  
✅ LANDSCAPE_FEATURES_DIAGNOSTIC_ONLY  
✅ NO_RANKER_CHANGE, NO_SELECTOR_CHANGE, NO_SIZING_CHANGE, NO_FINAL_SCORE_CHANGE  
✅ NO_ALPHA_PROMOTION  
✅ NO_PORTFOLIO_ACTIONS (no buy/sell/avoid/winner/loser language)  
✅ NO_PRODUCTION_MODEL_CHANGE (0 modifications to core algorithm)  
✅ CACHE_ONLY_PRODUCTION  
✅ POINT_IN_TIME_SAFE  
✅ NO_LANGGRAPH_ORCHESTRATION  
✅ NO_PRODUCTION_WIRING  

## Test Status

- Phase 0-4 regression: 141/141 PASS ✅
- Phase 5 new: 20/20 PASS ✅
- Total: 161/161 PASS ✅
- Time: ~5.4s

## Artifact Examples

**landscape_features.jsonl** (JSONL format, one record per ProgramRecord):
```json
{"feature_id":"abc123...", "program_id":"PROGRAM_xyz", "cluster_id":"C1", "disease_name":"Alzheimer's", "mechanism_class":"JAK inhibitor", "disease_program_count":8, "mechanism_program_count":5, "approved_incumbent_count":1, "phase3_program_count":2, "phase2_program_count":2, "mechanism_crowding_score":0.42, "white_space_score":0.58, "stage_crowding_score":0.10, "feature_confidence":0.8, "feature_status":"computed", "source_refs":["NCT001",...], "warnings":[], ...}
```

**landscape_feature_coverage_report.json** (diagnostic summary):
```json
{"as_of_date":"2026-06-16", "program_records":5, "landscape_feature_records":5, "features_with_mechanism_crowding_score":4, "features_with_stage_crowding_score":5, "features_with_white_space_score":4, "features_without_scores_due_unknown_mechanism":1, "mean_mechanism_crowding_score":0.35, "mean_stage_crowding_score":0.12, "mean_white_space_score":0.65, "warnings":[...]}
```

## Feature Formulas (Documented & Transparent)

**Mechanism Crowding** (cluster-level):
```
score = min(1.0,
  0.12 * approved_count +
  0.10 * filed_count +
  0.08 * phase3_count +
  0.05 * phase2_count +
  0.03 * phase1_count +
  0.02 * preclinical_count
)
```

**Stage Crowding** (same-stage in cluster):
```
stage_weight = {"approved": 0.12, "filed": 0.10, "phase3": 0.08, ...}
score = min(1.0, stage_weight[program_stage] * same_stage_program_count)
```

**White-Space** (inverse crowding):
```
score = max(0.0, 1.0 - mechanism_crowding_score)
  if disease is known AND mechanism is known AND confidence >= 0.50
  else None
```

**Feature Confidence**:
```
confidence = min(program.confidence, cluster.confidence)
  if program.source_refs else 0.5
```

## Boundary Maintained

✅ No landscape interpretation (no "crowded/attractive/white-space claims")  
✅ No portfolio language (no "buy/sell/avoid/winner/loser")  
✅ No production pipeline integration  
✅ No LangGraph or ML orchestration  
✅ No ranking export  
✅ No trading logic  
✅ No alpha signals or model improvement claims  

## Baseline Chain

```
9c7067fb Phase 4 CLI integration + exports (141 tests)
    ↓
2b6a5e22 Phase 5 landscape features (161 tests) ← HEAD
    ↓
origin/main synchronized
```

## Next Steps

Work is complete. Phase 5 provides:
- Count structures for structural competitive analysis
- Transparent diagnostic crowding/white-space proxies
- Feature confidence tracking
- Deterministic, reproducible outputs
- No production model changes or portfolio integration

All governance constraints maintained. Ready for operational observation if needed, or for future Phase 6+ work (e.g., clinical risk assessment, mechanism novelty diagnostics, etc.).
