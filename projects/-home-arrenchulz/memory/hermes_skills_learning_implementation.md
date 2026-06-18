---
name: hermes-skills-learning-implementation
description: Phase 1 implementation guide for skills execution logging, feedback collection, and monthly reporting
metadata:
  type: project
  node_type: implementation_roadmap
  status: active
  phase: 1
  target_date: 2026-06-10
  originSessionId: a6447a04-5415-446a-8dde-c297c95a4065
---

# Hermes Skills Learning Implementation (Phase 1)

**Phase 1 Scope:** Execution logging + feedback collection + monthly reporting (foundation for self-improvement)

**Timeline:** 2026-06-05 to 2026-06-10 (5 working days)

---

## Component 1: Execution Logging Framework

### Schema & Writer

**File:** `tools/skills_execution_logger.py`

```python
import json
import time
from pathlib import Path
from datetime import datetime
from typing import Dict, Any, Optional

class SkillExecutionLogger:
    """Log skill execution with metrics, outcomes, feedback hooks."""
    
    def __init__(self, logs_dir: Path = Path("artifacts/skills_learning")):
        self.logs_dir = logs_dir
        self.logs_dir.mkdir(parents=True, exist_ok=True)
    
    def log_execution(
        self,
        skill_name: str,
        task_context: str,
        inputs: Dict[str, Any],
        outputs: Dict[str, Any],
        latency_ms: float,
        tokens_in: int,
        tokens_out: int,
        cost_usd: float,
        success: bool,
        error: Optional[str] = None,
    ) -> str:
        """Log a skill execution. Returns execution_id."""
        import uuid
        exec_id = str(uuid.uuid4())[:8]
        
        record = {
            "execution_id": exec_id,
            "skill_name": skill_name,
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "task_context": task_context,
            "inputs": inputs,
            "outputs": outputs,
            "metrics": {
                "latency_ms": latency_ms,
                "tokens_in": tokens_in,
                "tokens_out": tokens_out,
                "cost_usd": cost_usd,
            },
            "outcome": {
                "success": success,
                "error": error,
                "user_feedback": None,  # populated later
            },
        }
        
        # Append to current month's log
        month_str = datetime.utcnow().strftime("%Y-%m")
        log_file = self.logs_dir / f"execution_log_{month_str}.jsonl"
        
        with open(log_file, "a") as f:
            f.write(json.dumps(record) + "\n")
        
        return exec_id

# Global instance
skill_logger = SkillExecutionLogger()

def log_skill(skill_name: str, **kwargs) -> str:
    """Convenience function for use in agents/skills."""
    return skill_logger.log_execution(skill_name, **kwargs)
```

**Integration Point:**
- Call from `run_openclaw.py` wrapper after every agent execution
- Call from `agent_heartbeat_checks.py` after each check completes
- Call manually from skill docs with start/end timestamps

### Collection Point: `run_openclaw.py`

Add instrumentation around agent calls:

```python
from tools.skills_execution_logger import log_skill

def run_agent_direct(agent_name, prompt, **kwargs):
    """Run agent with execution logging."""
    start_time = time.time()
    start_tokens = estimate_tokens(prompt)
    
    try:
        result = llm_call(agent_name, prompt, **kwargs)
        latency = (time.time() - start_time) * 1000
        output_tokens = estimate_tokens(result)
        
        log_skill(
            skill_name=agent_name,
            task_context=prompt[:100],  # First 100 chars
            inputs={"prompt_chars": len(prompt), "kwargs_keys": list(kwargs.keys())},
            outputs={"result_chars": len(result)},
            latency_ms=latency,
            tokens_in=start_tokens,
            tokens_out=output_tokens,
            cost_usd=estimate_cost(start_tokens, output_tokens),
            success=True,
        )
        return result
    except Exception as e:
        latency = (time.time() - start_time) * 1000
        log_skill(
            skill_name=agent_name,
            task_context=prompt[:100],
            inputs={},
            outputs={},
            latency_ms=latency,
            tokens_in=start_tokens,
            tokens_out=0,
            cost_usd=0,
            success=False,
            error=str(e),
        )
        raise
```

---

## Component 2: Feedback Collection Interface

### Storage

**File:** `artifacts/skills_learning/feedback_log_<YYYY-MM>.jsonl`

### Hermes Skill: `/skill feedback`

Create a new Hermes skill `skill-feedback-collector.md`:

```markdown
# Skill Feedback Collector

Record operator feedback on skill effectiveness, relevance, and recommendations.

## Usage

/skill feedback <skill_name> helpful|unhelpful|missing [--notes "..."]

## Examples

/skill feedback clinical-scoring helpful --notes "Fast and accurate for P3 trials"
/skill feedback 13f-validation-coordinator unhelpful --notes "False positives on small positions"
/skill feedback institutional-signal missing --notes "Need sector-level 13F aggregation"

## Output

Records feedback to: artifacts/skills_learning/feedback_log_<YYYY-MM>.jsonl
```

### Python API (for programmatic feedback)

**File:** `tools/skills_feedback_recorder.py`

```python
import json
from pathlib import Path
from datetime import datetime

def record_feedback(
    skill_name: str,
    verdict: str,  # "helpful" | "unhelpful" | "missing"
    notes: str = "",
    context: str = "",
) -> None:
    """Record operator feedback on a skill."""
    feedback = {
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "skill_name": skill_name,
        "verdict": verdict,
        "notes": notes,
        "context": context,
    }
    
    logs_dir = Path("artifacts/skills_learning")
    logs_dir.mkdir(parents=True, exist_ok=True)
    
    month_str = datetime.utcnow().strftime("%Y-%m")
    log_file = logs_dir / f"feedback_log_{month_str}.jsonl"
    
    with open(log_file, "a") as f:
        f.write(json.dumps(feedback) + "\n")
```

---

## Component 3: Monthly Learning Report

### Aggregation Script

**File:** `tools/hermes_skills_learning_loop.py`

```python
import json
from pathlib import Path
from collections import defaultdict
from datetime import datetime

def generate_monthly_report(month_str: str = None) -> Path:
    """Aggregate execution logs and feedback. Generate monthly report."""
    if not month_str:
        month_str = datetime.utcnow().strftime("%Y-%m")
    
    logs_dir = Path("artifacts/skills_learning")
    exec_log = logs_dir / f"execution_log_{month_str}.jsonl"
    feedback_log = logs_dir / f"feedback_log_{month_str}.jsonl"
    
    # Read logs
    executions = []
    if exec_log.exists():
        for line in exec_log.read_text().strip().split("\n"):
            if line:
                executions.append(json.loads(line))
    
    feedback = []
    if feedback_log.exists():
        for line in feedback_log.read_text().strip().split("\n"):
            if line:
                feedback.append(json.loads(line))
    
    # Aggregate by skill
    skill_stats = defaultdict(lambda: {
        "executions": 0, "successes": 0, "failures": 0,
        "total_latency": 0, "total_cost": 0, "tokens": 0,
        "feedback": []
    })
    
    for exec_record in executions:
        skill = exec_record["skill_name"]
        skill_stats[skill]["executions"] += 1
        if exec_record["outcome"]["success"]:
            skill_stats[skill]["successes"] += 1
        else:
            skill_stats[skill]["failures"] += 1
        skill_stats[skill]["total_latency"] += exec_record["metrics"]["latency_ms"]
        skill_stats[skill]["total_cost"] += exec_record["metrics"]["cost_usd"]
        skill_stats[skill]["tokens"] += (
            exec_record["metrics"]["tokens_in"] + exec_record["metrics"]["tokens_out"]
        )
    
    for fb in feedback:
        skill = fb["skill_name"]
        skill_stats[skill]["feedback"].append(fb)
    
    # Generate report
    report = f"""# Monthly Skills Learning Report — {month_str}

Generated: {datetime.utcnow().isoformat()}Z

## Summary

- Total executions: {len(executions)}
- Total feedback records: {len(feedback)}
- Skills with feedback: {sum(1 for s in skill_stats.values() if s["feedback"])}

## Skills by Efficacy (Success Rate)

"""
    
    # Sort by success rate
    sorted_skills = sorted(
        skill_stats.items(),
        key=lambda x: x[1]["successes"] / max(1, x[1]["executions"]),
        reverse=True
    )
    
    for skill_name, stats in sorted_skills:
        success_rate = (
            100 * stats["successes"] / max(1, stats["executions"])
        )
        avg_latency = (
            stats["total_latency"] / max(1, stats["executions"])
        )
        avg_cost = stats["total_cost"] / max(1, stats["executions"])
        
        report += f"""
### {skill_name}
- Executions: {stats["executions"]}
- Success rate: {success_rate:.1f}%
- Avg latency: {avg_latency:.0f}ms
- Avg cost: ${avg_cost:.4f}
- Feedback count: {len(stats["feedback"])}
"""
        if stats["feedback"]:
            helpful = sum(1 for f in stats["feedback"] if f["verdict"] == "helpful")
            unhelpful = sum(1 for f in stats["feedback"] if f["verdict"] == "unhelpful")
            missing = sum(1 for f in stats["feedback"] if f["verdict"] == "missing")
            report += f"  - Helpful: {helpful}, Unhelpful: {unhelpful}, Missing features: {missing}\n"
    
    # Write report
    report_path = logs_dir / f"monthly_report_{month_str}.md"
    report_path.write_text(report)
    
    return report_path

if __name__ == "__main__":
    report = generate_monthly_report()
    print(f"Report saved to: {report}")
```

### Cron Integration

Add to `cron_data_refresh.sh`:

```bash
# Generate monthly skills learning report (first Monday of month)
if [ "$(date +%A)" = "Monday" ] && [ "$(date +%-d)" -le 7 ]; then
  python3 tools/hermes_skills_learning_loop.py
fi
```

---

## Implementation Checklist (2026-06-05 to 2026-06-10)

### Day 1-2 (June 5-6)
- [ ] Create `tools/skills_execution_logger.py`
- [ ] Create `tools/skills_feedback_recorder.py`
- [ ] Create schema validator (`tools/validate_skill_log.py`)

### Day 3-4 (June 9-10)
- [ ] Integrate logging into `run_openclaw.py`
- [ ] Integrate logging into `agent_heartbeat_checks.py`
- [ ] Create `/skill feedback` command (Hermes skill)

### Day 5 (June 10)
- [ ] Create `tools/hermes_skills_learning_loop.py`
- [ ] Test monthly report generation
- [ ] Wire cron integration
- [ ] Update memory with implementation status

---

## Testing Plan

1. **Manual test:** Run skill with logger, verify JSONL written
2. **Feedback test:** Record 3 feedback entries, verify log format
3. **Aggregation test:** Generate report with 10+ execution records
4. **Cron test:** Verify cron runs on first Monday
5. **Operator test:** Ask operator to use `/skill feedback` 5 times

---

## Success Metrics

✓ All 31 skills logged on next execution  
✓ Feedback collected from 3+ operators in first month  
✓ Monthly report generated with no errors  
✓ Efficacy scores computed and trended  

---

## Phase 2 Preview (July 2026)

Once Phase 1 is stable:
- Dependency graph inference from execution logs
- Composition pattern mining (which skills work together)
- Auto-suggestion for task routing
- Performance optimization recommendations

---

**Owner:** Hermes Learning Engine  
**Status:** Ready for Phase 1 implementation (2026-06-05)
