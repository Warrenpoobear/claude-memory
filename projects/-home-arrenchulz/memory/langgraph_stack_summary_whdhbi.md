---
name: langgraph-stack-summary
description: Complete durable LangGraph stack — LG1 orchestrator, LG2 approval, LG3 design + runtime wrapper
metadata:
  type: project
  status: active
  locked_at: 2026-06-19
  lock_id: "whdhbi"
  originSessionId: 0c7c7507-2b0a-4c34-adaa-8737cd8b6b04
---

## LangGraph Stack Summary (whdhbi)

### Current Durable LangGraph Stack

```
LG1: 1b2c8095 — standalone review orchestrator
LG2: bdb97db7 — human decision artifacts
LG3 design: a95f14a8 — scheduled review design
LG3 runtime wrapper: 0afa9e25 — cron-compatible non-blocking wrapper
```

### Layer Descriptions

**LG1 (1b2c8095)**: Standalone Review Orchestrator
- Core deterministic workflow for artifact review
- StateGraph with pure function nodes (no LLM, no side effects)
- Entry point: `tools/run_scientific_cartography_langgraph_review.py`
- Status: OPERATIONAL
- Role: Review execution engine

**LG2 (bdb97db7)**: Human Decision Artifacts
- CLI flags: `--approve-review`, `--reject-review`, `--hold-review`
- Decision states: APPROVED_FOR_REVIEW_CONTINUATION, REJECTED_WITH_REASON, HOLD_PENDING_MORE_REVIEW, NO_DECISION_RECORDED
- Append-only JSONL artifact: `langgraph_human_decisions.jsonl`
- Governance: automation_approval immutably False
- Status: OPERATIONAL
- Role: Human-in-the-loop approval capture (review-workflow-only, never production deployment)

**LG3 Design (a95f14a8)**: Scheduled Review Design
- Specification for two modes: Mode A (manual) + Mode B (cron-compatible)
- Output directory convention, failure handling, retention policy, rollback procedures
- Status: DESIGN_ONLY (no runtime cron approved when design locked)
- Role: Planning layer above LG1/LG2

**LG3 Runtime Wrapper (0afa9e25)**: Cron-Compatible Non-Blocking Wrapper
- Script: `tools/run_scientific_cartography_scheduled_review.py`
- Documentation: `docs/scientific_cartography_lg3_cron_setup.md`
- Auto-detects latest snapshot, invokes LG1, logs to JSONL audit trail
- Non-blocking failure (exit 0 always)
- Status: COMMITTED, READY FOR CRON INSTALLATION
- Role: Scheduled execution wrapper (cron interface layer)

### Governance Locked Across Stack

- ✓ READ_ONLY_DIAGNOSTIC (all layers)
- ✓ NO_PRODUCTION_HOOK (all layers)
- ✓ NO_RANKER_SELECTOR_SIZING_FINAL_SCORE_CHANGE (all layers)
- ✓ NO_AUTOMATION_APPROVAL_CASCADE (LG2→LG3 independent)
- ✓ APPEND_ONLY_ARTIFACTS (LG2, LG3)
- ✓ NON_BLOCKING_FAILURE (LG3)

### Next Phase

**LG3 Observation Period** (2026-06-19 to 2026-07-03):
- Verify wrapper behavior in live cron execution
- Confirm audit trail appends cleanly
- Validate non-blocking failures stay non-blocking
- Ensure review artifacts remain bounded
- No production files move
- No portfolio impact

After successful observation: Consider LG4 (dashboard) and LG5 (Hermes summarization) as *optional enhancements*, not requirements.

---

**Lock ID**: whdhbi  
**Stack status**: COMPLETE
**Operational gates**: LG1/LG2 live; LG3 wrapper ready; observation pending
