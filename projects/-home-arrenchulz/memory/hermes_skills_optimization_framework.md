---
name: hermes-skills-optimization-framework
description: "Skills knowledge optimization system for recursive self-improvement (performance tracking, dependency mapping, feedback learning)"
metadata: 
  node_type: memory
  type: project
  status: active
  created: 2026-06-05
  version: 1
  scope: hermes-fleet-learning-layer
  originSessionId: a6447a04-5415-446a-8dde-c297c95a4065
---

# Hermes Skills Optimization Framework

**Goal:** Enable recursive self-improvement by tracking skill performance, mapping dependencies, recording feedback, and auto-composing skills for future tasks.

---

## 1. Performance Tracking Schema

Each skill execution is logged with:

```json
{
  "skill_name": "clinical-scoring",
  "execution_id": "uuid",
  "timestamp": "2026-06-05T10:23:45Z",
  "task_context": "evaluate RVMD clinical progress",
  "inputs": {
    "ticker": "RVMD",
    "trial_count": 3,
    "phase": "P3"
  },
  "outputs": {
    "clinical_score": 78.5,
    "confidence": 0.92,
    "reasoning": "..."
  },
  "metrics": {
    "latency_ms": 1240,
    "tokens_in": 450,
    "tokens_out": 280,
    "cost_usd": 0.031
  },
  "outcome": {
    "success": true,
    "user_feedback": null,
    "confidence_calibrated": true,
    "edge_cases": []
  }
}
```

**Location:** `artifacts/skills_learning/execution_log_<YYYY-MM>.jsonl`

---

## 2. Dependency Graph

Map skill→skill relationships for:
- **Prerequisites:** Skills that must run first
- **Parallelizable:** Skills with no mutual dependencies
- **Escalation chain:** When to call higher-confidence alternatives

```json
{
  "governance-spec-enforcement": {
    "prereqs": [],
    "inputs_from": ["memory-steward"],
    "calls": ["phase-2-step-4-readiness"],
    "fallback_to": ["hermes-contradiction-detector"],
    "parallelizable_with": ["13f-validation-coordinator", "path-c-governance-monitoring"]
  },
  "clinical-scoring": {
    "prereqs": [],
    "inputs_from": ["firecrawl-research-discovery"],
    "calls": ["ic-evaluation"],
    "fallback_to": ["financial-health"],
    "parallelizable_with": ["catalyst-resolution", "institutional-signal"]
  }
}
```

**Location:** `artifacts/skills_learning/dependency_graph.json`

**Update:** Infer from execution logs monthly; manual override for known patterns.

---

## 3. Execution History & Feedback Log

Track outcomes to identify:
- Which skills are effective for which domains
- Skill composition patterns that work well together
- Performance degradation over time
- Feedback from operators/agents

```json
{
  "execution_batch_id": "batch_20260605_phase2_monitoring",
  "timestamp": "2026-06-05T10:30:00Z",
  "task_type": "phase2-daily-tracking",
  "skills_used": ["screener-ops-governance", "path-c-governance-monitoring", "memory-steward"],
  "success": true,
  "total_latency_ms": 3450,
  "total_cost": 0.087,
  "user_feedback": {
    "helpful": ["path-c-governance-monitoring"],
    "unhelpful": [],
    "missing": ["shadow-monitor-diagnostics"],
    "notes": "All gates passed. Would have been faster with parallelized 13F validation."
  },
  "learning_points": [
    "Path C monitoring + Phase 2 tracking can run in parallel",
    "Memory steward should cache governance state for faster lookups"
  ]
}
```

**Location:** `artifacts/skills_learning/feedback_log_<YYYY-MM>.jsonl`

---

## 4. Skill Efficacy Scores

Rate each skill by domain and time:

```json
{
  "skill": "clinical-scoring",
  "domains": {
    "governance": { "efficacy": 0.0, "n_uses": 0 },
    "signal": { "efficacy": 0.94, "n_uses": 127, "trend": "+0.02/month" },
    "operations": { "efficacy": 0.68, "n_uses": 18, "trend": "stable" },
    "research": { "efficacy": 0.85, "n_uses": 34, "trend": "-0.01/month" }
  },
  "overall": 0.86,
  "confidence": 0.92,
  "last_updated": "2026-06-05T10:00:00Z",
  "reliability": {
    "error_rate": 0.02,
    "latency_p95": 2100,
    "cost_per_call": 0.024
  }
}
```

**Location:** `artifacts/skills_learning/skill_efficacy_<skill>.json`

**Update:** Monthly rollup from execution logs.

---

## 5. Skill Composition Patterns

Learn which skills work well together:

```json
{
  "pattern_id": "phase2_daily_sync",
  "name": "Phase 2 Daily Monitoring Composition",
  "skills": [
    { "name": "screener-ops-governance", "order": 1, "parallelizable": false },
    { "name": "path-c-governance-monitoring", "order": 2, "parallelizable": false },
    { "name": "13f-validation-coordinator", "order": 2, "parallelizable": true },
    { "name": "memory-steward", "order": 3, "parallelizable": false }
  ],
  "trigger": "daily cron at 10:20 AM ET OR manual request with task='phase2-tracking'",
  "success_rate": 0.98,
  "avg_latency": 3200,
  "avg_cost": 0.082,
  "n_uses": 12,
  "trend": "improving (+1% success per week)",
  "notes": "Parallelizable skills should run together to reduce wall-clock time."
}
```

**Location:** `artifacts/skills_learning/composition_patterns.json`

**Learn:** Infer from execution logs; user feedback refines patterns.

---

## 6. Recursive Self-Improvement Loop

**Monthly Cycle (first Monday of month):**

1. **Aggregate** execution logs from prior month
2. **Compute** efficacy scores, latency percentiles, cost per domain
3. **Infer** new dependency patterns from call chains
4. **Mine** successful compositions (>90% success rate)
5. **Identify** underperforming skills or missing compositions
6. **Generate** recommendations for skill optimization or new skill candidates
7. **Update** memory and dependency graph with findings
8. **Report** to operator with:
   - Top 3 skills by efficacy (trending up/down)
   - Unused/underused skills (candidates for deprecation or rebranding)
   - New composition patterns learned
   - Latency/cost optimization opportunities

**Automation:**
- Script: `tools/hermes_skills_learning_loop.py`
- Trigger: `cron 0 9 * * 1` (first Monday, 9:00 AM ET)
- Output: `artifacts/skills_learning/monthly_report_<YYYY-MM>.md`

---

## 7. Integration Points

**For Operators:**
- `/skill performance <skill_name>` — Show latest efficacy, trend, recommendations
- `/skill suggest <task_description>` — Recommend skills + composition based on history
- `/skill feedback <skill_name> <helpful|unhelpful> [notes]` — Record feedback

**For Agents (Hermes):**
- `agent_heartbeat_checks.py` — Embed skill efficacy scoring in health checks
- `run_openclaw.py` — Log execution metrics for all agent calls
- `supervisor.py` — Track which skills helped/hurt each decision

**For Cron:**
- `cron_data_refresh.sh` — Update efficacy scores post-snapshot
- `cron_daily_production.sh` — Log all skill calls to execution_log

---

## 8. Current State

**Implemented:** ✓ Skills inventory (31 skills)  
**Implemented:** ✓ Basic categorization (7 categories)  
**Implemented:** ✓ Skill registry (`docs/hermes_skills/_meta.json`)  

**To Implement (Phase 1):**
- Execution logging framework (JSONL writer + schema validator)
- Feedback collection UI (`/skill feedback` command)
- Monthly aggregation script
- Skill efficacy dashboard

**To Implement (Phase 2):**
- Dependency graph inference engine
- Composition pattern mining algorithm
- Auto-suggestion engine for task routing
- Performance optimization recommendations

---

## 9. Success Criteria

**Month 1 (June 2026):**
- ✓ Execution logging operational (all skill calls recorded)
- ✓ Feedback collection live (operators can rate skills)
- ✓ Monthly report generated with top findings

**Month 2 (July 2026):**
- ✓ Efficacy scores computed and trended
- ✓ Composition patterns mined and validated
- ✓ Operator feedback drives skill improvements

**Month 3+ (Aug+ 2026):**
- ✓ Agent auto-routing using skill efficacy
- ✓ New skills proposed by learning engine
- ✓ Latency/cost optimization applied automatically
- ✓ Recursive loop: agents suggest, operators approve, learning improves

---

## References

- Current skills: `docs/hermes_skills/_meta.json` (31 active skills)
- Execution logs: `artifacts/skills_learning/` (pending implementation)
- Learning engine: `tools/hermes_skills_learning_loop.py` (pending implementation)
- Memory steward: `memory-steward` skill (manages session memory graph)

---

**Next Step:** Implement Phase 1 (execution logging + feedback collection) by 2026-06-10.
