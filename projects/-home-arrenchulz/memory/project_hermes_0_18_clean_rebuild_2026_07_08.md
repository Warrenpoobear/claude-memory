---
name: project-hermes-0-18-clean-rebuild-2026-07-08
description: "Hermes upgraded to v0.18 via clean upstream rebuild (not force-merge); live install now on branch update/clean-0.18, fork main backed up."
metadata: 
  node_type: memory
  type: project
  originSessionId: 3700078e-6cfe-4ac1-bfcc-b6474387ab37
---

Hermes Agent upgraded **v0.17.0 → v0.18.0** on 2026-07-08 (deployed live, gateway healthy).

**Key state change — the live install (`~/.hermes/hermes-agent`) is now on branch `update/clean-0.18` (commit `54653dc21`), NOT `main`.** `main` (the old fork, 124 commits) is preserved at branch `fork-main-pre-0.18-backup` and on `origin` (Warrenpoobear fork). Rollback = stop services, `git checkout main` (or reset to fork-main-pre-0.18-backup), reinstall, restart.

**Why a clean rebuild, not a merge:** the fork was 124 commits ahead / 2143 behind upstream. A direct `git merge upstream/main` produced ~20 compile-clean-but-broken auto-merge regressions (dropped imports, duplicate/shadowed defs, arity mismatches, +97 fork lines in `conversation_compression.py` colliding with upstream's rewrite). Fixing them all was fragile, so we abandoned the merge and rebuilt from pristine upstream 0.18, re-applying only the essential fork bits.

**Re-applied onto clean 0.18:** `tools/skills_logger_v2.py` + the gateway `_log_skill` weave (single-skill dispatch in `gateway/run.py`); auth profile→global-root `active_provider` fallback (`_active_provider_from_store` in `hermes_cli/auth.py`, #18594) + its test; `.learnings/memory.md`.

**Deliberately DROPPED (superseded/unused/regression-causing):** fork desktop fixes, old `hermes_skills_mcp.py` (upstream moved it to `agent/transports/hermes_tools_mcp_server.py`), the compression +97 lines, chown/unraid install hooks, `.cursor` config, docs/Town-skill syncs.

**Deferred — NOT re-applied, flagged for user:** self-improvement tools (`tools/record_skill_feedback.py`, `pattern_to_skillpatch.py`, `self_improvement_audit.py` — need toolset registration), `.cursor` IDE rules, chown/unraid Docker hooks. Re-apply on request.

**Env facts:** gateway runs as **systemd user service** `hermes-gateway.service` (+ `hermeslink.service`), NOT cron — stop/start via `systemctl --user`. Live venv is `venv/` (uv-managed, no pip; use `VIRTUAL_ENV=.../venv uv pip ...`). Live install's extras = `.[messaging,anthropic]` (telegram/slack + anthropic; fastapi/uvicorn are base). The `reset --hard` guardrail hook blocks Claude — branch moves need the user's shell or a `git checkout` (hook-allowed). See [[feedback-shared-checkout-concurrency-2026-06-30]].
