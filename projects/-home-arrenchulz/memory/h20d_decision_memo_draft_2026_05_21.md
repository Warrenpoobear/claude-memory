---
name: h20d_decision_memo_draft_2026_05_21
description: h20d decision memo draft (May 21) — ready for finalization May 25–26 based on 13F verdict
metadata: 
  node_type: memory
  type: project
  status: in_progress
  expires: 2026-05-26
  related_to: 
    - h20d_phase_2_step_4_evidence_2026_05_21
    - 13f_q1_2026_monitoring_live_2026_05_15
    - phase_2_step_4_complete_2026_05_21
  originSessionId: 07e3d060-a7b3-4528-9261-952fbd7fa93c
---

# h20d Decision Memo — May 26, 2026

**Decision Authority:** User (Darren Schulz)  
**Decision Date:** May 26, 2026 EOD  
**Memo Status:** DRAFT (May 21) — Ready for finalization May 25–26

---

## Executive Summary

Phase 2 Step 4 Knowledge Graph implementation is **complete and validated** (52/52 tests PASS). Freeze-lift decision contingent on 13F quarantine clearance (Jaccard ≥ 0.70 expected May 23–26). Two paths forward:

1. **Path A (Recommended):** Freeze-lift approved + Phase 2 Step 5 implementation (May 28+) IF 13F clears
2. **Path B (Conservative):** Defer both freeze-lift and enforcement until June 1 final 13F verdict IF unclear

---

## Part 1: Evidence & Readiness

### Phase 2 Step 4 Implementation — ✅ COMPLETE

**Deliverables:**
- 4a Loader: 17/17 tests PASS (schema validation, JSONL seed, guard enforcement)
- 4b Queries: 10/10 tests PASS (4 query patterns: blockers, contradictions, evidence, promotion)
- 4c Contradictions: 12/12 tests PASS (C0–C5 detection with guard coverage restored)
- 4e Integration: 13/13 tests PASS (loader-query-detector contracts, Spec 089 scenario)
- **Total: 52/52 tests PASS** (execution time: 18.22s)

**Code Quality:**
- 2,500+ lines implementation (tools/kg_*.py, tools/graph_*.py)
- 1,000+ lines test code
- 100% test coverage (all query patterns, all contradiction types, error paths)
- Pre-commit hooks enforced (black, isort, flake8)
- Commit d0be4c7b clean (no formatting issues, whitespace check passed)

**Architecture Validated:**
- Design-by-contract guard pattern: `KnowledgeGraph.add_edge()` enforces referential integrity at API layer
- C0 structural coverage restored: Guard tests + detector code + clean-graph validation
- C4 soft contradiction enforcement: Policy requiring PENDING nodes to have DOCUMENTS/DEPENDS_ON edges
- Loader-query-detector contracts verified through integration tests

**Known Limitations (Acceptable):**
- Phase 1 PoC lineage artifact gitignored (56 nodes, 16 edges for 2026-05-20)
- Phase 2 Step 4d (CLI) deferred post-h20d (not required for enforcement)
- Phase 2 Step 5 (enforcement wiring) design locked, implementation blocked pending h20d approval

### 13F Quarantine Status (as of May 21, 2026)

**Current State:**
- Managers filed: 6/48 (12.5%)
- Jaccard similarity: 0.536
- Quarantine status: **ACTIVE**
- Monitoring: Daily cron active weekdays 6:22 PM ET through June 20

**Expected Clearance Timeline:**
- May 23–26: Additional manager filings expected
- Clearance trigger: Jaccard ≥ 0.70 when ≥34 managers filed
- Final verdict: May 26 EOD OR May 30 (if still unclear)

**Role in h20d Decision:**
- If Jaccard clears (≥0.70) by May 26 → Spec 089 KG governance pilot CAN activate
- If Jaccard doesn't clear → Spec 089 KG remains advisory-only
- If unclear by May 26 → Both freeze-lift and Step 5 enforcement deferred to June 1

---

## Part 2: Decision Paths

### Path A: Freeze-Lift Approved + Step 5 Implementation (RECOMMENDED)

**Gate:** 13F quarantine clears (Jaccard ≥ 0.70) by May 26

**Actions:**
1. Publish this memo with h20d verdict: APPROVED
2. Merge spec-110-pipeline-provenance-graph-2026-05-21 to main (Phase 2 Step 4 locked)
3. Begin Phase 2 Step 5 implementation (May 28+)
   - Wire What_Blocks_Ranker → preflight block/warning
   - Wire What_Contradicts → governance enforcement alert
   - Extend Phase 3b integration
4. Update Spec 089 status from DEFERRED → ACTIVE (governance pilot)
5. Activate daily lineage monitoring on production snapshots (May 27+)

**Success Criteria:**
- Phase 2 Step 5 implementation: 60+ tests PASS, zero contradictions in seed graph
- Spec 089 KG validators wired and enforcing by June 15
- Freeze-lift takes effect: Ranker research can proceed under KG governance

**Timeline:**
- May 26 EOD: Memo published, decision executed
- May 27–28: Main branch integrations, CI/CD validation
- May 28–June 15: Step 5 implementation (design → code → test → merge)
- June 15: Freeze-lift effective, new ranker work authorized under governance

**Risk Level:** LOW (contingent on 13F clearance; if it doesn't clear, immediately execute Path B)

---

### Path B: Defer Freeze-Lift + Hold Step 5 (CONSERVATIVE)

**Gate:** 13F quarantine doesn't clear or remains unclear by May 26

**Actions:**
1. Publish this memo with h20d verdict: DEFERRED
2. Keep branch spec-110-pipeline-provenance-graph-2026-05-21 unmerged (staging)
3. Continue Spec 089 KG as advisory-only (no enforcement)
4. Defer Phase 2 Step 5 implementation to June (post-13F final refresh, expected May 30)
5. Schedule re-decision for June 1 (post-13F final verdict)

**Success Criteria:**
- 13F final refresh verdict available May 30
- 13F Jaccard ≥ 0.70 achieved → enables June 1 re-decision for freeze-lift
- KG implementation preserved in staging; no work wasted

**Timeline:**
- May 26 EOD: Memo published, decision deferred
- May 27–31: Monitor 13F refresh for final verdict
- June 1: Re-decision based on 13F final state

**Risk Level:** NONE (preserves optionality, no enforcement changes)

---

### Path C: Partial Freeze-Lift (HYBRID — If 13F Shows Improvement)

**Gate:** 13F Jaccard 0.65–0.69 (improving but below threshold)

**Actions:**
1. Approve Phase 2 Step 4 completion (locked in main)
2. Merge KG implementation to main (locked/no-op until Step 5 approval)
3. Begin Spec 089 seed KG population (advisory state only)
4. Activate daily lineage validation on production (non-enforcement monitoring)
5. Defer Step 5 enforcement to June 1 final verdict

**Timeline:**
- May 26: Merge for infrastructure, no enforcement
- May 27–31: Validation monitoring, 13F final refresh
- June 1: Enforcement decision based on final 13F state

**Risk Level:** MEDIUM (requires careful transition from staging to enforcement)

---

## Part 3: Governance Context

### Alpha Freeze Status (May 21)

**Policy:** `policy_alpha_freeze_2026_04_04.md`  
**Status:** ACTIVE (blocks all ranker/selector changes without Checklist v2 approval)  
**KG Enforcement Role:** If h20d approves, Step 5 KG queries inform preflight decision gates  
**No Change to Freeze:** Freeze remains locked; KG adds governance layer, doesn't remove freeze

### Why Step 5 Enforcement Waits Until After h20d

Step 5 wires KG queries into the agent preflight system. Activating enforcement before h20d decision would:
1. Risk premature blocking of valid operations (KG data incomplete pending 13F refresh)
2. Create loop with quarantine (13F → distortion cleared → Spec 089 governance → Step 5 enforcement)
3. Violate governance sequencing (enforcement decision depends on quarantine verdict)

**Correct sequence:**
1. May 21: Phase 2 Step 4 complete (evidence ready) ✅
2. May 23–26: 13F quarantine monitoring (gates freeze-lift decision)
3. May 26: h20d verdict (freeze-lift approved or deferred)
4. May 28+ (if approved): Step 5 implementation (enforcement wiring)

---

## Part 4: Monitoring & Contingencies (May 21–26)

### Daily Checks (automated)

**13F Quarantine:**
```bash
python3 -m tools.check_13f_cohort_quarantine {date}
# Track: Managers filed (cumulative), Jaccard, quarantine status
# Daily through May 26
```

**Spec 110 Lineage:**
```bash
python3 -m tools.gen_provenance_lineage {snapshot_date}
# Verify: All 5 query patterns execute, validation PASS, no schema gaps
# Summary by May 25
```

### Pre-Decision Checklist (May 25–26)

- [ ] 13F quarantine status finalized (as of market close May 23)
- [ ] No new contradictions in Phase 1 PoC lineage graphs (May 21–25)
- [ ] Daily lineage validation 100% (May 21–26)
- [ ] Phase 2 Step 4 branch clean and synced
- [ ] h20d memo ready for publication (May 25 EOD)

### If 13F Status Unclear by May 25

- Execute Path B (defer both freeze-lift and Step 5)
- Schedule June 1 re-decision
- Preserve Phase 2 Step 4 work in staging
- No enforcement changes; KG advisory-only through May 31

### If Production Incident May 21–26

- Immediate priority: Stabilize production
- h20d decision deferred to June 2 (post-incident investigation)
- Phase 2 Step 4 evidence preserved; no work wasted

---

## Part 5: Approval Checklist

**Ready for execution May 26 EOD?**

- ✅ Phase 2 Step 4 complete (52/52 tests)
- ✅ Code quality validated (pre-commit, post-commit hygiene)
- ✅ h20d evidence documented
- ⏳ 13F quarantine final verdict (awaiting May 23–26)
- ⏳ Production stability check (daily through May 26)

**Decision authority:** User approval required May 26 EOD

---

## Signature Block (To be completed May 26)

**h20d Decision:** [APPROVED / DEFERRED / HYBRID]

**13F Quarantine Verdict:** [CLEARED / NOT CLEARED / UNCLEAR]

**Execution Path:** [Path A / Path B / Path C]

**Approved by:** Darren Schulz  
**Timestamp:** [May 26, 2026, HH:MM ET]

**Implementation owner:** Claude  
**Execution start date:** [May 27 or June 1, depending on decision]

---

## Related Evidence

- [[h20d_phase_2_step_4_evidence_2026_05_21]] — Implementation readiness
- [[h20d_decision_memo_framework_2026_05_21]] — Decision framework and contingencies
- [[phase_2_step_4_complete_2026_05_21]] — Detailed deliverables
- [[13f_q1_2026_monitoring_live_2026_05_15]] — Quarantine tracking
- [[13f_refresh_runbook_complete_2026_05_17]] — Validation gates and decision matrix
