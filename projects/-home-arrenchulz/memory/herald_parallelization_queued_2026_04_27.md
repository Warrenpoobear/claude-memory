---
name: Herald parallelization queued post-verification
description: Herald sequential fetch is band-aided with 600→1800s timeout (commit 88532185, 2026-04-27). Real fix is parallelization, gated behind 2026-04-28 verification.
type: project
originSessionId: 5c6a5e68-077e-42e4-88e5-794e96471906
---
Herald (`tools/fetch_company_press_releases.py`) currently loops 341 tickers
sequentially with `RATE_LIMIT_SECONDS=2` and two sleeps per ticker — floor of
682-1364s in sleeps alone. Commit 88532185 (2026-04-27 11:23) raised the
subprocess timeout 600s→1800s and the wrapper PIPELINE_TIMEOUT 2700s→4500s.
Author flagged in commit message: "Band-aids only — Herald still needs
parallelization."

**Why:** Pre-fix Herald was timing out 9/10 weekday runs. The 08:02 catch-up run
on 2026-04-27 hit the old 600s limit. Today's 16:30 run is the first weekday
run on the new 1800s budget. The pause policy
(`policy_pause_until_2026_04_28_verification.md`) blocks structural changes
until tomorrow's verification gate passes.

**How to apply:** Do NOT parallelize Herald until:
  1. 2026-04-27 16:30 production run completes and Herald fits in 1800s
  2. 2026-04-28 09:00 ET one-shot verification passes
After both gates pass, draft a `ThreadPoolExecutor` patch with per-domain rate
limiting over the source loop in `tools/fetch_company_press_releases.py:500`.
Target: ~3-5 min wall time. AACT also flagged for separate cron.
