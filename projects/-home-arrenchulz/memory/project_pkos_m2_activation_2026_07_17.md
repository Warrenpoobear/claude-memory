---
name: project_pkos_m2_activation
description: PKOS M2 manual-activation runbook status for wake-robin-knowledge — items complete, cycle count, M4 block state
metadata:
  type: project
  originSessionId: session-2026-07-17-pkos-m2
---

PKOS Milestone 2 (`docs/RUNBOOK-PKOS-M2.md` in [[reference_wake_robin_knowledge_repo]]) is a
**human-executed manual validation milestone** gating M4 (Town orchestrator, `docs/SPEC-PKOS-M4.md`)
implementation. Governance lives on GitHub Issue #3 in `Warrenpoobear/wake-robin-knowledge`.

**Status as of 2026-07-17:**
```
M2_ITEMS_1_8: COMPLETE_WITH_EVIDENCE
M2_ITEM_9: OPEN
QUALIFIED_PROMOTION_CYCLES: 1_OF_3
  Cycle 1: PR #10, merged as d3382b7 (indexes/monthly-review-2026-07.md)
M4_IMPLEMENTATION: BLOCKED
CRON_AND_SCHEDULING: NOT_AUTHORIZED
```

Items 1–8 evidence (clone/HEAD-verify, Obsidian vault, `local-only/` create+verify+ignore-check,
backup/restore drill, Lane-A prep run, report validation incl. reproducibility + seeded-case
routing against the M4 gates, one full human-gated promotion cycle, deterministic-rerun /
no-M1-defect-recurrence check) all recorded and independently verified this session.

**Why Item 9 stays open:** the runbook requires ≥3 *consecutive clean manual cycles* plus explicit
human sign-off before cron/Lane-C wiring. Only one qualifies so far. The user explicitly rejected
running a same-day "Cycle 2" using a manufactured artifact (a proposed `docs/M2-CYCLE-LOG.md`) —
see [[feedback_no_governance_theater_evidence]] for the durable lesson.

**How to apply:** Cycle 2 (and 3) must each occur on a **separate future occasion**, start from
the then-current canonical `main`, and promote something that **independently deserves to exist**
in the vault (a real daily/weekly/monthly Lane-A output worth keeping, or an evidence-backed
knowledge update) — not a manufactured process-log artifact. Each cycle repeats the full path:
fresh Lane-A run → report review → explicit human approval → branch → commit → review-gated PR →
human merge → canonical byte verification. Do not check Item 9, wire cron, or touch Lane-C
automation until 3 qualifying cycles are recorded and the user signs off on Issue #3.
