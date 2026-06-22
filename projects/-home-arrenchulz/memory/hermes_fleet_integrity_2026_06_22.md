---
name: hermes-fleet-integrity-2026-06-22
description: Hermes fleet integrity check 2026-06-22 — gateway .env fixed (no restart); OpenClaw still LIVE runtime (migration incomplete); LG3 cron not installed; 2 integrity-report false positives corrected
metadata: 
  node_type: memory
  type: project
  status: active
  expires: 2026-07-06
  related: 
    - hermes-fleet-status-2026-06-19
    - langgraph-lg3-cron-activated
    - hermes_update_2026_06_21
    - biotech_containment_governance_2026_06_21
  originSessionId: 15541646-0e32-452b-9f94-5548c6defadb
---

# Hermes Fleet Integrity Check — 2026-06-22

Read-only integrity check after "migrated OpenClaw → Hermes" claim. Scope held to **safe fixes only** (user choice) — fleet/crons left CLOSED per containment ([[hermes_update_2026_06_21]] / [[biotech_containment_governance_2026_06_21]]). Verdict: **ORANGE**.

## Key reframing — migration is INCOMPLETE, not done
- **OpenClaw is still the LIVE runtime.** Gateway `openclaw … gateway --port 19001` (pid 7171) is up and holds **open SQLite handles** into `~/.openclaw/agents/*/agent/openclaw-agent.sqlite` with WAL/SHM **actively written (Jun 21 20:42)**.
- All Hermes gateways are **DOWN** (8642 default / 8643 lmstudio / 8644 researcher). Hermes cron scheduler fires **independently** of the gateway (23 jobs, all enabled).
- So `~/.openclaw/agents/` is the live agent store, NOT leftover cruft. **Do not archive/move anything under `~/.openclaw/`** — would corrupt live SQLite.

## Fix applied (the only one)
- **Researcher gateway `.env` deduped.** `~/.hermes/profiles/researcher/.env` had duplicate keys: `API_SERVER_PORT="8644"` then a stale `API_SERVER_PORT=8642` (+ dup HOST) that overrode it → port collision with default gateway (:8642) → the recurring "8642 already in use / Telegram token in use" startup failure (Jun 21 15:07). Removed the stale 8642 duplicate; single `8644` now stands. Backup: `~/.hermes/profiles/researcher/.env.bak.integrity-2026-06-22`. **Service NOT started** (quiescence preserved). Gateway will start cleanly when deliberately brought up.

## Integrity-report FALSE POSITIVES corrected (no action was the right action)
1. **contradiction-detector "missing memory/"** — false alarm. **None** of the 31 agent dirs have a `memory/` dir (not the convention). `hermes-contradiction-detector` is an `on_demand`/`observe_only`/`llm_policy:none` repo-resident script (`agents/hermes-contradiction-detector/run_job.py`, IDENTITY+SOUL+USER present). Creating a memory dir would ADD drift. No action.
2. **"25 leftover .openclaw artifacts"** — none found; and the dirs are live (see reframing). No action.

## LG3 cron — NOT running (corrects [[langgraph-lg3-cron-activated]])
- `crontab -l` → "no crontab for arrenchulz". LG3 line not installed in user crontab / Hermes jobs.json / OpenClaw cron.
- Audit trail: only 4 runs ever (Jun 19 test runs incl. 1 failure, + Jun 21 13:07 UTC). None since. "Daily observation window" never accumulated.
- Latent bug: Jun 19 run failed `TypeError: disease_map_index_path is None` at `scientific_cartography/langgraph_review/nodes.py:189` (non-blocking by design).

## Still-open items (all gated on containment — NOT actioned)
- `agents_direct` cron dead since ~Jun 17 (19 repo agents idle) — gated `ALL_AGENTS_CLOSED`.
- 2026-06-21 snapshot empty stub; 06-22 not produced — gated.
- LG3 cron (re)install — gated reactivation.
- OpenClaw gateway (:19001) still running — closing it / cutover to Hermes is a reactivation/migration decision, not a safe unilateral fix. Flagged for operator.

## Repo state
- Frozen biotech repo at `/mnt/c/Projects/biotech_screener/biotech-screener`; uncommitted `src/snapshot_generator.py`. Integrity check did not touch the repo.
