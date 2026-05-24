---
name: Cron watchdog phase-2 recovery restored
description: tools/cron_watchdog.sh had three dead-recovery bugs (gate, detection, invocation). Fixed 2026-04-24 after the 2026-04-23 evening-agent outage exposed them. Verification checklist for 2026-04-25 + idempotency backlog item.
type: project
originSessionId: bdca0417-f353-48f3-b6a7-b0d9fada1d78
---
`tools/cron_watchdog.sh` phase-2 agent recovery was dead in three ways; restored 2026-04-24.

**Why:** On 2026-04-23 the WSL2 host evidently slept between 17:15 and 19:00 ET. Cron fired successfully for `ops` (17:00) and `sentinel` (17:15), then missed every evening agent: `crt_resolution_watcher`, `catalyst_delta`, `price_action_watch`, `postmortem`, `options_watch`, `review_queue_steward`, `event_analyst`. The watchdog's phase-2 recovery block should have caught this overnight but didn't fire. Root-cause audit found three concurrent bugs: (1) block gated behind `if [ "$PROD_RAN" = false ]`; (2) detection grep used `YYYY-MM-DD` against compact `YYYYMMDD` filenames and never matched; (3) `run_agent_direct.py` invocation used positional arg but argparse requires `--agent`. All three fixed in one pass.

**How to apply — tomorrow morning (2026-04-25) verification:**

1. `logs/watchdog.log` shows the phase-2 recovery block executed (look for `"MISSED phase-2 agents"` or `"All phase-2 agents ran"` lines with today's timestamp).
2. `logs/agents_direct/` has fresh JSON for the 5 phase-2 agents with today's date in filename: `price_action_watch`, `postmortem`, `options_watch`, `review_queue_steward`, `event_analyst`.
3. `review_queue_steward` output is fresh (most recent file in `logs/agents_direct/review_queue_steward_*.json` is 2026-04-25 or later).
4. `tools/agent_heartbeat_checks.py --dry-run` for these five — if any still show STALE, it's the `AGENT_REGISTRY.json` `artifact_paths` mismatch (they point at `agents/{name}/memory/` instead of `logs/agents_direct/{name}_*.json`), NOT a cron failure. Do not re-investigate cron.

**Do-not-do list:**

- Do not add `crt_resolution_watcher` or `catalyst_delta` to `PHASE2_AGENTS` yet (they also missed 2026-04-23, but expanding scope is a separate change).
- Do not update `AGENT_REGISTRY.json` `artifact_paths` yet — fleet-wide cosmetic change, needs its own pass.
- Do not add top-30 rank-change attribution yet.

**Backlog — idempotency bug (not urgent, but needed before relying on manual re-runs):**

The watchdog recovers missed agents by invoking `run_agent_direct.py`, which writes `logs/agents_direct/{agent}_{TODAY}_{HHMMSS}.json`. Detection looks for `{agent}_{YESTERDAY_COMPACT}_*.json`. So a recovery does not satisfy its own detection — if the watchdog runs twice in one day, it will re-recover the same agents on the second run. Current call frequency (Windows Task Scheduler / `@reboot`) makes this infrequent in practice. Fix shape: marker file under `logs/watchdog_recovery/{agent}_{YESTERDAY_COMPACT}.done` touched after successful recovery; detection skips agents with a marker for the target date.

**Key files:**
- `tools/cron_watchdog.sh` — the watchdog (fix landed 2026-04-24)
- `tools/run_agent_direct.py` — invocation target (unchanged)
- `logs/agents_direct/{agent}_{YYYYMMDD}_{HHMMSS}.json` — the actual agent output for every LLM-invoked agent (not `agents/{name}/memory/`)
- `logs/watchdog.log` — watchdog's own audit trail
