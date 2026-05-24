---
name: OpenClaw agent run entry point
description: Run fleet agents via tools/run_agent_direct.py after sourcing .env — NOT via openclaw gateway
type: feedback
originSessionId: 2ef84d70-4bb7-4c05-861a-b3d54debdd8b
---
In the biotech_screener project, run agents via `tools/run_agent_direct.py` (Anthropic SDK direct path), not via `openclaw agent --agent X --message Y` (gateway path).

**Why:** The openclaw gateway systemd unit only has `OPENCLAW_SETUP_TOKEN` (an OAuth `sk-ant-oat01-...` setup token) which triggers Anthropic's "third-party apps" billing rejection. The per-agent `auth-profiles.json` then looks for env var `ANTHROPIC_API_KEY` — which the gateway systemd unit doesn't have. All gateway-routed heartbeats fail with `FailoverError: No API key found for provider "anthropic"`. The `.env` in the repo *does* have `ANTHROPIC_API_KEY`, and `run_agent_direct.py` bypasses the gateway entirely to use it. The docstring of that file explicitly says it's a workaround for the gateway billing issue. This is why crontab always `source .env` before invoking `run_agent_direct.py`.

**How to apply:** Any time "run agents" / "heartbeat the fleet" / "test an agent" is requested in this repo, the invocation is:

```
cd /mnt/c/Projects/biotech_screener/biotech-screener && source .env && \
  python3 tools/run_agent_direct.py --agent <name> --message "<msg>"
```

The crontab (`crontab -l`) is the authoritative reference for how the fleet actually runs. Do not reach for `openclaw agent` / `openclaw cron run` — those are gateway paths that have been unreliable since the billing regression. Openclaw CLI is still useful for listing agents (`openclaw agents list`) and gateway status, just not for runtime invocations.
