---
name: Don't supervise the supervisor — install a smoke alarm
description: When building monitoring layers, do not stack supervisor → supervisor-supervisor → supervisor-supervisor-supervisor. The meta-layer should be a tiny health-check sentinel (~50-100 lines), not another interpretive layer.
type: feedback
originSessionId: d23dc9cc-6e15-4e35-a37f-c052a24155e0
---
When building monitoring infrastructure, stop the recursion at one cheap sentinel. Don't propose a "supervisor of the supervisor" or any deeper meta-layer.

**Why:** The user explicitly called this out (2026-04-28) when I was about to add a supervisor on top of the heartbeat monitor: *"You don't supervise the supervisor. You install a smoke alarm for the supervisor."* The right structure is bounded:

```
agents → heartbeat monitor → supervisor → sentinel (terminus)
```

**How to apply:**
1. Each layer's job is narrow:
   - **Heartbeat monitor**: did the cron fire?
   - **Supervisor**: is the failure actionable, known, or expected?
   - **Sentinel**: did the supervisor produce a valid artifact today? (THIS LAYER ENDS HERE.)
2. The sentinel must be **tiny** (~50–100 lines). It does NOT interpret model state, classify failures, or read agent logs. It only verifies the supervisor's artifact exists, parses, contains required fields, and is fresh.
3. The supervisor itself must **fail closed** when its inputs are missing (set severity=RED with an explicit reason) so the sentinel can detect missing-monitor scenarios via the supervisor's own output rather than needing its own monitor-monitor.
4. When a future request implies a "monitor for the X monitor", refuse to add another layer — instead ask whether layer X can be made fail-closed (so its own output is self-describing) and verified by the existing terminal sentinel.

**Daily ops question becomes:** "Is sentinel GREEN?" If yes, read supervisor verdict only if it's not GREEN. If no, fix the supervisor plumbing. Two-step decision tree — that's the end of the recursion.
