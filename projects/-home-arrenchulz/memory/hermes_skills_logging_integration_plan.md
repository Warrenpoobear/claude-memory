---
name: hermes-skills-logging-integration-safe
description: Safe integration plan for skills execution logging with redaction, environment tagging, minimum sample sizes, and advisory-only recommendations
metadata:
  type: project
  status: active
  phase: integration
  target_completion: 2026-06-12
  safety_constraints: strict
  observation_period_days: 7
  originSessionId: a6447a04-5415-446a-8dde-c297c95a4065
---

# Skills Execution Logging Integration (Safe Version)

**Framework:** Hermes skills learning system v2 with safety guardrails

**Safety First Approach:**
- Automatic redaction of PII/credentials/sensitive data
- Environment tagging (production vs test logs separate)
- Minimum thresholds before skill evaluation (5+ executions, 3+ feedback points)
- Advisory-only recommendations (no auto-apply)
- 7-day observation period before any routing changes
- No auto-optimization until sufficient data exists

---

## Redaction & Scrubbing

**File:** `tools/skills_logger_v2.py`

Automatically redacts:
- API keys, tokens, passwords: `api_key=secret` → `[REDACTED_KEY]`
- Email addresses: `user@example.com` → `[REDACTED_EMAIL]`
- Tickers/symbols: `RVMD` → `[REDACTED_TICKER]`
- Dates: `2026-06-04` → `[REDACTED_DATE]`
- IP addresses: `192.168.1.1` → `[REDACTED_IP]`
- Auth headers: `Bearer token...` → `[REDACTED_AUTH]`

Applied automatically to:
- `task_context` (what the skill was asked to do)
- `inputs` dict (all input parameters)
- `outputs` dict (all output values)
- `error` messages (error text)
- Feedback notes

---

## Environment Tagging

All logs are tagged with `environment=prod|test`:

```json
{
  "execution_id": "abc123ef",
  "skill_name": "clinical-scoring",
  "environment": "prod",
  "timestamp": "2026-06-05T13:00:00Z",
  ...
}
```

**Log files:**
- Production: `execution_log_prod_YYYY-MM.jsonl` + `feedback_log_prod_YYYY-MM.jsonl`
- Test: `execution_log_test_YYYY-MM.jsonl` + `feedback_log_test_YYYY-MM.jsonl`

**Report generation:**
- `python3 tools/hermes_skills_learning_loop_v2.py` → defaults to production
- `python3 tools/hermes_skills_learning_loop_v2.py 2026-06 prod` → production
- `python3 tools/hermes_skills_learning_loop_v2.py 2026-06 test` → test data only

---

## Safety Thresholds

**Minimum Execution Count for Evaluation:** 5
- Skills with <5 executions are marked `[INSUFFICIENT_DATA]` in reports
- No judgments made on skills with <5 runs

**Minimum Feedback Points for Judgment:** 3
- Skills with <3 feedback points are marked `[LOW_FEEDBACK]` in reports
- Feedback must be: helpful (✓), unhelpful (✗), or missing feature (?)

**Minimum Success Rate for "Good":** 80%
- Only skills with ≥80% success rate are candidates for preferred routing
- Even then, requires ≥OBSERVATION_PERIOD_DAYS observation

**Maximum Success Rate for "Poor":** 50%
- Skills with <50% success rate need investigation
- Marked in report with high priority for feedback

**Observation Period:** 7 days
- No behavioral changes until this period passes
- After 7+ days + minimum thresholds, changes are still advisory-only
- Operator approval required before implementing any changes

---

## Integration Points

### 1. `tools/run_agent_direct.py` (Agent Execution)

**Location:** In the `run_agent()` function around line 292

**Before implementation:**
```python
def run_agent(agent_name: str, message: str, model: str = "...", max_tokens: int = 4096) -> dict:
    # ... existing code ...
    result = llm_call(...)
    return result
```

**After integration:**
```python
import time
from tools.skills_logger_v2 import log_skill

def run_agent(agent_name: str, message: str, model: str = "...", max_tokens: int = 4096) -> dict:
    start_time = time.time()
    
    try:
        # ... existing code ...
        result = llm_call(...)
        
        # NEW: Log successful execution
        latency_ms = (time.time() - start_time) * 1000
        tokens_in = estimate_tokens(message)  # rough estimate
        tokens_out = estimate_tokens(result.get("output", ""))
        
        log_skill(
            skill_name=agent_name,
            task_context=message[:200],  # First 200 chars
            inputs={"model": model, "max_tokens": max_tokens},
            outputs={"output_len": len(result.get("output", ""))},
            latency_ms=latency_ms,
            tokens_in=tokens_in,
            tokens_out=tokens_out,
            cost_usd=estimate_cost(tokens_in, tokens_out, model),
            success=True,
            environment="prod",
        )
        
        return result
        
    except Exception as e:
        # NEW: Log failure
        latency_ms = (time.time() - start_time) * 1000
        log_skill(
            skill_name=agent_name,
            task_context=message[:200],
            inputs={},
            outputs={},
            latency_ms=latency_ms,
            success=False,
            error=str(e)[:500],  # First 500 chars of error
            environment="prod",
        )
        raise
```

**Helper functions to add:**
```python
def estimate_tokens(text: str) -> int:
    """Rough token estimate: 1 token ≈ 4 characters."""
    return max(1, len(text) // 4)

def estimate_cost(tokens_in: int, tokens_out: int, model: str) -> float:
    """Cost estimate based on model and tokens."""
    if "claude" in model.lower():
        return (tokens_in * 0.000003) + (tokens_out * 0.000015)
    else:  # Llama/Together
        return (tokens_in * 0.0000008) + (tokens_out * 0.0000010)
```

---

### 2. `tools/agent_heartbeat_checks.py` (Health Checks)

**Location:** In each `check_*()` function (e.g., `check_qa()`, `check_ic_health()`, etc.)

**Pattern:**
```python
from tools.skills_logger_v2 import log_skill
import time

def check_qa(dt: date) -> CheckResult:
    """Validate today's snapshot exists and is structurally sound."""
    start_time = time.time()
    
    ds = as_of_date(dt)
    snap = SNAPSHOT_DIR / ds
    anomalies = []
    
    try:
        # ... existing check logic ...
        
        if anomalies:
            result = CheckResult("qa", "FAIL", f"{len(anomalies)} issue(s)", anomalies)
            success = False
        else:
            result = CheckResult("qa", "OK", f"Snapshot {ds} valid")
            success = True
        
        # NEW: Log the check result
        latency_ms = (time.time() - start_time) * 1000
        log_skill(
            skill_name="qa_check",  # or "ic_health_monitor_check", etc.
            task_context=f"Daily snapshot validation for {ds}",
            inputs={"check_date": ds},
            outputs={"status": result.status, "anomaly_count": len(anomalies)},
            latency_ms=latency_ms,
            success=success,
            error=result.detail if not success else None,
            environment="prod",
        )
        
        return result
        
    except Exception as e:
        latency_ms = (time.time() - start_time) * 1000
        log_skill(
            skill_name="qa_check",
            task_context=f"Daily snapshot validation for {ds}",
            inputs={"check_date": ds},
            outputs={},
            latency_ms=latency_ms,
            success=False,
            error=str(e)[:500],
            environment="prod",
        )
        raise
```

---

## Implementation Timeline

### Week 1 (June 5-12)

**Day 1-2 (June 5-6):** Setup & Testing
- [x] Create `skills_logger_v2.py` (redaction + env tagging)
- [x] Create `hermes_skills_learning_loop_v2.py` (safe aggregation)
- [ ] Test redaction with sample data
- [ ] Verify environment tagging in logs

**Day 3-4 (June 9-10):** Integration - run_agent_direct.py
- [ ] Add logging import to run_agent_direct.py
- [ ] Add token estimation helpers
- [ ] Add cost estimation logic
- [ ] Wrap try/except around LLM call with logging
- [ ] Test on 5+ agent runs
- [ ] Verify logs in `execution_log_prod_2026-06.jsonl`

**Day 5 (June 12):** Integration - agent_heartbeat_checks.py
- [ ] Add logging to each check_* function
- [ ] Test heartbeat checks generate logs
- [ ] Verify check results are captured

### Week 2+ (June 12+): Observation Period

**June 12-19 (Days 1-7):** Observation & Feedback Collection
- [ ] Monitor production logs daily
- [ ] Collect operator feedback via `/skill feedback` command
- [ ] Generate weekly reports (advisory only)
- [ ] **NO behavioral changes during this period**

**June 19+:** Evaluation & Next Steps
- [ ] Review 7+ days of data
- [ ] Generate final monthly report with judgments
- [ ] Present recommendations to operator (advisory)
- [ ] Only apply changes with explicit operator approval

---

## Running the Learning Loop

**Generate production report (safe mode):**
```bash
python3 tools/hermes_skills_learning_loop_v2.py 2026-06 prod
# Output: artifacts/skills_learning/monthly_report_prod_2026-06.md
```

**Check logs:**
```bash
# Production executions
ls -lh artifacts/skills_learning/execution_log_prod_*.jsonl

# Production feedback
ls -lh artifacts/skills_learning/feedback_log_prod_*.jsonl

# Generated report
cat artifacts/skills_learning/monthly_report_prod_2026-06.md
```

---

## What NOT To Do (Until Approved)

❌ Auto-route traffic to "better" skills (wait 7+ days + operator approval)  
❌ Suppress "worse" skills automatically (wait for feedback threshold + approval)  
❌ Change execution order based on efficacy (advisory-only first)  
❌ Apply recommendations without explicit decision  
❌ Use test data to influence production routing  
❌ Log production data to test environment logs  

---

## Safety Review Checklist

Before enabling any behavioral changes:

- [ ] Observation period (7+ days) complete
- [ ] Minimum executions (5+) for skill
- [ ] Minimum feedback (3+) points collected
- [ ] Report explicitly marks skills as safe to change
- [ ] Operator has reviewed report
- [ ] Operator approval documented
- [ ] Change is reversible (can revert quickly)
- [ ] Monitoring in place for unintended side effects

---

## Related Files

- **Logger v2:** `tools/skills_logger_v2.py` (redaction + env tagging)
- **Learning loop v2:** `tools/hermes_skills_learning_loop_v2.py` (safe aggregation)
- **Integration guide:** `tools/run_agent_direct_instrumented.py` (example wrapper)
- **Memory:** This file

---

**Status:** Ready for integration (June 5-12)  
**Safety Level:** STRICT - Advisory-only, 7-day observation, operator approval required  
**Next Milestone:** First production report generation (June 12)
