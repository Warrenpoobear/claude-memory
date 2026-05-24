---
name: h20d_decision_memo_framework_2026_05_21
description: "h20d (May 26) decision memo framework — what to include, decision gates, evidence status"
metadata: 
  node_type: memory
  type: project
  status: in_progress
  expires: 2026-05-26
  related_to: 
    - h20d_phase_2_step_4_evidence_2026_05_21
    - 13f_q1_2026_monitoring_live_2026_05_15
  originSessionId: 07e3d060-a7b3-4528-9261-952fbd7fa93c
---

# h20d Decision Memo Framework — May 26, 2026

**Decision:** Freeze-lift YES/NO + Phase 2 Step 5 implementation timeline  
**Timeline:** Decision memo finalization May 25–26, decision execution May 26 EOD  
**Status:** Framework locked May 21; evidence collection May 21–26; finalization May 25–26

---

## Section 1: Evidence Summary (READY)

**Phase 2 Step 4 Implementation Status:**
- ✅ 4a Loader: 17/17 tests PASS
- ✅ 4b Query Layer: 10/10 tests PASS
- ✅ 4c Contradiction Detection: 12/12 tests PASS (C0 guard coverage restored)
- ✅ 4e Integration: 13/13 tests PASS
- ✅ Total: 52/52 tests PASS, 18.22s execution, post-commit hygiene CLEAN

**Architecture Validated:**
- Design-by-contract guard pattern verified (KnowledgeGraph.add_edge() enforces referential integrity)
- C0 structural coverage: Guard + defense-in-depth detector + test coverage confirmed
- C4 soft contradiction enforcement: Well-governed graphs require explicit documentation (validated by Spec 089 scenario)

**Known Limitations:**
- Phase 1 PoC lineage artifact gitignored (56 nodes, 16 edges for 2026-05-20)
- Daily lineage validation through May 26 shows all 5 query patterns executing without errors
- Phase 2 Step 4d (CLI) deferred — not required for h20d or preflight integration
- Phase 2 Step 5 (enforcement wiring) design locked; implementation blocked pending h20d approval

---

## Section 2: 13F Quarantine Status (PENDING)

**Monitoring Window:** May 15–26  
**Clearance Threshold:** Jaccard ≥ 0.70 when ≥34 managers filed  
**Current Status (as of May 21):**
- Managers filed: 6/48 (12.5%)
- Jaccard: 0.536 (below threshold)
- Quarantine: ACTIVE
- Next milestone: May 23–26 when additional managers expected to file

**Role in h20d Decision:**
- If Jaccard clears (≥0.70) by May 26 → Spec 089 KG governance pilot CAN be activated
- If Jaccard doesn't clear → Spec 089 KG rules remain advisory-only; no enforcement through Step 5
- If unclear by May 26 → Decision deferred to May 30 (post-13F final refresh)

---

## Section 3: Freeze-Lift Decision Options

### Option A: Approve Freeze-Lift + Conditional Step 5 (Recommended Path)

**Condition:** 13F quarantine clears (Jaccard ≥ 0.70) by May 26

**Actions:**
1. Publish h20d decision memo (May 26 EOD)
2. Merge spec-110-pipeline-provenance-graph-2026-05-21 to main
3. Begin Phase 2 Step 5 implementation (May 28+)
   - Wire What_Blocks_Ranker → preflight block/warning
   - Wire What_Contradicts → governance enforcement alert
   - Extend Phase 3b integration
4. Update Spec 089 KG pilot status from DEFERRED to ACTIVE
5. Activate daily lineage monitoring on production snapshots

**Timeline:** May 28–June 15 (Step 5 implementation) if 13F clears

**Rationale:**
- KG implementation is complete and validated
- Alpha freeze policy still applies (no ranker changes authorized)
- Step 5 enforcement only applies to Spec 089 governance decisions (not ranker changes)
- Contingent on 13F clearance (risk-managed through quarantine monitoring)

### Option B: Defer Freeze-Lift + Hold Step 5 (Conservative Path)

**Condition:** 13F quarantine doesn't clear or remains unclear by May 26

**Actions:**
1. Publish h20d decision memo noting incomplete quarantine clearance
2. Keep branch spec-110-pipeline-provenance-graph-2026-05-21 unmerged (staging)
3. Defer Phase 2 Step 5 implementation to June (post-13F final refresh)
4. Continue Spec 089 KG as advisory-only (no enforcement)
5. Plan re-decision for June 1 (post-13F final verdict expected May 30)

**Timeline:** June 1 re-decision if quarantine status unclear; no implementation until clearance confirmed

**Rationale:**
- Alpha freeze remains locked (no enforcement changes)
- Spec 089 governance remains deferred (consistent with cohort quarantine)
- KG validates cleanly; staging branch preserves implementation work
- Aligns with governance principle: no enforcement until quarantine clears

### Option C: Partial Freeze-Lift (Hybrid Path)

**Condition:** 13F shows improvement (e.g., Jaccard 0.65+) but below full clearance threshold

**Actions:**
1. Approve Phase 2 Step 4 completion for future reference
2. Merge KG implementation to main (locked/no-op until Step 5 approval)
3. Defer Step 5 enforcement until Jun 1 final 13F verdict
4. Activate daily lineage validation on production (non-enforcement)
5. Begin Spec 089 seed KG population (advisory state)

**Timeline:** May 28–May 31 (validation only), Jun 1+ (enforcement if clearance confirmed)

**Rationale:**
- Advances KG infrastructure without committing to enforcement
- Aligns enforcement activation with confirmed 13F stability
- Reduces implementation churn (if deferred to June) vs. re-merge risk

---

## Section 4: Evidence Collection (May 21–26)

### Daily Monitoring (automated)

**13F Quarantine Status:**
- Command: `python3 -m tools.check_13f_cohort_quarantine {today_date}`
- Track: Managers filed (cumulative), Jaccard similarity, quarantine status
- Update: Daily through May 26, final summary May 25

**Spec 110 Lineage Validation:**
- Command: `python3 -m tools.gen_provenance_lineage {snapshot_date}`
- Verify: All 5 query patterns execute, validation PASS, no schema gaps
- Summary: Confirm production readiness by May 25

### Manual Verification (May 25–26)

**Pre-decision checklist:**
- [ ] 13F quarantine status finalized (as of market close May 23)
- [ ] No new contradictions discovered in Phase 1 PoC lineage graphs
- [ ] Daily lineage validation 100% (May 21–26)
- [ ] Phase 2 Step 4 branch clean and ready to merge
- [ ] h20d memo draft complete (May 25 EOD)

**Decision inputs:**
- 13F final Jaccard ≥ 0.70? → Approve freeze-lift + Step 5
- 13F Jaccard < 0.70? → Defer enforcement, defer freeze-lift
- 13F unclear/mixed? → Hybrid path (merge for future, defer enforcement to Jun 1)

---

## Section 5: Communication Plan

### Internal (May 26 EOD)

**h20d Decision Memo to self:**
- Evidence summary
- 13F clearance status (final)
- Freeze-lift decision
- Phase 2 Step 5 approval or deferral
- Implementation timeline

### External (May 27, if freeze-lift approved)

**Spec 089 stakeholders:**
- KG implementation ready; governance pilot activation pending 13F clearance
- Expected timeline: May 28+ if approved, Jun 1+ if deferred

**Hermes agent fleet operators:**
- New preflight rules active (What_Blocks_Ranker, What_Contradicts) if Step 5 approved
- Training materials: Governance decision paths documented in KG schema

---

## Section 6: Known Unknowns (May 21–26)

### 13F Quarantine Verdict

**Unclear:** Manager filing rate may accelerate or stall May 22–26  
**Monitor:** Daily check via `check_13f_cohort_quarantine` through May 23  
**Contingency:** Re-decision May 30 if still below threshold by May 26

### Alpha Freeze Stability

**Assumption:** Alpha freeze policy remains in effect through May 26  
**Monitor:** Check MEMORY.md policy entries for any late changes  
**Contingency:** If freeze is lifted independently, h20d decision scope changes (consult then)

### Production Stability

**Assumption:** No critical bugs or operational incidents May 21–26  
**Monitor:** Daily snapshot runs; check post-snapshot supervisor logs  
**Contingency:** If snapshot fails post-May 23, defer h20d decision to Jun 1 (data quality precedence)

---

## Section 7: Next Steps (May 21–26)

1. **Daily:** Run lineage validation + 13F monitoring (automated)
2. **May 23:** Review 13F status mid-week; preliminary decision direction
3. **May 25:** Draft h20d memo based on 13F final status
4. **May 26:** Finalize decision memo and execute (merge, defer, or hybrid)
5. **May 27+:** Implement based on h20d decision (Step 5 approval or hold)

---

## Related Evidence

- [[h20d_phase_2_step_4_evidence_2026_05_21]] — Phase 2 Step 4 readiness (52/52 tests PASS)
- [[13f_q1_2026_monitoring_live_2026_05_15]] — Quarantine tracking and clearance thresholds
- [[13f_refresh_runbook_complete_2026_05_17]] — Validation gates and decision matrix
- [[phase_2_step_4_complete_2026_05_21]] — Implementation details and architecture
