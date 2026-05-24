---
name: architecture_optimization_2026_05_15
description: Hermes/OpenClaw operating layer architecture; three lanes; token policy; preflight checklist
metadata: 
  node_type: memory
  type: project
  status: active
  expires: 2026-06-15
  relates: "operational_closure_2026_05_15, spec_089_phase_1_5a_ranker_governance_kg_pilot"
  originSessionId: 75430853-0fb5-416b-bdff-7cf4caa2c776
---

# Architecture Optimization — Hermes/OpenClaw as Operating Layer (2026-05-15)

## Principle

> Hermes/OpenClaw is an operating layer around deterministic production code, not a substitute for it.

**Corollary**: Lane separation enforces this.

---

## Three Operational Lanes

### Lane A — Deterministic Production
- run_screen.py
- production_qa_check.py
- 13F ingest
- post-snapshot supervisor
- forward shadows
- universe maintenance
- No LLM. If it fails, it's a deterministic bug.

### Lane B — Cheap Monitoring + Escalation
- Tier 0 deterministic checks (file freshness, JSON schema, git state)
- Tier 1 escalation: Llama 3.3 70B (Together) only on anomaly
- Tier 1 cost: ~$0.20 per 1M tokens
- No gateway dependency; uses run_agent_direct.py fallback

### Lane C — High-Token Manual Engineering
- Spec-to-code tracing
- Multi-file refactors
- Test generation
- Memory compression
- Knowledge graph updates
- Manual sessions only; Opus (Tier 3, ~$3.00/1M tokens)

---

## Phase 1 — COMPLETE ✅ (Commit `a16f03f7`)

**Three governance docs committed** (2026-05-15):
1. `docs/ops/hermes_openclaw_routing_policy.md` — lane definitions, routing rules, authority levels, gateway fallback
2. `docs/ops/agent_preflight_checklist.md` — canonical preflight (git state, snapshots, blocked specs, allowed action, not allowed)
3. `docs/ops/token_budget_policy.md` — Tier 0/1/2/3 definitions, decision tree, monthly budget targets (~$200–400/month)

**No cron edits. No agent behavior changes. No production model changes.**

## Phase 2 Step 1 — COMPLETE ✅ (Commit `09b74fa5`)

**Registry metadata added** (2026-05-15):
- Added `llm_policy` enum: none | direct_llama_on_anomaly | manual_only
- Added `requires_preflight` boolean to all agents
- Distribution:
  * Lane A (deterministic): 5 agents with llm_policy=none
  * Lane B (escalation): 18 agents with llm_policy=direct_llama_on_anomaly
  * Lane C (manual): 7 agents with llm_policy=manual_only
  * Active/shadow agents: requires_preflight=true (28)
  * Retired/deprecated: requires_preflight=false (2)

**Metadata-only update: no behavior changes, no SOUL.md edits, no cron changes.**

## Phase 2 Step 2 — COMPLETE ✅ (Commit `82c14210`)

**Preflight tool created** (2026-05-15):
- `tools/agent_preflight.py` — reads git state, snapshots, registry, memos
- Outputs: branch state, snapshot, git HEAD, blocked specs, contradictions, quarantine/freeze, allowed action, not allowed
- CLI: `--agent NAME` for metadata, `--json` for JSON output
- Tested: all three modes working; linting clean (black, isort, flake8)
- **Not yet wired into run_agent_direct.py** — ready for manual testing

Three commits landed:
1. `a16f03f7` — Phase 1 governance docs (routing policy, preflight checklist, token budget)
2. `09b74fa5` — Phase 2 Step 1 registry metadata (llm_policy, requires_preflight)
3. `82c14210` — Phase 2 Step 2 preflight tool

## Manual Validation — COMPLETE ✅ (Commit `18bad6f0`)

**Agent preflight tool validated** (2026-05-15):
- Tested against live state: branch, snapshot, QA status, registry, memos
- All acceptance criteria PASSED:
  * ✅ Branch state detection ("on main, clean/dirty")
  * ✅ Latest snapshot identification (filters to YYYY-MM-DD, excludes non-date dirs)
  * ✅ QA status detection (reads both **Status**: and Status: formats)
  * ✅ 13F cohort quarantine status ("inst_delta_z distortion: NOT CLEARED")
  * ✅ Blocked specs (Spec 089, Spec 100, ranker/selector/sizing all listed)
  * ✅ Agent metadata (verified fleet_steward, herald, production_qa)
  * ✅ JSON output (parses cleanly with python3 -m json.tool)
- Tool fixes applied:
  * Snapshot filter: added YYYY-MM-DD format validation
  * QA detection: added markdown (**Status**:) format support
- Validation memo: `artifacts/audit/agent_preflight_validation_2026_05_15.md`
- Linting: black, isort, flake8 all pass
- **NOT YET WIRED** into run_agent_direct.py (pending Phase 2 Step 3 + 1 day clean use)

---

## Phase 2 — Roadmap (Next)

### Step 1: Registry Metadata (Low-Risk)
- Add to `agents/AGENT_REGISTRY.json`:
  ```json
  {
    "authority_level": "advisor | producer | monitor",
    "llm_policy": "none | direct_llama_on_anomaly | manual_only",
    "requires_preflight": true
  }
  ```
- **No SOUL.md edits** yet (avoid noisy diffs)
- Single commit: "agents: add authority and routing metadata"

### Step 2: Preflight Tool
- Create `tools/agent_preflight.py`
- Emits: current branch state, latest snapshot, blocked specs, allowed action, not allowed
- Called by `run_agent_direct.py` before agent starts
- Later: OpenClaw wrappers can call this

### Step 3: Evening Cron Reliability Audit
- Create `artifacts/audit/evening_cron_reliability_audit_2026_05_15.md`
- Diagnostic only (not action yet)
- Check: are forward shadows running? 13F ingest? Catch-up needed?
- Then decide: Task Scheduler, always-on Linux, or catch-up scripts

### Step 4: Spec 089 Knowledge Graph (Post-Cohort-Clearance)
- After 13F cohort clears (~May 23–26)
- Build KG query layer
- Document contract: `--what-blocks production-ranker-change`, `--contradictions`, `--next-actions`
- Do NOT enforce yet (document intent first)

### Step 5: KG Gating (Late)
- Only after KG query layer exists and is manually validated
- Then: make KG checks mandatory for ranker-related agent work

---

## Critical Constraints (Locked)

1. **No cron depends on gateway token** — run_agent_direct.py is fallback; deterministic scripts are primary
2. **Preflight required before all agent work** — prevents drift, stale recommendations, contradictions
3. **No ranker/selector/sizing changes without explicit authorization** — frozen during cohort quarantine (until ~May 26)
4. **WSL sleep fragility** — must be diagnosed before evening cron reliability is locked; separate task from architecture optimization

---

## Token Budget Summary

| Tier | Tool | Cost | When |
|------|------|------|------|
| 0 | Bash/Python/JSON | $0 | Artifact freshness, schema validation |
| 1 | Llama 3.3 70B | ~$0.20/1M | Anomaly escalation (5–10×/week) |
| 2 | Claude Sonnet | ~$0.90/1M | Synthesis, tests, refactors (2×/week) |
| 3 | Claude Opus | ~$3.00/1M | Hard design, multi-file audit (1×/month, manual) |
| **Total** | | **~$200–400/month** | Sustains current ops |

---

## Preflight Checklist (Canonical)

Every agent session must run this:
```bash
git status --short && git log --oneline -5
ls -td data/snapshots/*/ | head -3
python tools/build_hermes_knowledge_layer.py 2>/dev/null || true
cat artifacts/ops/knowledge_layer/latest_state.md 2>/dev/null | head -80
```

Output:
```
Current branch state: [state]
Latest snapshot: [date + QA status]
Blocked specs: [list]
Allowed next action: [explicit]
Not allowed: [explicit]
```

Prevents: stale recommendations, contradictions, unsynchronized state, forbidden changes, artifact gaps.

---

## Key Dates

- **2026-05-15**: Phase 1 complete (three docs committed)
- **~2026-05-17**: Phase 2 Step 1 (registry metadata)
- **~2026-05-18**: Phase 2 Step 2 (preflight tool)
- **~2026-05-19**: Phase 2 Step 3 (evening cron audit)
- **~2026-05-23**: Phase 2 Step 4 (13F cohort clears; Spec 089 KG implementation resumes)
- **~2026-05-26**: h20d checkpoint; KG gating optional/validated
- **~2026-06-01**: All phases complete; new operating model live

---

## References

- `docs/ops/hermes_openclaw_routing_policy.md`
- `docs/ops/agent_preflight_checklist.md`
- `docs/ops/token_budget_policy.md`
- `agents/AGENT_REGISTRY.json` (to be updated Phase 2 Step 1)
- `tools/run_agent_direct.py` (fallback default)
- `tools/agent_preflight.py` (to be created Phase 2 Step 2)
