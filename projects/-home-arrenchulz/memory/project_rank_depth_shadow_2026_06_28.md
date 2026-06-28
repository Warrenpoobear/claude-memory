---
name: project-rank-depth-shadow-2026-06-28
description: Rank-depth shadow tracking (Top-60 / ranks 31-60) shipped as validation infra; PR
metadata: 
  node_type: memory
  type: project
  status: shipped
  related: 
    - ees-shadow-monitor-state-2026-06-23
    - scoped-work-freeze-2026-06-22
    - reference-iss-document
  originSessionId: 288d161d-2b0d-4ba9-a697-3a0270b79120
---

Rank-depth shadow tracking shipped 2026-06-28 (operator-instructed, full spec). `VALIDATION_INFRASTRUCTURE / RANK_DEPTH_SHADOW_TRACKING / NO_MODEL_CHANGE`.

**What:** tracks Top-60 + ranks 31-60 alongside the Top-30 forward-validation basket. Top-30 = primary (unchanged); ranks 31-60 = shadow reserve bench; Top-60 = depth-of-rank cohort. Diagnostic only, not tradable by default.

**Files (commit `10cae69e` code + `18b5094e` docs):**
- `run_screen.py` — `add_rank_depth_cohorts()` + non-blocking sidecar `snapshots/<date>/rank_depth_top60.csv` (try/except guarded; written on every snapshot).
- `tools/run_forward_validation.py` — captures record `cohorts {top30, rank31_60, top60}`.
- `tools/fill_forward_returns.py` — `compute_cohort_returns()` (per-cohort EW/XBI/XS at 1d/5d/20d).
- `tools/run_daily_production.py` — `top60` price scope + opt-in `--validation-rank-depth {30,60}`; extracted module-level `MODE_DEFAULTS` + `resolve_validation_rank_depth_scope()`.
- `tools/rank_depth_validation_summary.py` (new) → `artifacts/validation/rank_depth/RANK_DEPTH_VALIDATION.md`.
- `tests/test_rank_depth_validation.py` (new, 9/9). ~770 regression tests touching modified tools pass.
- `docs/MODEL_DOCUMENTATION.md` — Recent Update section.

**Not changed:** ranker/selector/scoring/eligibility/sizing/cron/production-defaults/trading. Freeze intact ([[scoped-work-freeze-2026-06-22]]). Cron promotion of rank-depth reporting deliberately NOT done (deferred per ratified FORWARD_VALIDATION_PROTOCOL.md).

**Branch topology gotcha:** built in isolated worktree `.claude/worktrees/rank-depth-shadow` on branch `feat/rank-depth-shadow`, based on `prod/sharpen-run-screen-production-2026-06-28` (HEAD `98a8f1c0`) — NOT main. As of 2026-06-28, a stack of ~37 commits (forward-validation infra, prod-timing, options shadow, 13F, backtest audits, hermes hardening) sits on feature branches far ahead of `main` (main only ~1 commit past merge-base `2035a5aa`). PR #436 initially targeted main → CONFLICTING (37 commits); **retargeted base to `prod/sharpen-run-screen-production-2026-06-28`** → clean 2-commit descendant. When PR-ing stacked feature work, target the actual parent branch, not main.

**Concurrency note:** a concurrent process/agent was editing `run_screen.py` live during this session (added `_read_price_history_rows` cache + `--validation-daily` mode, committed as `98a8f1c0`). The harness "modified since read" guard kept firing; resolved by working in an isolated worktree off HEAD. Re-confirms [[explore-agent-bash-write-risk-2026-06-22]] live-watcher hazard.
