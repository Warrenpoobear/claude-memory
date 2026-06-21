---
name: infra_ubuntu_wsl2_verdict_2026_06_21
description: "Infrastructure verdict: stay on Ubuntu WSL2 for dev, move repo to Linux-native filesystem, small Ubuntu VPS for always-on cron — no distro switch"
metadata: 
  node_type: memory
  type: project
  status: active
  date: 2026-06-21
  originSessionId: ec7a4958-2a85-44e3-bb58-cf66e6fa3931
---

# Infrastructure Verdict — 2026-06-21

**Decision:** Stay on Ubuntu. Do not switch distros.

## Agreed migration order

**Phase 0 — now (blocked):** no infra changes until containment clears.

**Phase 1 — after containment:** move repo from `/mnt/c/Projects/biotech_screener/biotech-screener/` to `~/Projects/biotech_screener/biotech-screener/` (Linux-native WSL2 filesystem). WSL2 I/O across the `/mnt/c` bridge is 5–10× slower than native paths; all snapshot writes + file scans benefit.

**Phase 2:** run same tests/snapshots from Linux-native path; verify no path-hardcoding breaks.

**Phase 3:** move cron jobs to systemd timers or a small Ubuntu VPS. WSL2 cron unreliable (suspends when Windows sleeps; prior incident: Phase 2 Step 3 evening reliability failure 19:30–19:40 window).

**Phase 4:** Ubuntu VPS (~$6–12/mo, DigitalOcean or Hetzner) for always-on production monitoring only. Keep development local on WSL2.

## What NOT to do
Do not switch to Arch, Fedora, Debian, NixOS, Windows-native Python, or Docker-first rewrite. None of these address the actual bottlenecks.

## Real bottlenecks (not distro-related)
governance/containment · stale universe · external data reliability (yfinance/SEC/CTGov) · WSL sleep/cron reliability · Windows filesystem bridge overhead · branch protection/agent shutdown discipline

## Why:** User confirmed this assessment 2026-06-21. Ubuntu is the right OS for this stack (Python 3.12, yfinance, SQLite, LangGraph, MCP). [[biotech_containment_governance_2026_06_21]]
