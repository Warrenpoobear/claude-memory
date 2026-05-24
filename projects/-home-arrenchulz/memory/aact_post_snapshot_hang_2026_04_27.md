---
name: AACT post-snapshot hang killed both 2026-04-27 production runs
description: Both 2026-04-27 production runs died silently post-snapshot — morning hung mid-AACT, 16:30 wrapper produced no Python output at all. Trigger condition for the post-snapshot task supervisor named in the pause policy.
type: project
originSessionId: 5c6a5e68-077e-42e4-88e5-794e96471906
---
On 2026-04-27, **both** daily production wrapper invocations died silently after writing only the wrapper's "Starting daily production" log line:

1. **08:02 reboot catch-up** — Python ran through Module 1-5 successfully, wrote
   `data/snapshots/2026-04-27/rankings.csv` at 08:25, kept logging through CRT
   resolutions at 08:38:38, then printed `[5n] AACT trial warehouse refresh
   (weekly, latest 6d old) ...` and produced no further output. The wrapper
   never wrote a PASS/FAIL/TIMEOUT line. The lock file was cleaned up (EXIT
   trap fired), so the wrapper received SIGTERM or exited gracefully — not
   SIGKILL. Herald had already timed out at 600s earlier in the same run
   (pre-fix; Herald timeout bump 600→1800s landed at 11:23 in commit 88532185).

2. **16:30 scheduled run** — Wrapper started at 16:30:01, took the lock,
   wrote "Starting daily production" to both cron.log and the daily log.
   Then NOTHING. No Python output appeared in the daily log (file gained
   exactly 70 bytes — just the cron-wrapper line). No PASS/FAIL/TIMEOUT
   was logged. Lock file was cleaned up. By 16:39 (9 min in), zero
   production processes existed; total system process count was 28.
   Either Python detected the existing morning snapshot via the
   completed-manifest gate (`run_daily_production.py:4112`) and exited
   before flushing, OR the wrapper got SIGTERM'd before reaching its
   PASS/FAIL block.

**Why:** This matches the trigger condition called out in
`policy_pause_until_2026_04_28_verification.md`:
"if next run still dies post-snapshot, build a post-snapshot task
supervisor (not another monitor)". The wrapper itself acknowledges this
in `tools/cron_daily_production.sh:142`: "post-snapshot tasks (Herald,
AACT, etc.) sometimes hang and never return EXIT_CODE, but the snapshot
itself is already complete by then." The rank-change monitor was already
gated on snapshot existence rather than exit code for this reason.

**How to apply:**

- Today's data is OK — morning snapshot at 08:25 is complete, downstream
  agents (review_queue_steward, postmortem, options_watch, etc.) operate
  on that snapshot. No data loss.
- The Herald 600→1800s timeout bump landed in commit `88532185` but
  CANNOT be evaluated from today's runs — Python produced no output past
  "Starting" on the 16:30 attempt, and the morning run hung in AACT
  (post-Herald), not Herald itself.
- Tomorrow's 2026-04-28 09:00 ET verification one-shot
  (`tools/cron_one_shot_2026_04_28.sh`) will likely surface AACT as the
  next bottleneck even if Herald is fine. Plan for that outcome:
  Herald-PASS + AACT-FAIL is a partial green, not a full pass.
- Post-04-28, the right shape of fix is a **post-snapshot task
  supervisor** (per-task timeouts, kill-and-continue, structured PASS/
  FAIL emission per task) — NOT another monitor, NOT another wrapper
  layer. The supervisor would let the wrapper exit cleanly with a
  meaningful summary even when individual tail tasks (Herald, AACT, CRT
  watcher tail) hang.
- Do NOT build the supervisor before the 04-28 verification clears,
  per the pause policy. The two silent deaths today are evidence for the
  supervisor design, not a license to build it now.

**Open question for the verification audit:** the morning run made it
into AACT and hung; the 16:30 run apparently never produced any Python
output. If the 16:30 run took the manifest-skip path
(`run_daily_production.py:4112`) and exited successfully, the wrapper
should have logged PASS — it didn't. Either the manifest-skip path is
silent (logging-only, no return), or the wrapper was killed by something
external (WSL2 host sleep, SIGTERM from another process). The
verification audit should distinguish these by reproducing a manifest-
skip run in isolation and checking whether it logs PASS.
