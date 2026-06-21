---
name: langgraph-lg3-runtime-wrapper-locked
description: LG3 runtime wrapper LOCKED at 0afa9e25 — MODE_B_CRON_COMPATIBLE, READ_ONLY_DIAGNOSTIC, NON_BLOCKING, NO_AUTOMATION_APPROVAL
metadata:
  type: project
  status: active
  locked_at: 2026-06-19
  lock_id: "0n5ax6"
  commit: 0afa9e25
  originSessionId: 0c7c7507-2b0a-4c34-adaa-8737cd8b6b04
---

## LG3 Runtime Wrapper — LOCKED (0n5ax6)

**Status**: LANGGRAPH_PHASE_LG3_RUNTIME_SCHEDULING_WRAPPER_COMMITTED_AND_PUSHED

**Commit**: 0afa9e25

### Locked Invariants

```
MODE_B_CRON_COMPATIBLE_WRAPPER
READ_ONLY_DIAGNOSTIC
NON_BLOCKING_FAILURE
APPEND_ONLY_AUDIT_TRAIL
NO_PRODUCTION_HOOK
NO_RANKER_SELECTOR_SIZING_FINAL_SCORE_CHANGE
NO_AUTOMATION_APPROVAL_CASCADE
```

### Critical Nuance

**This completes the runtime-capable wrapper, NOT cron installation itself.**

- ✓ Wrapper script written, tested, committed
- ✓ Cron setup documentation complete
- ✗ Cron entry NOT installed (operator action pending)
- ✗ Observation period NOT started (waiting for manual cron activation)

### Governance

The wrapper is production-safe and can be deployed. It enforces:
- Non-blocking failure in all paths (exit 0 always)
- Read-only output (artifacts directory only)
- Append-only audit trail (JSONL, never overwrites)
- Governance metadata in every log entry (automation_approval: false immutable)
- LG2 independence (no decision cascades)

### Delivered Files & Runtime Detail

*(Merged from the same-commit `langgraph-lg3-runtime-scheduling-implemented` fact, 0afa9e25 — folded here to avoid a duplicate fact for one deliverable.)*

- **`tools/run_scientific_cartography_scheduled_review.py`** (265 lines) — Mode B cron-compatible wrapper. Auto-detects latest snapshot via `find_latest_snapshot_date()`, invokes LG1 with `--approve-review` default, `decision_actor="scheduled-review-automation"`. Logs every run (timestamp, as_of_date, outcome, duration, error_message + governance block) to **`artifacts/scientific_cartography/scheduled_review_cron.jsonl`** (append-only). Exit code 0 in all paths.
- **`docs/scientific_cartography_lg3_cron_setup.md`** (204 lines) — install/operate/rollback guide. Intended schedule: daily **08:05 AM ET**.
- **Disable/rollback**: remove the cron entry or `export LG3_SCHEDULED_REVIEW_DISABLED=1`.
- **Monitor**: `jq 'select(.outcome=="success")' artifacts/scientific_cartography/scheduled_review_cron.jsonl | wc -l`
- Note: `[[langgraph-lg3-cron-activated]]` records the later operator install (2026-06-19); current runtime state is governed by the containment freeze (crons paused, see `[[biotech_containment_governance_2026_06_21]]`).

---

**Approval date**: 2026-06-19  
**Implementation date**: 2026-06-19  
**Lock ID**: 0n5ax6
