---
name: hermes-scheduler-paused-job-safety-2026-06-22
description: "Standing rule: do not use hermes cron run + hermes cron tick to test paused jobs — re-enables them as side effect. Use direct hermes chat -q only."
metadata: 
  node_type: memory
  type: feedback
  status: active
  related: 
    - platform-roadmap-2026-06-22
    - containment-lifted-reactivation-2026-06-22
  originSessionId: c137a3de-ca62-4ea1-b220-612f0a145451
---

**Rule:** Do not use `hermes cron run <id>` + `hermes cron tick` to dry-run or test a paused Hermes cron job. Use direct `hermes chat -q` with the extracted prompt instead.

**Why:** Discovered 2026-06-22 during `weekly-skill-harvester` Option C dry-run. `hermes cron tick` transitions the queued job OUT of `paused` state — flipping `enabled: True` and `state: scheduled` — rather than running it in place and returning to paused. The job would have fired at its next scheduled time (20:00 ET) if not caught.

**How to apply:** Any time a paused Hermes cron job needs a one-off test run:
1. Extract the prompt: `python3 -c "import json; from pathlib import Path; d=json.loads((Path.home()/'.hermes/cron/jobs.json').read_text()); j=next(x for x in d['jobs'] if x['id']=='<id>'); Path('/tmp/prompt.txt').write_text(j['prompt'])"`
2. Invoke directly: `hermes chat -t "<toolsets>" -s "<skills>" --accept-hooks -q "$(cat /tmp/prompt.txt)"`
3. The cron job state (`enabled`, `state`) is never touched.

This rule is canonical until Hermes scheduler behavior is explicitly fixed and re-reviewed (tracked in PR #375).
