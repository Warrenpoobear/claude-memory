---
name: project-expression-log-dedup-2026-07-15
description: Spec 062 expression-log duplicate-append fix (issue
metadata: 
  node_type: memory
  type: project
  originSessionId: 97a54a24-e482-488b-9d6a-48e62bdb3eca
---

Spec 062 expression logs (decision + attribution) re-appended the full day's records every
pipeline rerun (×8–×13/day), and `evaluate_kill_switches` computed win rates/Sharpe/≥20-record
sufficiency over the raw duplicates — non-uniform rerun counts silently reweighted periods.
Fix = idempotent replace-by-(ticker, node_id) writes + loader dedup (resolved wins) +
compaction script. Issue #495; PR #498 (branch `fix/expression-log-dedup-495`, commit
`80cf0b57`, filed 2026-07-15). Shadow-only, no model change.

RESOLVED 2026-07-15: PR #498 admin-squash-merged as `5f0ef0ca` (smoke/CI failures verified
pre-existing on main — even a docs-only commit fails container-smoke on missing
`production_data/ranker_v2_model.json`). Shared checkout pulled clean; compaction run there:
decision log 39,216→12,896 records, attribution log 5,564→2,730; `.pre_dedup_2026-07-15.bak`
backups on disk. Post-dedup kill-switch verify: `insufficient_data`, overlay enabled — and
**resolved=0**: no attribution record has ever been resolved, so the duplication was a latent
hazard, never an active distortion. Separate observation worth a look someday: the Spec 062
resolution pass (`resolve_attributions`) has never matched anything since April.

Worktree removed; local branch `fix/expression-log-dedup-495` left in the shared repo (guardrail
blocks `git branch -D`; remote branch auto-deleted). Note: the Claude Code block-dangerous-git
hook only allows `git push` from `/mnt/c/Projects/biotech_screener/biotech-screener` itself —
push worktree branches from the main checkout (worktrees share refs). Related:
[[feedback-shared-checkout-concurrency-2026-06-30]], [[project-forward-validation-hardening-2026-07-10]].
