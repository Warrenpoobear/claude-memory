---
name: hermes_model_migration_deepseek_2026_05_20
description: "Hermes fleet migrated to DeepSeek v4 flash — 27 agents, May 20 2026. Gateway config fixed 2026-05-25."
metadata: 
  node_type: memory
  type: project
  status: active
  supersedes: hermes_skills_audit_2026_05_15
  related: ic_health_monitor_alert_explanation_2026_05_19
  originSessionId: f4dc98ee-62dd-4417-a691-d33d6d3e0320
---

## Hermes Model Migration — May 20, 2026

**BREAKING CHANGE**: Entire Hermes fleet migrated from Claude (Sonnet 4.6 + Haiku 4.5) to DeepSeek v4 flash.

### Migration Details

**Date**: 2026-05-20 (commit facd9fa8)
**Agents Affected**: 27 active agents (+ deprecated/shadow agents)
**New Model**: `deepseek/deepseek-v4-flash:free` (all agents)

**Previous Configuration:**
- 17 agents on Claude Sonnet 4.6 (reasoning-heavy)
- 8 agents on Claude Haiku 4.5 (monitoring)
- 2 agents on Claude Haiku 4.5-20251001 (specialized)

**New Configuration:**
- All 27 agents on DeepSeek v4 flash (free tier)

### Critical Timing

**First run on new model**: May 20 13F validation trigger (~5:00 PM ET)
- Validation gates 2–6 execution
- IC health monitor signal processing
- Quarantine status evaluation
- Production ranking/scoring components

**Risk level**: HIGH (first critical production job on new model)

### Monitoring Requirements

**Immediate (May 20 post-validation):**
1. Check 13F validation artifact `artifacts/13f_validation_2026-05-20.md`
   - Gate execution quality
   - Verdict clarity (CLEAR/EXTEND/MANUAL)
   - Jaccard result validity

2. IC health monitor output
   - Signal IC calculations correctness
   - ALERT/WARN status accuracy
   - Contradiction detection reliability

3. Production ranking artifacts
   - `rankings.csv` coherence
   - Score distribution sanity
   - Top-30 stability

**Medium-term (May 21–26):**
- Compare agent outputs vs historical baselines
- Monitor forward shadow performance (inst_delta, cross_signal)
- Track IC dashboard updates (post-refresh recovery)
- Verify governance compliance (freeze, blocked specs)

**Success criteria:**
- 13F validation gates 2–6 function correctly
- IC health monitor produces valid signals
- Production rankings execute without errors
- No API incompatibility with OpenClaw orchestration

### Why DeepSeek v4 Flash?

**User decision**: Explicit approval for fleet-wide migration on 2026-05-20.

**Considerations:**
- Cost reduction (free tier)
- Model capability assessment (real-world production performance)
- Compatibility with OpenClaw agent orchestration (to be verified)
- Output quality vs Claude baseline (monitoring required)

### Gateway Config Fix (2026-05-25)

Gateway was starting on `meta-llama/llama-3.3-70b` (Together AI fallback) because Nous Research model warmup timed out at 5s. Fixed in `~/.hermes/config.yaml`:
- Primary: `provider: openrouter`, `default: deepseek/deepseek-v4-flash:free`
- Fallback order: OpenRouter/DeepSeek first, Together/Llama second
- `cli-config.yaml.example` updated in hermes-agent repo (`ae6f28e98`)
- Together AI 402 credit errors hit 2026-05-20 (8 agents STALE); recovered by 2026-05-22; **check Together AI balance before Monday production run**

### Rollback Path

If critical failures emerge post-validation (May 20–21):
1. Revert commit facd9fa8: `git revert facd9fa8`
2. Restore Claude model specs: Sonnet 4.6 for reasoning agents, Haiku 4.5 for monitoring
3. Re-deploy agents
4. Validate recovery

**Post-mortem triggers:**
- 13F validation gates 2–6 FAIL
- IC health monitor produces spurious ALERT/WARN
- Production ranking execution error
- OpenClaw orchestration incompatibility

### Documentation Updates

- `.claude/agents/hermes-operator.md`: Updated with migration notice + monitoring warning
- All agent `SOUL.md` files: Model specification changed
- Commit message: Full audit trail of affected agents

### Next Steps

**Immediate (next 4 hours until validation):**
- Monitor system behavior
- Prepare for 13F validation verdict
- Have rollback plan ready

**Post-validation (May 21+):**
- Assess output quality
- Make go/no-go decision on permanent migration
- Document lessons learned

**If clearing (May 23+):**
- Proceed with Phase 2 Step 4 KG pilot
- Continue forward shadow monitoring
- Benchmark DeepSeek vs Claude baseline

---

**Commit**: facd9fa8
**Affected Files**: 28 files (agents/*/SOUL.md, .claude/agents/hermes-operator.md)
**User Approval**: Explicit approval given 2026-05-20
