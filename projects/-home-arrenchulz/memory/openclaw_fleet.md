---
name: OpenClaw agent fleet
description: OpenClaw fleet in biotech_screener — run agents via tools/run_agent_direct.py, NOT openclaw gateway
type: project
originSessionId: 2ef84d70-4bb7-4c05-861a-b3d54debdd8b
---
## Runtime entry point — CRITICAL
**Never invoke agents via `openclaw agent --agent X`** (gateway path is broken — `OPENCLAW_SETUP_TOKEN` triggers Anthropic "third-party apps" billing rejection, and the systemd unit lacks `ANTHROPIC_API_KEY`). See `feedback_openclaw_run_entry_point.md`.

Correct invocation (what crontab uses):
```
cd /mnt/c/Projects/biotech_screener/biotech-screener && source .env && \
  python3 tools/run_agent_direct.py --agent <name> --message "<msg>"
```

`tools/run_agent_direct.py` calls the Anthropic SDK directly with `ANTHROPIC_API_KEY` from `.env`, bypassing the gateway. Per-agent model overrides live in `AGENT_MODELS` in that script (default Sonnet, some Haiku).

## Agent inventory (29 dirs in `agents/`)
aact_trial_ingest, bioshort_watch, biotech_news_digest, calibration, calibration_evidence,
catalyst_delta, company_news_ingest, crt_resolution_watcher, ctgov_poller, data_auditor,
earnings_calendar_sync, event_analyst, fleet_steward, grok_biotech_watch, herald,
ic_health_monitor, intraday_mover_watch, ops, options_watch, policy_shadow_watch,
postmortem, price_action_watch, production_qa, qa, review_queue_steward, sentinel,
shadow_monitor, shadow_watch, universe_maintenance

Each agent dir has `IDENTITY.md`, `SOUL.md`, `HEARTBEAT.md`, `AGENTS.md`, `TOOLS.md`, `USER.md`, `memory/`.

## Tiers (from `.claude/agent-memory/openclaw-monitor/fleet_config.md`)
- **Tier 1 (LLM via run_agent_direct.py):** ops, sentinel, crt_resolution_watcher, catalyst_delta, price_action_watch, postmortem, options_watch, shadow_watch, review_queue_steward, event_analyst, herald, ctgov_poller, bioshort_watch, universe_maintenance, grok_biotech_watch, policy_shadow_watch
- **Tier 2 (deterministic Python):** data_auditor (`run_audit.py`), earnings_calendar_sync (`cron_bellringer.sh`), biotech_news_digest (`scripts/build_news_digest.py`)
- **Tier 2 (heartbeat-checked via `agent_heartbeat_checks.py`):** qa, ic_health_monitor, calibration, calibration_evidence, shadow_monitor, aact_trial_ingest, biotech_news_digest, fleet_steward

## Gateway (still useful for some ops)
- Systemd user unit: `openclaw-gateway.service` on ws://127.0.0.1:18789
- Unit env has `OPENCLAW_SETUP_TOKEN` (OAuth setup token), not `ANTHROPIC_API_KEY`
- Useful commands: `openclaw agents list`, `openclaw cron list` (jobs will show `error` — gateway-run crons are broken, real cron uses `crontab -l`)

## Where to look
- Real schedule: `crontab -l` (NOT `openclaw cron list`)
- Cron wrappers: `tools/cron_*.sh` (each sources `.env` before invoking)
- Per-agent runs: invoked by crontab entries via `run_agent_direct.py`
- Heartbeat script: `tools/agent_heartbeat_checks.py` (Tier 2 LLM-optional path)

## How to apply
- To test agents: use `run_agent_direct.py`, not `openclaw agent`
- To see the real schedule: `crontab -l`, not `openclaw cron list`
- If agents fail with `No API key found for provider "anthropic"`, the wrong entry point was used
