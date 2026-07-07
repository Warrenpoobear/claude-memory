---
name: phase_2_step_3b_preflight_wired_2026_05_15
description: Phase 2 Step 3b preflight integration complete — agent_preflight wired into run_agent_direct with blocking/warning/non-blocking modes
metadata: 
  node_type: memory
  type: project
  status: completed
  expires: 2026-05-23
  originSessionId: ac2e97af-a29e-41ec-9781-6d83e22339a2
---

# Phase 2 Step 3b — Preflight Integration Complete (2026-05-15)

**Status**: COMPLETE ✅ | **Tests**: 5/5 PASS | **Commits**: `f29f53ed` + `c5da6870`

## What was delivered

Integrated `tools/agent_preflight.py` governance enforcement into `tools/run_agent_direct.py`:
- **Blocking path**: agents matching `_AGENT_SCOPE_KEYWORDS` → checked against `not_allowed` list → exit 1 if blocked
- **Warning path**: contradictions and blocked specs printed to stderr; execution continues
- **Non-blocking path**: preflight unavailable/errored → warn and continue (Lane A/B unaffected)
- **Audit**: full preflight report included in JSON logs for post-hoc governance tracing

## How it works

```bash
# Normal: preflight runs, checks governance, blocks fleet_steward if ranker changes frozen
python3 tools/run_agent_direct.py --agent fleet_steward --message TEST
# Output: [PREFLIGHT BLOCKED] fleet_steward; exit 1

# Override: skip preflight (rollback/development)
python3 tools/run_agent_direct.py --agent fleet_steward --message TEST --skip-preflight
# Output: Running agent...; exit 0

# Unscoped agent: runs normally, preflight logged
python3 tools/run_agent_direct.py --agent herald --message TEST
# Output: [PREFLIGHT_WARN] (warnings only); Running agent...; exit 0
```

## Scoped agents (require preflight check)

| Agent | Blocked if | Current Status |
|-------|-----------|--------|
| `fleet_steward` | "Ranker/selector/sizing" in not_allowed | Frozen (cohort quarantine) |
| `sentinel` | "Ranker/selector/sizing" in not_allowed | Frozen (cohort quarantine) |
| `spec_089_builder` | "Spec 089" in not_allowed | Deferred (cohort quarantine) |
| `ranker_optimizer` | "Ranker/selector/sizing" in not_allowed | Frozen (cohort quarantine) |

Unscoped agents (`herald`, `ops`, `calibration`, etc.) proceed normally with preflight warnings logged.

## Testing

**Unit tests** (5/5 PASS):
- `test_preflight_blocks_scoped_agent()` — scope + not_allowed → exit 1 ✅
- `test_preflight_warns_but_proceeds_on_contradiction()` — contradictions → warn + run ✅
- `test_preflight_unavailable_is_non_blocking()` → run anyway ✅
- Plus 2 pre-existing tests

**Integration** (verified):
- Blocking agent (`sentinel`) exits 1 without running ✅
- Passing agent (`herald`) runs with warnings, preflight in log ✅
- `--skip-preflight` override works ✅

## Next phase

**Phase 2 Step 4** → pending May 19 watchdog verification (May 16–17):
1. Evening cron reliability audit fires 05-16/05-17
2. Watchdog confirms cron pipeline works end-to-end
3. May 19: green light for broader phase 2 work
4. Then: Spec 089 KG implementation (blocked by 13F cohort clearance ~May 23)

**Related**: [[13f_q1_2026_monitoring_live_2026_05_15]], [[spec_089_phase_1_5a_ranker_governance_kg_pilot.md]]
