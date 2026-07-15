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

Open steps:
1. Merge PR #498 (main CI still RED from known py3.10 collection errors → likely admin-override,
   same as PRs #486–#488).
2. **After merge + pull in the shared checkout, run `python3 scripts/compact_expression_logs.py`
   there once** — the untracked `data/expression_attribution_log.jsonl` (kill-switch input) only
   exists in the deployed checkout. Backups land as gitignored `.bak` files.
3. Kill-switch `evaluation_status` may honestly flip (e.g. to insufficient_data) after dedup —
   expected, not a regression.

Worktree used: scratchpad `dedup-wt` (delete after merge). Note: the Claude Code
block-dangerous-git hook only allows `git push` from `/mnt/c/Projects/biotech_screener/biotech-screener`
itself — push worktree branches from the main checkout (worktrees share refs). Related:
[[feedback-shared-checkout-concurrency-2026-06-30]], [[project-forward-validation-hardening-2026-07-10]].
