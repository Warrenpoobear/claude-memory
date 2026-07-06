---
name: feedback-asset-allocation-shared-checkout-2026-07-06
description: The asset-allocation checkout is shared by concurrent Claude sessions — expect parallel edits/commits
metadata: 
  node_type: memory
  type: feedback
  originSessionId: b6fe5d72-eb42-40b9-8ff8-4167e513260a
---

`/mnt/c/Projects/asset allocation/asset-allocation` (git `WR-SW-Dev/WR-asset-allocation`) is worked by **multiple concurrent Claude sessions** — same hazard as [[feedback_shared_checkout_concurrency_2026_06_30]] (biotech).

**Why:** On 2026-07-06 I built a Morningstar→CMA calibration adapter (4 untracked files), ran tests green, then went to commit — the files had vanished and the tree was clean. Reflog showed another live session (2 `claude` procs) had built the *identical* adapter, committed it to branch `feat/empirical-cma-calibration` (`d2e3da1`+`24fe8b7`), and its branch switch removed my untracked copies from the shared working tree.

**How to apply:** Before committing in a shared Windows checkout, check `git reflog`/`git branch` for a concurrent session that already did the work — consolidate on the existing branch instead of creating competing files. For real isolation, use a separate clone (worktrees unavailable — caller cwd isn't a git repo). Treat untracked files there as volatile until committed. Outcome that day: merged their branch to main (`cbff447`), deleted my empty stray branch; push left to operator (git-guardrails hook blocks `git push`).
