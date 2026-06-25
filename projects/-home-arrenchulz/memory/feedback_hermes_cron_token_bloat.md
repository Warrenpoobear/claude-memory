---
name: feedback-hermes-cron-token-bloat
description: "Hermes cron job token bloat patterns and fixes — pre-loaded skills, sleep-cliff multi-firing, script-writing retry loops"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: b5a62b40-67a7-4bc7-9db5-ab70c9a2d5f5
---

When Hermes cron sessions consume millions of tokens, there are three root causes to check in order:

**1. Pre-loaded skills (`skill` / `skills` fields in jobs.json)**
The `"skill"` field injects a full SKILL.md as system prompt; `"skills"` array pre-loads additional skills. Fix: set both to null/[]. Use lazy `skill_view(name='...')` in the prompt only when needed.

**Why:** weekly-skill-harvester hit 6.1M tokens (Jun 25) by loading openclaw-fleet-triage (100K chars) as primary skill — ran full fleet triage before harvesting. Also: jobs.json top-level is `data['jobs']` (dict with key), not a bare list.

**How to apply:** When `hermes insights` shows a cron session at 10× normal, first check `job['skill']` and `job['skills']`. Patch via Python (json.load → mutate → json.dump) not direct text edit.

**2. Sleep-cliff multi-firing without idempotency guard**
Sleep cliff causes cron watchdog to retrigger missed jobs on wake. Without a guard, a weekly job can run 3–5× in one day. Fix: prepend STEP 0 to prompt: check for recent output file → respond `[SILENT]` if found.

**Why:** event-outcome-binder-watch and weekly-signal-regime-sweep each ran 3× on Jun 24.

**How to apply:** For daily jobs, check today's date against most recent output filename in `~/.hermes/cron/output/<job-id>/`. For weekly jobs, use 5–7 day window. `[SILENT]` alone (no other text) suppresses delivery.

**3. Script-writing retry loops**
Agent with terminal access writes a Python script, hits SyntaxError, retries in a loop. Spike: pdufa-proximity-alert hit 1.19M tokens (Jun 24, normally ~200K). Fix: add explicit constraint to prompt forbidding write_file for Python scripts.

**How to apply:** Add to prompt: "Do NOT write any Python scripts or temporary files. Read files directly and process in-memory."

**Audit command to find token hogs:**
```python
import json
with open('/home/arrenchulz/.hermes/cron/jobs.json') as f:
    data = json.load(f)
for job in data['jobs']:
    if job.get('skill') or job.get('skills'):
        print(job['id'], job['name'], job['skill'], job['skills'])
```

**Skill reference:** Classes F, G, H in `openclaw-cron-scheduler-debug`.
