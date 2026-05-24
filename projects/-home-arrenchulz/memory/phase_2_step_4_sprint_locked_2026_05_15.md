---
name: phase_2_step_4_sprint_locked
description: "Phase 2 Step 4 KG implementation sprint fully designed and locked, ready for May 23-28 execution"
metadata: 
  node_type: memory
  type: project
  status: active
  created: 2026-05-15
  expires: 2026-05-30
  relates: phase_2_step_3_evening_reliability_complete_2026_05_15
  originSessionId: 75430853-0fb5-416b-bdff-7cf4caa2c776
---

# Phase 2 Step 4 — Knowledge Graph Sprint Design LOCKED (2026-05-15)

## Current State

**Date**: 2026-05-15  
**Status**: Design complete and locked. Five detailed implementation specs created. Ready for May 23–28 coding sprint.  
**Prerequisite Gate**: Phase 2 Step 3 verification (May 16–19) must pass before starting Phase 4

## Deliverables Created

### Five Implementation Specs (One Per Phase)

All saved to `artifacts/audit/`:

1. **phase_2_step_4a_kg_loader_implementation_2026_05_15.md** (2 hours, 150 lines)
   - KnowledgeGraphNode, KnowledgeGraphEdge, KnowledgeGraph classes
   - JSONL loader, schema validation, efficient traversal
   - 17 test cases

2. **phase_2_step_4b_query_implementations_2026_05_15.md** (3 hours, 200 lines)
   - Five deterministic query functions (blockers, spec-status, contradictions, next-actions, what-touches)
   - Pure graph traversal (except Query 5: one git log call)
   - 11 test cases

3. **phase_2_step_4c_contradiction_detection_2026_05_15.md** (2.5 hours, 150 lines)
   - Five rules: status, stub, scope, artifact, promotion contradictions
   - ContradictionReport class
   - 8 test cases

4. **phase_2_step_4d_cli_tool_api_2026_05_15.md** (2.5 hours, 200 lines)
   - Six subcommands (what-blocks-ranker, spec-status, contradictions, next-actions, what-touches, all)
   - JSON and human-readable output
   - 8 test cases

5. **phase_2_step_4e_validation_tests_2026_05_15.md** (3 hours, 400 lines + seed graph)
   - 35+ end-to-end test cases
   - Seed graph authoring guide
   - Integration tests, governance constraint validation
   - 35+ test cases

### Sprint Summary Document

**phase_2_step_4_sprint_summary_2026_05_15.md** — Overall roadmap, timeline, success criteria, risk mitigation

## Sprint Timeline

| Date | Phase | Task | Duration | Commits |
|------|-------|------|----------|---------|
| May 23–24 (Fri–Sat) | 4a | KG Loader | 2 hrs | 1 |
| May 24–25 (Sat–Sun) | 4b | Query Implementations | 3 hrs | 1 |
| May 25–26 (Sun–Mon) | 4c | Contradiction Detection | 2.5 hrs | 1 |
| May 26–27 (Mon–Tue) | 4d | CLI Tool | 2.5 hrs | 1 |
| May 27–28 (Tue–Wed) | 4e | Validation Tests | 3 hrs | 1 |

**Total**: ~13 hours coding + testing, 5 commits, 60+ tests

## Sprint Readiness Checklist

- ✅ Phase 4a spec complete (KG data structures + loader)
- ✅ Phase 4b spec complete (5 query functions)
- ✅ Phase 4c spec complete (5 contradiction detection rules)
- ✅ Phase 4d spec complete (CLI tool)
- ✅ Phase 4e spec complete (35+ validation tests)
- ✅ Sprint summary with timeline and success criteria
- ✅ All specs include: full code, test cases, acceptance criteria, commit checklists
- ⏳ **Blocked on**: Phase 2 Step 3 verification (May 16–19)
- ⏳ **Blocked on**: Cohort clearance expected ~May 23–26

## Design Highlights

### KG Loader (Phase 4a)
- In-memory KG with indexed traversal (`_edges_by_src`, `_edges_by_dst`)
- JSONL seed format: `{"type": "node" | "edge", ...}`
- Schema validation: 11 node types, 15 edge types
- Efficient graph operations

### Query Layer (Phase 4b)
- **Query 1**: what_blocks_production_ranker_change() — All blockers + dependency chains
- **Query 2**: spec_status(spec_id) — Dependencies, blockers, contradictions
- **Query 3**: contradictions() — All CONTRADICTS edges with evidence
- **Query 4**: next_actions() — PENDING actions sorted by deadline
- **Query 5**: what_touches_file(path) — Commits/specs touching file (graph + git log)
- All JSON-serializable, no LLM reasoning

### Contradiction Detection (Phase 4c)
- **Rule 1** (Status): Closed node with DEPENDS_ON edges → HIGH risk
- **Rule 2** (Stub): Complete spec with stubbed code → HIGH risk
- **Rule 3** (Scope): Commit violates freeze policy → HIGH risk
- **Rule 4** (Artifact): PENDING artifact with no files → MEDIUM risk
- **Rule 5** (Promotion): Shadow signal in production → HIGH risk
- ContradictionReport with summary + human-readable formatting

### CLI Tool (Phase 4d)
- 6 subcommands (one per query + all)
- JSON output (`--json` flag) for automation
- Human-readable text for operator review
- Exit codes: 0=success, 1=error/contradictions found
- Graceful fallback on missing seed graph

### Validation Tests (Phase 4e)
- 35+ test cases covering all modules
- Loader validation: nodes, edges, types, schema
- Query validation: blockers, status, contradictions, actions, files
- CLI validation: all subcommands, output formats
- Integration tests: cross-query consistency, JSON serialization
- Governance constraint validation: policies, specs, actions present
- Edge case tests: empty graph, missing files

## Key Constraints & Decisions

**Non-Goals for Phase 4**:
- No production integration yet (Phase 5)
- No LLM reasoning (all deterministic)
- No graph database (in-memory only)
- No cron automation (manual queries)

**Design Decisions**:
- JSONL seed format: simple, human-readable, version-controllable
- In-memory only: fast queries, no persistence layer
- Deterministic rules: all testable without human interpretation
- Five fixed queries: stable contract, no ambiguity
- Pure graph traversal: predictable performance, no surprises

## Seed Graph Requirements

Phase 4e requires `artifacts/audit/kg_seed.jsonl` with:
- **Minimum**: 10 nodes, 10 edges
- **Target**: 80 nodes, 120 edges (full governance state)
- **Content**:
  - Specs: 096 (doctrine), 100 (IC tooling), 072 (screener), others
  - Policies: alpha_freeze, checklist_v2
  - Actions: forward_return_wiring, ic_computation, promotion_readiness
  - Signals: inst_delta_forward_shadow, cross_signal_forward_shadow, others
  - Model components: ranker_v2, selector_a4, gate_clinical
  - Edges: BLOCKS, DEPENDS_ON, IMPLEMENTS, GOVERNS, CONTRADICTS, etc.

**Authoring**: Can be done incrementally (Phase 4a–4d can use minimal seed; expand for Phase 4e)

## Integration Points

**Within Phase 4**:
- 4a (Loader) → used by 4b, 4c, 4d, 4e
- 4b (Queries) → called by 4d (CLI), 4e (validation)
- 4c (Contradictions) → called by 4d (CLI), 4e (validation)
- 4d (CLI) → validated by 4e

**With Phase 2 Step 5** (late phase):
- Wire KG queries into agent governance enforcement
- Use Query 1 to check ranker blockers before agent dispatch
- Use Query 3 to surface contradictions as warnings
- Extend Phase 3b preflight integration with KG-based blocking

## Success Criteria

**Phase 4 COMPLETE** when:
- ✅ All 60+ tests pass (17 + 11 + 8 + 8 + 35+)
- ✅ Zero contradictions in seed graph (Rule 5: no false positives)
- ✅ All queries return expected structure (JSON + text)
- ✅ CLI handles missing seed gracefully
- ✅ No regressions (Phase 3b tests still pass)

## Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| Seed graph authoring takes too long | Create minimal seed first (10 nodes), expand after 4d |
| Query performance on large graphs | Use indexed edge lookups, limit recursion depth |
| Contradiction rules produce false positives | Each rule has clear condition; validate with real data |
| CLI output doesn't match spec | Use JSON as source of truth; compare with examples |

## Next Steps

1. **May 16–19**: Execute Phase 2 Step 3 verification (monitor evening jobs, verify watchdog)
2. **May 19 post-verification**: Implement Phase 2 Step 3b (preflight integration)
3. **May 20–22**: Observe, watch for integration issues
4. **May 23 (or post-cohort-clearance)**: Begin Phase 2 Step 4 sprint
   - Start with Phase 4a (KG loader)
   - Follow spec exactly; all code provided
   - Run tests after each commit
5. **May 28 afternoon**: All phases complete, 60+ tests passing
6. **May 29+**: Consider Phase 2 Step 5 (KG gating) design

## Status

| Component | Status | Date |
|-----------|--------|------|
| Phase 2 Step 3 (Evening Cron) | ✅ Complete, monitoring | 2026-05-15 |
| Phase 2 Step 3b (Preflight Integration) | 🔒 Ready (post-May-19) | 2026-05-15 |
| Phase 2 Step 4 (KG Implementation) | 🔒 **LOCKED** (post-May-23) | 2026-05-15 |
| Phase 2 Step 5 (KG Gating) | 📋 Design pending | 2026-05-28+ |

---

**Phase 2 Step 4 is locked, designed, and ready for May 23–28 coding sprint.**
