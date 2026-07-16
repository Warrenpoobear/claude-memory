---
name: project-hermeslink-relay-outage-fix-2026-07-16
description: "Town's \"Hermes API OFFLINE\" (15 consecutive runs since 2026-06-26/07-14) traced and fixed — HermesLink bridge daemon was dead since 2026-07-15, not the gateway itself"
metadata: 
  node_type: memory
  type: project
  originSessionId: 68b5443c-865f-4cb6-8d4d-90d09d636a18
---

Traced and fixed 2026-07-16. Town's weekly fleet report flagged "Hermes API OFFLINE — 15th consecutive run" as a HIGH item. Root cause was NOT the Hermes gateway (port 8642, healthy the whole time) — it was **HermesLink** (`@hermespilot/link`, npm package at `~/.npm-global/bin/hermeslink`, runtime `~/.hermeslink/`), the separate bridge daemon that authenticates this WSL box to the external relay (`hermes-server.clawpilot.me` / `hermes-relay.clawpilot.me`) Town calls through.

Timeline (from `~/.hermeslink/logs/daemon.log` + `hermeslink.log`):
- 2026-07-14 15:35 EDT: HermesLink auto-updated to v1.0.1 via `HERMESLINK_SKIP_RESTART=1` (installer explicitly skipped its own restart, expected external supervision to bring it back).
- Crash-looped through 07-14/07-15 ("child health probe failed 3 consecutive times").
- 2026-07-15 09:16 EDT: `device_access_token_invalid` + `refresh_token_invalid` during a reconnect attempt.
- 2026-07-15 14:34 EDT: final SIGKILL stop. **Zero HermesLink processes ran from then until fixed 2026-07-16.**
- Boot autostart IS configured (`systemd --user`, `~/.config/systemd/user/hermeslink.service`) but did not self-heal — this class of failure (systemd --user units not reliably surviving WSL session/crash boundaries) is a known WSL flakiness pattern, see [[env_wsl2_aarch64]] / [[env_wsl_uptime_required]].

Fix: `hermeslink status` showed `Mode: paired` (pairing intact, no interactive re-auth needed) but `Service: not running`. Ran `hermeslink restart` — confirmed `Service: running`, `Relay: connected`. Underlying gateway (port 8642, `hermes status` → Gateway Service ✓ running) was unaffected throughout; verified healthy before and after.

**Open/unresolved:** autostart reliability gap not addressed (would require editing the systemd --user unit or supervision logic — bigger control-plane change, deferred pending operator decision). If "Hermes API OFFLINE" recurs, check `hermeslink status` first — likely the same daemon-died-silently pattern, fix is the same `hermeslink restart`.

Separately traced same Town report's "Intraday Movers RED July 14" → NOT a market-data outage (log's `provider=unknown` was misleading). Actual cause: daily production failed all day 07-14 (exit 1, ~8 retries) → no `rankings.csv` → intraday-mover hit `_empty_artifact(status="NO_DATA", detail="rankings missing")` early-return on every poll. This is the same already-resolved #499/#500 production outage (see [[project_ctis_timeout_fix_2026_07_16]] / [[project_forward_validation_hardening_2026_07_10]]) — no separate fix needed, self-healed with production recovery 07-15.

See also [[reference_town_fleet_report_fix_caveats_2026_07_16]] for the two Town-recommended fixes that were NOT applied (CRT watcher suppression, manager_registry Town-side routing).
