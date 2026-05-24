---
name: governance_clearance_spec089_spec110_2026_05_21
description: "Governance approval for Spec 089 KG pilot + Spec 110 provenance planning (KG/provenance only, no ranker/selector/sizing)"
metadata: 
  node_type: memory
  type: project
  status: active
  expires: 2026-05-26
  related: "13f_q1_2026_monitoring_live_2026_05_15, spec_089_phase_1_5a_ranker_governance_kg_pilot"
  originSessionId: f4dc98ee-62dd-4417-a691-d33d6d3e0320
---

# GOVERNANCE CLEARANCE MEMO

**Date**: 2026-05-21
**Decision**: APPROVED
**Scope**: Knowledge Graph pilot (Spec 089) + Pipeline Provenance Graph planning (Spec 110)
**Constraints**: Governance/provenance work only — no ranker/selector/sizing/scoring changes

---

## 13F Quarantine Decision

**Status**: NO_QUARANTINE / CLEAR

**Evidence** (May 21 pre-check validation):
- Filed managers: 37/48 (77%)
- Elite core: 42/42 (100%)
- Cohort Jaccard: 0.99 (well above 0.70 threshold)
- All 6 gates: PASS
- Top-30 churn: 2 in / 2 out (within policy)
- inst_delta_z KS: 0.34 (monitoring flag, classified as expected refresh behavior)

**Implication**: Quarantine lift confirmed. Specs 072, 089, 094, 100 no longer blocked by 13F gate.

---

## Scope Authorization

### APPROVED: Knowledge-Layer & Provenance-Graph Work

**Spec 089 KG Pilot** (already shipped, Phase 1.5A):
- ✓ Governance knowledge graph schema (12 node types, 15 edge types)
- ✓ Contradiction detection (5 rules)
- ✓ Deterministic, in-memory, read-only
- ✓ 29 tests passed, 0 contradictions
- ✓ **Ranker changes still blocked** (governance/freeze/Checklist v2 gates remain)

**Spec 110 Pipeline Provenance Graph** (Planning phase):
- ✓ Design/spec scaffold only (first pass)
- ✓ Node schema (13 types: RawSource, CacheFile, Feature, Module, Snapshot, etc.)
- ✓ Edge schema (8 types: PRODUCES, CONSUMES, DERIVES, VALIDATES, QUARANTINES, etc.)
- ✓ Source/artifact inventory
- ✓ Query patterns (5: lineage, snapshot-inputs, breakage-impact, stale-features, validate-snapshot)
- ✓ Acceptance tests & non-goals
- ✓ Test plan & success criteria
- ⚠ **No production runtime wiring in first pass**
- ⚠ **No LLM-derived facts**
- ⚠ **No graph-derived alpha signals**

### NOT APPROVED: Architecture/Model Changes

**Explicitly blocked** by this memo and architecture freeze (active through May 26 or later):
- ✗ Selector changes (Spec 094 blocked)
- ✗ Ranker modifications (Spec 072 blocked, 2-feat limit enforced)
- ✗ Sizing/position-weight changes
- ✗ Scoring logic or weights
- ✗ Promotion/demotion of signals
- ✗ Production-ranker wiring of KG outputs

**Rationale**: Spec 089 control pattern proved this works — 29 tests, 0 contradictions, ranker still locked. KG/provenance is a governance/lineage tool, not an alpha engine.

---

## Spec 110 Bounded Planning Phase

**Branch**: `spec-110-pipeline-provenance-graph-2026-05-21` (from clean `main`)

**Deliverables** (first pass, non-implementation):

1. **Node Schema** — Define 13 node types with metadata fields, cardinality, and lifecycle
2. **Edge Schema** — Define 8 edge types with dependency rules and validation
3. **Source/Artifact Inventory** — Map raw sources through transformation pipeline to final artifacts
4. **Query Patterns** — Specify 5 query signatures (signature, input, expected output, complexity)
5. **Acceptance Tests** — 10–15 test cases covering happy path and error cases
6. **Non-Goals** — Explicitly list what pipeline provenance does NOT do
7. **Test Plan** — How to validate the schema against production artifacts
8. **Success Criteria** — Definition of "ready to implement" (e.g., schema stability, test coverage, stakeholder review)

**Scope Boundaries**:
- ✓ Read-only, deterministic graph definition (no ML, no scoring)
- ✓ CLI queryability (e.g., `hermes graph query --type lineage --artifact rankings.csv`)
- ✓ Gitignored outputs (provenance artifacts, per Spec 089 pattern)
- ✓ Integration touchpoints with governance-spec-enforcement, hermeslink
- ✗ No implementation of 5 specs (4a–4e) in first pass
- ✗ No production runtime wiring
- ✗ No cross-file consistency checks beyond the scope boundary
- ✗ No agent/cron ops graph (Spec 112, deferred)
- ✗ No feature provenance (Spec 111, deferred)
- ✗ No 13F cohort graph (deferred)

**Stop Point**: After design/test scaffold + one full-cycle test (e.g., generate lineage for a single snapshot and verify all edges are correct). Do not implement all 5 specs unless diff is small and tests are clear.

---

## Architecture Freeze Status

**Active through May 26 (h20d decision)** or later, unless explicitly lifted by separate governance memo.

- ✓ KG/provenance work proceeds under this memo
- ✗ Ranker/selector/sizing changes require separate freeze-lift + Checklist v2 gates
- ✗ No unilateral authority to change production scoring logic

---

## Related Context

- **Spec 089 Phase 1.5A**: 12 node types, 15 edge types, 5 contradiction rules — shipped, proven pattern
- **13F Q1 2026**: 37/48 managers filed, Jaccard 0.99, all gates pass — quarantine cleared May 21
- **h20d (May 26)**: Separate freeze-lift decision — will require Phase 2 Step 5 validation + governance memo
- **Governance Control Pattern**: KG is read-only governance tool, not alpha engine. Production ranker changes require Checklist v2 (two-frame evidence, comparator, writeup, sign-off, receipt).

---

## Approval

**Approved by**: Governance (this memo)
**Effective**: 2026-05-21
**Expires**: 2026-05-26 (h20d decision will either confirm, modify, or revoke)

**Conditions**:
1. Spec 110 branch must be dedicated (no mixing with ranker/selector/sizing work)
2. Test scaffold must be complete before any implementation
3. No production runtime wiring without separate approval memo
4. Non-goals list must be reviewed by governance before implementation phase

---

## Signature

**Governance Clearance**: APPROVED
**Memo ID**: governance_clearance_spec089_spec110_2026_05_21
**Next Review**: May 26 h20d (freeze-lift decision)
