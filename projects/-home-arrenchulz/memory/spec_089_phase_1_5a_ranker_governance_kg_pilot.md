---
name: spec_089_phase_1_5a_ranker_governance_kg_pilot
description: Narrow ranker-governance-only knowledge graph pilot for Spec 089 Phase 1.5A
metadata: 
  node_type: memory
  type: project
  status: pending
  expires: 2026-05-22
  related: "spec_089_hermes_knowledge_layer, feedback_ranker_governance_enforcement, ranker_research_landscape_2026_05_14"
  originSessionId: 1d8fa0e0-cd32-4e95-a561-2833608ccaa3
---

# Spec 089 Phase 1.5A — Ranker Governance Knowledge Graph Pilot

**Goal**: Encode ranker governance dependencies and enforcement rules into a queryable graph. Validate the approach on the highest-risk domain (ranker change authorization) before expanding to full repo ops.

**Why**: Current bottleneck is not model code—it is governance state, dependency tracking, contradictions, and safe next-action selection. Explicit graph enables automatic contradiction detection (like Spec 100 stub detection) and blocks accidental ranker promotions.

## Deliverables

```
tools/build_knowledge_graph.py
tools/query_knowledge_graph.py
artifacts/ops/knowledge_graph/nodes.jsonl
artifacts/ops/knowledge_graph/edges.jsonl
artifacts/ops/knowledge_graph/latest_graph_summary.md
tests/test_knowledge_graph_spec089.py
```

Non-scope: no cron, no production changes, no graph database.

## Scope — Ranker Governance Domain Only

Specs covered:
- Spec 072 (screener vNext, pending 2026-05-22 review)
- Spec 091 (ranker warning governance)
- Spec 096 (doctrine governing all ranker promotions)
- Spec 100 (true ranker IC tooling scaffold, implementation pending)
- Spec 094 (marginal-value proof, blocker)
- Spec 095 (correct IC scope, blocker)
- Governance: 13F cohort distortion clearance, Checklist v2, 2026-05-22 review readiness

Do NOT model biotech domain, companies, trials, mechanisms, or assets yet.

## Node Types (11)

```
Spec
Policy
Commit
Artifact
CodeFile
Signal
ModelComponent
Blocker
ValidationGate
Snapshot
Review
Action
```

## Edge Types (15)

```
IMPLEMENTS
DOCUMENTS
BLOCKS
DEPENDS_ON
GOVERNS
REQUIRES
VALIDATES
PENDING_ON
CLOSED_BY
TOUCHES
READS
WRITES
PROHIBITS
CONTRADICTS
```

## Initial Hardcoded Assertions (Ranker Governance)

```
Spec096 GOVERNS ProductionRankerChange
Spec096 REQUIRES Spec094
Spec096 REQUIRES Spec095
Spec096 REQUIRES OldSpec100
OldSpec100 PENDING_ON ForwardReturnWiring
OldSpec100 PENDING_ON TrueRankerICTooling
Spec072 PENDING_ON Review2026_05_22
Spec072 REQUIRES CohortDistortionCleared
Spec091 REQUIRES CRT
Spec100Scaffold TOUCHES scripts/research/run_true_ranker_ic.py
Spec100Scaffold CONTRADICTS "Spec100 complete" (if load_forward_returns() returns empty dict)
CohortDistortionCleared PENDING_ON Snapshot2026_05_15
Checklist2 BLOCKS ProductionRankerPromotion
```

## First Queries to Support (5)

```bash
python tools/query_knowledge_graph.py --what-blocks production-ranker-change
python tools/query_knowledge_graph.py --spec-status spec_100
python tools/query_knowledge_graph.py --contradictions
python tools/query_knowledge_graph.py --next-actions
python tools/query_knowledge_graph.py --what-touches run_screen.py
```

**Expected answer for `--what-blocks production-ranker-change`:**

```
Production ranker change is blocked by:
- Spec 096 doctrine (all ranker changes require Specs 094, 095, 100)
- Spec 094 marginal-value proof (pending evidence)
- Spec 095 correct IC scope (pending evidence)
- old Spec 100 true ranker IC tooling (implementation pending, forward-return wiring pending)
- Checklist v2 (required for any promotion)
- Spec 072 D7/D8/D9 evaluation pending 2026-05-22
- Cohort distortion clearance (pending 2026-05-15 snapshot validation)
```

## Contradiction Rules (5)

Implement exactly these:

1. **Status contradiction**: Spec marked CLOSED but has PENDING_ON edges.
   - Detects: "Spec 100 complete" claim but depends on unresolved forward-return wiring

2. **Stub contradiction**: Spec marked COMPLETE but linked code contains stub/placeholder markers.
   - Detects: `load_forward_returns()` returns empty dict, `ic_results = None`, etc.

3. **Scope contradiction**: Change touches ranker/selector/module files but ranker-freeze policy active.
   - Detects: commit that modifies `ranker/`, `selector/`, or model config during freeze window

4. **Artifact contradiction**: Closure memo claims artifact exists, but no tracked memo or file reference exists.
   - Detects: "closure committed" but `find artifacts/` yields nothing

5. **Promotion contradiction**: Signal marked SHADOW_ONLY or MONITORING_ONLY appears as input to production ranker.
   - Detects: `inst_delta_forward_shadow` in production ranker inputs

## Build Sequence

1. **Design** minimal node/edge schema for ranker governance (include definitions, cardinality, evidence sources)
2. **Extract** specs from `specs/changes/`, commits from git log, memos from audit files, code stubs via grep
3. **Emit** `nodes.jsonl` and `edges.jsonl` (one JSON object per line)
4. **Query** layer with graph traversal (BFS for blockers, contradiction checks, next-action candidates)
5. **Validate** contradiction rules on known issues (Spec 100 stub, Spec 072 pending review, 13F distortion)
6. **Checkpoint**: write one closure memo showing graph correctly identified all blockers to shipping a hypothetical ranker change

## Timing

**Do NOT start before**:
- 2026-05-15 snapshot closure
- Spec 105 live QA closure
- Spec 104 Phase B closure
- 13F cohort distortion validation

**Start after** those closures are done (expected ~2026-05-16).

**Deadline**: complete pilot by 2026-05-22 so it informs the 2026-05-22 ranker review meeting.

## Success Criteria

1. Graph correctly encodes all five contradiction rules with no false positives/negatives on known issues
2. `--what-blocks production-ranker-change` returns exactly the list above
3. `--contradictions` catches Spec 100 stub issue automatically
4. Closure memo demonstrates graph prevents accidental ranker ship
5. All tests pass; no cron failures

## Non-scope (Explicitly Out)

- Graph database (JSONL only)
- Production model changes
- Cron automation until manually validated
- Biotech domain entities
- Universal repo ops ontology (just ranker governance)
- LLM reasoning (pure rule-based)
