---
name: Agent expansion roadmap
description: Priority-ordered next 5 agents after the initial 7 — review queue steward first, all read-only or artifact-writing
type: project
---

## Next 5 agents (user-specified priority, 2026-03-26)

1. **review_queue_steward** — reads review_queue.csv/md + coverage_quality.json, groups into "must look now" vs "monitor", explains what changed vs yesterday. Cleanest next addition — sits on a deterministic artifact already produced every run.

2. **decision_memo / ic_brief** — reads the decision memo / IC-style brief from snapshot, answers "what changed, what matters, what needs a decision." Morning/evening brief role.

3. **hedge_guard** — watches hedge posture, concentration, portfolio alerts from biotech_hedge_report.py + portfolio report + readiness. Flags when hedge/risk picture meaningfully changed.

4. **evidence_packet** — reads/runs signal evidence packet (run_signal_evidence.py), tells you whether a proposed signal/ruleset change deserves deeper attention. Narrower sibling of calibration, one proposal at a time.

5. **freshness_scout** — watches source freshness, missing collectors, weekend-safe fallbacks, stale coverage drift from collection health + cache + data integrity artifacts. Highest-ROI data-quality protection.

## Governance tier assignments
- Read-only: review_queue_steward, hedge_guard, evidence_packet, freshness_scout
- Artifact-writing: decision_memo (writes brief to artifacts/decision_memo/)
- Human-only: all promotion, rollback, trade, code decisions

## Dependency chain
- review_queue_steward: no dependencies, can deploy immediately after current fleet stabilizes
- decision_memo: benefits from review_queue_steward output
- hedge_guard: independent, can deploy in parallel
- evidence_packet: benefits from calibration agent context
- freshness_scout: independent, can deploy in parallel

**Why this order:** review_queue_steward and decision_memo give biggest reduction in human packet-reading overhead. hedge_guard adds portfolio discipline. evidence_packet improves governance. freshness_scout protects data quality.

**How to apply:** Deploy one at a time, prove low-noise over 5 trading days before adding the next. Same trial rubric pattern as catalyst_delta.
