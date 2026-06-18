---
name: layer-b-reactivation-2026-06-05
description: "Layer B signal monitors re-enabled post-trading (18:00-18:20 ET) to restore observational coverage during Phase 2"
metadata:
  type: project
  status: active
  date: 2026-06-05
  relatedTo: "hermes_agent_skills_status_2026_05_26, phase2_day1_official_start_2026_06_01"
---

# Layer B Agent Reactivation — 2026-06-05

**Decision:** Restore Layer B observational monitoring (18:00–18:20 ET post-trading, Mon–Fri)

## What Changed

**Before:** Layer B agents dormant (no cron jobs, last heartbeat 2026-06-03)  
**After:** 5 Layer B agents scheduled daily post-trading

| Time | Agent | Status |
|------|-------|--------|
| 18:00 | price_action_watch | ✓ Scheduled |
| 18:05 | catalyst_delta | ✓ Scheduled |
| 18:10 | options_watch | ✓ Scheduled |
| 18:15 | ic_health_monitor | ✓ Scheduled |
| 18:20 | grok_biotech_watch | ✓ Scheduled |

## Why

Layer B agents produce advisory/observational outputs (no portfolio authority). Dormancy created blind spot during Phase 2 monitoring window. Reactivation restores situation awareness without violating Phase 2 governance constraints (portfolio locked, forward actions blocked).

## Governance Constraints (Unchanged)

- Phase 2 baseline locked (2026-06-04, immutable)
- Forward catalyst actions: BLOCKED (classifier remediation pending)
- Phase 3: BLOCKED (Phase 2 completion gate + classifier remediation)
- Layer B output authority: ADVISORY ONLY (no portfolio decisions)

## Test Verification (2026-06-05)

`python3 tools/build_price_action_watch.py --as-of-date 2026-06-05` executed successfully:
- Consumed fresh 2026-06-05 snapshot
- Output: 40 names, 39 alerted
- Written to artifacts/price_action_watch/2026-06-05_watch.json/.md

## Next Steps

Layer B monitors will run daily post-trading through Phase 2 decision gate (~2026-06-17). Outputs available for operator review; no automated portfolio changes authorized until Phase 3 gates clear.

---

**Status:** Active / Effective  
**Operator Review:** Recommended weekly (check Layer B outputs for unexpected signals)  
**Next Decision:** Phase 2 closure memo (~2026-06-17, based on IC observable + drawdown gate)
