---
name: WSL/Ubuntu must be kept running during scheduled cron windows
description: Cron only fires when Ubuntu/WSL is alive. Minimum operating window 16:00-20:00 ET Mon-Fri; ideal 08:00-20:00 ET trading days. Friday 19:00 ET calibration cron requires Ubuntu still running into the evening.
type: project
originSessionId: d23dc9cc-6e15-4e35-a37f-c052a24155e0
---
**The Linux cron daemon only runs when Ubuntu/WSL is alive.** Closing Windows, suspending the laptop, or letting WSL get killed silently misses scheduled cron entries. There is no retry layer.

**Why this matters now (2026-04-28):** The calibration_evidence agent missed its Friday 2026-04-24 19:00 ET fire. Investigating in-session, no code-level cause was found. The likeliest explanation per the user: WSL was not running at 19:00 ET that Friday. This is consistent with the symptom pattern (no log entry vs error log) — a missed fire, not a failed fire.

**Required operating windows (Mon-Fri trading days):**

| Window | What runs | Severity if missed |
|---|---|---|
| 08:00 ET | Morning data refresh, herald, ctgov_poller (14:30 ET catch-up) | Medium — daily 16:30 production may compensate |
| 14:30 ET | ctgov_poller, herald | Medium |
| 16:30 ET | **Daily production cron** (run_screen, scoring, snapshot promote) | **HIGH — model output not produced** |
| 17:00–17:30 ET | Heartbeat checks, ops triage | Medium — supervisor will RED-flag missing rankings |
| 18:00 ET | crt_resolution_watcher, watchdog | Medium |
| 18:20–19:00 ET | Catalyst delta, options_watch, postmortem, event_analyst, others | Low–medium |
| 19:00 ET (Fri) | calibration_evidence | Low — weekly; stale memory says 11d limit |
| 19:30 ET | inst_delta forward shadow checkpoint | Medium — h-day skipped |
| 19:40 ET | cross-signal forward bucket logger | Medium — h-day skipped |
| 20:30 ET | ops_supervisor | Medium — sentinel will catch absence |
| 20:40 ET | supervisor sentinel | High if supervisor missed AND sentinel missed |

**Minimum acceptable**: 16:00–20:30 ET Mon–Fri.
**Recommended**: 08:00–21:00 ET on trading days.

**How to verify cron is alive in Ubuntu:**

```bash
sudo service cron status
# or
pgrep cron
```

If dead:

```bash
sudo service cron start
```

**How this affects ops_supervisor classification:** The supervisor's `calibration_evidence_stale` exception currently treats a single missed Friday cron as YELLOW (watch only) until 2026-05-01 19:00 ET. That's correct behavior — but the *root cause* is most likely WSL availability, not code. If 2026-05-01 also misses, the next investigation step is **verify Ubuntu was running at 19:00 ET on 2026-05-01**, not debug `build_calibration_evidence.py`.

**Longer-term fix (not built):** A `tools/wsl_runtime_health_check.py` could verify cron daemon, repo mount, .env readability, disk space, time sanity, expected crontab entries — to disambiguate "agent failed" from "WSL was off". Spec sketched in conversation 2026-04-28 but deferred. The cleanest version of this lives at the OS layer (Windows Task Scheduler that starts WSL + cron during business hours), not as Python.

**How to apply in future sessions:**
- Before debugging a missed cron fire, ask: "was WSL running at the scheduled time?"
- For repeated misses on the same time slot (e.g., consistent Friday-evening misses), suspect environment availability before suspecting code.
- Don't propose code-level retries for missed fires — they only retry within the same session, which assumes WSL is alive when the retry runs.
