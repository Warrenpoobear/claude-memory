---
name: hermes-fleet-status-2026-06-19
description: "Fleet health 2026-06-19 — 11 OK / 2 WARN / 2 FAIL; agents_direct cron dead, calibration_evidence FAIL, production_qa RED"
metadata: 
  node_type: memory
  type: project
  status: active
  expires: 2026-06-26
  originSessionId: 65f0f71e-02f8-4531-98ed-049d80d13993
---

# Hermes Fleet Status — 2026-06-19

**Overall: YELLOW** — 11 OK / 2 WARN / 2 FAIL / 9 STALE / 5 SKIP

Last heartbeat: 2026-06-17 22:00 ET. No new regressions since Jun 16–17 checks. Three persistent critical issues identified.

## Critical Issues (Actionable)

### 1. agents_direct cron DEAD since ~Jun 03
**Impact:** Cascading staleness across 5+ dependent agents
- ops_supervisor (STALE, Jun 12 last run)
- earnings_calendar_sync (STALE, Jun 11)
- crt_resolution_watcher (STALE, Jun 11)
- calibration_evidence (FAIL, 17d stale, depends on postmortem input)
- data_auditor (showing OK but data-dependent)

**Root cause:** Cron job not executing since Jun 03. Direct dependency between agents broken.

**Why:** This is the known recurring blocker from [[hermes_update_2026_06_12]]. Cron health verified operational (PID 225) but embedded agents_direct job within evening cron stalled.

**How to apply:** Investigate agents_direct cron job definition; check for exit codes or silent failures in embedded script. Likely a script path or dependency issue.

---

### 2. calibration_evidence FAIL (17d stale)
**Severity:** Hard FAIL (threshold 10d)
- Last evidence file: 2026-06-02 15:46
- Ledger + evidence both flagged as stale
- No postmortems filed since May 21 (~29d gap)

**Why:** Chronic postmortem agent gap is upstream blocker. Without new postmortem artifacts, calibration_evidence has no new data to ingest.

**How to apply:** Unblock postmortem agent (known chronic issue) OR explicitly waive this agent if no new calibrations are expected until Phase 24+.

---

### 3. production_qa RED (persistent 3 failures)
**Issues:**
- `run_manifest.json` missing — post-production gate file not being written
- No readiness scorecard artifact
- `classifier_escalation_pool` other_share 56.7% (threshold 50%) — exceeds limit

**Why:** Likely code path not writing manifest post-snapshot, or readiness scorecard not invoked. Classifier pool contamination from [[top30_classifier_impact_audit_2026_06_02]].

**How to apply:** Check `run_batch` orchestration for run_manifest write step. Verify readiness scorecard gate is being called. Classifier pool threshold may require formal adjustment or triage.

---

## Secondary Issues

| Agent | Status | Last Activity | Notes |
|-------|--------|---------------|-------|
| policy_shadow / shadow_monitor | STALE | Jun 12 | Position-file errors for 06-03 + 06-17; data dependency issue |
| herald / news_digest | WARN | Jun 17 08:05 | Sending 0 items (SEC 8K/news classification filtering everything) |
| grok_biotech_watch | STALE | Jun 17 18:45 | Artifact output dir empty; check write path |
| review_queue_steward | STALE | Jun 11 | 6.2d since last invoke (threshold 2d) |

---

## Operational Status

- **Today's production run:** Not yet executed (check time was pre-10:20 ET window)
- **Last snapshot:** 2026-06-18 (not 06-19)
- **Gateway (port 19001):** UNKNOWN (nc blocked; last confirmed Jun 17)
- **Cron health:** Core jobs firing correctly (firecrawl, data_refresh, herald, Layer B monitors, evening); agents_direct embedded job stalled

---

## Fixes Applied (2026-06-19)

### 1. ✅ agents_direct cron UNBLOCKED
**Fix:** Added `sys.path.insert(0, str(PROJECT_ROOT))` to `tools/run_agent_direct.py` before importing `tools.skills_logger_v2`.
**Root cause:** Relative import `from tools.skills_logger_v2 import log_skill` was failing when run_agent_direct.py was invoked from cron_evening_catchup.sh. The Python import system couldn't resolve `tools.skills_logger_v2` without the repo root in sys.path.
**Impact:** agents_direct cron should now execute successfully, allowing agents (ops, sentinel, crt_resolution_watcher, catalyst_delta, price_action_watch, postmortem) to run daily 17:00-18:35 ET.
**Status:** COMMITTED (commit 116ec3bb)

### 2. ⚠️ calibration_evidence FAIL — INVESTIGATION NEEDED
**Issue:** 17d stale (threshold 10d); last evidence file 2026-06-02; postmortem agent stale since May 21.
**Root cause:** Postmortem agent is not producing output, likely because it's being called but not writing artifacts to logs/agents_direct/. May be related to the run_agent_direct import issue (now fixed).
**Action required:** 
- Monitor postmortem agent logs after agents_direct cron fix is deployed
- If still failing: check postmortem agent IDENTITY.md/SOUL.md for behavioral requirements
- If needed: explicitly waive this check or unblock by running postmortem manually

### 3. ⚠️ production_qa RED — MULTIPLE BLOCKERS
**Issues:**
- `run_manifest.json` missing from snapshot directory (should be copied during promotion)
- Classifier escalation pool: 56.7% "other" share exceeds 50% threshold
- Readiness scorecard may not be generated

**Root causes:**
- run_manifest.json issue: manifest written to staging_date_dir before promotion, should be copied by promote_snapshot() function. If promotion fails/incomplete, only output/run_manifest.json exists.
- Classifier pool issue: press-release classifier is incorrectly classifying 56.7% of releases as "other" (unclassified). This is a classifier model quality issue, not a pipeline bug.

**Action required:**
- Verify promote_snapshot() is copying manifest correctly
- Investigate classifier model performance or consider relaxing threshold temporarily
- Monitor readiness scorecard generation

## Next Actions (Priority Order)

1. **MONITOR agents_direct post-fix** — confirm cron executes successfully on next run (22:00 ET today or tomorrow morning)
2. **DIAGNOSE postmortem stale** — if still failing after agent fix, investigate why postmortem isn't writing logs
3. **VERIFY production pipeline** — once agents_direct works, production runs should resume and generate new snapshots with manifests
4. **INVESTIGATE classifier pool** — determine if threshold adjustment or model fix is needed for sustainable production

**Effort estimate:** 1–2 hours monitoring; investigation cost deferred until issues resurface post-fix.

**Timeline:** agents_direct fix deployed now; await cron execution verification by 2026-06-20 morning.
