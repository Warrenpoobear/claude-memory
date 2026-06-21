---
name: hermes_selfimprove_staging_2026_06_21
description: "Hermes recursive-self-improvement loop closure staged OUTSIDE frozen repo at ~/hermes_selfimprove_staging/; gated on containment gates; closes reward-signal + auto-promotion gaps"
metadata:
  node_type: memory
  type: project
  status: active
  date: 2026-06-21
  relatedTo: "biotech_containment_governance_2026_06_21, hermes_update_2026_06_21, hermes-skills-optimization-framework, hermes-skills-logging-integration-safe"
  originSessionId: 0f691105-7cfd-4213-9e8d-e8baf966cfc8
---

# Hermes Self-Improvement Loop — Staging (2026-06-21)

## What & why
User asked to make Hermes "recursively self-improve more." Repo is FROZEN
(INC-2026-06-20-AUTOPUSH, see [[biotech_containment_governance_2026_06_21]]) and
the ask — more autonomy/self-directed repo writes — is the *exact incident class*.
So built everything as non-executing drafts OUTSIDE the repo (governance-package
pattern), gated on all 3 containment gates. User chose "Draft outside repo."

## The gap (confirmed against d9531c7b)
Loop is self-MONITORING, not self-IMPROVING. Repo already logs every execution
(`skills_logger_v2.log_skill`) and reports (`hermes_skills_learning_loop_v2.py`),
but every `outcome.user_feedback` is `null`. Missing links:
1. `log_skill()` returns an `execution_id` that `run_agent_direct.py:514` discards.
2. `record_feedback()` (skills_logger_v2.py:140) exists but is never called.
3. LEARNINGS.md Pattern-Key→skill-patch promotion is 100% manual.

## Staged package: `~/hermes_selfimprove_staging/` (5 files + README)
- `weekly_learning_cron.txt` — Mon 09:00 ET weekly report (NOT installed; install violates ALL_AGENTS_CLOSED)
- `feedback_capture.patch` — captures exec_id, stamps `skill_exec_id` into run-log JSON (2-hunk diff vs run_agent_direct.py)
- `record_skill_feedback.py` — wraps `record_feedback()`; `attach_outcome_verdict(exec_id, was_correct, evidence)` is the automated reward source
- `pattern_to_skillpatch.py` — read-only LEARNINGS.md scanner; drafts skill patches for ≥3× patterns; auto-BLOCKS scoring/selector skills
- `APPLY_WHEN_GATES_CLEAR.md` — gated apply order (reward signal → automated source → cron → auto-draft) + rollback

## Validated under freeze (read-only)
`pattern_to_skillpatch.py` ran vs live `.learnings/LEARNINGS.md`: 16 entries scanned,
2 promotion-ready (`raw_count_size_confound`×3, `f_string_no_placeholder`×5), drafted,
correctly routed to docs/plumbing skills. Both py files compile clean.

## Next step
Nothing applies until BRANCH_PROTECTION_ENABLED + ALL_AGENTS_CLOSED +
QUIESCENCE_CONFIRMED_TWICE. The recursive piece = wiring `attach_outcome_verdict()`
into ONE ground-truth check (ic_health_monitor or catalyst watcher), advisory-only 7d.
