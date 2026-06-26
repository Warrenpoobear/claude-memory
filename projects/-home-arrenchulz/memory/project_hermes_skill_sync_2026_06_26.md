---
name: project-hermes-skill-sync-2026-06-26
description: "hermes-skill-sync-agent shipped 2026-06-26 — audit tool, wrapper, 8 tests, PR"
metadata: 
  node_type: memory
  type: project
  status: active
  originSessionId: 516c9a38-5fd1-4d61-bfc3-97674c7e0cd7
---

## hermes-skill-sync-agent — SHIPPED 2026-06-26

**PR #423** open on branch `tooling/hermes-skill-sync-2026-06-26`. Not yet merged.

**Why:** Town was referencing a retired Correction Ledger that no longer exists as a live feed. The agent keeps Hermes canonical skill sources, generated mirrors, and retired references aligned permanently.

**Files created:**
- `tools/hermes_skill_sync_audit.py` — 3-mode audit (audit/check/sync); 7 drift classes; exits 1 on DRIFT_CRITICAL only in audit mode; Town notification via `send_operator_event()`
- `scripts/run_hermes_skill_sync_agent.sh` — repo-side wrapper with flock + log tee
- `~/.hermes/scripts/hermes_skill_sync_agent.sh` — thin Hermes cron launcher (delegates to repo)
- `agents/hermes-skill-sync-agent/HEARTBEAT.md` — miss_threshold 8d, stale_threshold 10d
- `tests/test_hermes_skill_sync_agent.py` — 8 tests passing
- `agents/AGENT_REGISTRY.json` — `hermes-skill-sync-agent` entry added

**Immediate fix applied:**
- `skills/self-improving/SKILL.md`: 2 retired Town Correction Ledger references removed
- `skills/self-improving/REFERENCE.md`: 1 retired reference removed
- Both mirrors regenerated; first audit run: **0 CRITICAL**

**Cron NOT yet registered** — operator must run:
```bash
hermes cron add \
  --name "hermes-skill-sync-guard" \
  --schedule "0 8 * * 0" \
  --no-agent \
  --script hermes_skill_sync_agent.sh \
  --workdir /mnt/c/Projects/biotech_screener/biotech-screener
```

**Authority model:** `skills/` canonical → `docs/hermes_skills/` generated mirror → Town observer only.

**Known pre-existing warnings (not blockers):** 21 `FRONTMATTER_MISSING` across all skills (pre-existing; no YAML frontmatter was ever required). Exit code 0 for `DRIFT_WARNING` in audit mode.

**sync_hermes_skills.py bug discovered:** `all_sync_keys()` merges SKILL_MAP and REFERENCE_MAP into one dict — when both have "self-improving" key, REFERENCE_MAP value overwrites SKILL_MAP value. The `self-improving.md` SKILL_MAP mirror is never processed by `main()`. Workaround: call `sync_pair("self-improving", "self-improving.md", dry_run=False)` directly. Bug NOT fixed in this PR (out of scope).

**How to apply:** When asked about skill sync status, check PR #423 merge status. If merged, cron registration is next. If cron registered, check latest heartbeat at `artifacts/governance/hermes_skill_sync/latest_heartbeat.json`.
