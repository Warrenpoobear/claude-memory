---
name: reference-town-fleet-report-fix-caveats-2026-07-16
description: "Two Town \"Hermes Fleet\" RED-report quick-fix recommendations are misleading/not-applicable-from-WSL — CRT watcher + manager_registry 404"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 68b5443c-865f-4cb6-8d4d-90d09d636a18
---

Town's weekly **Hermes Fleet Health Audit** email (from `warrenpoobear@town.com` → `djschulz@gmail.com`; 2026-07-15 report = RED) recommended two "easy" fixes that are NOT safe/possible to apply from the WSL box. Verified 2026-07-16:

1. **"Uncomment CRT resolution watcher cron (single-character fix)" — DO NOT.** `crt_resolution_watcher` is `status=suppressed` in `agents/AGENT_REGISTRY.json` with note: *"Suppressed 2026-06-26: last ran 2026-06-11, before INC-2026-06-20-AUTOPUSH containment. Reactivation requires operator decision. Sunset review: 2026-09-30."* It has `authority_level: mutate_data` (writes `output/catalyst_ev/`). `run_agent_direct.py` blocks it via preflight (`[DIRECT_RUN_BLOCKED] status=suppressed`). Uncommenting would reverse an incident containment and just error nightly. Leave until the 2026-09-30 sunset review or an explicit operator reactivation decision tied to closing [[scoped_work_freeze_2026_06_22]] / INC-2026-06-20.

2. **"Fix manager_registry.json 404 path" — Town-side, not fixable here.** File is present+correct on GitHub remote `main` at BOTH `manager_registry.json` and `production_data/manager_registry.json` (10,677 bytes). No local "coinvest monitor" script fetches it — the 404'ing **Coinvest Monitor is a Town routine** pulling from GitHub. Bug is in the Town routine config (path/branch/token), editable only in the Town web app. See [[reference_manager_registry_count_2026_07_14]].

Lesson: Town fleet-report "recommended actions" are heuristic and can contradict deliberate suppressions/containment. Verify against `AGENT_REGISTRY.json` status + git remote before acting. Genuine SEV-1s in the report (GitHub Actions minutes exhausted → Aug 1 reset; CELC PDUFA 2026-07-17 manual watch; fleet-steward 22-day gap) are all operator-only, not WSL-fixable.
