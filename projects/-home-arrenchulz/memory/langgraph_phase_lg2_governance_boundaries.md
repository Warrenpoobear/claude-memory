---
name: langgraph-lg2-governance-boundaries
description: "LG2 approval pattern scope — review-workflow-only, never automation or production"
metadata: 
  node_type: memory
  type: feedback
  status: active
  locked_at: 2026-06-19
  originSessionId: 0c7c7507-2b0a-4c34-adaa-8737cd8b6b04
---

## LG2 Governance Boundaries (Locked)

**Commit**: bdb97db7 — "Add LangGraph human decision artifacts"

### What LG2 Is

- Human decision capture layer for Scientific Cartography review workflow
- CLI-driven approval pattern with 4 states: APPROVED_FOR_REVIEW_CONTINUATION, REJECTED_WITH_REASON, HOLD_PENDING_MORE_REVIEW, NO_DECISION_RECORDED
- Append-only JSONL artifact with full governance audit trail
- Deterministic nodes; automation_approval immutably False

### What LG2 Is NOT

- ✗ Cron/scheduler integration (no runtime automation)
- ✗ Dashboard or UI wiring
- ✗ Production model hook (biotech ranker/selector/sizing untouched)
- ✗ Agent summarization or LLM-driven deployment decisions
- ✗ Any form of automation_approval (governance-enforced False everywhere)

### Enforcement Rules

1. **automation_approval is ALWAYS false** — state level, artifact level, output level
2. **No production model changes** — governance block forbids ranker/selector/sizing/final_score changes
3. **Review-workflow-approval-only** — decision approves workflow continuation, never deployment
4. **Read-only diagnostic** — no side effects on biotech scoring engine
5. **Append-only artifacts** — audit trail never overwrites, supports multiple decisions per review

### CLI Interface

```bash
--approve-review                    # Approve workflow continuation
--reject-review                     # Reject (requires --decision-reason)
--hold-review                       # Hold for more review (requires --decision-reason)
--decision-reason <text>            # Actor's explanation
--decision-actor <name>             # Who made decision (default: "operator")
```

Mutually exclusive: only one of --approve-review, --reject-review, --hold-review per invocation.

### Relationship to Other Phases

- **LG1** (1b2c8095): Standalone review orchestrator; LG2 extends with decision capture
- **LG3** (design-only pending): Scheduled review jobs must maintain same governance (disabled-by-default, non-blocking, LG2 approval never cascades to automation)

### Key Test Coverage

- test_automation_approval_always_false — validates False in JSONL governance block and top-level state
- test_decision_artifact_jsonl_created — validates append-only, schema integrity
- Mutually exclusive CLI flag validation
- Decision reason requirement for reject/hold

### When to Reference This Memory

- Any discussion of LG2 scope expansion (answer: no cron, no automation, no production hook)
- Any consideration of LG3 design (baseline: maintain same governance boundaries, never treat LG2 approval as deployment approval)
- Any request to wire LG2 approval to production systems (answer: forbidden by governance, enforced at state level)
