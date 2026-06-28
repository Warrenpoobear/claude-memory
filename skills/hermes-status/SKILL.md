---
name: hermes-status
description: |
  Check Hermes agent fleet health: gateway connectivity, cron last-run timestamps, agent output freshness. Use when the user says "hermes status", "check hermes", "is hermes running", "fleet health", "agent status", or similar. Reports gateway up/down, which agents are stale (>24h), and any cron failures.
allowed-tools:
  - Bash(curl *)
  - Bash(crontab *)
  - Bash(ls *)
  - Bash(find *)
  - Bash(python3 *)
  - Bash(cat *)
  - Bash(ps *)
---

# Hermes Status

Fleet health check for the Hermes agent system.

## Steps

### 1 — Gateway connectivity
```bash
# Primary gateway (:8642)
curl -s --max-time 3 http://localhost:8642/health 2>/dev/null && echo "Gateway :8642 UP" || echo "Gateway :8642 DOWN"

# Researcher gateway (:8644)
curl -s --max-time 3 http://localhost:8644/health 2>/dev/null && echo "Gateway :8644 UP" || echo "Gateway :8644 DOWN"
```

### 2 — Crontab status
```bash
crontab -l | grep -v "^#" | grep -v "^$" | head -30
```
Check for expected jobs (morning catch-up, daily production, evening catchup, etc.).

### 3 — Agent output freshness
```bash
python3 - <<'EOF'
import os, glob
from datetime import datetime, timedelta

REPO = '/mnt/c/Projects/biotech_screener/biotech-screener'
agents_dir = os.path.join(REPO, 'agents')

if not os.path.exists(agents_dir):
    print("agents/ directory not found"); exit(0)

now = datetime.now()
stale_threshold = timedelta(hours=24)
results = []

for agent_dir in sorted(os.listdir(agents_dir)):
    output_dir = os.path.join(agents_dir, agent_dir, 'output')
    memory_dir = os.path.join(agents_dir, agent_dir, 'memory')
    
    for d in [output_dir, memory_dir]:
        if os.path.exists(d):
            files = glob.glob(os.path.join(d, '*'))
            if files:
                latest = max(files, key=os.path.getmtime)
                age = now - datetime.fromtimestamp(os.path.getmtime(latest))
                status = "✓" if age < stale_threshold else f"⚠️ STALE ({int(age.total_seconds()/3600)}h)"
                results.append(f"  {agent_dir:<30} {status}")
                break

for r in results:
    print(r)
EOF
```

### 4 — Recent log activity
```bash
ls -lt /mnt/c/Projects/biotech_screener/biotech-screener/logs/*.log 2>/dev/null | head -10
```

### 5 — Report
```
HERMES FLEET STATUS — YYYY-MM-DD HH:MM

GATEWAYS
  :8642 (primary)    UP / DOWN
  :8644 (researcher) UP / DOWN

CRON
  [N jobs registered]
  Last known run: YYYY-MM-DD HH:MM

AGENTS (stale if >24h)
  agent_name          ✓ FRESH / ⚠️ STALE (Xh)
  ...

SUMMARY: N/N agents fresh | N stale | Gateways: UP/DOWN
```

## Context
- OpenClaw RETIRED (2026-06-23) — do not attempt to restart
- Gateway :19001 was OpenClaw; now dead — expected
- Hermes gateway :8642 is the active primary
- If all gateways down: check if WSL is running and cron has fired
