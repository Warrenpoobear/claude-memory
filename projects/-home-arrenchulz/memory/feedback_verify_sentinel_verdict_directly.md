---
name: Verify sentinel verdict directly when downstream agents report rollback
description: openclaw-monitor (and other downstream readers) can misread sentinel artifacts — always read the sentinel daily memo before acting on a "ROLLBACK_RECOMMENDED" claim
type: feedback
originSessionId: e73699c3-7da1-4e6b-bde7-f46ff1037fdf
---
When openclaw-monitor or any downstream summarizer reports `sentinel ROLLBACK_RECOMMENDED` (or "N consecutive WARN days"), do NOT act on the headline. Read `agents/sentinel/memory/{date}.md` directly first.

**Why:** On 2026-05-01, openclaw-monitor reported "sentinel ROLLBACK_RECOMMENDED: 5 consecutive WARN days on ruleset 2a3e79eb adaptive cost/cap thresholds." The actual 2026-04-30 sentinel daily memo said:
- Recommendation: **WATCH**, with "Improving trend argues against rollback recommendation today"
- 7 degraded days were 5 FAIL + 1 WARN, not 5 WARN
- The signal was `catalyst_7d_count_high` (portfolio composition), not adaptive cost/cap thresholds
- Drift guardrails reported "no adaptive warnings, cost coverage 100%, cap binding 0%"
- 04-30 was the first IMPROVEMENT: FAIL→WARN, count 8→5, weight 28.58%→17.43%

The downstream agent inverted the trend direction (improving → degrading), miscounted the days, and substituted a different signal name. Acting on the headline would have triggered an unnecessary governance event and potentially a ruleset rollback during an improving trend.

**How to apply:**
1. When a monitor claims sentinel verdict, immediately read the latest `agents/sentinel/memory/*.md` (sorted by date) and compare.
2. The fields that matter for a rollback decision: `Overall Status`, `Recommendation`, `Direction` (IMPROVING/DEGRADING), and the underlying signal name.
3. If the monitor-claimed signal name is different from what sentinel actually reports, treat the monitor as wrong by default.
4. Sentinel's own escalation rule is the source of truth: it currently says "if phase-2 re-enters FAIL territory next week, escalate" — that's the trigger, not a downstream agent's summary.
